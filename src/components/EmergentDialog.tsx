import { createTimeout } from "@/lib/solid";
import {
	createEffect,
	createMemo,
	createSignal,
	onMount,
	untrack,
	type Accessor,
	type JSX,
	type Setter,
} from "solid-js";

const enum OpenStage {
	PreOpening,
	Opening,
	Opened,
	PreClosing,
	Closing,
	Closed,
}

type OpenState =
	| {
		stage: OpenStage.PreOpening;
		bodyRect: DOMRect;
	}
	| {
		stage: OpenStage.Opening;
		bodyRect: DOMRect;
		pictureRect: DOMRect;
	}
	| {
		stage: OpenStage.Opened;
	}
	| {
		stage: OpenStage.PreClosing;
		bodyRect: DOMRect;
	}
	| {
		stage: OpenStage.Closing;
		bodyRect: DOMRect;
	}
	| {
		stage: OpenStage.Closed;
	};

const MIN_WIDTH = 700;

const createMainlyHorizontal = (setter: Setter<DialogAxis>) => {
	const match = window.matchMedia(`(max-width: ${MIN_WIDTH}px)`);
	setter(match.matches ? DialogAxis.Vertical : DialogAxis.Horizontal);

	match.addEventListener("change", (e) => {
		console.log('match')
		setter(e.matches ? DialogAxis.Vertical : DialogAxis.Horizontal);
	});
}

export const enum DialogOpenMode {
	Horizontal,
	Vertical,
	MainlyHorizontal,
}

export const enum DialogAxis {
	Horizontal,
	Vertical,
}

const OPENING_DURATION = 200;

export default function EmergentDialog({
	opened,
	image,
	children,
	fromImage,
	onClose,
	containerClass,
	openMode,
}: {
	onClose: () => void;
	opened: Accessor<boolean>;
	image: JSX.Element;
	children: JSX.Element;
	fromImage: Accessor<Element | null | undefined>;
	containerClass?: string;
	openMode: DialogOpenMode;
}) {
	let container: HTMLDivElement;
	let dialog: HTMLDialogElement;
	let body: HTMLElement;
	let picture: Element;

	const [dialogAxis, setDialogAxis] = createSignal<DialogAxis>(DialogAxis.Vertical);

	onMount(() => {
		if (openMode === DialogOpenMode.MainlyHorizontal) {
			createMainlyHorizontal(setDialogAxis)
			return
		}

		if (openMode === DialogOpenMode.Vertical) {
			setDialogAxis(DialogAxis.Vertical)
			return
		}

		setDialogAxis(DialogAxis.Horizontal)
	})

	const onClick = (e: Event) => {
		if (!container.contains(e.target as Node)) {
			onClose();
		}
	};

	const [openStage, setOpenStage] = createSignal<OpenState>({
		stage: OpenStage.Closed,
	});

	let imageRect: DOMRect;

	const computeDialogPosition = () => {
		const dialogRect = dialog.getBoundingClientRect();
		const targetX = computeTargetAxis(
			dialogRect.width,
			dialogRect.x,
			imageRect.width,
		);

		const targetY = computeTargetAxis(
			dialogRect.height,
			dialogRect.y,
			imageRect.height,
		);

		return `transform: translate(${imageRect.x - targetX}px, ${imageRect.top - targetY}px)`;
	};

	const transitionClass = "transition-all duration-200 ease-in-out";
	const dialogDisplay = "grid grid-rows-[minmax(0,1fr)]";

	const bodyHiddenBox = () =>
		createBox(
			dialogAxis() === DialogAxis.Horizontal
				? {
					width: 0,
					height: imageRect.height,
				}
				: {
					width: imageRect.width,
					height: 0,
				},
		);

	const classes = createMemo(() => {
		const openState = openStage();

		if (!imageRect) return {};

		switch (openState.stage) {
			case OpenStage.PreOpening: {
				return {
					dialogClass: dialogDisplay,
					pictureStyle: createBox(imageRect),
					dialogStyle: computeDialogPosition(),
					bodyStyle: bodyHiddenBox(),
					innerBodyStyle: createBox(openState.bodyRect),
					bodyClass: "overflow-hidden",
				};
			}

			case OpenStage.Opening: {
				const bodyBox = createBox(openState.bodyRect);
				const pictureBox = createBox(openState.pictureRect);

				return {
					dialogClass: `${transitionClass} ${dialogDisplay}`,
					pictureClass: transitionClass,
					pictureStyle: pictureBox,
					bodyStyle: bodyBox,
					innerBodyStyle: bodyBox,
					bodyClass: "overflow-hidden",
				};
			}
			case OpenStage.Opened: {
				return {
					bodyClass: dialogAxis() === DialogAxis.Vertical ? "overflow-auto" : "",
				}
			}
			case OpenStage.PreClosing: {
				const bodyBox = createBox(openState.bodyRect);
				const pictureBox = createBox(picture.getBoundingClientRect());

				return {
					dialogClass: dialogDisplay,
					pictureStyle: pictureBox,
					bodyStyle: bodyBox,
					innerBodyStyle: bodyBox,
				};
			}
			case OpenStage.Closing: {
				return {
					dialogClass: `${transitionClass} ${dialogDisplay}`,
					pictureClass: `${transitionClass}`,
					pictureStyle: createBox(imageRect),
					dialogStyle: computeDialogPosition(),
					bodyStyle: bodyHiddenBox(),
					innerBodyStyle: createBox(openState.bodyRect),
					bodyClass: "overflow-hidden",
				};
			}
			case OpenStage.Closed:
				return {};
		}
	});

	createEffect(() => {
		opened();

		const image = fromImage();
		if (!image) return;

		imageRect = image.getBoundingClientRect();
	});

	const startOpen = () => {
		dialog.showModal();

		const bodyRect = body.getBoundingClientRect();
		const pictureRect = picture.getBoundingClientRect();

		setOpenStage({
			stage: OpenStage.PreOpening,
			bodyRect,
		});

		createTimeout(() => {
			setOpenStage({
				stage: OpenStage.Opening,
				bodyRect,
				pictureRect,
			});
		}, 0);

		createTimeout(() => {
			setOpenStage({
				stage: OpenStage.Opened,
			});
		}, OPENING_DURATION);
	}

	const startClose = () => {
		const bodyRect = body.getBoundingClientRect();

		setOpenStage({
			stage: OpenStage.PreClosing,
			bodyRect,
		});

		createTimeout(() => {
			setOpenStage({
				stage: OpenStage.Closing,
				bodyRect,
			});
		}, 0);

		createTimeout(() => {
			setOpenStage({
				stage: OpenStage.Closed,
			});
			dialog.close();
		}, OPENING_DURATION);
	}

	createEffect(() => {
		const { stage: currentStage } = untrack(openStage);
		if (opened() && currentStage === OpenStage.Closed) {
			startOpen();
			return
		}

		if (!opened() && currentStage === OpenStage.Opened) {
			startClose();
			return
		}
	});

	return (
		<dialog
			ref={(e) => (dialog = e)}
			onClick={onClick}
			class={`fixed inset-0 bg-gray-800 rounded-lg overflow-hidden backdrop:bg-black/50 backdrop:backdrop-blur-md 
	${classes().dialogClass}`}
			style={classes().dialogStyle}
		>
			<div
				ref={(e) => (container = e)}
				class={`${containerClass} flex ${dialogAxis() === DialogAxis.Vertical ? "flex-col" : "flex-row"}`}
			>
				<picture
					style={classes().pictureStyle}
					ref={(e) => (picture = e)}
					class={`[&>*]:h-full [&>*]:w-full [&>*]:object-cover max-w-full max-h-full 
									${classes().pictureClass} ${dialogAxis() === DialogAxis.Vertical ? "w-[9999px] h-auto" : "w-auto"}`}
				>
					{image}
				</picture>

				<div
					class={`${transitionClass} ${classes().bodyClass}`}
					ref={(e) => (body = e)}
					style={classes().bodyStyle}
				>
					<div class="p-4 w-full h-full" style={classes().innerBodyStyle}>
						{children}
					</div>
				</div>
			</div>
		</dialog>
	);
}

const computeTargetAxis = (
	currentWidth: number,
	currentX: number,
	targetWidth: number,
) => (currentWidth - targetWidth) / 2 + currentX;

function createBox({ width, height }: Pick<DOMRect, "width" | "height">) {
	return `width: ${width}px; height: ${height}px`;
}

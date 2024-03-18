import {
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  type Accessor,
  type JSX,
} from "solid-js";

const enum OpenStage {
  Opening,
  Opened,
  PreClosing,
  Closing,
  Closed,
}

type OpenState =
  | {
      stage: OpenStage.Opening;
    }
  | {
      stage: OpenStage.Opened;
      bodyRect: DOMRect;
      pictureRect: DOMRect;
    }
  | {
      stage: OpenStage.PreClosing;
    }
  | {
      stage: OpenStage.Closing;
    }
  | {
      stage: OpenStage.Closed;
    };

export default function EmergentDialog({
  opened,
  image,
  children,
  fromImage,
  onClose,
}: {
  onClose: () => void;
  opened: Accessor<boolean>;
  image: JSX.Element;
  children: JSX.Element;
  fromImage: Accessor<Element | null | undefined>;
}) {
  let container: HTMLDivElement;
  let dialog: HTMLDialogElement;
  let body: HTMLElement;
  let picture: Element;

  const onClick = (e: Event) => {
    if (!container.contains(e.target as Node)) {
      onClose();
    }
  };

  const [openStage, setOpenStage] = createSignal<OpenState>({
    stage: OpenStage.Closed,
  });

  let imageRect: DOMRect;

  const computeDialogOverlay = () => {
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
  const classes = createMemo(() => {
    const openState = openStage();

    if (!imageRect) return {};

    switch (openState.stage) {
      case OpenStage.Opening: {
        return {
          dialogStyle: computeDialogOverlay(),
          pictureStyle: `width: ${imageRect.width}px; height: ${imageRect.height}px`,
          pictureClass: "transition-all duration-200",
          bodyStyle: `width: 0px`,
        };
      }
      case OpenStage.Opened:
        return {
          dialogClass: "transition-all duration-200",
          pictureStyle: `width: auto; height: 9999px`,
          bodyStyle: `width: ${openState.bodyRect.width}px`,
        };
      case OpenStage.PreClosing: {
        const pictureRect = picture.getBoundingClientRect();
        return {
          pictureStyle: `width: ${pictureRect.width}px; height: ${pictureRect.height}px`,
        };
      }
      case OpenStage.Closing: {
        return {
          dialogClass: "transition-all duration-200",
          pictureClass: "transition-all duration-200",
          pictureStyle: `width: ${imageRect.width}px; height: ${imageRect.height}px; `,
          dialogStyle: computeDialogOverlay(),
          bodyStyle: `width: 0px`,
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

    imageRect = image!.getBoundingClientRect();
  });

  createEffect(() => {
    if (opened()) {
      dialog.showModal();

      const bodyRect = body.getBoundingClientRect();
      const pictureRect = picture.getBoundingClientRect();

      setOpenStage({
        stage: OpenStage.Opening,
      });

      createTimeout(() => {
        setOpenStage({
          stage: OpenStage.Opened,
          bodyRect,
          pictureRect,
        });
      }, 100);

      return;
    }

    setOpenStage({
      stage: OpenStage.PreClosing,
    });

    createTimeout(() => {
      setOpenStage({
        stage: OpenStage.Closing,
      });
    }, 0);

		createTimeout(() => {
      setOpenStage({
        stage: OpenStage.Closed,
      });
      dialog.close();
		}, 200);
  });

  return (
    <dialog
      ref={(e) => (dialog = e)}
      onClick={onClick}
      class={`fixed inset-0 bg-gray-800 rounded-lg overflow-hidden backdrop:bg-black/50 backdrop:backdrop-blur-md ${classes().dialogClass ?? ""}`}
      style={classes().dialogStyle}
    >
      <div ref={(e) => (container = e)} class="flex">
        <picture
          style={classes().pictureStyle}
          ref={(e) => (picture = e)}
          class={`[&>*]:h-full [&>*]:w-full [&>*]:object-cover max-h-96 ${classes().pictureClass ?? ""}`}
        >
          {image}
        </picture>

        <div
          class="transition-all duration-200"
          ref={(e) => (body = e)}
          style={classes().bodyStyle}
        >
          <div class="p-4">{children}</div>
        </div>
      </div>
    </dialog>
  );
}

function createTimeout(callback: () => void, ms?: number) {
  const timeout = setTimeout(callback, ms);
  onCleanup(() => clearTimeout(timeout));
}

const computeTargetAxis = (
  currentWidth: number,
  currentX: number,
  targetWidth: number,
) => (currentWidth - targetWidth) / 2 + currentX;

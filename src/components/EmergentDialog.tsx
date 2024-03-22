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
      pictureRect: DOMRect;
    }
  | {
      stage: OpenStage.Opened;
      bodyRect: DOMRect;
      pictureRect: DOMRect;
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

export default function EmergentDialog({
  opened,
  image,
  children,
  fromImage,
  onClose,
  containerClass,
}: {
  onClose: () => void;
  opened: Accessor<boolean>;
  image: JSX.Element;
  children: JSX.Element;
  fromImage: Accessor<Element | null | undefined>;
  containerClass?: string;
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

  const classes = createMemo(() => {
    const openState = openStage();

    if (!imageRect) return {};

    switch (openState.stage) {
      case OpenStage.Opening: {
        return {
          dialogStyle: computeDialogPosition(),
          pictureStyle: `width: ${imageRect.width}px; height: ${imageRect.height}px`,
          pictureClass: `max-h-none`,
          bodyStyle: `width: 0px`,
        };
      }
      case OpenStage.Opened:
        return {
          dialogClass: transitionClass,
          pictureClass: `${transitionClass} max-h-none`,
          pictureStyle: `width: ${openState.pictureRect.width}px; height: ${openState.pictureRect.height}px`,
          bodyStyle: `width: ${openState.bodyRect.width}px`,
          innerBodyStyle: `width: ${openState.bodyRect.width}px; height: ${openState.bodyRect.height}px`,
        };
      case OpenStage.PreClosing: {
        const pictureRect = picture.getBoundingClientRect();
        return {
          pictureStyle: `width: ${pictureRect.width}px; height: ${pictureRect.height}px`,
          bodyStyle: `width: ${openState.bodyRect.width}px; height: ${openState.bodyRect.height}px`,
          innerBodyStyle: `width: ${openState.bodyRect.width}px; height: ${openState.bodyRect.height}px`,
        };
      }
      case OpenStage.Closing: {
        const pictureSize = `width: ${imageRect.width}px; height: ${imageRect.height}px;`;

        return {
          dialogClass: transitionClass,
          pictureClass: `${transitionClass} max-h-none`,
          pictureStyle: pictureSize,
          dialogStyle: computeDialogPosition(),
          bodyStyle: `width: 0px; height: 0px;`,
          innerBodyStyle: `width: ${openState.bodyRect.width}px; height: ${openState.bodyRect.height}px`,
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
        pictureRect,
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
    }, 200);
  });

  return (
    <dialog
      ref={(e) => (dialog = e)}
      onClick={onClick}
      class={`fixed inset-0 bg-gray-800 rounded-lg overflow-hidden backdrop:bg-black/50 backdrop:backdrop-blur-md ${classes().dialogClass ?? ""}`}
      style={classes().dialogStyle}
    >
      <div ref={(e) => (container = e)} class={containerClass}>
        <picture
          style={classes().pictureStyle}
          ref={(e) => (picture = e)}
          class={`[&>*]:h-full [&>*]:w-full [&>*]:object-cover w-auto h-[9999px] max-h-96 ${classes().pictureClass ?? ""}`}
        >
          {image}
        </picture>

        <div
					class={transitionClass}
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

function createTimeout(callback: () => void, ms?: number) {
  const timeout = setTimeout(callback, ms);
  onCleanup(() => clearTimeout(timeout));
}

const computeTargetAxis = (
  currentWidth: number,
  currentX: number,
  targetWidth: number,
) => (currentWidth - targetWidth) / 2 + currentX;

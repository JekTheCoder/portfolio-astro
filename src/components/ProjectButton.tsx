import { projectElements } from "@/lib/projects-elements";
import {
  createSignal,
  onMount,
  type Signal,
  createEffect,
  type Accessor,
  onCleanup,
  createMemo,
} from "solid-js";

function createMounted() {
  const [mounted, setMounted] = createSignal(false);
  onMount(() => {
    setMounted(true);
  });

  return mounted;
}

export default function ProjectButton({
  children,
  projectId,
}: {
  children: string;
  projectId: string;
}) {
  let button: HTMLElement;

  const mounted = createMounted();
  const openedSignal = createSignal(false);

  const dialog = <ProjectDialog opened={openedSignal} element={() => button} />;

  const openDialog = () => {
    const [_, setOpened] = openedSignal;
    setOpened(true);
  };

  return (
    <>
      <a
        href={`/projects#${projectId}`}
        class={!mounted() ? "block" : "hidden"}
      >
        {children}
      </a>
      <button
        ref={(e) => (button = e)}
        onClick={openDialog}
        class={mounted() ? "block" : "hidden"}
      >
        {children}
      </button>

      {dialog}
    </>
  );
}

const enum OpenStage {
  Opening,
  Opened,
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
    }
  | {
      stage: OpenStage.Closing;
    }
  | {
      stage: OpenStage.Closed;
    };

function ProjectDialog({
  element,
  opened: [opened, setOpened],
}: {
  opened: Signal<boolean>;
  element: Accessor<HTMLElement>;
}) {
  let container: HTMLDivElement;
  let dialog: HTMLDialogElement;
  let body: HTMLElement;

  const onClick = (e: Event) => {
    if (!container.contains(e.target as Node)) {
      setOpened(false);
    }
  };

  const [openStage, setOpenStage] = createSignal<OpenState>({
    stage: OpenStage.Closed,
  });

  const classes = createMemo(() => {
    const openState = openStage();

    if (!element()) return {};

    const image = element().querySelector("#catstagram");
    const imageRect = image!.getBoundingClientRect();
    let dialogRect: DOMRect;

    switch (openState.stage) {
      case OpenStage.Opening:
        dialogRect = dialog.getBoundingClientRect();
        return {
          dialogStyle: `transform: translate(${-(dialogRect.left - imageRect.left)}px, ${imageRect.top - dialogRect.top}px)`,
          pictureStyle: `width: ${imageRect.width}px; height: ${imageRect.height}px`,
          bodyStyle: `width: 0px`,
        };
      case OpenStage.Opened:
        return {
          dialogClass: "transition-all duration-200",
          pictureStyle: `width: ${imageRect.width}px; height: ${imageRect.height}px`,
          bodyStyle: `width: ${openState.bodyRect.width}px`,
        };
      case OpenStage.Closing:
        const bodyRect = body.getBoundingClientRect();
        dialogRect = dialog.getBoundingClientRect();
        return {
          dialogClass: "transition-all duration-200",
          pictureStyle: `width: ${imageRect.width}px; height: ${imageRect.height}px`,
          dialogStyle: `transform: translate(${-(dialogRect.left - imageRect.left + bodyRect.width / 2)}px, ${imageRect.top - dialogRect.top}px)`,
          bodyStyle: `width: 0px`,
        };
      case OpenStage.Closed:
        return {
          pictureStyle: `width: ${imageRect.width}px; height: ${imageRect.height}px`,
        };
    }
  });

  let timeout: ReturnType<typeof setTimeout>;
  createEffect(() => {
    onCleanup(() => clearTimeout(timeout));

    if (opened()) {
      dialog.showModal();
      const bodyRect = body.getBoundingClientRect();
      setOpenStage({
        stage: OpenStage.Opening,
      });

      timeout = setTimeout(() => {
        setOpenStage({
          stage: OpenStage.Opened,
          bodyRect,
        });
      }, 100);
      return;
    }

    setOpenStage({
      stage: OpenStage.Closing,
    });
    timeout = setTimeout(() => {
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
      <div ref={(e) => (container = e)}>
        <div class="grid grid-cols-[auto_1fr] grid-rows-[minmax(0,1fr)]">
          <picture style={classes().pictureStyle}>
            <img class="h-full" src="/catstagram.PNG" alt="Catstagram" />
          </picture>

          <div
            class="overflow-hidden transition-all duration-200"
            ref={(e) => (body = e)}
            style={classes().bodyStyle}
          >
            <div class="p-4">
              <h3>Catstagram</h3>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  ) as HTMLDialogElement;
}

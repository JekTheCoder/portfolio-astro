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
  let picture: HTMLElement;
  let body: HTMLElement;

  const onClick = (e: Event) => {
    if (!container.contains(e.target as Node)) {
      setOpened(false);
    }
  };

  const [openStage, setOpenStage] = createSignal<OpenState>({
    stage: OpenStage.Closing,
  });

  const classes = createMemo(() => {
    const image = element().querySelector("#catstagram");
    const imageRect = image!.getBoundingClientRect();
    const dialogRect = dialog.getBoundingClientRect();

    const openState = openStage();

    switch (openState.stage) {
      case OpenStage.Opening:
        return {
          dialogStyle: `transform: translate(${-(dialogRect.left - imageRect.left)}px, ${imageRect.top - dialogRect.top}px)`,
          bodyStyle: `width: 0px`,
        };
      case OpenStage.Opened:
        return {
          dialogClass: "transition-all duration-1000",
          bodyStyle: `width: ${openState.bodyRect.width}px`,
        };
      case OpenStage.Closing:
        const bodyRect = body.getBoundingClientRect();
        return {
          dialogClass: "transition-all duration-1000",
          pictureStyle: `width: ${imageRect.width}px; height: ${imageRect.height}px`,
          bodyStyle: `width: 0px`,
          dialogStyle: `translate(${-(dialogRect.left - imageRect.left + bodyRect.width / 2)}px, ${imageRect.top - dialogRect.top}px)`,
        };
    }
  });

  let timeout: ReturnType<typeof setTimeout>;
  createEffect(() => {
    onCleanup(() => clearTimeout(timeout));

    if (opened()) {
      dialog.showModal();
      setOpenStage({
        stage: OpenStage.Opening,
      });
      const bodyRect = body.getBoundingClientRect();

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
      dialog.close();
    });
  });

  createEffect(() => {
    if (opened()) {
      dialog.showModal();

      const image = element().querySelector("#catstagram");
      const rect = image!.getBoundingClientRect();

      picture.style.width = `${rect.width}px`;
      picture.style.height = `${rect.height}px`;

      const dialogRect = dialog.getBoundingClientRect();

      body.style.width = "";
      body.classList.remove("w-0");

      dialog.classList.remove("transition-all");
      dialog.classList.remove("duration-1000");

      dialog.style.transform = `translate(${-(dialogRect.left - rect.left)}px, ${rect.top - dialogRect.top}px)`;

      const bodyRect = body.getBoundingClientRect();
      body.classList.add("w-0");

      setTimeout(() => {
        dialog.classList.add("transition-all");
        dialog.classList.add("duration-1000");

        dialog.style.transform = "";
        body.classList.remove("w-0");
        body.style.width = `${bodyRect.width}px`;
      }, 10);

      return;
    }

    dialog.classList.remove("transition-all");
    dialog.classList.remove("duration-150");

    const image = element().querySelector("#catstagram");
    const rect = image!.getBoundingClientRect();

    picture.style.width = `${rect.width}px`;
    picture.style.height = `${rect.height}px`;

    const dialogRect = dialog.getBoundingClientRect();

    const bodyRect = body.getBoundingClientRect();

    body.style.width = "";
    body.classList.add("w-0");

    dialog.classList.add("transition-all");
    dialog.classList.add("duration-150");
    dialog.style.transform = `translate(${-(dialogRect.left - rect.left + bodyRect.width / 2)}px, ${rect.top - dialogRect.top}px)`;

    setTimeout(() => {
      dialog.close();
    }, 150);
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
          <picture ref={(e) => (picture = e)} class={}>
            <img class="h-full" src="/catstagram.PNG" alt="Catstagram" />
          </picture>

          <div
            class="overflow-hidden transition-all duration-150"
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

import { createSignal, onMount } from "solid-js";
import EmergentDialog from "./EmergentDialog";

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

      <EmergentDialog
        opened={openedSignal}
        fromImage={() => button?.querySelector("#" + projectId)}
        image={<img src="/catstagram.PNG" alt="catstagram" />}
      >
        adawd
      </EmergentDialog>
    </>
  );
}

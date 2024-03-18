import { createSignal, onMount } from "solid-js";
import { setProjectDialog } from "@/lib/state/project-dialog";

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
	let image: HTMLImageElement | undefined;

	onMount(() => {
		image = button.querySelector("#"+projectId) as HTMLImageElement
	})

  const openDialog = () => {
		if (!image) return;

		const currentImage = image;

    setProjectDialog(() => ({
      id: projectId,
			image: currentImage,
    }));
  };

  return (
    <>
      <a
        href={`/projects#${projectId}`}
        class={`${!mounted() ? "block" : "hidden"} min-h-0`}
      >
        {children}
      </a>
      <button
        ref={(e) => (button = e)}
        onClick={openDialog}
        class={`${mounted() ? "block" : "hidden"} min-h-0`}
      >
        {children}
      </button>
    </>
  );
}

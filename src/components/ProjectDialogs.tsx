import { projectDialog, setProjectDialog } from "@/lib/state/project-dialog";
import EmergentDialog from "./EmergentDialog";
import { createEffect, createSignal } from "solid-js";

export default function ProjectDialogs() {
  const closeDialog = () => setProjectDialog(null);

  const [opened, setOpened] = createSignal<
    | {
        id: string | null;
        lastImage?: Element;
      }
    | undefined
  >(undefined);

  createEffect<{ id: string; image: Element } | null>((prev) => {
    const current = projectDialog();
    setOpened(() => ({
      id: current?.id ?? null,
      lastImage: current?.image ?? prev?.image,
    }));

    return current;
  }, null);

  return (
    <>
      <EmergentDialog
        onClose={closeDialog}
        image={<img src="/catstagram.PNG" alt="catstagram" />}
        fromImage={() => opened()?.lastImage}
        opened={() => opened()?.id === "catstagram"}
      >
        <h3>Catstagram</h3>

      </EmergentDialog>

      <EmergentDialog
        onClose={closeDialog}
        image={<img src="/blog-preview.png" alt="blog" />}
        fromImage={() => opened()?.lastImage}
        opened={() => opened()?.id === "blog"}
      >
        <h3>Blog!</h3>
      </EmergentDialog>
    </>
  );
}

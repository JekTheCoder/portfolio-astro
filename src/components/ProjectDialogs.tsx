import { projectDialog, setProjectDialog } from "@/lib/state/project-dialog";
import EmergentDialog from "./EmergentDialog";
import { createEffect, createSignal } from "solid-js";
import { PROJECTS } from "@/lib/const/projects";

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
      {PROJECTS.map((p) => (
        <EmergentDialog
          onClose={closeDialog}
          image={
            <>
              {p.image && (
                <img
                  id={p.id}
                  src={p.image}
                  alt={`Preview image of ${p.name}`}
                />
              )}
              {p.video && (
                <video
                  id={p.id}
                  src={p.video}
                  autoplay
                  muted
                  loop
                />
              )}
            </>
          }
          fromImage={() => opened()?.lastImage}
          opened={() => opened()?.id === p.id}
        >
          <h3>{p.name}</h3>
        </EmergentDialog>
      ))}
    </>
  );
}

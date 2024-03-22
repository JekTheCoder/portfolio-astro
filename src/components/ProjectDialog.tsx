import { projectDialog, setProjectDialog } from "@/lib/state/project-dialog";
import EmergentDialog from "./EmergentDialog";
import { type JSX, createEffect, createSignal } from "solid-js";

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

export default function ProjectDialog({
  projectId,
  image,
  video,
  children,
  name,
  containerClass,
}: {
  projectId: string;
  image?: string;
  video?: string;
  children: JSX.Element;
  name: string;
  containerClass?: string;
}) {
  const closeDialog = () => setProjectDialog(null);

  return (
    <EmergentDialog
      onClose={closeDialog}
      image={
        <>
          {image && (
            <img id={projectId} src={image} alt={`Preview of ${name}`} />
          )}
          {video && <video id={projectId} src={video} autoplay muted loop />}
        </>
      }
      fromImage={() => opened()?.lastImage}
      opened={() => opened()?.id === projectId}
      containerClass={containerClass}
    >
      {children}
    </EmergentDialog>
  );
}

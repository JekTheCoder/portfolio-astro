import { createSignal } from "solid-js";

export const [projectDialog, setProjectDialog] = createSignal<{
  id: string;
  image: Element;
} | null>(null);

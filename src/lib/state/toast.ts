import { createSignal } from "solid-js";

export const [toast, setToast] = createSignal("", { equals: false });

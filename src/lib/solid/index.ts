import { onCleanup } from "solid-js";

export function createTimeout(callback: () => void, ms?: number) {
  const timeout = setTimeout(callback, ms);
  onCleanup(() => clearTimeout(timeout));
}

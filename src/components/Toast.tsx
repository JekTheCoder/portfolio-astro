import { createTimeout } from "@/lib/solid";
import { toast } from "@/lib/state/toast";
import { createEffect, createSignal } from "solid-js";

export default function Toast() {
  const [show, setShow] = createSignal(false);

  createEffect(() => {
    if (!toast()) return;

    setShow(true);

    createTimeout(() => {
      setShow(false);
    }, 1_000);
  });

  return (
    <div
      class={`fixed bottom-4 right-1/2 left-1/2 bg-zinc-900 rounded-lg px-2 w-max transition-transform ease-in-out ${show() ? "translate-y-0" : "translate-y-10"}`}
    >
      {toast()}
    </div>
  );
}

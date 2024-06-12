import { setToast } from "@/lib/state/toast";
import CopyIcon from "@/public/icons/copy.svg?raw";

export default function ContactInfo({ children }: { children: HTMLElement | string }) {
  const copy = () => {
    navigator.clipboard.writeText((children as HTMLElement).innerHTML);
    setToast("copied!");
  };

  return (
    <button onClick={copy}>
      <span class="flex gap-x-2 bg-zinc-900 text-sm italic p-2 rounded-tr-lg rounded-bl-lg hover:text-soft-light">
        {children}

				<div class="h-5 w-5 aspect-square" innerHTML={CopyIcon}></div>
      </span>
    </button>
  );
}

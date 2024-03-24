import { setToast } from "@/lib/state/toast";

export default function ContactInfo({ children }: { children: HTMLElement }) {
  const copy = () => {
    navigator.clipboard.writeText(children.innerHTML);
    setToast("copied!");
  };

  return (
    <button onClick={copy}>
      <span class="bg-zinc-900 text-sm italic p-2 rounded-tr-lg rounded-bl-lg hover:text-soft-light">
        {children}
      </span>
    </button>
  );
}

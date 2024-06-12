import { closeDialog } from "@/lib/state/project-dialog";

export default function CloseDialogButton() {
	return <button class="rounded-full p-2 bg-opacity-20 hover:bg-zinc-700" onClick={closeDialog}>
		x
	</button>
}

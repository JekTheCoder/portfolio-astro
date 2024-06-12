import { closeDialog } from "@/lib/state/project-dialog";
import Icon from "./Icon";

export default function CloseDialogButton() {
	return <button class="rounded-full grid place-content-center h-8 w-8 hover:bg-opacity-20 hover:bg-white text-bold" onClick={closeDialog}>
		<Icon name="minus" class="h-4 w-4" />
	</button>
}

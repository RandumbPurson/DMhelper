import { dialog } from "electron";

function selectStatblock() {
    return dialog.showOpenDialogSync({});
}

export default selectStatblock;


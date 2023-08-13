import { dialog } from "electron";

function selectStatblock() {
    return dialog.showOpenDialogSync({});
}

function loadStatblock(){
    console.log(selectStatblock());
}

export default loadStatblock;


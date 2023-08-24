import { dialog } from "electron";

async function selectStatblock(options: Object) {
    console.log("options", options)
    let selection = await dialog.showOpenDialog(options);
    if (selection != null) {return selection.filePaths[0]}
}

export default selectStatblock;


import { dialog } from "electron";
import fs from "fs";
import yaml from "js-yaml";

export async function selectStatblock(options: Object) {
    let selection = await dialog.showOpenDialog(options);
    if (selection != null) {return selection.filePaths[0]}
}

export async function loadFromYaml(path: string) {
    let data = fs.readFileSync(path, "utf8")
    return yaml.load(data);
}


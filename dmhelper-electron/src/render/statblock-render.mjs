import { TabRenderer } from "./display-elements/tab-renderer.mjs";
import { renderStatusBar } from "./statusbar.mjs";
import { renderStatBar } from "./statbar.mjs";
import { createAction, updateAction } from "./actions.mjs";


const tabRenderer = new TabRenderer();

async function renderActiveStatblock() {
    renderStatusBar()
    renderStatBar()
    tabRenderer.initRender(
        {"actions": createAction, "reactions": createAction},
        {"actions": updateAction, "reactions": updateAction}
    )
}

export { renderActiveStatblock }


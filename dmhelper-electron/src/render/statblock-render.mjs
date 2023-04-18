import { TabRenderer } from "./display-elements/actions.mjs";
import { renderStatusBar } from "./statusbar.mjs";
import { renderStatBar } from "./statbar.mjs";

const tabRenderer = new TabRenderer();

async function renderActiveStatblock() {
    renderStatusBar()
    renderStatBar()
    tabRenderer.initRender()
}

export { renderActiveStatblock }


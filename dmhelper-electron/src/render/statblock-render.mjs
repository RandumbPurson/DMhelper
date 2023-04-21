import { TabRenderer } from "./display-elements/tabs.mjs";
import { renderStatusBar } from "./statusbar.mjs";
import { renderStatBar } from "./statbar.mjs";
import { getActionInfo } from "./display-elements/actions.mjs";

const tabRenderer = new TabRenderer();

async function renderActiveStatblock() {
    renderStatusBar()
    renderStatBar()
    let tabInfo = {
        ...await getActionInfo()
    }
    tabRenderer.initRender(tabInfo);
}

export { renderActiveStatblock }


import { TabRenderer } from "./display-elements/tabs.mjs";
import { renderStatusBar } from "./statusbar.mjs";
import { renderStatBar } from "./statbar.mjs";
import * as actions from "./display-elements/actions.mjs";

const tabRenderer = new TabRenderer();

async function renderActiveStatblock() {
    renderStatusBar()
    renderStatBar()
    let tabNames = await window.statblock.actionTabsData();
    let tabActionInfo = {};
    for (let tabName of tabNames){
        tabActionInfo[tabName] = {
            "createCallback": actions.createTabContent,
            "showCallback": actions.showTabContent
        }
    }
    tabRenderer.initRender(tabActionInfo)
}

export { renderActiveStatblock }


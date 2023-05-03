import { TabRenderer } from "./display-elements/tabs.mjs";
import { renderStatusBar } from "./statusbar.mjs";
import { renderStatBar } from "./statbar.mjs";
import { getActionInfo } from "./display-elements/actions.mjs";
import { getAttackInfo } from "./display-elements/attacks.mjs";
import { getMultiattackInfo } from "./display-elements/multiattack.mjs";

const tabRenderer = new TabRenderer();

async function getTabInfo() {
    const hasModules = await window.statblock.hasLoadedModules();
    let tabInfo = {};
    if (hasModules["multiattacks"]) {
        tabInfo = {...tabInfo, ...getMultiattackInfo()}
    }
    if (hasModules["actions"]){
        tabInfo = {...tabInfo, ...await getActionInfo()}
    }
    if (hasModules["attacks"]) {
        tabInfo = {...tabInfo, ...getAttackInfo()}
    }
    return tabInfo;
}

async function renderActiveStatblock() {
    renderStatusBar()
    renderStatBar()
    let tabInfo = await getTabInfo();
    tabRenderer.initRender(tabInfo);
}

export { renderActiveStatblock }


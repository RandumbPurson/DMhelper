import { TabManager } from "./display-elements/tabs.mjs";
import { renderStatusBar } from "./statusbar.mjs";
import { renderStatBar } from "./statbar.mjs";
import { ActionTab } from "./display-elements/actions.mjs";
import { AttackTab } from "./display-elements/attacks.mjs";
import { MultiattackTab } from "./display-elements/multiattack.mjs";

const tabManager = new TabManager();

async function getTabInfo() {
    const hasModules = await window.statblock.hasLoadedModules();
    if (hasModules["multiattacks"]) {
        tabManager.createTab("Multiattacks", new MultiattackTab("Multiattacks"))
    }
    if (hasModules["actions"]){
        let actionNames = await window.statblock.actionTabsData();
        for (let tabName of actionNames){
            await tabManager.createTab(tabName, new ActionTab(tabName))
        }
    }
    if (hasModules["attacks"]) {
        tabManager.createTab("Attacks", new AttackTab("Attacks"))
    }
}

async function renderActiveStatblock() {
    renderStatusBar()
    renderStatBar()
    tabManager.clearTabs()
    await getTabInfo();
    await tabManager.renderTabs()
}

export { renderActiveStatblock }


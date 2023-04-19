import { printOut } from "../output.mjs";

const actionDisplayTabs = document.getElementById("actionDisplayTabs");
const actionDisplay = document.getElementById("actionDisplay");


/**
 * TODO
 * - Decouple Tab Renderer from actions, attacks, etc.
 *  - Begin by removing "show"Actions" from init
 *  - Provide hooks
 */


/**
 * Remove all the children of an HTML element
 * @param {element} element - An HTML element; may or may not have children
 */
function removeAllChildren(element) {
    while (element.hasChildNodes()) {
        element.removeChild(element.firstChild);
    }
}

/**
 * Helper function to remove whitespace from a string
 * @param {string} string - Any string
 * @returns {string} A string with whitespace removed
 */
function removeWS(string) {
    return string.replaceAll(" ", "");
}

class TabRenderer {

    /**
     * Initialize rendering, only called on statblock selection
     */
    async initRender(renderHooks, updateHooks) {
        this.renderHooks = renderHooks;
        this.updateHooks = updateHooks;

        let sbData = await window.statblock.actionTabsData();
        removeAllChildren(actionDisplayTabs);
        removeAllChildren(actionDisplay);
        for (let tab of sbData) {
            await this.#createTab(tab);
        }
        if (actionDisplayTabs.hasChildNodes()){
            actionDisplayTabs.firstChild.className = "selectedTab";
            this.selectedTab = sbData[0];
        }
        this.updateTab();
    }

    /**
     * Create outer structures for a single tab
     * @param {string} tab - A string representing the name of the tab
     */
    async #createTab(tab) {
        // create tabs
        let tabBtn = document.createElement("button");
        tabBtn.textContent = tab;
        tabBtn.addEventListener("mouseover", this.#switchTab(tab))
        actionDisplayTabs.appendChild(tabBtn);

        // create content divs
        let tabContent = document.createElement("div");
        tabContent.id = `${removeWS(tab)}Tab`;
        tabContent.className = "tabContent";
        actionDisplay.appendChild(tabContent);

        // populate tab with actions
        await this.#createTabContent(tab);
    }

    /**
     * A callback function decorator for switching tabs
     * @param {string} tab - A string representing the name of the tab
     * @returns {function} The callback function for switching tabs 
     */
    #switchTab(tab) {
        return (event) => {
            actionDisplayTabs.childNodes.forEach(child => {
                child.className = "";
            })
            event.target.className = "selectedTab";
            this.selectedTab = tab;
            this.updateTab();
        }
    }

    /**
     * Shows actions for current tab; called on every update
     */
    async updateTab(){
        actionDisplay.childNodes.forEach(elem => {elem.style.display = "none"})
        this.#updateTabContent(
            this.selectedTab, 
            "block", 
            (...args) => this.updateHooks[this.selectedTab](...args)
        );
    }
    /**
     * Creates content for a specific tag, only called on statblock selection
     * @param {string} tab - A string representing the name of the tab
     */
    async #createTabContent(tab) {
        this.#updateTabContent(tab, "none", (...args) => this.renderHooks[tab](...args))
    }
    /**
     * Helper function to update or create content of a tab
     * @param {string} tab - A string representing the name of the tab
     * @param {string} display - Either "none" or "block" depending on whether to show or hide tab content
     * @param {function} renderFunc - A function of the form (key, val, selectedTab) called on each action
     *      in the tab's content
     * @returns {null} Returns if current tab fails to load or is unset
     */
    async #updateTabContent(tab, display, renderFunc){
        let sbData = await window.statblock.actionData(tab);
        if (sbData == null) {return}

        const selectedTab = document.getElementById(`${removeWS(tab)}Tab`);
        selectedTab.style.display = display;

        Object.entries(sbData).forEach(elem => {
            let [ key, val ] = elem;
            renderFunc(key, val, selectedTab);
        })
    }

}

export { TabRenderer }
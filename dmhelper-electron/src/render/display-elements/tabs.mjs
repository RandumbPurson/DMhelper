import { printOut } from "../output.mjs";

const tabsDisplay = document.getElementById("tabsDisplay");
const tabsContent = document.getElementById("tabsContent");


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
    async initRender(tabInfo) {
        let tabNames = Object.keys(tabInfo);
        this.tabInfo = tabInfo;

        removeAllChildren(tabsDisplay);
        removeAllChildren(tabsContent);
        for (let tab of tabNames) {
            await this.#createTab(tab); //-inv 0
        }
        if (tabsDisplay.hasChildNodes()){
            tabsDisplay.firstChild.className = "selectedTab";
            this.selectedTab = tabNames[0];
        }
        this.showActions()
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
        tabsDisplay.appendChild(tabBtn);

        // create content divs
        let tabContentDiv = document.createElement("div");
        tabContentDiv.id = `${removeWS(tab)}Tab`;
        tabContentDiv.className = "tabContent";
        tabsContent.appendChild(tabContentDiv);

        // populate tab with actions
        await this.#createTabContent(tab);
    }

    /** - Keep
     * A callback function decorator for switching tabs
     * @param {string} tab - A string representing the name of the tab
     * @returns {function} The callback function for switching tabs 
     */
    #switchTab(tab) {
        return (event) => {
            tabsDisplay.childNodes.forEach(child => {
                child.className = "";
            })
            event.target.className = "selectedTab";
            this.selectedTab = tab;
            this.showActions();
        }
    }

    /**
     * Shows actions for current tab; called on every update
     */
    async showActions(){
        tabsContent.childNodes.forEach(elem => {elem.style.display = "none"})
        this.tabInfo[this.selectedTab].showCallback(this.selectedTab)
    }
    /**
     * Creates content for a specific tab, only called on statblock selection
     * @param {string} tab - A string representing the name of the tab
     */
    async #createTabContent(tab) {
        this.tabInfo[tab].createCallback(tab, (...args) => this.showActions(...args))
    }

}

export { TabRenderer }
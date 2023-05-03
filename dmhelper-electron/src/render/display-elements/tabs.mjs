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

class TabManager {

    constructor() {
        this.clearTabs();
    }

    clearTabs() {
        this.tabs = {};
        this.selectedTab = "";
        removeAllChildren(tabsDisplay);
        removeAllChildren(tabsContent);
    }

    /**
     * Initialize rendering, only called on statblock selection
     */
    async renderTabs() {
        if (tabsDisplay.hasChildNodes()){
            tabsDisplay.firstChild.className = "selectedTab";
            this.selectedTab = Object.keys(this.tabs)[0];
            this.#showTabContent()
        }
    }

    /**
     * Create outer structures for a single tab
     * @param {string} tabName - A string representing the name of the tab
     * @param {object} tabObj - The tab object to create
     */
    async createTab(tabName, tabObj) {
        this.tabs[tabName] = tabObj;
        // create tabs
        let tabBtn = document.createElement("button");
        tabBtn.textContent = tabName;
        tabBtn.addEventListener("mouseover", this.#switchTab(tabName))
        tabsDisplay.appendChild(tabBtn);

        // create content divs
        let tabContentDiv = document.createElement("div");
        tabContentDiv.id = `${removeWS(tabName)}Tab`;
        tabContentDiv.className = "tabContent";
        tabsContent.appendChild(tabContentDiv);

        // populate tab with actions
        await tabObj.createTab()//this.#createTabContent(tabName, tabObj);
    }

    /** - Keep
     * A callback function decorator for switching tabs
     * @param {string} tabName - A string representing the name of the tab
     * @returns {function} The callback function for switching tabs 
     */
    #switchTab(tabName) {
        return (event) => {
            tabsDisplay.childNodes.forEach(child => {
                child.className = "";
            })
            event.target.className = "selectedTab";
            this.selectedTab = tabName;
            this.#showTabContent();
        }
    }

    async #showTabContent() {
        await this.tabs[this.selectedTab].showContent()
    }

    /**
     * Creates content for a specific tab, only called on statblock selection
     * @param {string} tabName - A string representing the name of the tab
     * @param {object} tabObj - An object defining update, creation, and callback fucntions
     *      for a particular tab
     */
    async #createTabContent(tabObj) {
        await tabObj.createTab((...args) => this.showContent(tabObj))
    }

}

export { TabManager }
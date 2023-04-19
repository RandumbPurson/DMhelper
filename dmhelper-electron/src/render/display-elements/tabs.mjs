import { printOut } from "../output.mjs";

const tabsDisplay = document.getElementById("tabsDisplay");
const tabsContent = document.getElementById("tabsContent");


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

    /** - keep
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
        await this.#createTabContent(tab); // -inv 1
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
    /** - likely keep
     * Creates content for a specific tag, only called on statblock selection
     * @param {string} tab - A string representing the name of the tab
     */
    async #createTabContent(tab) {
        // - inv 2                                       // - inv 3

        this.tabInfo[tab].createCallback(tab, (...args) => this.showActions(...args))
        //this.#updateTabContent(tab, "none", (...args) => this.#createAction(...args)) 
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
        // - gets action specific-data - change or separate
        let sbData = await window.statblock.actionData(tab);
        if (sbData == null) {return}

        Object.entries(sbData).forEach(elem => {
            let [ key, val ] = elem;
            renderFunc(key, val, selectedTab); // - inv ^
        })
    }

    
    /**
     * A callback function decorator to perform an action
     * @param {string} actionName - The name of the action to do
     * @returns {function} A callback function which performs the specified action
     */

    /*
    #doAction(actionName) {
        return async (event) => {
            // - action-specific, requires specific tab
            let result = await window.statblock.doAction({
                "actionType": this.selectedTab,
                "action": actionName
            })

            if (typeof(result) == "string") {
                printOut(result);
            }else{
                for (let roll in result) {
                    printOut(`${roll}: ${result[roll][1]}`)
                }
            }

            // - renderer specific
            this.showActions();
        }
    }
    

    async #doAction(func) {
        let func = await funcPromise;
        return async (event) => {
            func();

            this.showActions();
        }
    }
    */

}

export { TabRenderer }
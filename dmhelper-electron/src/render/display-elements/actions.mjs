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
    async initRender() {
        let sbData = await window.statblock.actionTabsData();
        removeAllChildren(tabsDisplay);
        removeAllChildren(tabsContent);
        for (let tab of sbData) {
            await this.#createTab(tab);
        }
        if (tabsDisplay.hasChildNodes()){
            tabsDisplay.firstChild.className = "selectedTab";
            this.selectedTab = sbData[0];
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
        let tabContent = document.createElement("div");
        tabContent.id = `${removeWS(tab)}Tab`;
        tabContent.className = "tabContent";
        tabsContent.appendChild(tabContent);

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
        this.#updateTabContent(this.selectedTab, "block", (...args) => this.#updateAction(...args));
    }
    /**
     * Creates content for a specific tag, only called on statblock selection
     * @param {string} tab - A string representing the name of the tab
     */
    async #createTabContent(tab) {
        this.#updateTabContent(tab, "none", (...args) => this.#createAction(...args))
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
    
    /**
     * Updates an action's uses without creating or destroying elements
     * @param {string} key - The name of an action in the current tab
     * @param {object} val - Info about the action with the given key
     * @param  {...any} args - Empty args allowing for usafe with @see #updateTabContent
     * @returns {null} Returns if not tracking uses
     */
    #updateAction(key, val, ...args) {
        if (!("maxUses" in val)) {return}
        let tabElemBlock = document.getElementById(`${removeWS(key)}`);
        let useHeader = tabElemBlock.querySelector(".useHeader");
        useHeader.textContent = `(${val["uses"]}/${val["maxUses"]})`;
    }
    
    /**
     * Create the content for a single action in the tab
     * @param {string} key - The name of an action in the current tab
     * @param {object} val - Info about the action with the given key
     * @param {element} selectedTab - An HTML element which represents the current tab
     */
    #createAction(key, val, selectedTab) {
        // outer container
        let tabElemBlock = document.createElement("div");
        tabElemBlock.className = "tabElemBlock collapsed";
        tabElemBlock.id = `${removeWS(key)}`;

        // - header container
        let tabElemHeader = document.createElement("div");
        tabElemHeader.className = "tabElemHeader";

        // - - header name container
        let nameHeader = document.createElement("header");
        nameHeader.className = "nameHeader";
        nameHeader.textContent = key;
        nameHeader.addEventListener("click", () => {
            tabElemBlock.classList.toggle("collapsed");
        })
        tabElemHeader.appendChild(nameHeader);

        // - - header uses container
        let useHeader = document.createElement("header");
        useHeader.className = "useHeader";
        useHeader.addEventListener("click", this.#doAction(key))
        if ("maxUses" in val) {  
            useHeader.textContent = `(${val["uses"]}/${val["maxUses"]})`;
        }else{
            useHeader.textContent = "Use";
        }
        tabElemHeader.appendChild(useHeader);
        tabElemBlock.appendChild(tabElemHeader);

        // - text
        let textBlock = document.createElement("p");
        textBlock.textContent = val["text"];

        tabElemBlock.appendChild(textBlock);
        selectedTab.appendChild(tabElemBlock);
    }
    
    /**
     * A callback function decorator to perform an action
     * @param {string} actionName - The name of the action to do
     * @returns {function} A callback function which performs the specified action
     */
    #doAction(actionName) {
        return async (event) => {
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
            this.showActions();
        }
    }

}

export { TabRenderer }
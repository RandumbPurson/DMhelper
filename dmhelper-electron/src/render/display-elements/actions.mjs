import { printOut } from "../output.mjs";
import { renderStatusBar } from "../statusbar.mjs";
import { Tab } from "./tab.mjs";

class ActionTab extends Tab {

    async createTab() {
        let sbData = await window.statblock.actionData(this.tabName);
        if (sbData == null) {return}

        const selectedTab = document.getElementById(`${this.tabName.replaceAll(" ", "")}Tab`);
        selectedTab.style.display = "none";

        for (let [ key, val ] of Object.entries(sbData)) {
            let tabElemBlock = this.#createElem(key, val);
            selectedTab.appendChild(tabElemBlock);
        }
    }

    async update() {
        let sbData = await window.statblock.actionData(this.tabName);
        if (sbData == null) {return}

        for (let [ key, val ] of Object.entries(sbData)) {
            await this.updateElem(key, val)
        }
    }

    async doAction(actionName) {
        let result = await window.statblock.doAction({
            "actionType": this.tabName,
            "action": actionName
        })

        if (typeof(result) == "string") {
            printOut(result);
        }else{
            for (let roll in result) {
                printOut(`${roll}: ${result[roll][1]}`)
            }
        }
        this.showContent();
    }

    #getUsesString(val) {
        let usesString = " --- ";
        if ("maxUses" in val) {  
            usesString = `(${val["uses"]}/${val["maxUses"]})`;
        }
        if ("resourceKey" in val) {
            usesString = usesString + ` ${val["resourceKey"]} [-${val["cost"]}]`
        }
        return usesString;
    }

    /**
     * Create the content for a single action in the tab
     * @param {string} key - The name of an action in the current tab
     * @param {object} val - Info about the action with the given key
     */
    #createElem(key, val) {

        // outer container
        let tabElemBlock = document.createElement("div");
        tabElemBlock.className = "tabElemBlock collapsed";
        tabElemBlock.id = `${key.replaceAll(" ", "")}`;

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
        useHeader.addEventListener("click", () => this.doAction(key))
        
        useHeader.textContent = this.#getUsesString(val);
        tabElemHeader.appendChild(useHeader);
        tabElemBlock.appendChild(tabElemHeader);

        // - text
        let textBlock = document.createElement("p");
        textBlock.textContent = val["text"];

        tabElemBlock.appendChild(textBlock);
        return tabElemBlock
    }

    /**
     * Updates an action's uses without creating or destroying elements
     * @param {string} key - The name of an action in the current tab
     * @param {object} val - Info about the action with the given key
     * @returns {null} Returns if not tracking uses
     */
    async updateElem(key, val) {
        if (!("maxUses" in val) && !("resourceKey" in val)) {return}
        let tabElemBlock = document.getElementById(`${key.replaceAll(" ", "")}`);
        let useHeader = tabElemBlock.querySelector(".useHeader");
        useHeader.textContent = this.#getUsesString(val);
        await renderStatusBar()
    }
}

export { ActionTab }
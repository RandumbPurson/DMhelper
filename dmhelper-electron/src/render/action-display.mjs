import { printOut } from "./output.mjs";

const actionDisplayTabs = document.getElementById("actionDisplayTabs");
const actionDisplay = document.getElementById("actionDisplay");

class ActionRenderer {

    async actionSetup() {
        let sbData = await window.statblock.actionTabsData();
        while (actionDisplayTabs.hasChildNodes()) {
            actionDisplayTabs.removeChild(actionDisplayTabs.firstChild);
        }
        while (actionDisplay.hasChildNodes()){
            actionDisplay.removeChild(actionDisplay.firstChild);
        }
        for (let tab of sbData) {
            await this.#setupActionTab(tab);
        }
        if (actionDisplayTabs.hasChildNodes()){
            actionDisplayTabs.firstChild.className = "selectedTab";
            this.selectedTab = sbData[0];
        }
        this.showActions()
    }

    async #setupActionTab(tab) {
        let tabBtn = document.createElement("button");
        tabBtn.textContent = tab;
        tabBtn.addEventListener("mouseover", this.#switchTab(tab))
        actionDisplayTabs.appendChild(tabBtn);

        let actionTab = document.createElement("div");
        actionTab.id = `${tab.replaceAll(" ", "")}Tab`;
        actionTab.className = "actionTab";
        actionDisplay.appendChild(actionTab);

        await this.#setupActionTabContent(tab);
    }
    async #setupActionTabContent(actionType) {
        let sbData = await window.statblock.actionData(actionType);
        const actionsTab = document.getElementById(`${actionType.replaceAll(" ", "")}Tab`);
        while (actionsTab.hasChildNodes()){
            actionsTab.removeChild(actionsTab.firstChild);
        }
        if (sbData == null) {
            return
        }
        Object.entries(sbData).forEach(elem => {
            let [ key, val ] = elem;
            this.#renderAction(key, val, actionsTab);
        })
        actionsTab.style.display = "none";
    }
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
    #updateAction(key, val) {
        if (!("maxUses" in val)) {return}
        let actionBlock = document.getElementById(`${key.replaceAll(" ", "")}`);
        let useHeader = actionBlock.querySelector(".useHeader");
        useHeader.textContent = `(${val["uses"]}/${val["maxUses"]})`;
    }
    
    #renderAction(key, val, actionsTab) {
        let actionBlock = document.createElement("div");
        actionBlock.className = "actionBlock collapsed";
        actionBlock.id = `${key.replaceAll(" ", "")}`;

        let actionHeader = document.createElement("div");
        actionHeader.className = "actionHeader";

        let nameHeader = document.createElement("header");
        nameHeader.className = "nameHeader";
        nameHeader.textContent = key;
        nameHeader.addEventListener("click", () => {
            actionBlock.classList.toggle("collapsed");
        })
        actionHeader.appendChild(nameHeader);

        let useHeader = document.createElement("header");
        useHeader.className = "useHeader";
        useHeader.addEventListener("click", this.#doAction(key))
        if ("maxUses" in val) {  
            useHeader.textContent = `(${val["uses"]}/${val["maxUses"]})`;
        }else{
            useHeader.textContent = "Use";
        }
        actionHeader.appendChild(useHeader);
        actionBlock.appendChild(actionHeader);

        let textBlock = document.createElement("p");
        textBlock.textContent = val["text"];

        actionBlock.appendChild(textBlock);
        actionsTab.appendChild(actionBlock);
    }
    
    #switchTab(tab) {
        return (event) => {
            actionDisplayTabs.childNodes.forEach(child => {
                child.className = "";
            })
            event.target.className = "selectedTab";
            this.selectedTab = tab;
            this.showActions();
        }
    }
    
    
    async showActions(){
        let sbData = await window.statblock.actionData(this.selectedTab);
        const currentTab = document.getElementById(`${this.selectedTab.replaceAll(" ", "")}Tab`);
        actionDisplay.childNodes.forEach(elem => {elem.style.display = "none"})
        currentTab.style.display = "block";
        Object.entries(sbData).forEach(elem => {
            let [ key, val ] = elem;
            this.#updateAction(key, val);
        })
    }
}

export { ActionRenderer }
const pbText = document.getElementById("pbText");
const skillList = document.querySelector(".skillList");

const statusBar = document.getElementById("statusBar");

const actionDisplayTabs = document.getElementById("actionDisplayTabs");
const actionDisplay = document.getElementById("actionDisplay");

const output = document.getElementById("output");
const anchor = document.getElementById("anchor");

function printOut(str) {
    let outLine = document.createElement("p");
    outLine.textContent = str;
    output.insertBefore(outLine, anchor.nextSibling);
}

/**
 * Render the status bar for the active statblock
 */
async function renderStatusBar() {
    const sbData = await window.statblock.statusbarData();
    let hpHeader = document.createElement("header");
    hpHeader.className = "hpHeader";
    hpHeader.textContent = `${sbData.hp} / ${sbData.maxHP}`;

    let acHeader = document.createElement("header");
    acHeader.className = "statusBarElem";
    acHeader.textContent = `AC: ${sbData.ac}`;

    let spdHeader = document.createElement("header");
    spdHeader.className = "statusBarElem";
    let renderedSpeeds = [];
    for (let key in sbData.speed) {
        renderedSpeeds.push(`${key}: ${sbData.speed[key]}ft`);
    }
    spdHeader.textContent = renderedSpeeds.join(", ");

    statusBar.innerHTML = "";
    statusBar.appendChild(hpHeader);
    statusBar.appendChild(acHeader);
    statusBar.appendChild(spdHeader);
}
/**
 * Render the stat bar for the active statblock
 */
async function renderStatBar(){
    const sbData = await window.statblock.statbarData();
    pbText.textContent = sbData.pb;
    for (let stat in sbData.statmods) {
        let listItem = document.querySelector(`#stat${stat}`);
        listItem.textContent = sbData.statmods[stat]

        let checkBtn = document.createElement("button");
        checkBtn.className = "statCheck";
        checkBtn.textContent = stat;
        checkBtn.addEventListener("click", async () => {
            let [ total, resultStr ] = await window.statblock.statCheck(stat);
            printOut(resultStr);
        })

        let saveBtn = document.createElement("button");
        saveBtn.className = sbData.savingThrows.includes(stat) 
            ? "proficientSave" : "notProficientSave";
        saveBtn.addEventListener("click", async () => {
            let [ total, resultStr ] = await window.statblock.rollSave(stat);
            printOut(resultStr);
        })

        listItem.appendChild(checkBtn);
        listItem.appendChild(saveBtn);
    }

    while (skillList.hasChildNodes()) {
        skillList.removeChild(skillList.firstChild);
    }
    sbData.skills.forEach( skill => {
        let listItem = document.createElement("li");
        let skillCheckBtn = document.createElement("button");
        skillCheckBtn.textContent = skill;
        skillCheckBtn.addEventListener("click", async () => {
            let [ total, resultStr ] = await window.statblock.skillCheck(skill);
            printOut(resultStr)
        })

        listItem.appendChild(skillCheckBtn);
        skillList.appendChild(listItem);
    })
}

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
        actionRenderer.showActions()
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

const actionRenderer = new ActionRenderer();

async function renderActiveStatblock() {
    renderStatusBar()
    renderStatBar()
   actionRenderer.actionSetup()
}

export { renderActiveStatblock }


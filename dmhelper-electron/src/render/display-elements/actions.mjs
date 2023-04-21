import { printOut } from "../output.mjs";

async function createTabContent(tab, updateCallback) {
    let sbData = await window.statblock.actionData(tab);
    if (sbData == null) {return}

    for (let [ key, val ] of Object.entries(sbData)) {
        createAction(key, val, tab, updateCallback)
    }
}

async function showTabContent(tab) {
    let sbData = await window.statblock.actionData(tab);
    if (sbData == null) {return}

    for (let [ key, val ] of Object.entries(sbData)) {
        updateAction(key, val)
    }
    const selectedTab = document.getElementById(`${tab.replaceAll(" ", "")}Tab`);
    selectedTab.style.display = "block";
}

async function doAction(tab, actionName) {
    let result = await window.statblock.doAction({
        "actionType": tab,
        "action": actionName
    })

    if (typeof(result) == "string") {
        printOut(result);
    }else{
        for (let roll in result) {
            printOut(`${roll}: ${result[roll][1]}`)
        }
    }
}

/**
 * Create the content for a single action in the tab
 * @param {string} key - The name of an action in the current tab
 * @param {object} val - Info about the action with the given key
 * @param {element} selectedTab - An HTML element which represents the current tab
 */
function createAction(key, val, tab, updateCallback) {
    const selectedTab = document.getElementById(`${tab.replaceAll(" ", "")}Tab`);
    selectedTab.style.display = "none";

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
    useHeader.addEventListener("click", async function() {
        await doAction(tab, key);
        updateCallback();
    })
    if ("maxUses" in val) {  
        useHeader.textContent = `(${val["uses"]}/${val["maxUses"]})`;
    }else{
        useHeader.textContent = " --- ";
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
 * Updates an action's uses without creating or destroying elements
 * @param {string} key - The name of an action in the current tab
 * @param {object} val - Info about the action with the given key
 * @param  {...any} args - Empty args allowing for usafe with @see #updateTabContent
 * @returns {null} Returns if not tracking uses
 */
function updateAction(key, val) {

    if (!("maxUses" in val)) {return}
    let tabElemBlock = document.getElementById(`${key.replaceAll(" ", "")}`);
    let useHeader = tabElemBlock.querySelector(".useHeader");
    useHeader.textContent = `(${val["uses"]}/${val["maxUses"]})`;
}

async function getActionInfo() {
    let tabNames = await window.statblock.actionTabsData();
    let tabActionInfo = {};
    for (let tabName of tabNames){
        tabActionInfo[tabName] = {
            "createCallback": createTabContent,
            "showCallback": showTabContent
        }
    }
    return tabActionInfo;
}

export { getActionInfo }
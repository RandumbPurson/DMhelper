import { printOut } from "../output.mjs";

async function createTabContent(tab, updateCallback) {
    let sbData = await window.statblock.multiattackData();
    if (sbData == null) {return}

    const selectedTab = document.getElementById(`${tab.replaceAll(" ", "")}Tab`);
    selectedTab.style.display = "none";

    for (let [ key, val ] of Object.entries(sbData)) {
        let attackElem = createMultiattack(key, val, updateCallback);
        selectedTab.appendChild(attackElem);
    }
}

async function showTabContent(...args) {
    
}

async function doMultiattack(attackName) {
    let result = await window.statblock.doMultiattack(attackName);
    for (let [ hstring, dstring, dtype ] of result) {
        printOut(`${hstring}: ${dstring} ${dtype}`);
    }
    
}

function createMultiattack(key, val, updateCallback) {

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
    tabElemHeader.appendChild(nameHeader);

    // - - header uses container
    let useHeader = document.createElement("header");
    useHeader.className = "useHeader";
    useHeader.addEventListener("click", async function() {
        await doMultiattack(key);
        updateCallback();
    })
    useHeader.textContent = `x${val}`;
    tabElemHeader.appendChild(useHeader);
    tabElemBlock.appendChild(tabElemHeader);

    return tabElemBlock;
}

function getMultiattackInfo() {
    return {
        "multiattacks": {
            "createCallback": createTabContent,
            "showCallback": showTabContent
        }
    }
}

export { getMultiattackInfo }
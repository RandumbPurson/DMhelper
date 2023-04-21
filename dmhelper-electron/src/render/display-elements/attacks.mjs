import { printOut } from "../output.mjs";

async function createTabContent(tab, updateCallback) {
    let sbData = await window.statblock.attacksData();
    if (sbData == null) {return}

    const selectedTab = document.getElementById(`${tab.replaceAll(" ", "")}Tab`);
    selectedTab.style.display = "none";

    for (let [ key, val ] of Object.entries(sbData)) {
        let attackElem = createAttack(key, val, updateCallback);
        selectedTab.appendChild(attackElem);
    }
}

async function showTabContent(...args) {
    
}

async function doAttack(attackName) {
    let [ hstring, dstring, dtype ] = await window.statblock.doAttack(attackName);
    printOut(`${hstring}: ${dstring} ${dtype}`);
}

function createAttack(key, val, updateCallback) {

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
        await doAttack(key);
        updateCallback();
    })
    useHeader.textContent = `${val.type} ${val.range}, ${val.hitBonus} to hit, ${val.dmgString} ${val.dmgType}`;
    tabElemHeader.appendChild(useHeader);
    tabElemBlock.appendChild(tabElemHeader);

    return tabElemBlock;
}

function getAttackInfo() {
    return {
        "attacks": {
            "createCallback": createTabContent,
            "showCallback": showTabContent
        }
    }
}

export { getAttackInfo }
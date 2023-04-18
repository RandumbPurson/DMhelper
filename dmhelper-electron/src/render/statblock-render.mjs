const pbText = document.getElementById("pbText");
const statList = document.querySelector(".statList");
const skillList = document.querySelector(".skillList");

const statusBar = document.getElementById("statusBar");

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

function renderActiveStatblock() {
    renderStatusBar()
    renderStatBar()
}

export { renderActiveStatblock }


import { printOut } from "./output.mjs";

const pbText = document.getElementById("pbText");
const skillList = document.querySelector(".skillList");

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

export { renderStatBar }
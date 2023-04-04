import { renderStatblock } from "./statblock-render.mjs";

const initiativeList = document.getElementsByClassName("initiativeList")[0];

function buildInitiativeItem(statblock) {
    let item = document.createElement("li");

    let button = document.createElement("button");
    button.innerText = statblock.name;
    button.addEventListener("click", () => {
        window.statblock.setActiveStatblock(statblock);
        renderStatblock(statblock)
    });

    let initText = document.createTextNode(statblock.initiative);
    
    item.appendChild(button);
    item.appendChild(initText);

    return item;
}

async function renderInitiativeList(){
    const cbInitList = await combatManager.getInitiativeList();
    const cbInitIndex = await combatManager.getInitiativeIndex();
    if (cbInitList.length == 0) {return};

    let initListHTML = cbInitList.map(buildInitiativeItem);
    if (cbInitIndex != null) {
        initListHTML[cbInitIndex].classList.add("currentTurn");
    }
    

    while (initiativeList.firstChild) {
        initiativeList.removeChild(initiativeList.firstChild);
    }
    initListHTML.forEach(elem => initiativeList.appendChild(elem))
}

export { renderInitiativeList };
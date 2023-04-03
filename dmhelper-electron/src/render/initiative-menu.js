const initiativeList = document.getElementsByClassName("initiativeList")[0];
const rollInitiativeBtn = document.getElementById("rollInitiativeBtn");

rollInitiativeBtn.addEventListener(
    "click", () => {
        window.combatManager.rollInitiative();
        renderInitiativeList();
    }
);

function buildInitiativeItem(statblock) {
    let item = document.createElement("li");

    let button = document.createElement("button");
    button.innerText = statblock.name;
    button.addEventListener(
        "click",
        () => window.display.renderStatblock(statblock)
    );

    let initText = document.createTextNode(toString(statblock.initiative));
    
    item.appendChild(button);
    item.appendChild(initText);

    return item;
}

async function renderInitiativeList(){
    const cbInitList = await window.combatManager.getInitiativeList();
    const cbInitIndex = await window.combatManager.getInitiativeIndex();

    let initListHTML = cbInitList.map(buildInitiativeItem);
    initListHTML[cbInitIndex].classList.add("currentTurn");

    while (initiativeList.firstChild) {
        initiativeList.removeChild(initiativeList.firstChild);
    }
    initListHTML.forEach(elem => initiativeList.appendChild(elem))
}

//exports.renderInitiativeList = renderInitiativeList;
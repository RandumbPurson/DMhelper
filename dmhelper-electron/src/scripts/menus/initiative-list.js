const { stat } = require("original-fs");

const initiativeList = document.getElementsByClassName("initiativeList");

function buildInitiativeItem(statblock) {
    let item = document.createElement("li");

    let button = document.createElement("button");
    button.innerText = statblock.name;
    button.addEventListener(window.display.renderStatblock(statblock));

    let initText = document.createTextNode(toString(statblock.initiative));
    
    item.appendChild(button);
    item.appendChild(initText);

    return item;
}

function renderInitiativeList(){
    const cbInitList = window.combatManager.getInitiativeList();
    const cbInitIndex = window.combatManager.getInitiativeIndex();

    let initListHTML = cbInitList.map(buildInitiativeItem);
    initListHTML[cbInitIndex].classList.add("currentTurn");

    initiativeList.innerHTML = initListHTML.join("");
}
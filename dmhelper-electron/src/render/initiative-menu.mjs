import { renderActiveStatblock } from "./statblock-render.mjs";

const initiativeList = document.getElementsByClassName("initiativeList")[0];

/**
 * Generate an initiative list HTML element from a statblock
 * @param {object} statblock - A Statblock object
 * @returns {object} The generated HTML element
 */
function buildInitiativeItem(statblock) {
    let item = document.createElement("li");

    let button = document.createElement("button");
    button.innerText = statblock.name;
    // Add event listener to load a specific statblock
    button.addEventListener("click", () => {
        window.statblock.setActiveStatblock(statblock);
        renderActiveStatblock(statblock)
    });

    let initText = document.createTextNode(statblock.initiative);
    
    item.appendChild(button);
    item.appendChild(initText);

    return item;
}

/**
 * Render the initiative list in the DOM
 * @returns {null} Returns early on failure
 */
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
import { LoadingMenu } from "./loading-menu.mjs";
import { renderInitiativeList } from "./initiative-menu.mjs";

/* Loading Button*/
const addSBBtn = document.getElementById("addSBBtn");
const loadStatblockBtn = document.getElementById("loadStatblockBtn");

let loadingMenu = new LoadingMenu();

loadStatblockBtn.addEventListener("click", () => {
    loadingMenu.getNewStatblock();
});

addSBBtn.addEventListener("click", () => {
    loadingMenu.loadNumStatblocks();
    renderInitiativeList();
});

/* Initiative Button */

const rollInitiativeBtn = document.getElementById("rollInitiativeBtn");

rollInitiativeBtn.addEventListener("click", async () => {
    const initList = await combatManager.getInitiativeList();
    if (initList.length == 0){
        return
    }
    combatManager.rollInitiative();
    renderInitiativeList();
});

/* Next Turn Button */
const nextTurnBtn = document.getElementById("nextTurnBtn");

nextTurnBtn.addEventListener("click", () => {
    combatManager.nextTurn();
    renderInitiativeList();
});
import { LoadingMenu } from "./loading-menu.mjs";
import { renderInitiativeList } from "./initiative-menu.mjs";

/* Loading Button*/
const addSBBtn = document.getElementById("addSBBtn");
const loadStatblockBtn = document.getElementById("loadStatblockBtn");

let loadingMenu = new LoadingMenu();

loadStatblockBtn.addEventListener("click", () => loadingMenu.getNewStatblock())

addSBBtn.addEventListener("click", () => loadingMenu.loadNumStatblocks())

/* Initiative Button */

const rollInitiativeBtn = document.getElementById("rollInitiativeBtn");

rollInitiativeBtn.addEventListener(
    "click", () => {
        window.combatManager.rollInitiative();
        renderInitiativeList();
    }
);
import { printOut } from "../output.mjs";
import { Tab } from "./tab.mjs";

class AttackTab extends Tab {
    async createTab() {
        let sbData = await window.statblock.attacksData();
        if (sbData == null) {return}
    
        const selectedTab = document.getElementById(`${this.tabName.replaceAll(" ", "")}Tab`);
        selectedTab.style.display = "none";
    
        for (let [ key, val ] of Object.entries(sbData)) {
            let attackElem = this.#createElem(key, val);
            selectedTab.appendChild(attackElem);
        }
    }
    
    async doAttack(attackName) {
        let [ hstring, dstring, dtype ] = await window.statblock.doAttack(attackName);
        printOut(`${hstring}: ${dstring} ${dtype}`);
        this.showContent();
    }
    
    #createElem(key, val) {
    
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
        useHeader.addEventListener("click", () => this.doAttack(key))
        useHeader.textContent = `${val.type} ${val.range}, ${val.hitBonus} to hit, ${val.dmgString} ${val.dmgType}`;
        tabElemHeader.appendChild(useHeader);
        tabElemBlock.appendChild(tabElemHeader);
    
        return tabElemBlock;
    }
}

export { AttackTab }
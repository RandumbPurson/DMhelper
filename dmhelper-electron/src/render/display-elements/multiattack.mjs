import { printOut } from "../output.mjs";
import { Tab } from "./tab.mjs";

class MultiattackTab extends Tab {
    async createTab() {
        let sbData = await window.statblock.multiattackData();
        if (sbData == null) {return}
    
        const selectedTab = document.getElementById(`${this.tabName.replaceAll(" ", "")}Tab`);
        selectedTab.style.display = "none";
    
        for (let [ key, val ] of Object.entries(sbData)) {
            let attackElem = this.#createElem(key, val);
            selectedTab.appendChild(attackElem);
        }
    }
    
    async doMultiattack(attackName) {
        let result = await window.statblock.doMultiattack(attackName);
        for (let [ hstring, dstring, dtype ] of result) {
            printOut(`${hstring}: ${dstring} ${dtype}`);
        }
        this.showContent()
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
        useHeader.addEventListener("click", async ( )=> this.doMultiattack(key))
        useHeader.textContent = `x${val}`;
        tabElemHeader.appendChild(useHeader);
        tabElemBlock.appendChild(tabElemHeader);
    
        return tabElemBlock;
    }
}


export { MultiattackTab }
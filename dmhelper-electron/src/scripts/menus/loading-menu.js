
const loadStatblockBtn = document.getElementById("loadStatblockBtn")
const numLoadInput = document.getElementById("numLoadInput")
const addSBInput = document.getElementById("addSBInput")
const addSBLabel = document.getElementById("addSBLabel")
const addSBBtn = document.getElementById("addSBBtn")

class LoadingMenu {
    constructor(root="/home/emmaf/DnD/statblocks"){
        this.root = root;
        this.curLoading = null;
        this.statblockData = null;
    }

    #getNameFromPath(path){
        let sbName = path.split("/");
        sbName = sbName[sbName.length - 1];
        sbName = sbName.substring(0, sbName.indexOf("."));
        return sbName;
    }

    #getNumSB(name){
        numLoadInput.style.display = "flex";
        addSBLabel.textContent = name;
        addSBInput.value = 1;
    }
    
    async loadNumStatblocks(){
        const num = parseInt(addSBInput.value);
        numLoadInput.style.display = "none";
        window.loading.addStatblocks({
            "num": num,
            ...this.statblockData
        });
    }

    async getNewStatblock(){
        const file = await window.loading.selectFile(this.root);
        const path = file.filePaths[0];
        const sbName = this.#getNameFromPath(path);
        this.statblockData = {
            "name": sbName,
            "data": await window.loading.loadStatblockData(path)
        }
        this.#getNumSB(sbName)
    }
}

let menu = new LoadingMenu();

loadStatblockBtn.addEventListener("click", () => menu.getNewStatblock())

addSBBtn.addEventListener("click", () => menu.loadNumStatblocks())
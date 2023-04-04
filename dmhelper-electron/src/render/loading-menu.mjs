const numLoadInput = document.getElementById("numLoadInput")
const addSBInput = document.getElementById("addSBInput")
const addSBLabel = document.getElementById("addSBLabel")

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
        loading.addStatblocks({
            "num": num,
            ...this.statblockData
        });
    }

    async getNewStatblock(){
        const file = await loading.selectFile(this.root);
        if (file.canceled) {return};
        const path = file.filePaths[0];
        const sbName = this.#getNameFromPath(path);
        this.statblockData = {
            "name": sbName,
            "data": await loading.loadStatblockData(path)
        }
        this.#getNumSB(sbName)
    }
}

export { LoadingMenu };
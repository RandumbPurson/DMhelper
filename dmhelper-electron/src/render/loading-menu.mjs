const numLoadInput = document.getElementById("numLoadInput")
const addSBInput = document.getElementById("addSBInput")
const addSBLabel = document.getElementById("addSBLabel")

class LoadingMenu {
    /**
     * @constructor
     * @param {string} root - The path to the directory with statblocks in it
     */
    constructor(root="/home/emmaf/DnD/statblocks"){
        this.root = root;
        this.curLoading = null;
        this.statblockData = null;
    }

    /**
     * Get the name of a statblock from its path
     * @param {string} path - The path to a statblock file
     * @returns {string} The name of the statblock to load
     */
    #getNameFromPath(path){
        let sbName = path.split("/");
        sbName = sbName[sbName.length - 1];
        sbName = sbName.substring(0, sbName.indexOf("."));
        return sbName;
    }

    /**
     * Render the statblock number selector
     * @param {string} name - The name of the statblock being loaded
     */
    #getNumSB(name){
        numLoadInput.style.display = "flex";
        addSBLabel.textContent = name;
        addSBInput.value = 1;
    }
    
    /**
     * Load the currently selected statblocks into the combat manager
     */
    async loadNumStatblocks(){
        const num = parseInt(addSBInput.value);
        numLoadInput.style.display = "none";
        loading.addStatblocks({
            "num": num,
            ...this.statblockData
        });
    }

    /**
     * Begin loading process
     * @returns {null}
     */
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
const loadStatblockBtn = document.getElementById("loadStatblockBtn")

class LoadingMenu {
    constructor(root="/home/emmaf/DnD/statblocks"){
        this.root = root;
        this.list = document.getElementById("loadList");
        this.statblocks = {};
    }

    #getNameFromPath(path){
        let sbName = path.split("/");
        sbName = sbName[sbName.length - 1];
        sbName = sbName.substring(0, sbName.indexOf("."));
        return sbName;
    }
    
    #addElemToList(sbName){
        const newElem = document.createElement("li");
        this.list.appendChild(newElem);
    
        const label = document.createElement("label");
        label.textContent = sbName;
        label.setAttribute("for", sbName);
        newElem.appendChild(label);
    
        const input = document.createElement("input");
        input.type = "number";
        input.name = sbName;
        input.id = sbName;
        newElem.appendChild(input);
    }

    async getNewStatblock(){
        const file = await window.loader.selectFile(this.root);
        const paths = file.filePaths;
        const names = paths.map(this.#getNameFromPath);
        names.forEach(sbName => this.#addElemToList(sbName));

        for (let i=0; i < names.length; i++){
            this.statblocks[names[i]] = {
                "ID": this.list.querySelector(`#${names[i]}`),
                "data": await window.loader.loadStatblock(paths[i])
            };
        }
    }
}

let menu = new LoadingMenu();

loadStatblockBtn.addEventListener("click", () => menu.getNewStatblock())

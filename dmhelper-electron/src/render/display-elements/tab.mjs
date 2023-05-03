const tabsContent = document.getElementById("tabsContent");

class Tab {
    constructor(tabName) {
        this.tabName = tabName;
    }

    async update(){}

    async showContent(){
        tabsContent.childNodes.forEach(elem => {elem.style.display = "none"})
        await this.update()

        const selectedTab = document.getElementById(
            `${this.tabName.replaceAll(" ", "")}Tab`
        );
        selectedTab.style.display = "block";
    }
}

export { Tab }
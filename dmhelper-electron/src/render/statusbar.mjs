const statusBar = document.getElementById("statusBar");

function removeAllChildren(element) {
    while (element.hasChildNodes()) {
        element.removeChild(element.firstChild);
    }
}

/**
 * Render the status bar for the active statblock
 */
async function renderStatusBar() {
    // TODO - comment
    const sbData = await window.statblock.statusbarData();
    let hpHeader = document.createElement("header");
    hpHeader.className = "hpHeader";
    hpHeader.textContent = `${sbData.hp} / ${sbData.maxHP}`;

    let acHeader = document.createElement("header");
    acHeader.className = "statusBarElem";
    acHeader.textContent = `AC: ${sbData.ac}`;

    let spdHeader = document.createElement("header");
    spdHeader.className = "statusBarElem";
    let renderedSpeeds = [];
    for (let key in sbData.speed) {
        renderedSpeeds.push(`${key}: ${sbData.speed[key]}ft`);
    }
    spdHeader.textContent = renderedSpeeds.join(", ");

    removeAllChildren(statusBar);
    statusBar.appendChild(hpHeader);
    statusBar.appendChild(acHeader);
    statusBar.appendChild(spdHeader);

    //optional
    let hasModules = await window.statblock.hasLoadedModules();

    if (hasModules["resources"]){
        let resources = await window.statblock.getResources();
        for (let resource of resources){
            let resourceVal = await window.statblock.getResourceVal(resource);
            let resourceHeader = document.createElement("header");
            resourceHeader.className = "statusBarElem clickable";
            resourceHeader.textContent = `${resource}: ${resourceVal}`;
            resourceHeader.addEventListener("click", async (event) => {
                await window.statblock.resetResource(resource);
                await renderStatusBar();
            })
            statusBar.appendChild(resourceHeader);
        }
    }
}

export { renderStatusBar }
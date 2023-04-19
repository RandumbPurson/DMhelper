
/**
 * Updates an action's uses without creating or destroying elements
 * @param {string} key - The name of an action in the current tab
 * @param {object} val - Info about the action with the given key
 * @param  {...any} args - Empty args allowing for usafe with @see #updateTabContent
 * @returns {null} Returns if not tracking uses
 */
function updateAction(key, val, ...args) {
    if (!("maxUses" in val)) {return}
    let actionBlock = document.getElementById(`${removeWS(key)}`);
    let useHeader = actionBlock.querySelector(".useHeader");
    useHeader.textContent = `(${val["uses"]}/${val["maxUses"]})`;
}

/**
     * A callback function decorator to perform an action
     * @param {string} actionName - The name of the action to do
     * @returns {function} A callback function which performs the specified action
     */
function doAction(actionName) {
    return async (event) => {
        let result = await window.statblock.doAction({
            "actionType": this.selectedTab,
            "action": actionName
        })
        if (typeof(result) == "string") {
            printOut(result);
        }else{
            for (let roll in result) {
                printOut(`${roll}: ${result[roll][1]}`)
            }
        }
        this.showActions();
    }
}

/**
 * Create the content for a single action in the tab
 * @param {string} key - The name of an action in the current tab
 * @param {object} val - Info about the action with the given key
 * @param {element} selectedTab - An HTML element which represents the current tab
 */
function createAction(key, val, selectedTab) {
    // outer container
    let actionBlock = document.createElement("div");
    actionBlock.className = "actionBlock collapsed";
    actionBlock.id = `${removeWS(key)}`;

    // - header container
    let actionHeader = document.createElement("div");
    actionHeader.className = "actionHeader";

    // - - header name container
    let nameHeader = document.createElement("header");
    nameHeader.className = "nameHeader";
    nameHeader.textContent = key;
    nameHeader.addEventListener("click", () => {
        actionBlock.classList.toggle("collapsed");
    })
    actionHeader.appendChild(nameHeader);

    // - - header uses container
    let useHeader = document.createElement("header");
    useHeader.className = "useHeader";
    useHeader.addEventListener("click", doAction(key))
    if ("maxUses" in val) {  
        useHeader.textContent = `(${val["uses"]}/${val["maxUses"]})`;
    }else{
        useHeader.textContent = "Use";
    }
    actionHeader.appendChild(useHeader);
    actionBlock.appendChild(actionHeader);

    // - text
    let textBlock = document.createElement("p");
    textBlock.textContent = val["text"];

    actionBlock.appendChild(textBlock);
    selectedTab.appendChild(actionBlock);
}

export { createAction, updateAction }
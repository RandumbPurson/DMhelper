import { ActionRenderer } from "./action-display.mjs";
import { renderStatusBar } from "./statusbar.mjs";
import { renderStatBar } from "./statbar.mjs";

const actionRenderer = new ActionRenderer();

async function renderActiveStatblock() {
    renderStatusBar()
    renderStatBar()
    actionRenderer.actionSetup()
}

export { renderActiveStatblock }


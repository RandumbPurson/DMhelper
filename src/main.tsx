import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App.tsx";
import "./index.css";

import CombatManager from "./main/combat-manager.ts";
import store from "./main/store.ts";

const combatMgr = new CombatManager();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

postMessage({ payload: "removeLoading" }, "*");

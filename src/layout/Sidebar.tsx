import { createContext, useState } from "react";
import DynamicButtons from "../components/sidebar/DynamicButtons";
import { LoadButton } from "../components/sidebar/LoadButton";
import "./Layout.css";

type renderDataValues = {
  name: string;
  uid: number;
  initiative: number;
}[];

interface statblockRenderManagerValues {
  renderData: renderDataValues | [];
  setRenderData: Function;
}

export const StatblockRenderManager =
  createContext<statblockRenderManagerValues>({
    renderData: [],
    setRenderData: () => null,
  });

// Component
function Sidebar() {
  const [renderData, setRenderData] = useState([]);

  return (
    <div className="sidebar">
      <StatblockRenderManager.Provider value={{ renderData, setRenderData }}>
        <div className="staticButtonGroup">
          <LoadButton />
        </div>

        <div className="dynamicButtonGroup">
          <DynamicButtons />
        </div>
      </StatblockRenderManager.Provider>
    </div>
  );
}

export default Sidebar;

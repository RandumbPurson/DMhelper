import "./Sidebar.css";

import DynamicButtons from "../components/sidebar/DynamicButtons";
import { LoadButton } from "../components/sidebar/LoadButton";

// Component
function Sidebar() {
  return (
    <div className="sidebar">
      <div className="staticButtonsContainer">
        <LoadButton />
      </div>
      <div className="dynamicButtonsContainer">
        <DynamicButtons />
      </div>
    </div>
  );
}

export default Sidebar;

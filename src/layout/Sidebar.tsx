import DynamicButtons from "../components/sidebar/DynamicButtons";
import { LoadButton } from "../components/sidebar/LoadButton";
import "./Layout.css";

// Component
function Sidebar() {
  return (
    <div className="sidebar">
      <div className="staticButtonGroup">
        <LoadButton />
      </div>

      <div className="dynamicButtonGroup">
        <DynamicButtons />
      </div>
    </div>
  );
}

export default Sidebar;

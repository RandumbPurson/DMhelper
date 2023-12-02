import { useContext } from "react";
import { StatblockRenderManager } from "../../layout/Sidebar";
import StatblockButton from "./StatblockButton";

function SidebarDynamicButtons() {
  const { renderData, setRenderData } = useContext(StatblockRenderManager);

  return (
    <>
      {renderData.map((data) => {
        return <StatblockButton key={`${data.name}${data.uid}`} data={data} />;
      })}
    </>
  );
}

export default SidebarDynamicButtons;

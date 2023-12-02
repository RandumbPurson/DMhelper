import { useContext } from "react";
import "./Statblock.css";
import { AppManager } from "../../App";
import StatblockHeader from "./StatblockHeader";

function Statblock() {
  const { statblockData } = useContext(AppManager);
  if (statblockData == null) {
    return <></>;
  }
  return (
    <div className="stat-block">
      <StatblockHeader
        name={statblockData["name"]}
        traits={statblockData["traits"]}
      />
      <p>{JSON.stringify(statblockData)}</p>
      {null}
    </div>
  );
}

export default Statblock;

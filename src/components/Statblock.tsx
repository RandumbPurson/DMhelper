import { useContext, useEffect } from "react";
import "./Statblock.css";
import { AppManager } from "../App";

function Statblock() {
  const { statblockData } = useContext(AppManager);

  return (
    <>
      <p className="stat-block">{JSON.stringify(statblockData)}</p>
    </>
  );
}

export default Statblock;

import { useContext } from "react";

async function loadStatblock() {
  let statblock = await window.fs.selectStatblock();
  console.log(statblock);
}

function LoadButton() {
  const combatMgr = useContext(ManagerContext);
  return <button onClick={loadStatblock}>Load</button>;
}

export default LoadButton;

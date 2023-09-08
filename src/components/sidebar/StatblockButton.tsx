import { useContext } from "react";
import { AppManager } from "../../App";

interface Props {
  data: {
    name: string;
    uid: number;
    initiative: number;
  };
}

function StatblockButton({ data }: Props) {
  const { updateStatblock } = useContext(AppManager);

  let { name, uid, initiative } = data;
  return (
    <div className="statblockButtonDiv">
      <button
        onClick={async () => {
          const newSBData = await window.statblock.getData({ name, uid });
          updateStatblock(newSBData);
        }}
        className="statblockMainButton"
      >
        <div className="sbName">{name}</div>
        <div className="sbID">{uid}</div>
      </button>
      <button className="statblockInitButton">
        {initiative ? initiative : null}
      </button>
    </div>
  );
}

export default StatblockButton;

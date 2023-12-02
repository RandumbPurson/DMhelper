import "./Statblock.css";
import { traitsType } from "../../../@types/statblockTypes";

function formatStatblockHeading(traits: traitsType) {
  let commaFlag = false;
  let outStr = "";
  if (traits["size"]) {
    outStr = outStr + traits["size"] + " ";
    commaFlag = true;
  }
  if (traits["creatureType"]) {
    outStr = outStr + traits["creatureType"];
    commaFlag = true;
  }
  if (traits["alignment"]) {
    if (commaFlag) {
      outStr = outStr + ", ";
    } else {
      outStr = outStr + " ";
    }
    outStr = outStr + traits["alignment"];
  }

  return outStr;
}

interface Props {
  name?: string;
  traits: traitsType;
}

export default function StatblockHeader({ name, traits }: Props) {
  return (
    <div className="creature-heading tapered-rule">
      <h1>{name}</h1>
      <h2>{formatStatblockHeading(traits)}</h2>
    </div>
  );
}

import { traitsType, stateType } from "../../../types/statblockObjectTypes";
import "./Statblock.css";

interface Props {
    traits: traitsType;
    state: stateType;
}

function speedsString(speeds: [string, number][]) {
    return Object.entries(speeds).map(spd => `${spd[0]} ${spd[1]} ft`).join(",")
}

export default function SBTopInfo({traits, state}: Props) {
    return (
        <div className="top-stats">
            <div className="property-line first">
                <h4>Armor Class</h4>
                <p> {traits["AC"]}</p>
            </div>
            <div className="property-line">
                <h4>Hit Points </h4>
                <p>{`${state["HP"]} / ${state["maxHP"]} ${traits["HPDice"] ? traits["HPDice"] : ""}`}</p>
            </div>
            <div className="property-line">
                <h4>Speed </h4>
                <p>{speedsString(traits["speed"])}</p>
            </div>
        </div>
    );
}

import { traitsType, stateType } from "../../../types/statblockObjectTypes";
import "./Statblock.css";

interface Props {
    traits: traitsType;
    state: stateType;
}

export default function StatblockTopInfo({traits, state}: Props) {
    console.log(traits, state)
    return (
        <div className="top-stats">
            <div className="property-line first">
                <h4>Armor Class </h4>
                <p>{traits["AC"]}</p>
            </div>
            <div className="property-line">
                <h4>Hit Points </h4>
                <p>{`${state["HP"]} / ${state["maxHP"]}`}</p>
            </div>
        </div>
    );
}

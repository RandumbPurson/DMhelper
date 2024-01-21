import { traitsType } from "../../../types/statblockObjectTypes";
import "./Statblock.css";

interface Props {
    traits: traitsType;
}

export default function StatblockTopInfo({traits}: Props) {
    console.log(traits)
    return (
        <div className="top-stats">
            <div className="property-line first">
                <h4>Armor Class </h4>
                <p>{traits["AC"]}</p>
            </div>
        </div>
    );
}

import { statsType, traitsType } from "../../../types/statblockObjectTypes"
import { decoratePositives } from "../../utils/strProcessing";

const TEXT = 0;
const VAL = 1;

interface Props {
    traits: traitsType;
    stats: statsType;
}

function propLine(prop: string, condition: any, getdata: () => string, classes="") {
    if (!condition) return;
    return (<div className={`property-line ${classes}`}>
        <h4>{prop}</h4>
        <p> {getdata()}</p>
    </div>)
}

export default function SBMidInfo({traits, stats}: Props) {
    return (<div>
        {propLine(
            "Saving Throws", 
            stats.savingThrows,
            () => Object.entries(stats.savingThrows).map(
                save => `${save[TEXT]} ${decoratePositives(save[VAL])}`
            ).join(", "),
            "first"
        )} 
        {propLine(
            "Skills",
            stats.skills,
            () => Object.entries(stats.skills).map(
                skill => `${skill[TEXT]} ${decoratePositives(skill[VAL])}`    
            ).join(", ")
        )}
        {propLine(
            "Damage Resistances",
            traits.resistances,
            () => traits.resistances!.join(", ")
        )}
        {propLine(
            "Damage Immunities",
            traits.immunities,
            () => traits.immunities!.join(", ")
        )}
    </div>)
}

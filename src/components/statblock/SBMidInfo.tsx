import { statsType, traitsType } from "../../../types/statblockObjectTypes"
import { decoratePositives } from "../../utils/strProcessing";

const TEXT = 0;
const VAL = 1;

interface Props {
    traits: traitsType;
    stats: statsType;
}

function ifExists(data: any, val: any) {
    if (data) return val;
}

function propLine(prop: string, data: string, classes="") {
    return (<div className={`property-line ${classes}`}>
        <h4>{prop}</h4>
        <p> {data}</p>
    </div>)
}

export default function SBMidInfo({traits, stats}: Props) {
    return (<div>
        {ifExists(stats.savingThrows, propLine(
            "Saving Throws", 
            Object.entries(stats.savingThrows).map(
                save => `${save[TEXT]} ${decoratePositives(save[VAL])}`
            ).join(", "),
            "first"
        ))} 
        {ifExists(stats.skills, propLine(
            "Skills",
            Object.entries(stats.skills).map(
                skill => `${skill[TEXT]} ${decoratePositives(skill[VAL])}`    
            ).join(", ")
        ))}
        {ifExists(traits.resistances, propLine(
            "Damage Resistances",
            traits.resistances!.join(", ")
        ))}
    </div>)
}

import { statsType, traitsType } from "../../../../types/statblockObjectTypes"
import { decoratePositives } from "../../../utils/strProcessing";

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

function multiTextPropLine(prop: string, data?: string[], classes="") {
    return propLine(
        prop,
        data,
        () => data!.join(", "),
        classes
    )
}

export default function MidInfo({traits, stats}: Props) {
    return (<div>
        {propLine(
            "Proficiency Bonus",
            stats.pb,
            () => stats.pb!.toString(),
            "first"
        )}
        {propLine(
            "Saving Throws", 
            stats.savingThrows,
            () => Object.entries(stats.savingThrows).map(
                save => `${save[TEXT]} ${decoratePositives(save[VAL])}`
            ).join(", ")
        )} 
        {propLine(
            "Skills",
            stats.skills,
            () => Object.entries(stats.skills).map(
                skill => `${skill[TEXT]} ${decoratePositives(skill[VAL])}`    
            ).join(", ")
        )}
        {multiTextPropLine(
            "Damage Vulnerabilities",
            traits.vulnerabilities
        )}
        {multiTextPropLine(
            "Damage Resistances",
            traits.resistances
        )}
        {multiTextPropLine(
            "Damage Immunities",
            traits.immunities
        )}
        {multiTextPropLine(
            "Condition Immunities",
            traits.condImmunities
        )}
        {multiTextPropLine("Senses", traits.senses)}
        {multiTextPropLine("Languages", traits.languages)}
        {propLine(
            "Challenge",
            traits.CR,
            () => traits.CR!.toString(),
            "last"
        )}


    </div>)
}

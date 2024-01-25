import { statChoice } from "../../../../types/enums";
import { statsType } from "../../../../types/statblockObjectTypes"
import { decoratePositives } from "../../../utils/strProcessing";

interface Props {
    stats: statsType
}

function renderStat(
    stats: statsType, 
    statcode: statChoice 
) {
    let mod = stats.statmods[statcode];
    return (<div>
        <h4>{statcode}</h4>
        <p>{
            `${stats.stats[statcode]} (${decoratePositives(mod)})`}
        </p>
    </div>)
}

export default function SBStats({stats}: Props) {
    return (
    <div className="abilities">
        {renderStat(stats, "STR")}
        {renderStat(stats, "DEX")}
        {renderStat(stats, "CON")}
        {renderStat(stats, "INT")}
        {renderStat(stats, "WIS")}
        {renderStat(stats, "CHA")}
    </div>
    )
}

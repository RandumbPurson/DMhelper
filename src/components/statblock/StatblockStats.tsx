import { statsType as statsType } from "../../../types/statblockObjectTypes"

interface Props {
    stats: statsType
}

let statmodsStr = (statmod: number) => {
    if (statmod >= 0) {
        return `+${statmod}`
    }else{
        return `${statmod}`
    }
}

function renderStat(
    stats: statsType, 
    statcode: string
) {
    let mod = stats.statmods[statcode];
    return (<div>
        <h4>{statcode}</h4>
        <p>{
            `${stats.stats[statcode]} (${statmodsStr(mod)})`}
        </p>
    </div>)
}

export default function StatblockStats({stats}: Props) {
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

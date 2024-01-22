import { useContext } from "react";
import "./Statblock.css";
import { AppManager } from "../../App";
import SBHeader from "./SBHeader";
import SBTopInfo from "./SBTopInfo";
import SBStats from "./SBStats";
import SBMidInfo from "./SBMidInfo";

function rule() {
    return (
    <svg height="5" width="100%" className="tapered-rule">
        <polyline points="0,0 400,2.5 0,5"></polyline>
    </svg>
    )
}

function Statblock() {
    const { statblockData } = useContext(AppManager);
    if (statblockData == null) {
        return <></>;
    }
    return (
        <div className="stat-block">
            <SBHeader
                name={statblockData["name"]}
                traits={statblockData["traits"]}
            />
            {rule()}
            <SBTopInfo 
                traits={statblockData["traits"]}
                state={statblockData["state"]}
            />
            {rule()}
            <SBStats stats={statblockData["stats"]} />
            {rule()}
            <SBMidInfo 
                traits={statblockData["traits"]}
                stats={statblockData["stats"]}
            />
            {rule()}
        </div>
    );
}

export default Statblock;

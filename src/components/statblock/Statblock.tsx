import { useContext } from "react";
import "./Statblock.css";
import { AppManager } from "../../App";
import SBHeader from "./SBHeader";
import SBTopInfo from "./SBTopInfo";
import SBStats from "./SBStats";

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
        <div className="stat-block wide section-left">
            <SBHeader
                name={statblockData["name"]}
                traits={statblockData["traits"]}
            />
            {rule()}
            <SBTopInfo traits={statblockData["traits"]} state={statblockData["state"]}/>
            {rule()}
            <SBStats stats={statblockData["stats"]} />
            {rule()}
            <p>{JSON.stringify(statblockData)}</p>
            {null}
        </div>
    );
}

export default Statblock;

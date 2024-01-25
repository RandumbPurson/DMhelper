import { useContext } from "react";
import "./Statblock.css";
import { AppManager } from "../../App";
import Header from "./static/Header";
import TopInfo from "./static/TopInfo";
import Stats from "./static/Stats";
import MidInfo from "./static/MidInfo";
import SBTraits from "./Traits";
import Actions from "./Actions/Actions";

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
        <div className="stat-block wide">
        <div className="section-left">
            <Header
                name={statblockData["name"]}
                traits={statblockData["traits"]}
            />
            {rule()}
            <TopInfo 
                traits={statblockData["traits"]}
                state={statblockData["state"]}
            />
            {rule()}
            <Stats stats={statblockData["stats"]} />
            {rule()}
            <MidInfo 
                traits={statblockData["traits"]}
                stats={statblockData["stats"]}
            />
            {rule()}
            <SBTraits
                traits={statblockData["traits"]}
            />
        </div>
        <div className="section-right">
            <Actions 
                actions={statblockData["actions"]}
            /> 
        </div>
        </div>
    );
}

export default Statblock;

import { useContext } from "react";
import "./Statblock.css";
import { AppManager } from "../../App";
import StatblockHeader from "./StatblockHeader";
import StatblockTopInfo from "./StatblockTopInfo";

function Statblock() {
    const { statblockData } = useContext(AppManager);
    if (statblockData == null) {
        return <></>;
    }
    return (
        <div className="stat-block wide section-left">
            <StatblockHeader
                name={statblockData["name"]}
                traits={statblockData["traits"]}
            />
            <svg height="5" width="100%" className="tapered-rule">
                <polyline points="0,0 400,2.5 0,5"></polyline>
            </svg>
            <StatblockTopInfo traits={statblockData["traits"]} state={statblockData["state"]}/>
            <p>{JSON.stringify(statblockData)}</p>
            {null}
        </div>
    );
}

export default Statblock;

import React, {useEffect, useState} from 'react';
import Header from "./header";
import StatusList from "./statusList";
import Loader from "./loader";

import "../css/StatScreen.css"
import FetchUtil from "../utils/fetchUtil";
import TimeUtil from "../utils/TimeUtil";

function formatNumber(number, symbol = "+", isDelta) {
    if (!number && isDelta) {
        return;
    }
    try {
        if (Number.isFinite(number)) {
            return (isDelta ? symbol : "") + Number(number).toLocaleString();
        }
    } catch {
        return (isDelta ? symbol : "") + number;
    }

}

function StatScreen(props) {
    const [stats, setStats] = useState([]);
    const [globalStat, setGlobalStat] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [lastChecked, setLastChecked] = useState();

    useEffect(() => {
        const fetchStats = async () => {
            const response = await FetchUtil.fetchStats(props.regions);
            const map = new Map();
            response.locations.forEach(item => map.set(item.code, item));
            setGlobalStat(response.global);
            const result = [];
            props.regions.forEach(region => {
                result.push(map.get(region.value));
            });
            setLastChecked(response.updated);
            setStats(result);
            setLoading(false);
        };
        fetchStats();

    }, []);


    return (
        isLoading ? <Loader/> :
            <>
                <div
                    className="sticky"
                    style={{padding: "16px 24px 0"}}>
                    <Header
                        subHeading={<small>Last checked: {TimeUtil.naturalTime(lastChecked)}</small>}
                        onChange={props.onChange}/>
                    <div className="global-stats">
                        <div className="heading">
                            <div>Global Stats</div>
                            <div className="line"></div>
                        </div>
                        <div className="info">
                            <div className="cell">
                                <div className="heading total">TOTAL</div>
                                <div className="value total">{formatNumber(globalStat.total)}</div>
                            </div>
                            <div className="cell">
                                <div className="heading active">ACTIVE</div>
                                <div className="value active">{formatNumber(globalStat.active)}</div>
                            </div>
                            <div className="cell">
                                <div className="heading recovered">RECOVERED</div>
                                <div className="value recovered">{formatNumber(globalStat.recover)}</div>
                            </div>
                            <div className="cell">
                                <div className="heading death">DECEASED</div>
                                <div className="value death">{formatNumber(globalStat.fatal)}</div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="status-list status-list-heading"
                        style={{
                            margin: "10px -6px 0",
                            padding:"0"
                        }}>
                        <div className="heading region">REGION</div>
                        <div className="heading active">A</div>
                        <div className="heading recovered">R</div>
                        <div className="heading death">D</div>
                    </div>
                </div>
                <StatusList stats={stats} format={formatNumber}/>
                <button
                    className="add-more"
                    onClick={props.onChange}>
                    Add<span style={{margin: "0 1px"}}>/</span>Edit regions
                </button>
            </>
    )
}

export default StatScreen;
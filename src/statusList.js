import React from "react";
import "./StatusList.css";

function statusList(props) {
    const stats = props.stats;
    return (
            <ul className="status-list">
                {stats.map((stat, index) =>
                    <li key={index}>
                        <div className="value region">
                            <div className="total today">{props.format(stat.all.total)}</div>
                            <div className="label">{stat.label}</div>
                        </div>
                        <div className="value active">
                            <div
                                className="today orange bolder">{props.format(stat.delta.active, stat.delta.activeSymbol, true)}</div>
                            <div className="total">{props.format(stat.all.active)}</div>
                        </div>
                        <div className="value recovered">
                            <div
                                className="today green bolder">{props.format(stat.delta.recover, stat.delta.recoverSymbol, true)}</div>
                            <div className="total">{props.format(stat.all.recover)}</div>
                        </div>
                        <div className="value death">
                            <div
                                className="today red bolder">{props.format(stat.delta.fatal, stat.delta.recoverSymbol, true)}</div>
                            <div className="total">{props.format(stat.all.fatal)}</div>
                        </div>
                    </li>
                )}
            </ul>
    )
}

export default statusList;
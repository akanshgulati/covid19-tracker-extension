import React from "react";
import "./StatusBar.css"
function statusBar(props) {
    if (!props.total) {
        return null;
    }
    const {total, active, dead, recovered} = props;
    const activeWidth = active / total * 100 - 0.5 + "%";
    const deadWidth = dead / total * 100 - 0.5 + "%";
    const recoveredWidth = recovered / total * 100 - 0.5 + "%";
    return (
        <div className="status-bar">
            <div style={{width: activeWidth}} className="orange bar"/>
            <div style={{width: recoveredWidth}} className="green bar"/>
            <div style={{width: deadWidth}} className="red bar"/>
        </div>
    )
}

export default statusBar;
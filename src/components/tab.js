import React from "react";
import "../css/Tab.css"

function tab(props) {
    return (
        <div className="tabs">
            {
                props.tabs.map((tab, index) => {
                    return (
                        <div
                            key={index}
                            onClick={_ => props.onChange(tab)}
                            className={"tab" + (props.active.value === tab.value ? " active" : "")}>
                            {tab.label}
                        </div>
                    );
                })
            }
        </div>
    )
}

export default tab;
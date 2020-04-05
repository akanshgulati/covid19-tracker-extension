import React from "react";
import "../css/Header.css";
function Header(props) {
    return (
        <div id="header">
            <h2 title={props.heading}>{props.heading || "COVID-19 Tracker"}</h2>
            <div className="secondary">
                {props.subHeading || <h6>Get live stats for COVID-19 pandemic</h6>}
            </div>
        </div>
    )
}
export default Header;
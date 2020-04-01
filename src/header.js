import React from "react";
import "./Header.css";
function Header(props) {
    return (
        <div id="header">
            <h2 title={props.heading}>{props.heading || "COVID-19 Tracker"}</h2>
            <div className="secondary">
                <h6>{props.subHeading || "Get live stats for COVID-19 pandemic"}</h6>
                {/*{props.onChange ?*/}
                {/*    <button className="secondary--button"*/}
                {/*            onClick={(e) => {*/}
                {/*                e.preventDefault();*/}
                {/*                props.onChange();*/}
                {/*            }}>*/}
                {/*        Change*/}
                {/*    </button> : ""*/}
                {/*}*/}
            </div>
        </div>
    )
}
export default Header;
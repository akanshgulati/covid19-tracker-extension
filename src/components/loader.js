import React from "react";
import "../css/Loader.css"
export default function Loader() {
    return (
        <div className="loader">
            <img src="../icons/icon-128.png" alt="Loading" height="100" width="100"/>
            <div className="heading">Stay Home. Stay Safe.</div>
            <div className="loading">Fetching stats...</div>
        </div>
    )
}
import React from "react";
import "./Loader.css"
export default function Loader() {
    return (
        <div className="loader">
            <div className="heading">Stay Safe</div>
            <img src="/icon-128.png" alt="" height="128" width="128"/>
            <div className="loading">Fetching stats...</div>
        </div>
    )
}
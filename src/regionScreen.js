import React, {useState, useEffect} from 'react';
import CountrySelect from "./countrySelect";
import {Remove, Get} from "./storageUtil";
import Header from "./header";
import "./RegionScreen.css";

function RegionScreen(props) {
    const localRegions = Get("regions") ? Get("regions") : [];
    const [selectedRegions, setSelectedRegions] = useState(localRegions);
    
    function onUpdate(e, values) {
        if (!values) {
            return;
        }
        window.localStorage.setItem("regions", JSON.stringify(values));
        setSelectedRegions(values);
        setTimeout(() => {
            document.querySelector(".container").scroll({
                top: document.querySelector(".container").scrollHeight,
                behavior: "smooth"
            });
        }, 100);
    }

    function onRemove(index) {
        let newObject = JSON.parse(JSON.stringify(selectedRegions));
        newObject.splice(index, 1);
        onUpdate(null, newObject);
    }

    const statButtonVisibility = selectedRegions && selectedRegions.length ? "visible" : "hidden";
    
    useEffect(() => {
        // remove stored stats;
        Remove("stats");
    }, []);
    return (
        <div className="region-screen">
            <div>
                <Header/>
                <CountrySelect onUpdate={onUpdate} values={selectedRegions} isLoading={props.isLoading} locations={props.locations}/>
                <small>For ex: New York, Delhi, Italy etc.</small>
            </div>
            <div
                className="selected-regions"
                style={{
                    visibility: statButtonVisibility
                }}
            >
                <div className="heading">Selected Regions ({selectedRegions.length})</div>
                <div className="container">
                    {selectedRegions.map((region, index) =>
                        <div key={index}
                             className="selected-region"
                             onClick={() => onRemove(index)}>
                            {region.label}
                            <button className="remove">Remove</button>
                        </div>
                    )}
                </div>
            </div>
            <div style={{textAlign: "center"}}>
                <button
                    style={{
                        visibility: statButtonVisibility
                    }}
                    className="done"
                    onClick={() => {
                        props.onUpdate(selectedRegions);
                    }}>View Stats
                </button>
            </div>
        </div>
    )
}

export default RegionScreen;
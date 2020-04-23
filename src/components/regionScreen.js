import React, { useState, useEffect } from 'react';
import CountrySelect from './countrySelect';
import { Remove, Get, Set } from '../utils//storageUtil';
import Header from './header';
import '../css/RegionScreen.css';

function RegionScreen(props) {
    const localRegions = Get('regions') ? Get('regions') : [];
    const [selectedRegions, setSelectedRegions] = useState(localRegions);

    function onUpdate(e, values, scrollToBottom) {
        if (!values) {
            return;
        }
        Set('regions', JSON.stringify(values));
        setSelectedRegions(values);
        if (scrollToBottom) {
            setTimeout(() => {
                document.querySelector('.scroll-bar').scroll({
                    top: document.querySelector('.scroll-bar').scrollHeight,
                    behavior: 'smooth',
                });
            }, 100);
        }
    }

    function onRemove(index) {
        let newObject = JSON.parse(JSON.stringify(selectedRegions));
        newObject.splice(index, 1);
        onUpdate(null, newObject, false);
    }

    const statButtonVisibility = selectedRegions && selectedRegions.length ? 'block' : 'none';
    const defaultRegionVisibility = !selectedRegions || !selectedRegions.length && !props.isLoading ? 'block' : 'none';

    useEffect(() => {
        // remove stored stats;
        Remove('stats');
        Remove('historic-stats');
        Remove('chart-regions');
    }, []);
    return (
        <div className='region-screen' id='region-screen'>
            <div>
                <Header />
                <CountrySelect
                    onUpdate={onUpdate}
                    values={selectedRegions}
                    isLoading={props.isLoading}
                    locations={props.locations}
                />
                <small>For ex: New York, Delhi, Italy etc.</small>
            </div>
            <div
                className='selected-regions'
                style={{
                    display: defaultRegionVisibility,
                }}>
                <div className='separator'>
                    <span className='line' />
                    <span>OR</span>
                    <span className='line' />
                </div>
                <div className='heading'>Select Default Regions</div>
                <div className='container'>
                    <div
                        className='selected-region default'
                        onClick={(e) => {
                            const regions = props.locations.filter(
                                (location) => location.isCountry
                            );
                            onUpdate(e, regions, false);
                        }}>
                        All Countries
                    </div>
                    <div
                        className='selected-region default'
                        onClick={(e) => {
                            const regions = props.locations.filter(
                                (location) => location.isState && location.country === 'US'
                            );
                            regions.unshift(
                                props.locations.filter(
                                    (location) => location.isCountry && location.code === 'US'
                                )[0]
                            );
                            onUpdate(e, regions, false);
                        }}>
                        USA states
                    </div>
                    <div
                        className='selected-region default'
                        onClick={(e) => {
                            const regions = props.locations.filter(
                                (location) => location.isState && location.country === 'IN'
                            );
                            regions.unshift(
                                props.locations.filter(
                                    (location) => location.isCountry && location.code === 'IN'
                                )[0]
                            );
                            onUpdate(e, regions, false);
                        }}>
                        Indian states
                    </div>
                </div>
            </div>
            <div
                className='selected-regions'
                style={{
                    display: statButtonVisibility,
                }}>
                <div className='heading'>
                    Selected Regions ({selectedRegions.length})
                    <span
                        className='clear-all'
                        onClick={(e) => {
                            onUpdate(e, [], false);
                        }}>
                        {' '}
                        Remove All
                    </span>
                </div>
                <div className='container scroll-bar'>
                    {selectedRegions.map((region, index) => (
                        <div
                            key={index}
                            className='selected-region'
                            onClick={() => onRemove(index)}>
                            {region.label}
                            <button className='remove'>Remove</button>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ textAlign: 'center' }}>
                <button
                    style={{
                        display: statButtonVisibility,
                    }}
                    className='done'
                    onClick={() => {
                        props.onUpdate(selectedRegions);
                    }}>
                    View Stats
                </button>
            </div>
        </div>
    );
}

export default RegionScreen;

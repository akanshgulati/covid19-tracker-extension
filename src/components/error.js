import React from 'react';
import '../css/Error.css';
import { Remove, Set } from '../utils/storageUtil';

export default function Error(props) {
    const resetRegions = () => {
        Remove('regions');
        Remove('chart-regions');
        Set('screen', 'regions');
        window.location.reload();
    };
    return (
        <div className='error-screen flex flex-column'>
            <div className='error-heading bolder'>Error Occurred</div>
            {props.message && <div className='error-message'>{props.message}</div>}
            <div onClick={resetRegions} className='pointer error-select'>
                Select Regions Again
            </div>
            <div>
                If facing trouble frequently, <br />
                please report issue to{' '}
                <a href='mailto:support@coronatrends.live' title='Contact Developers'>
                    Support
                </a>
            </div>
        </div>
    );
}

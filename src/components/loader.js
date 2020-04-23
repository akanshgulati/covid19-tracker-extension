import React, { useEffect, useState } from 'react';
import '../css/Loader.css';
import { Remove } from '../utils/storageUtil';

export default function Loader() {
    const [showReset, setResetView] = useState(false);
    useEffect(() => {
        const counter = setTimeout(() => {
            setResetView(true);
        }, 6000);
        return () => {
            clearTimeout(counter);
        };
    }, []);
    const reset = () => {
        Remove('regions');
        Remove('chart-regions');
        Remove('locations');
        Remove('screen');
        Remove('historic-stats');
        Remove('stats');
        window.location.reload();
    };
    return (
        <div className='loader'>
            <img src='../icons/icon-128.png' alt='Loading' height='100' width='100' />
            {showReset ? (
                <>
                    <div className='heading'>Taking more time than expected?</div>
                    <div className='loading bold button pointer' onClick={reset}>
                        Click here to reset
                    </div>
                </>
            ) : (
                <>
                    <div className='heading'>Stay Home. Stay Safe.</div>
                    <div className='loading'>Fetching stats...</div>
                </>
            )}
        </div>
    );
}

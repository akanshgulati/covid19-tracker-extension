import React from 'react';
import '../css/StatusBar.css';

export default function StatusBar(props) {
    return (
        <>
            {props.screen === 'disabled' ? (
                <div className='flex align-middle status-bar'>
                    <svg
                        style={{ marginRight: '5px' }}
                        width='12'
                        height='12'
                        viewBox='0 0 14 14'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'>
                        <path
                            d='M7 0C3.1402 0 0 3.14024 0 7.00004C0 10.8598 3.1402 14 7 14C10.8598 14 14 10.8598 14 7.00004C14 3.14024 10.8598 0 7 0ZM7 12.7273C3.84194 12.7273 1.27273 10.1581 1.27273 7.00004C1.27273 3.84202 3.84194 1.27273 7 1.27273C10.1581 1.27273 12.7273 3.84202 12.7273 7.00004C12.7273 10.1581 10.158 12.7273 7 12.7273Z'
                            fill='#666666'
                        />
                        <path
                            d='M6.99968 2.96973C6.53191 2.96973 6.15137 3.35053 6.15137 3.81859C6.15137 4.28624 6.53191 4.6667 6.99968 4.6667C7.46745 4.6667 7.848 4.28624 7.848 3.81859C7.848 3.35053 7.46745 2.96973 6.99968 2.96973Z'
                            fill='#666666'
                        />
                        <path
                            d='M7.00013 5.93945C6.64869 5.93945 6.36377 6.22437 6.36377 6.57582V10.394C6.36377 10.7454 6.64869 11.0304 7.00013 11.0304C7.35158 11.0304 7.6365 10.7454 7.6365 10.394V6.57582C7.6365 6.22437 7.35158 5.93945 7.00013 5.93945Z'
                            fill='#666666'
                        />
                    </svg>
                    <span>
                        <small>Historical data not available for selected regions</small>
                    </span>
                </div>
            ) : (
                ''
            )}
            {props.screen === 'stat-screen' ? (
                <div
                    className='status-bar flex justify-center'
                    onClick={() => props.onClick('select-regions')}>
                    <svg
                        id='graph'
                        width='14'
                        height='14'
                        viewBox='0 0 14 14'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        stroke='#666666'>
                        <line x1='0.5' y1='2.18557e-08' x2='0.499999' y2='14' />
                        <path d='M2 12L5 8L7.5 10L11 5.5' />
                        <line x1='14' y1='13.5' x2='-4.37114e-08' y2='13.5' />
                        <circle cx='11.25' cy='5.25' r='1.25' />
                    </svg>
                    <div className='text'>See graphical view</div>
                </div>
            ) : (
                ''
            )}
            {props.screen === 'select-regions' ? (
                <div className='status-bar flex justify-between'>
                    {props.selectedChartRegions.length === 0 ? (
                        <div className='flex align-middle'>
                            <svg
                                style={{ marginRight: '5px' }}
                                width='12'
                                height='12'
                                viewBox='0 0 14 14'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'>
                                <path
                                    d='M7 0C3.1402 0 0 3.14024 0 7.00004C0 10.8598 3.1402 14 7 14C10.8598 14 14 10.8598 14 7.00004C14 3.14024 10.8598 0 7 0ZM7 12.7273C3.84194 12.7273 1.27273 10.1581 1.27273 7.00004C1.27273 3.84202 3.84194 1.27273 7 1.27273C10.1581 1.27273 12.7273 3.84202 12.7273 7.00004C12.7273 10.1581 10.158 12.7273 7 12.7273Z'
                                    fill='#666666'
                                />
                                <path
                                    d='M6.99968 2.96973C6.53191 2.96973 6.15137 3.35053 6.15137 3.81859C6.15137 4.28624 6.53191 4.6667 6.99968 4.6667C7.46745 4.6667 7.848 4.28624 7.848 3.81859C7.848 3.35053 7.46745 2.96973 6.99968 2.96973Z'
                                    fill='#666666'
                                />
                                <path
                                    d='M7.00013 5.93945C6.64869 5.93945 6.36377 6.22437 6.36377 6.57582V10.394C6.36377 10.7454 6.64869 11.0304 7.00013 11.0304C7.35158 11.0304 7.6365 10.7454 7.6365 10.394V6.57582C7.6365 6.22437 7.35158 5.93945 7.00013 5.93945Z'
                                    fill='#666666'
                                />
                            </svg>
                            <span>
                                <small>
                                    Select atleast a region (selective regions data available)
                                </small>
                            </span>
                        </div>
                    ) : (
                        <div className='text blue' onClick={() => props.onClick('chart-screen')}>
                            See graphical view ({props.selectedChartRegions.length}/7){' '}
                            <span className='arrow'>→</span>
                        </div>
                    )}
                    <div className='underline pointer' onClick={() => props.onClick('stat-screen')}>
                        Cancel
                    </div>
                </div>
            ) : (
                ''
            )}
            {props.screen === 'go-to-stat-screen' ? (
                <div className='status-bar flex justify-center' onClick={props.onClick}>
                    <div className='text arrow'>←</div>
                    <div className='text'>Switch to Tabular View</div>
                </div>
            ) : (
                ''
            )}
        </>
    );
}

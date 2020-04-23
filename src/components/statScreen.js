import React, { useEffect, useState } from 'react';
import Header from './header';
import StatusList from './statusList';
import Loader from './loader';
import StatusBar from './statusBar';
import { Set } from '../utils/storageUtil';
import '../css/StatScreen.css';
import FetchUtil from '../utils/fetchUtil';
import TimeUtil from '../utils/TimeUtil';
const MAX_SELECTION = 1000;
function formatNumber(number, symbol = '+', isDelta) {
    if (!number && isDelta) {
        return;
    }
    try {
        if (Number.isFinite(number)) {
            return (isDelta ? symbol : '') + Number(number).toLocaleString();
        }
    } catch {
        return (isDelta ? symbol : '') + number;
    }
}

function StatScreen(props) {
    const [stats, setStats] = useState([]);
    const [globalStat, setGlobalStat] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [lastChecked, setLastChecked] = useState();
    const [statusBarScreen, setStatusBarScreen] = useState('stat-screen');
    const [showCheckbox, setCheckbox] = useState(false);
    const [selectedChartRegions, setChartRegions] = useState([]);
    const [selectedChartRegionsValue, setChartRegionsValue] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            const response = await FetchUtil.fetchStats(props.regions);
            const map = new Map();
            let hasHistoricalData = false;
            response.locations.forEach((item) => {
                map.set(item.code, item);
                if (item.hasHistoricData) {
                    hasHistoricalData = true;
                }
            });
            if (!hasHistoricalData) {
                setStatusBarScreen('disabled');
            }
            setGlobalStat(response.global);
            const result = [];
            props.regions.forEach((region) => {
                result.push(map.get(region.value));
            });
            setLastChecked(response.updated);
            setStats(result);
            setLoading(false);
        };
        fetchStats();
    }, []);

    const statusBarClick = (value) => {
        switch (value) {
            case 'select-regions':
                setStatusBarScreen(value);
                setCheckbox(true);
                break;
            case 'stat-screen':
                setStatusBarScreen(value);
                setCheckbox(false);
                setChartRegions([]);
                setChartRegionsValue([]);
                break;
            case 'chart-screen':
                props.onSelectChartScreen(selectedChartRegions);
                break;
        }
    };

    const onCheckboxClick = (code) => {
        // cloning the current array
        const _selectedRegions = JSON.parse(JSON.stringify(selectedChartRegions));
        const _selectedRegionsValue = JSON.parse(JSON.stringify(selectedChartRegionsValue));

        const currentIndex = _selectedRegionsValue.indexOf(code);

        if (currentIndex !== -1) {
            _selectedRegionsValue.splice(currentIndex, 1);
            _selectedRegions.splice(currentIndex, 1);
        } else if (selectedChartRegionsValue.length < MAX_SELECTION) {
            _selectedRegions.push(props.regions.find((region) => region.value === code));
            _selectedRegionsValue.push(code);
        }
        setChartRegions(_selectedRegions);
        setChartRegionsValue(_selectedRegionsValue);
    };

    return isLoading ? (
        <Loader />
    ) : (
        <>
            <div className='sticky' style={{ padding: '16px 24px 0' }}>
                <Header
                    subHeading={<small>Last checked: {TimeUtil.naturalTime(lastChecked)}</small>}
                />
                <div className='global-stats'>
                    <div className='heading'>
                        <div>Global Stats</div>
                        <div className='line'></div>
                    </div>
                    <div className='info'>
                        <div className='cell'>
                            <div className='heading total1'>TOTAL</div>
                            <div className='value total1'>{formatNumber(globalStat.total)}</div>
                        </div>
                        <div className='cell'>
                            <div className='heading active'>ACTIVE</div>
                            <div className='value active'>{formatNumber(globalStat.active)}</div>
                        </div>
                        <div className='cell'>
                            <div className='heading recovered'>RECOVERED</div>
                            <div className='value recovered'>
                                {formatNumber(globalStat.recover)}
                            </div>
                        </div>
                        <div className='cell'>
                            <div className='heading death'>DECEASED</div>
                            <div className='value death'>{formatNumber(globalStat.fatal)}</div>
                        </div>
                    </div>
                </div>
                <div
                    className='status-list status-list-heading'
                    style={{
                        margin: '10px -6px 0',
                        padding: '0',
                    }}>
                    <div className='heading region'>REGION</div>
                    <div className='heading total1'>T</div>
                    <div className='heading active'>A</div>
                    <div className='heading recovered'>R</div>
                    <div className='heading death'>D</div>
                </div>
            </div>
            <StatusList
                stats={stats}
                format={formatNumber}
                isSelectionMode={showCheckbox}
                checkedIndex={selectedChartRegionsValue}
                onCheckboxClick={onCheckboxClick}
            />
            <button className='add-more' onClick={props.onSelectRegionScreen}>
                Add<span style={{ margin: '0 1px' }}>/</span>Edit regions
            </button>
            <StatusBar
                onClick={statusBarClick}
                screen={statusBarScreen}
                selectedChartRegions={selectedChartRegions}
            />
        </>
    );
}

export default StatScreen;

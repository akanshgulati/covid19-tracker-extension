import React, { useEffect, useState } from 'react';
import Header from './header';
import StatusList from './statusList';
import Loader from './loader';
import StatusBar from './statusBar';
import '../css/StatScreen.css';
import FetchUtil from '../utils/fetchUtil';
import TimeUtil from '../utils/TimeUtil';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import NumberUtil from '../utils/numberUtil';

const MAX_SELECTION = 7;
function formatNumber(number, symbol = '+', isDelta) {
    if (!number && isDelta) {
        return;
    }
    try {
        if (Number.isFinite(number)) {
            if (isDelta) {
                return symbol + Number(Math.abs(number)).toLocaleString();
            } else if (Number(number) > 1e6) {
                return NumberUtil.shorten(Number(number), 2);
            } else {
                return Number(number).toLocaleString();
            }
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
    const [districtMode, setDistrictMode] = useState(null);
    const [loadingDistrictStats, setLoadingDistrictStats] = useState(null);
    const [stateName, setStateName] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);
    
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

    const fetchDistrictStats = async (districtCode) => {
        setLoadingDistrictStats(districtCode);
        let hasHistoricalData = false;
        const response = await FetchUtil.fetchDistrictData(districtCode);
        setLoadingDistrictStats(null);
        response.locations.forEach((item) => {
            if (item.hasHistoricData) {
                hasHistoricalData = true;
            }
        });
        if (!hasHistoricalData) {
            setStatusBarScreen('disabled');
        }
        setStats(response.locations);
        setDistrictMode(districtCode);
        setTimeout(() => {
            const list = document.querySelector('.status-list.scroll-bar');
            if (list) {
                list.scrollTo({
                    top: 0,
                    behaviour: 'smooth',
                });
            }
        });
    };

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

    const resetDistrictMode = () => {
        setDistrictMode(null);
        setCheckbox(false);
        setLoadingDistrictStats(null);
        setStatusBarScreen('stat-screen');
        setChartRegions([]);
        setChartRegionsValue([]);
        fetchStats();
    };

    const onDistrictView = (code) => {
        if (!code || code.includes('unknown')) {
            resetDistrictMode();
            return;
        }
        const stateData = stats.find((stat) => stat.code === code);
        if (stateData) {
            setGlobalStat(stateData.all);
            setStateName(stateData.label);
        }
        fetchDistrictStats(code).catch((err) => {
            resetDistrictMode();
        });
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
                        <SwitchTransition mode="out-in">
                            <CSSTransition
                                in={true}
                                classNames='fade'
                                timeout={{appear: 500, enter: 500, exit: 100}}
                                key={districtMode ? stateName : 'global'}>
                                <div>{districtMode ? stateName : 'Global Stats'}</div>
                            </CSSTransition>
                        </SwitchTransition>
                        <div className='line' />
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
                {districtMode ? (
                    <div
                        className='flex align-middle back-district pointer'
                        onClick={resetDistrictMode}>
                        <span className='arrow' style={{ marginRight: '3px' }}>
                            ←
                        </span>
                        Back
                        <div className='line' />
                    </div>
                ) : (
                    ''
                )}
                <div
                    className='status-list status-list-heading'
                    style={{
                        margin: '10px -6px 0',
                        padding: '0',
                    }}>
                    <div className='heading region'>{districtMode ? 'DISTRICT' : 'REGION'}</div>
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
                onDistrictViewSelect={onDistrictView}
                loadingDistrictStats={loadingDistrictStats}
                humanise={NumberUtil.humanise}
                districtCode={districtMode}
            />
            <button className='add-more' onClick={props.onSelectRegionScreen}>
                Add<span style={{ margin: '0 1px' }}>/</span>Edit regions
            </button>
            <StatusBar
                onClick={statusBarClick}
                screen={statusBarScreen}
                max={MAX_SELECTION}
                selectedChartRegions={selectedChartRegions}
            />
        </>
    );
}

export default StatScreen;

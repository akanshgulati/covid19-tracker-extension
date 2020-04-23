import React, { useEffect, useRef, useState } from 'react';
import Chart from './chart.js';
import '../css/Base.css';
import '../css/ChartScreen.css';
import FetchUtil from '../utils/fetchUtil';
import Loader from './loader';
import TimeUtil from '../utils/TimeUtil';
import Header from './header';
import DropDown from './DropDown';
import StatusBar from './statusBar';
import Error from './error';
const colors = [
    '#25D9E4',
    '#109CF1',
    '#C21DA8',
    '#ec4c1d',
    '#9d56f7',
    '#FC6DAB',
    '#FF9F1C',
    '#824700',
    '#0f9751',
    '#aa5568',
];

function ChartScreen(props) {
    const [historicData, setHistoricData] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [lastChecked, setLastChecked] = useState();
    const [currentCaseType, setCaseType] = useState('total');
    const [locations, setLocations] = useState([]);
    const [error, setError] = useState(null);

    const formatHistoricData = (data, caseType = 'total') => {
        const key = caseType;
        if (!data || !data.length) {
            return {};
        }

        if (!data[0][caseType]) {
            setError('Invalid Data #1');
        }
        const labels = Object.keys(data[0][caseType]).map((date) => {
            const _date = new Date(date);
            const months = [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
            ];
            return _date.getDate() + ' ' + months[_date.getMonth()];
        });
        const datasets = data.map((datum, index) => {
            if (!datum || !datum[key]) {
                // setError("Invalid Data - #2");
                return {};
            }
            return {
                label: datum.label,
                data: Object.values(datum[key]),
                borderColor: colors[index],
                backgroundColor: colors[index],
                borderWidth: 3,
                fill: false,
            };
        });
        return {
            labels: labels,
            datasets: datasets,
        };
    };

    useEffect(() => {
        if (!props.regions) {
            return;
        }
        const fetchHistoricData = async () => {
            const response = await FetchUtil.fetchHistoricData(props.regions);
            setLocations(response.locations);
            setHistoricData(formatHistoricData(response.locations, currentCaseType));
            setLastChecked(response.updated);
        };
        fetchHistoricData();
    }, [props.regions]);

    useEffect(() => {
        if (historicData && historicData.labels && historicData.labels.length) {
            setLoading(false);
        }
    }, [historicData]);

    const onChangeCaseType = (value) => {
        if (currentCaseType !== value) {
            setCaseType(value);
            setHistoricData(formatHistoricData(locations, value));
        }
    };
    if (isLoading) {
        return <Loader />;
    } else if (error) {
        return <Error message={error} />;
    }
    return (
        <div id='chart-screen' style={{ padding: '16px 24px 0' }}>
            <Header subHeading={<small>Last checked: {TimeUtil.naturalTime(lastChecked)}</small>} />
            <div
                className='flex justify-between align-middle'
                style={{
                    margin: '10px 0',
                    padding: '0',
                    textAlign: 'right',
                }}>
                <div>Last 1 month Data</div>
                <DropDown
                    items={[
                        {
                            value: 'total',
                            label: 'Total cases',
                        },
                        {
                            value: 'recover',
                            label: 'Recovered cases',
                        },
                        {
                            value: 'fatal',
                            label: 'Deaths',
                        },
                    ]}
                    placeholder='Cases'
                    onChange={onChangeCaseType}
                    value='total'
                />
            </div>
            {historicData && <Chart data={historicData} />}
            <StatusBar screen='go-to-stat-screen' onClick={props.onChange} />
        </div>
    );
    // return <div className="ct-chart" id="myChart" width="400" style={{width: "400px", height: "400px"}}></div>
}

export default ChartScreen;

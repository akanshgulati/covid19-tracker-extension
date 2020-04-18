import React, { useEffect, useRef, useState } from 'react';
import Chart from './chart.js';
import '../css/Base.css';
import '../css/ChartScreen.css';
import FetchUtil from '../utils/fetchUtil';
import Loader from './loader';
import TimeUtil from '../utils/TimeUtil';
import Header from './header';
import DropDown from './DropDown';

const colors = ['#25D9E4', '#109CF1', '#C21DA8', '#ec4c1d', '#9d56f7'];

function formatHistoricData(data, caseType = 'total') {
    const key = caseType;
    const labels = Object.keys(data[0].total).map((date) => {
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
}

function ChartScreen(props) {
    const [historicData, setHistoricData] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [lastChecked, setLastChecked] = useState();
    const [currentCaseType, setCaseType] = useState('total');
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        debugger;
        const fetchHistoricData = async () => {
            const response = await FetchUtil.fetchHistoricData(props.regions);
            setLocations(response.locations);
            setHistoricData(formatHistoricData(response.locations, currentCaseType));
            setLastChecked(response.updated);
            
        };
        fetchHistoricData();
    }, []);

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

    return isLoading ? (
        <Loader />
    ) : (
        <div id='chart-screen' style={{ padding: '16px 24px 0' }}>
            <Header
                subHeading={
                    <small>
                        Last checked: {TimeUtil.naturalTime(lastChecked)}
                    </small>
                }
            />
            <div
                style={{
                    margin: '10px 0',
                    padding: '0',
                    textAlign: 'right',
                }}>
                <DropDown
                    items={[
                        {
                            value: 'total',
                            label: 'Total Cases',
                        },
                        {
                            value: 'recover',
                            label: 'Recovered Cases',
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
            {historicData && <Chart data={historicData}/>}
            <button
                className="add-more"
                onClick={props.onChange}>
                Add<span style={{margin: "0 1px"}}>/</span>Edit regions
            </button>
        </div>
    );
    // return <div className="ct-chart" id="myChart" width="400" style={{width: "400px", height: "400px"}}></div>
}

export default ChartScreen;

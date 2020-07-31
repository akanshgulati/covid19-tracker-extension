import React, { useEffect, useState } from 'react';
import '../css/Base.css';
import '../css/App.css';
import RegionScreen from './regionScreen.js';
import StatScreen from './statScreen.js';
import ChartScreen from './chartScreen.js';
import ShareWrapper from './socialWrapper.js';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import FetchUtil from '../utils/fetchUtil';
import { Get, Set } from '../utils/storageUtil';
/*global chrome*/
const theme = createMuiTheme({
    typography: {
        fontFamily: 'Lato, sans-serif',
    },
});

function App() {
    const localRegions = Get('regions') ? Get('regions') : [];
    const localChartRegions = Get('chart-regions') ? Get('chart-regions') : [];
    const localScreen = Get('screen') && localRegions ? Get('screen') : 'regions';
    const [screen, setScreen] = useState(localScreen);
    const [locations, setLocations] = useState([]);
    const [error, setError] = useState(undefined);
    const [isLoading, setLoading] = useState(true);

    const [regions, setRegions] = useState(localRegions);
    const [chartRegions, setChartRegions] = useState(localChartRegions);

    useEffect(() => {
        const fetchData = async () => {
            const data = await FetchUtil.fetchLocations();
            setLocations(data.locations);
            setLoading(false);
        };
        fetchData();
        if (chrome && chrome.browserAction) {
            chrome.browserAction.setBadgeText({ text: '' });
            chrome.storage.local.get('stats', function ({ stats }) {
                const data = stats && JSON.parse(stats);
                if (data) {
                    chrome.storage.local.set({
                        seenCount: data.result.global.total,
                    });
                }
            });
        }
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <ShareWrapper/>
            <div className='App'>
                {screen === 'regions' ? (
                    <RegionScreen
                        isLoading={isLoading}
                        locations={locations}
                        onUpdate={(regions) => {
                            if (regions) {
                                setRegions(regions);
                                setScreen('stats');
                                Set('screen', 'stats');
                            }
                        }}
                    />
                ) : (
                    ''
                )}
                {screen === 'stats' ? (
                    <StatScreen
                        onSelectRegionScreen={() => {
                            setScreen('regions');
                            Set('screen', 'regions');
                        }}
                        onSelectChartScreen={(regions) => {
                            setChartRegions(regions);
                            Set('chart-regions', regions);
                            Set('screen', 'chart');
                            setTimeout(() => setScreen('chart'), 100);
                        }}
                        regions={regions}
                    />
                ) : (
                    ''
                )}
                {screen === 'chart' ? (
                    <ChartScreen
                        onChange={() => {
                            setScreen('stats');
                            Set('screen', 'stats');
                        }}
                        regions={chartRegions}
                    />
                ) : (
                    ''
                )}
            </div>
        </ThemeProvider>
    );
}

export default App;

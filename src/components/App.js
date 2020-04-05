import React, {useEffect, useState} from 'react';
import '../css/App.css';
import RegionScreen from './regionScreen.js'
import StatScreen from './statScreen.js'
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import FetchUtil from "../utils/fetchUtil";
import {Get, Set} from "../utils/storageUtil";
/*global chrome*/
const theme = createMuiTheme({
    typography: {
        fontFamily: 'Lato, sans-serif',
    }
});

function App() {
    const localRegions = Get("regions") ? Get("regions") : [];
    const localScreen = Get("screen") ? Get("screen") : "regions";
    const [screen, setScreen] = useState(localScreen);
    const [locations, setLocations] = useState([]);
    const [error, setError] = useState(undefined);
    const [isLoading, setLoading] = useState(true);
    
    const [regions, setRegions] = useState(localRegions);

    useEffect(() => {
        const fetchData = async () => {
            const data = await FetchUtil.fetchLocations();
            setLocations(data.locations);
            setLoading(false);
        };
        fetchData();
        chrome.browserAction.setBadgeText({text: ''});
        chrome.storage.local.get('stats', function ({stats}) {
            const data = stats && JSON.parse(stats);
            if (data) {
                chrome.storage.local.set({seenCount: data.result.global.total});
            }
        });
    }, []);
    
    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                {screen === "regions" ?
                        <RegionScreen
                            isLoading={isLoading}
                            locations={locations}
                            onUpdate={(regions) => {
                                if (regions) {
                                    setRegions(regions);
                                    setScreen("stats");
                                    Set("screen", "stats");
                                }
                            }}/>
                    : ""}
                {screen === "stats" ?
                    <StatScreen
                        onChange={() => {
                            setScreen("regions");
                            Set("screen", "regions");
                        }}
                        regions={regions}/> : ""}
            </div>
        </ThemeProvider>
    );
}

export default App;

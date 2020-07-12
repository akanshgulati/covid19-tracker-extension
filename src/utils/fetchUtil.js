import {Get, Set} from "./storageUtil";

const URLS = {
    base: "https://api.coronatrends.live",
    location: "/get/locations",
    stat: "/get/stats",
    historic: "/get/historic",
    district: "/get/district-wise/"
};

const API = {
    async fetchLocations() {
        const localLocations = Get('locations');
        const now = +new Date();
        // if cache is more than an hour old
        if (localLocations && localLocations.result && (now - localLocations.timestamp < 3600000)) {
            return localLocations.result;
        }
        const locations = await fetch(URLS.base + URLS.location).then(resp => resp.json());
        Set('locations', {
            result: locations,
            timestamp: now
        });
        return locations;
    },
    async fetchStats(regions) {
        const localStats = Get('stats');
        const now = +new Date();

        if (localStats && localStats.result && (now - localStats.timestamp < 1800000)) {
            return localStats.result;
        }

        const values = regions.map(region => region.value);
        const stats = await fetch(URLS.base + URLS.stat, {
            method: "POST",
            body: JSON.stringify({locations: values}),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(resp => resp.json());
        Set('stats', {
            result: stats,
            timestamp: now
        });
        return stats;
    },
    async fetchHistoricData(regions) {
        const localStats = Get('historic-stats');
        const now = +new Date();
        const regionHash = window.btoa(JSON.stringify(regions));
        
        if (localStats && localStats.result && (now - localStats.timestamp < 1800000) && regionHash === localStats.hash) {
            return localStats.result;
        }

        const values = regions.map(region => region.value);
        const stats = await fetch(URLS.base + URLS.historic, {
            method: "POST",
            body: JSON.stringify({locations: values}),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(resp => resp.json());
        
        Set('historic-stats', {
            result: stats,
            timestamp: now,
            hash: regionHash
        });
        return stats;
    },
    async fetchDistrictData(districtCode) {
        const localStats = Get('district-stats_' + districtCode);
        const now = +new Date();
        const regionHash = districtCode;

        if (localStats && localStats.result && (now - localStats.timestamp < 1800000) && regionHash === localStats.hash) {
            return localStats.result;
        }
        
        const stats = await fetch(URLS.base + URLS.district + districtCode, {
            method: "GET"
        }).then(resp => resp.json());

        Set('district-stats_'+ districtCode, {
            result: stats,
            timestamp: now,
            hash: regionHash
        });
        return stats;
    }
};
export default API;
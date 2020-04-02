/*global chrome*/
export function Get(key, callback) {
    if (typeof key === "undefined") {
        return;
    }
    const data = window.localStorage.getItem(key);
    if (callback) {
        chrome.storage.local.get(key, callback);
    }
    try {
        return JSON.parse(data);
    } catch {
        return data;
    }
}

export function Set(key, value, callback) {
    if (typeof key === "undefined" || typeof value === "undefined") {
        return;
    }
    if (typeof value !== 'string') {
        value = JSON.stringify(value);
    }
    window.localStorage.setItem(key, value);
    chrome.storage.local.set({
        [key]: value
    }, callback);
}

export function Remove(key, callback) {
    if (typeof key === "undefined") {
        return;
    }
    window.localStorage.removeItem(key);
    chrome.storage.local.remove([key], callback);
}

export function Clear(callback) {
    window.localStorage.clear();
    chrome.storage.local.clear(callback);
}

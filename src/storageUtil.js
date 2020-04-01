export function Get(key) {
    if (typeof key === "undefined") {
        return;
    }
    try {
        return JSON.parse(window.localStorage.getItem(key));
    } catch {
        return window.localStorage.getItem(key);
    }
}

export function Set(key, value) {
    if (typeof key === "undefined" || typeof value === "undefined") {
        return;
    }
    if (typeof value !== 'string') {
        value = JSON.stringify(value);
    }
    window.localStorage.setItem(key, value);
}

export function Remove(key) {
    if (typeof key === "undefined") {
        return;
    }
    window.localStorage.removeItem(key);
}

export function Clear() {
    window.localStorage.clear();
}

function shorten(n, d) {
    if (n < 1000) {
        return n + '';
    }
    if (n > 1e9) {
        return '10 B+';
    }
    var x = ('' + n).length;
    var p = Math.pow;
    d = p(10, d);
    x -= x % 3;
    return Math.round((n * d) / p(10, x)) / d + ' ' + ' KMBTPE'[x / 3];
}

function humanise(number) {
    try {
        if (Number.isFinite(number)) {
            return Number(number).toLocaleString();
        }
    } catch {
        return number;
    }
}

export default {
    shorten,
    humanise,
};

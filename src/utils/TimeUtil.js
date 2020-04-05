export default {
    naturalTime(timestamp) {
        if (!timestamp) {
            return '';
        }
        const now = +new Date();
        const diff = (now - timestamp) / 1000;
        let seconds, minutes, hours;

        if (diff < 86400) {
            // if timestamp passed in was after an hour ago…
            seconds = Math.round(diff);
            minutes = Math.round(diff / 60);
            hours = Math.round(diff / 3600);

            if (hours) {
                if (hours === 1) {
                    return "an hr. ago"
                }
                return hours + " hr ago";
            }
            if (minutes) {
                if (minutes === 1) {
                    return "a min ago";
                } else {
                    return minutes + " min. ago";
                }
            }
            if (seconds <= 10) {
                return "few sec. ago";
            } else {
                return seconds + " sec. ago";
            }
        }
        return "few days ago";
    }
}
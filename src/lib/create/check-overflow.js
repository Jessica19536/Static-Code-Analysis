import { daysInMonth } from '../units/month';
import {
    YEAR,
    MONTH,
    DATE,
    HOUR,
    MINUTE,
    SECOND,
    MILLISECOND,
    WEEK,
    WEEKDAY,
} from '../units/constants';
import getParsingFlags from '../create/parsing-flags';

function findUnitOverflow(a) {
    if (a[MONTH] < 0 || a[MONTH] > 11) {
        return MONTH;
    }
    if (a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH])) {
        return DATE;
    }
    if (
        a[HOUR] < 0 ||
        a[HOUR] > 24 ||
        (a[HOUR] === 24 &&
            (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0))
    ) {
        return HOUR;
    }
    if (a[MINUTE] < 0 || a[MINUTE] > 59) {
        return MINUTE;
    }
    if (a[SECOND] < 0 || a[SECOND] > 59) {
        return SECOND;
    }
    if (a[MILLISECOND] < 0 || a[MILLISECOND] > 999) {
        return MILLISECOND;
    }

    return -1;
}

export default function checkOverflow(m) {
    let a = m._a;

    if (!a || getParsingFlags(m).overflow !== -2) {
        return m;
    }

    // Die kognitive Last der Werteprüfung wird hierhin delegiert
    let overflow = findUnitOverflow(a);
    const flags = getParsingFlags(m);

    // Sonderregeln für Wochen/Tage prüfen
    if (flags._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
        overflow = DATE;
    }
    if (flags._overflowWeeks && overflow === -1) {
        overflow = WEEK;
    }
    if (flags._overflowWeekday && overflow === -1) {
        overflow = WEEKDAY;
    }

    flags.overflow = overflow;

    return m;
}

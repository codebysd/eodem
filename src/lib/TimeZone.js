import * as tz from '../../assets/tz/tz.js';
import * as luxon from '../../deps/luxon/luxon.min.js';

/**
 * @typedef ZoneDay
 * @property {luxon.DateTime} startDateTime
 * @property {luxon.Interval[]} slots
 */

/**
 * @typedef TimeZoneView
 * @property {ZoneDay[]} days
 * @property {string} zone
 */

export class TimeZone {
    /**
     * Pre defined zone names.
     * @type {string[]}
     */
    static ZONES = tz.default;


    /**
     * Search for time zone names
     * @param {string} query 
     * @returns {string[]}
     */
    static search(query) {
        if (typeof query !== 'string' || query.length < 1) {
            return [];
        }

        return TimeZone.ZONES.filter(z => z.toLowerCase().includes(query.toLowerCase()));
    }

    static slots(zone, date) {
        const output = [];

        if (typeof zone !== 'string' || !(date instanceof Date)) {
            return output;
        }

        let dt = luxon.DateTime.fromJSDate(date).setZone(zone);
        if (!dt.isValid) {
            throw new Error(dt.invalidExplanation);
        }

        let dt1 = dt.startOf('day');
        let dt2 = dt1.plus({ minutes: 30 });
        for (let i = 0; i < 48; i++) {
            output.push({
                from: dt1.toLocaleString(luxon.DateTime.TIME_SIMPLE),
                to: dt2.toLocaleString(luxon.DateTime.TIME_SIMPLE)
            });
            dt1 = dt1.plus({ minutes: 30 });
            dt2 = dt1.plus( i === 46 ? {minutes:29} :{ minutes: 30 });
        }

        return output;
    }
}
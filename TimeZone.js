import { Csv } from './Csv.js';

const TZ_FILES = [
    { name: 'country', columns: ['code', 'name'] },
    { name: 'timezone', columns: ['zoneId', 'abbrev', 'startTime', 'gmtOffset', 'dst'] },
    { name: 'zone', columns: ['zoneId', 'countryCode', 'name'] },
];

const TZ_DATA = new Promise((resolve, reject) => {
    Promise.all(TZ_FILES.map(f => Csv.load(`/tz/${f.name}.csv`, f.columns)))
        .then(loaded => {
            const result = {};
            for (const i in TZ_FILES) {
                result[TZ_FILES[i].name] = loaded[i];
            }
            resolve(result);
        })
        .catch(reject);
});

export class TimeZone {
    static async search(query) {
        TZ_DATA.then(console.log);
    }
}
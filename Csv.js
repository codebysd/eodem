/**
 * Homegrown CSV parser. Capable of loading csv assets from URLs.
 */
export class Csv {

    /**
     * Fetch and parse CSV data.
     * @param {string} url URL to load CSV data from.
     * @param {string[]} [columns] Column names, if not given, first row is considered as column names.
     * @returns {object[]} Parsed records array.
     */
    static async load(url, columns) {
        // load rows
        const data = await window.fetch(url).then(resp => resp.text());
        const rows = data.split('\n');

        // parse rows
        const records = [];
        for (const i in rows) {

            // parse row values, strip encolsing quotes if any
            const values = rows[i].split(',').map(v => (v.startsWith('"') && v.endsWith('"')) ? v.substring(1, v.length - 1) : v);

            // use first row as columns if columns not provided
            if (i === 0 && !(columns instanceof Array && columns.length > 0)) {
                columns = values;
                continue;
            }

            // construct record
            const rec = {};
            for (const j in columns) {
                rec[columns[j]] = values[j];
            }

            // collect record
            records.push(rec);
        }

        // parsed records
        return records;
    }
}
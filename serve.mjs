import { createServer } from 'http';
import { join } from 'path';
import { existsSync, createReadStream, statSync } from 'fs';

const mimeTypes = {
    'html': 'text/html',
    'js': 'text/javascript',
    'png': 'image/png',
    'jpeg': 'image/jpeg',
    'css': 'text/css',
    'csv': 'text/csv'
}

function serve(file, res) {
    if (!existsSync(file)) {
        res.statusCode = 404;
        res.end();
    } else if (statSync(file).isDirectory()) {
        file = join(file, 'index.html');
        serve(file, res);
    } else {
        for (const k in mimeTypes) {
            if (file.endsWith(`.${k}`)) {
                res.setHeader('Content-Type', mimeTypes[k]);
            }
            res.setHeader('Allow-Origin','*');
        }
        createReadStream(file).pipe(res);
    }
}

const server = createServer((req, res) => serve(join(process.cwd(), req.url), res));

server.listen(8080);
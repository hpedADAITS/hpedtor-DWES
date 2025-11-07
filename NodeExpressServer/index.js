import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT_NUMBER = 3001;
const FILES_DIR = join(__dirname, 'src');

app.use(
    '/view',
    express.static(FILES_DIR, {
        index: 'meme.png',
        dotfiles: 'deny',
        setHeaders: (res, path) => {
            res.setHeader('Content-Disposition', 'inline');
        },
    }),
);

app.get('/', (req, res) => {
    res.send('Hello World\n');
    console.log('Request received!');
});

app.post('/', (req, res) => {
    res.send('Got a POST request');
    console.log('POST received!');
});

app.get('/status', (req, res) => {
    res.sendFile(join(FILES_DIR, 'status.html'));
    console.log('Status page request received!');
});

app.get('/status-api', (req, res) => {
    const statusData = {
        status: 'working',
        port: PORT_NUMBER,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
    };
    res.json(statusData);
    console.log('Status API request received!');
});

app.listen(PORT_NUMBER, () => {
    console.log(`Listening at port ${PORT_NUMBER}`);
});

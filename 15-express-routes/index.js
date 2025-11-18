import express from 'express';
import animalsRouter from './routes/animals.js';

const server = express();
const PORT = 3000;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get('/header', (req, res) => {
    const { token } = req.headers;

    if (!token) {
        return res.status(401).send({
            code: 401,
            error: 'Unauthorized',
            message: 'Error: Set a token to login',
        });
    }

    console.log('Token:', token);
    res.status(200).send({ message: 'Token received', token });
});

server.get('/params/:name', (req, res) => {
    const { name } = req.params;
    res.status(200).send(`Hola ${name}`);
});

server.get('/query', (req, res) => {
    const { number = 100 } = req.query;
    const num = parseInt(number);

    if (isNaN(num) || num < 1) {
        return res.status(400).send({
            code: 400,
            error: 'BadRequest',
            message: 'ERROR: Por favor introduce un numero valido',
        });
    }

    const sum = (num * (num + 1)) / 2;
    res.status(200).send({ sum, message: `Suma de 1 a ${num}` });
});

server.post('/body', (req, res) => {
    console.log('Body received:', req.body);

    const htmlList = Object.entries(req.body)
        .map(
            ([key, value]) =>
                `<li><strong>${key}:</strong> ${JSON.stringify(value)}</li>`,
        )
        .join('');

    const htmlResponse = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Solicitud de BODY</title>
    </head>
    <body>
      <ul>
        ${htmlList}
      </ul>
    </body>
    </html>
  `;
    res.status(200).setHeader('Content-Type', 'text/html').send(htmlResponse);
});

server.use('/animals', animalsRouter);

server.use((req, res) => {
    res.status(404).send({
        code: 404,
        error: 'Not Found',
        message: 'Error: Path not found',
    });
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

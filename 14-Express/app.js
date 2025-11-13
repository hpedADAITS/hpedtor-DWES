const express = require('express');
const app = express();
const port = 3000;

const logger = require('./middleware/logger');
app.use(logger);

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/', (req, res) => {
    res.send('Got POST request');
});

app.put('/user', (req, res) => {
    res.send('Got PUT request by /user');
});

app.delete('/user', (req, res) => {
    res.send('Got DELETE request by /user');
});

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});

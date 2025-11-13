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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

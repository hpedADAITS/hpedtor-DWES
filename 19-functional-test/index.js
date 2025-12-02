const { app, config } = require('./services/utils');

const { port } = config.app;

app.listen(port, (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`App listening on port ${port}!`);
});

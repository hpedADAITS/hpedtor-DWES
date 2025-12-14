import app from './app.js';
import config from './config.js';

const { puerto } = config;

app.listen(puerto, () => {
  console.log(`servidor de notas escuchando en puerto ${puerto}`);
});

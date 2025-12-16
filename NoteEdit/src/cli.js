import { ejecutarCli } from '../cli/api.js';

export * from '../cli/api.js';

const ruta = process.argv[1] || '';

if (ruta.endsWith('src/cli.js')) {
  ejecutarCli().then((codigo) => {
    process.exitCode = codigo;
  });
}

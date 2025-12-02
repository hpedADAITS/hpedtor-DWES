const colors = {
  azul: "\x1b[34m",
  rojo: "\x1b[31m",
  verde: "\x1b[32m",
  reset: "\x1b[0m",
};

const color = process.argv[2];
const text = process.argv.slice(3).join(" ");

if (!color || !text) {
  console.error('Uso: npm run imprime:azul -- "texto"');
  process.exit(1);
}

const code = colors[color];
if (!code) {
  console.error("Color desconocido. Usa: azul, rojo, verde");
  process.exit(1);
}

console.log(code + text + colors.reset);

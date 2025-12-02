const fs = require("fs");
const path = require("path");

const name = process.argv[2];
if (!name) {
  console.error("Uso: npm run crear:js -- <nombreSinExtension>");
  process.exit(1);
}

const base = path.join(process.cwd(), "files");
if (!fs.existsSync(base)) fs.mkdirSync(base, { recursive: true });

const filePath = path.join(base, `${name}.js`);
if (fs.existsSync(filePath)) {
  console.error("El fichero ya existe:", filePath);
  process.exit(1);
}

const template = `// ${name}.js\nconsole.log('Hello from ${name}');\n`;
fs.writeFileSync(filePath, template);
console.log("Fichero creado:", filePath);

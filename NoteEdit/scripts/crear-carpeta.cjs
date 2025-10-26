const fs = require("fs");
const path = require("path");

const name = process.argv[2];
if (!name) {
  console.error("Uso: npm run crear:carpeta -- <nombreCarpeta>");
  process.exit(1);
}

const base = path.join(process.cwd(), "files");
if (!fs.existsSync(base)) fs.mkdirSync(base, { recursive: true });

const dirPath = path.join(base, name);
if (fs.existsSync(dirPath)) {
  console.error("La carpeta ya existe:", dirPath);
  process.exit(1);
}

fs.mkdirSync(dirPath, { recursive: true });
console.log("Carpeta creada:", dirPath);

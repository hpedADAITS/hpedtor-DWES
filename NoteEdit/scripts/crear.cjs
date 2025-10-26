const fs = require("fs");
const path = require("path");

const base = path.join(process.cwd(), "files");

if (!fs.existsSync(base)) {
  fs.mkdirSync(base, { recursive: true });
  console.log('Carpeta "files" creada en:', base);
} else {
  console.log('La carpeta "files" ya existe en:', base);
}

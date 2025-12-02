const fs = require("fs");
const path = require("path");

const base = path.join(process.cwd(), "files");
if (!fs.existsSync(base)) {
  console.log('No existe la carpeta "files". Nada que borrar.');
  process.exit(0);
}

try {
  fs.rmSync(base, { recursive: true, force: true });
  console.log('Carpeta "files" borrada completamente:', base);
} catch (err) {
  console.error("Error al borrar:", err.message);
  process.exit(1);
}

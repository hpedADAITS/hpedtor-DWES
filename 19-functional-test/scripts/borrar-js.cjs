const fs = require("fs");
const path = require("path");

const base = path.join(process.cwd(), "files");
if (!fs.existsSync(base)) {
  console.log('No existe la carpeta "files". Nada que borrar.');
  process.exit(0);
}

const files = fs.readdirSync(base).filter((f) => f.endsWith(".js"));
if (files.length === 0) {
  console.log("No hay ficheros .js en la carpeta files.");
  process.exit(0);
}

for (const f of files) {
  try {
    fs.unlinkSync(path.join(base, f));
    console.log("Borrado:", f);
  } catch (err) {
    console.error("Error borrando", f, err.message);
  }
}

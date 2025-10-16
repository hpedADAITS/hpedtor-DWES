const fs = require("fs");
const path = require("path");

function printFileIfExists(filePath) {
  if (!filePath) {
    console.log("Error: Debe proporcionar el nombre de un fichero.");
    return 1;
  }
  if (!fs.existsSync(path.resolve(filePath))) {
    console.error(`Error: El fichero "${filePath}" no existe.`);
    return 1;
  }
  const display = fs.readFileSync(path.resolve(filePath), "utf8");
  console.log(display);
}

printFileIfExists("./note.txt");

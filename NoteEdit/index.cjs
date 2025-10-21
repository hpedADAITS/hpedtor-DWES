const fs = require("fs");
const args = require("process").argv;
const readline = require("readline");
const path = require("path");
const chalk = require("chalk");
const NOTES_DIR = path.join(__dirname, "notes");

if(!fs.existsSync(NOTES_DIR)) {
  fs.mkdirSync(NOTES_DIR);
}

if (args.includes("--create")) {
  const noteName = args[args.indexOf("--create") + 1];
  if (!noteName) {
    console.log(chalk.red("--create OPTS: \"--create <note_name>, <NOTE_PATH>\""));
    process.exit(1);
    crearNota();
  }

if (args.includes("--read")) {
  const noteName = args[args.indexOf("--read") + 1];
  if (!noteName) {
    console.log(chalk.red("--read OPTS: \"--read <note_name>, <NOTE_PATH>\""));
    process.exit(1);
  }
  leerNota(args[args.indexOf("--read") + 1]);
  const filePath = path.join(NOTES_DIR, `${noteName}.note`);
  if (!fs.existsSync(filePath)) {
    console.log(chalk.red("Nota no encontrada."));
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, "utf-8");
  console.log(content);
  process.exit(0);
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function showMenu() {
  console.log(chalk.blue("MENU:"));
  console.log(chalk.underline("1. Crear nueva nota"));
  console.log(chalk.underline("2. Editar nota existente"));
  console.log(chalk.underline("3. Eliminar nota"));
  console.log(chalk.underline("0. Salir"));
  rl.question("Elige una opción: ", handleMenu);
}

function handleMenu(option) {
  switch (option.trim()) {
    case "1":
      crearNota();
      break;
    case "2":
      editNote();
      break;
    case "3":
      deleteNote();
      break;
    case "0":
      rl.close();
      console.log("Chau xd");
      break;
    default:
      console.log(chalk.red("Esa opcion no existe"));
      showMenu();
  }
}

function crearNota() {
  rl.question("Nombre de la nota: ", (name) => {
    const filePath = path.join(NOTES_DIR, `${name}.note`);
    if (fs.existsSync(filePath)) {
      console.log(chalk.red("Ya existe una nota con ese nombre."));
      return showMenu();
    }

    console.log("Escribe tu nota.");
    readMultilineInput((lecontent) => {
      fs.writeFileSync(filePath, lecontent);
      console.log(chalk.green("Nota guardada."));
      showMenu();
    });
  });
}

function editNote() {
  const notes = getNoteFiles();
  if (notes.length === 0) {
    console.log(chalk.red("No hay notas para editar."));
    return showMenu();
  }

  console.log("Notas disponibles: (./notes)");
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    console.log((i + 1) + ". " + note);
  }

  rl.question("Elige nota: ", (num) => {
    const index = parseInt(num) - 1;
    if (index < 0 || index >= notes.length) {
      console.log(chalk.red("Selección no valida."));
      return showMenu();
    }

    const filePath = path.join(NOTES_DIR, notes[index]);
    const oldlecontent = fs.readFileSync(filePath, "utf-8");
    console.log(oldlecontent);
    console.log("Appendiendo el contrenido");

    readMultilineInput((newlecontent) => {
      fs.writeFileSync(filePath, newlecontent);
      console.log(chalk.green("Nota actualizada."));
      console.clear();
      showMenu();
    });
  });
}

function deleteNote() {
  const notes = getNoteFiles();
  if (notes.length === 0) {
    console.log(chalk.red("No hay notas para eliminar."));
    return showMenu();
  }

  console.log("Notas disponibles:");
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    console.log((i + 1) + ". " + note);
  }

  rl.question("Elige una nota para eliminar: ", (num) => {
    const index = parseInt(num) - 1;
    if (index < 0 || index >= notes.length) {
      console.log(chalk.red("Selección inválida."));
      return showMenu();
    }

    const filePath = path.join(NOTES_DIR, notes[index]);
    fs.unlinkSync(filePath);
    console.log(chalk.green("NOTA ELIMINADA"));
    showMenu();
  });
}

function readMultilineInput(callback) {
  let lines = [];
  let emptyCount = 0;

  function askLine() {
    rl.question("", (line) => {
      if (line.trim() === "") {
        emptyCount++;
        if (emptyCount === 2) {
          return callback(lines.join("\n"));
        }
      } else {
        emptyCount = 0;
      }
      lines.push(line);
      askLine();
    });
  }
  askLine();
}

function getNoteFiles() {
  return fs.readdirSync(NOTES_DIR).filter(file => file.endsWith(".note"));
}
showMenu();
}

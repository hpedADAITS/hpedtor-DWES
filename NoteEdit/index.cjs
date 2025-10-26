const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const readline = require("readline");

const rawArgs = process.argv.slice(2);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const NOTES_DIR = "./notes";

if (!fs.existsSync(NOTES_DIR)) {
  fs.mkdirSync(NOTES_DIR, { recursive: true });
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

function readNoteByName(name) {
  const filePath = path.join(NOTES_DIR, `${name}.note`);
  if (!fs.existsSync(filePath)) {
    console.log(chalk.red("Nota no encontrada."));
    process.exit(1);
  }
  const content = fs.readFileSync(filePath, "utf-8");
  console.log(content);
  process.exit(0);
}

function createNoteInteractive(nameArg) {
  if (nameArg) {
    const filePath = path.join(NOTES_DIR, `${nameArg}.note`);
    if (fs.existsSync(filePath)) {
      console.log(chalk.red("Ya existe una nota con ese nombre."));
      process.exit(1);
    }
    console.log(
      `Escribe tu nota para ${nameArg}. Termina con 2 líneas vacías.`
    );
    readMultilineInput((content) => {
      fs.writeFileSync(filePath, content);
      console.log(chalk.green("Nota guardada."));
      rl.close();
      process.exit(0);
    });
    return;
  }

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

function editNoteByName(nameArg) {
  const filePath = path.join(NOTES_DIR, `${nameArg}.note`);
  if (!fs.existsSync(filePath)) {
    console.log(chalk.red("Nota no encontrada."));
    process.exit(1);
  }
  const oldContent = fs.readFileSync(filePath, "utf-8");
  console.log(oldContent);
  console.log("Appendiendo el contrenido (termina con 2 líneas vacías)");
  readMultilineInput((newlecontent) => {
    fs.writeFileSync(filePath, newlecontent);
    console.log(chalk.green("Nota actualizada."));
    rl.close();
    process.exit(0);
  });
}

function deleteNoteByName(nameArg) {
  const filePath = path.join(NOTES_DIR, `${nameArg}.note`);
  if (!fs.existsSync(filePath)) {
    console.log(chalk.red("Nota no encontrada."));
    process.exit(1);
  }
  fs.unlinkSync(filePath);
  console.log(chalk.green("NOTA ELIMINADA"));
  process.exit(0);
}

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
    console.log(chalk.red("No hay notas."));
    return showMenu();
  }

  console.log("Notas disponibles: (./notes)");
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    console.log(i + 1 + ". " + note);
  }

  rl.question("Elige nota: ", (num) => {
    const index = parseInt(num) - 1;
    if (index < 0 || index >= notes.length) {
      console.log(chalk.red("Selección inválida."));
      return showMenu();
    }

    const filePath = path.join(NOTES_DIR, notes[index]);
    const oldlecontent = fs.readFileSync(filePath, "utf-8");
    console.log(oldlecontent);
    console.log("Appendiendo el contrenido");

    readMultilineInput((newlecontent) => {
      fs.writeFileSync(filePath, newlecontent);
      console.log(chalk.green("Nota actualizada."));
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
    console.log(i + 1 + ". " + note);
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

function getNoteFiles() {
  return fs.readdirSync(NOTES_DIR).filter((file) => file.endsWith(".note"));
}

if (rawArgs.length > 0) {
  const cmd = rawArgs[0];
  const name = rawArgs[1];
  switch (cmd) {
    case "--read":
    case "--readnote":
      if (!name) {
        console.error("Uso: node index.cjs --readnote <nombre>");
        process.exit(1);
      }
      readNoteByName(name);
      break;
    case "--create":
      if (name) createNoteInteractive(name);
      else createNoteInteractive();
      break;
    case "--edit":
      if (name) editNoteByName(name);
      else editNote();
      break;
    case "--delete":
    case "--deletenote":
      if (name) deleteNoteByName(name);
      else deleteNote();
      break;
    default:
      console.log(chalk.yellow("Argumento desconocido:"), cmd);
      showMenu();
  }
} else {
  showMenu();
}

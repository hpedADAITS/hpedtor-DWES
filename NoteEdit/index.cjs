const chalk = require('chalk');
const readline = require('readline');
const mongoose = require('mongoose');
require('dotenv').config();

const rawArgs = process.argv.slice(2);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/noteedit';
const mongoHabilitado = process.env.MONGO_ENABLED !== 'false';

const notaSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    contenido: { type: String, default: '' },
    categoria: { type: String, default: 'general' },
    creadaEn: { type: String, required: true },
    actualizadaEn: { type: String, required: true },
  },
  { versionKey: false },
);

const Nota = mongoose.models.Nota || mongoose.model('Nota', notaSchema);

const preguntar = (texto) => new Promise((resolve) => rl.question(texto, resolve));

const leerMultilinea = () => new Promise((resolve) => {
  const lineas = [];
  let vacias = 0;

  const pedir = () => {
    rl.question('', (linea) => {
      if (linea.trim() === '') {
        vacias += 1;
        if (vacias === 2) return resolve(lineas.join('\n'));
      } else {
        vacias = 0;
      }
      lineas.push(linea);
      return pedir();
    });
  };

  pedir();
});

const conectarMongo = async () => {
  if (!mongoHabilitado) {
    console.log(chalk.red('mongo deshabilitado (MONGO_ENABLED=false)'));
    process.exit(1);
  }
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(mongoUri);
};

const cerrarTodo = async () => {
  rl.close();
  try {
    await mongoose.disconnect();
  } catch (e) {
    // nada
  }
};

const buscarNotaPorTitulo = async (titulo) => {
  const docs = await Nota.find({ titulo }).sort({ actualizadaEn: -1 }).limit(2);
  if (!docs || docs.length === 0) return null;
  if (docs.length > 1) return { conflicto: true, docs };
  return { doc: docs[0] };
};

const listarNotasBasico = async () => Nota.find({}).sort({ actualizadaEn: -1 }).select('_id titulo');

const imprimirListado = (docs) => {
  for (let i = 0; i < docs.length; i += 1) {
    const doc = docs[i];
    console.log(`${i + 1}. ${doc.titulo} (${doc._id})`);
  }
};

const leerNotaPorNombre = async (nombre) => {
  const resultado = await buscarNotaPorTitulo(nombre);
  if (!resultado) {
    console.log(chalk.red('nota no encontrada.'));
    process.exitCode = 1;
    return;
  }
  if (resultado.conflicto) {
    console.log(chalk.red('hay varias notas con ese titulo, usa el menu para elegir.'));
    process.exitCode = 1;
    return;
  }
  console.log(resultado.doc.contenido || '');
};

const crearNotaInteractiva = async (nombreArg) => {
  let titulo = nombreArg;
  if (!titulo) {
    titulo = (await preguntar('Nombre de la nota: ')).trim();
  }
  if (!titulo) {
    console.log(chalk.red('titulo vacio'));
    return;
  }

  const ya = await Nota.findOne({ titulo });
  if (ya) {
    console.log(chalk.red('ya existe una nota con ese nombre.'));
    return;
  }

  console.log(`Escribe tu nota para ${titulo}. Termina con 2 lineas vacias.`);
  const contenido = await leerMultilinea();
  const ahora = new Date().toISOString();
  await Nota.create({
    titulo,
    contenido,
    categoria: 'general',
    creadaEn: ahora,
    actualizadaEn: ahora,
  });
  console.log(chalk.green('nota guardada.'));
};

const editarNotaPorNombre = async (nombreArg) => {
  const resultado = await buscarNotaPorTitulo(nombreArg);
  if (!resultado) {
    console.log(chalk.red('nota no encontrada.'));
    process.exitCode = 1;
    return;
  }
  if (resultado.conflicto) {
    console.log(chalk.red('hay varias notas con ese titulo, usa el menu para elegir.'));
    process.exitCode = 1;
    return;
  }

  const doc = resultado.doc;
  console.log(doc.contenido || '');
  console.log('reescribe el contenido (termina con 2 lineas vacias)');
  const nuevo = await leerMultilinea();
  doc.contenido = nuevo;
  doc.actualizadaEn = new Date().toISOString();
  await doc.save();
  console.log(chalk.green('nota actualizada.'));
};

const borrarNotaPorNombre = async (nombreArg) => {
  const resultado = await buscarNotaPorTitulo(nombreArg);
  if (!resultado) {
    console.log(chalk.red('nota no encontrada.'));
    process.exitCode = 1;
    return;
  }
  if (resultado.conflicto) {
    console.log(chalk.red('hay varias notas con ese titulo, usa el menu para elegir.'));
    process.exitCode = 1;
    return;
  }
  await Nota.deleteOne({ _id: resultado.doc._id });
  console.log(chalk.green('nota eliminada'));
};

const editarNotaMenu = async () => {
  const docs = await listarNotasBasico();
  if (!docs || docs.length === 0) {
    console.log(chalk.red('no hay notas.'));
    return;
  }

  console.log('notas disponibles:');
  imprimirListado(docs);
  const num = await preguntar('Elige nota: ');
  const index = parseInt(num, 10) - 1;
  if (Number.isNaN(index) || index < 0 || index >= docs.length) {
    console.log(chalk.red('seleccion invalida.'));
    return;
  }

  const doc = await Nota.findById(docs[index]._id);
  console.log(doc?.contenido || '');
  console.log('reescribe el contenido (termina con 2 lineas vacias)');
  const nuevo = await leerMultilinea();
  await Nota.updateOne(
    { _id: docs[index]._id },
    { $set: { contenido: nuevo, actualizadaEn: new Date().toISOString() } },
  );
  console.log(chalk.green('nota actualizada.'));
};

const borrarNotaMenu = async () => {
  const docs = await listarNotasBasico();
  if (!docs || docs.length === 0) {
    console.log(chalk.red('no hay notas para eliminar.'));
    return;
  }

  console.log('notas disponibles:');
  imprimirListado(docs);
  const num = await preguntar('Elige una nota para eliminar: ');
  const index = parseInt(num, 10) - 1;
  if (Number.isNaN(index) || index < 0 || index >= docs.length) {
    console.log(chalk.red('seleccion invalida.'));
    return;
  }

  await Nota.deleteOne({ _id: docs[index]._id });
  console.log(chalk.green('nota eliminada'));
};

const menu = async () => {
  while (true) {
    console.log(chalk.blue('MENU:'));
    console.log(chalk.underline('1. Crear nueva nota'));
    console.log(chalk.underline('2. Editar nota existente'));
    console.log(chalk.underline('3. Eliminar nota'));
    console.log(chalk.underline('0. Salir'));

    const opcion = await preguntar('Elige una opción: ');
    const op = (opcion || '').trim();
    if (op === '0') {
      console.log('chau xd');
      return;
    }
    if (op === '1') await crearNotaInteractiva();
    else if (op === '2') await editarNotaMenu();
    else if (op === '3') await borrarNotaMenu();
    else console.log(chalk.red('esa opcion no existe'));
  }
};

(async () => {
  await conectarMongo();

  if (rawArgs.length > 0) {
    const cmd = rawArgs[0];
    const nombre = rawArgs[1];

    if (cmd === '--read' || cmd === '--readnote') {
      if (!nombre) {
        console.error('Uso: node index.cjs --readnote <titulo>');
        process.exitCode = 1;
      } else {
        await leerNotaPorNombre(nombre);
      }
    } else if (cmd === '--create') {
      await crearNotaInteractiva(nombre);
    } else if (cmd === '--edit') {
      if (nombre) await editarNotaPorNombre(nombre);
      else await editarNotaMenu();
    } else if (cmd === '--delete' || cmd === '--deletenote') {
      if (nombre) await borrarNotaPorNombre(nombre);
      else await borrarNotaMenu();
    } else {
      console.log(chalk.yellow('Argumento desconocido:'), cmd);
      await menu();
    }
  } else {
    await menu();
  }
})()
  .catch((err) => {
    console.error(chalk.red(`fallo: ${err?.message || err}`));
    process.exitCode = 1;
  })
  .finally(async () => {
    await cerrarTodo();
  });

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/noteedit';
const notasDir = process.env.NOTAS_DIR || path.join(process.cwd(), 'notes');

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

const leerArchivosNota = () => {
  if (!fs.existsSync(notasDir)) return [];
  return fs.readdirSync(notasDir).filter((f) => f.endsWith('.note'));
};

const obtenerTitulo = (archivo) => archivo.replace(/\.note$/i, '');

const migrar = async () => {
  const archivos = leerArchivosNota();
  if (archivos.length === 0) {
    console.log(chalk.yellow(`no hay ficheros .note en ${notasDir}`));
    return;
  }

  await mongoose.connect(mongoUri);

  let creadas = 0;
  let saltadas = 0;

  for (const archivo of archivos) {
    const ruta = path.join(notasDir, archivo);
    const titulo = obtenerTitulo(archivo);
    const contenido = fs.readFileSync(ruta, 'utf-8');
    const stat = fs.statSync(ruta);

    const creadaEn = new Date(stat.birthtimeMs || stat.ctimeMs || Date.now()).toISOString();
    const actualizadaEn = new Date(stat.mtimeMs || Date.now()).toISOString();

    const ya = await Nota.findOne({ titulo });
    if (ya) {
      saltadas += 1;
      continue;
    }

    await Nota.create({
      titulo,
      contenido,
      categoria: 'general',
      creadaEn,
      actualizadaEn,
    });
    creadas += 1;
  }

  console.log(chalk.green(`migracion terminada: creadas=${creadas} saltadas=${saltadas}`));
};

migrar()
  .catch((err) => {
    console.error(chalk.red(`fallo migrando: ${err?.message || err}`));
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await mongoose.disconnect();
    } catch (e) {
      // nada
    }
  });

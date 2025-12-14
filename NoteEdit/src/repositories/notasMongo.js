import mongoose from 'mongoose';
import { NotaMongo } from '../models/notaMongo.js';

const mapearNota = (doc) => {
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    titulo: doc.titulo,
    contenido: doc.contenido,
    categoria: doc.categoria || 'general',
    creadaEn: doc.creadaEn,
    actualizadaEn: doc.actualizadaEn,
  };
};

const asegurarConexion = () => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('mongo no conectado');
  }
};

export const listarNotasMongo = async () => {
  asegurarConexion();
  const docs = await NotaMongo.find({}).lean();
  return docs.map((doc) => mapearNota({ ...doc, _id: doc._id }));
};

export const crearNotaMongo = async ({ titulo, contenido = '', categoria = 'general' }) => {
  asegurarConexion();
  const ahora = new Date().toISOString();
  const creada = await NotaMongo.create({
    titulo,
    contenido,
    categoria,
    creadaEn: ahora,
    actualizadaEn: ahora,
  });
  return mapearNota(creada);
};

export const buscarNotaMongo = async (id) => {
  asegurarConexion();
  const doc = await NotaMongo.findById(id);
  return mapearNota(doc);
};

export const actualizarNotaMongo = async (id, cambios) => {
  asegurarConexion();
  const update = Object.entries(cambios || {}).reduce((acc, [clave, valor]) => {
    if (valor === undefined) return acc;
    acc[clave] = valor;
    return acc;
  }, {});
  update.actualizadaEn = new Date().toISOString();
  const doc = await NotaMongo.findByIdAndUpdate(id, update, { new: true });
  return mapearNota(doc);
};

export const borrarNotaMongo = async (id) => {
  asegurarConexion();
  const doc = await NotaMongo.findByIdAndDelete(id);
  return Boolean(doc);
};

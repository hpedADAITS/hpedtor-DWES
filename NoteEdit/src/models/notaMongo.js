import mongoose from 'mongoose';

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

export const NotaMongo = mongoose.models.Nota || mongoose.model('Nota', notaSchema);

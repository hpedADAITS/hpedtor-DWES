import { obtenerHoraExterna } from './service.js';

export const obtenerHora = async (req, res, next) => {
  try {
    const datos = await obtenerHoraExterna();
    return res.json({ datos });
  } catch (err) {
    return next(err);
  }
};

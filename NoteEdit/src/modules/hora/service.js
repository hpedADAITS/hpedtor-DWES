import config from '../../core/config/index.js';

const construirUrl = () => {
  const base = (config.horaApiBase || '').replace(/\/$/, '');
  const zona = (config.horaApiZona || '').replace(/^\//, '');
  return { url: `${base}/${zona}`, zona };
};

export const obtenerHoraExterna = async () => {
  const { url, zona } = construirUrl();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`hora api fallo: ${res.status}`);
    }
    const data = await res.json();
    if (!data?.datetime) throw new Error('hora api respuesta invalida');
    return {
      fuente: 'worldtimeapi',
      zona,
      fechaHora: data.datetime,
    };
  } finally {
    clearTimeout(timeout);
  }
};

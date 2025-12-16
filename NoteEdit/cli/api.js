import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ quiet: true });

export const normalizarClaveFlag = (clave) => (
  (clave || '')
    .toString()
    .trim()
    .split('-')
    .filter(Boolean)
    .map((trozo, i) => (i === 0 ? trozo : `${trozo[0]?.toUpperCase() || ''}${trozo.slice(1)}`))
    .join('')
);

export const parsearFlags = (entrada = []) => {
  const flags = {};
  const posicionales = [];

  for (let i = 0; i < entrada.length; i += 1) {
    const actual = entrada[i];

    if (!actual.startsWith('--')) {
      posicionales.push(actual);
    } else {
      const bruto = actual.slice(2);
      const [claveBruta, valorPegado] = bruto.split('=');
      const clave = normalizarClaveFlag(claveBruta);

      if (valorPegado !== undefined) {
        flags[clave] = valorPegado;
      } else {
        const siguiente = entrada[i + 1];
        if (!siguiente || siguiente.startsWith('--')) {
          flags[clave] = true;
        } else {
          flags[clave] = siguiente;
          i += 1;
        }
      }
    }
  }

  return { flags, posicionales };
};

const imprimirAyuda = (log) => {
  log('uso:');
  log('  npm run cli -- <comando>');
  log('');
  log('comandos:');
  log('  help                          muestra esta ayuda');
  log('  token [--rondas 10]            genera un token bcrypt para la api');
  log('  ping                           comprueba el servidor (/ping)');
  log('  notas listar [--page 1 ...]    lista notas (requiere token + rol)');
  log('  notas ver <id>                 muestra una nota');
  log('  notas crear --titulo x [...]   crea una nota');
  log('  notas editar <id> [...]        edita una nota');
  log('  notas borrar <id>              borra una nota (rol admin)');
  log('');
  log('variables de entorno:');
  log('  NOTEEDIT_URL=http://localhost:3000');
  log('  NOTEEDIT_TOKEN=<hash bcrypt>');
  log('  NOTEEDIT_ROL=usuario|admin');
  log('  NOTEEDIT_USUARIO=admin');
};

const obtenerUrlBase = (env) => {
  const puerto = env.PORT || 3000;
  return env.NOTEEDIT_URL || `http://localhost:${puerto}`;
};

const requerirToken = (env, error) => {
  const token = env.NOTEEDIT_TOKEN;
  if (!token) {
    error('falta NOTEEDIT_TOKEN, usa: npm run cli -- token');
    return null;
  }
  return token;
};

const construirHeaders = ({
  token,
  rol,
  usuario,
  json,
}) => {
  const headers = {};

  if (token) headers.Authorization = `Bearer ${token}`;
  if (rol) headers['x-rol'] = rol;
  if (usuario) headers['x-usuario'] = usuario;
  if (json) headers['Content-Type'] = 'application/json';

  return headers;
};

const leerRespuesta = async (res) => {
  const tipo = (res.headers.get('content-type') || '').toLowerCase();
  if (tipo.includes('application/json')) return res.json();
  return res.text();
};

const imprimirRespuesta = (payload, log) => {
  if (payload === null || payload === undefined) {
    log('');
    return;
  }
  if (typeof payload === 'string') {
    log(payload);
    return;
  }
  log(JSON.stringify(payload, null, 2));
};

const peticion = async ({
  fetchImpl,
  urlBase,
  ruta,
  metodo = 'GET',
  headers = {},
  body,
}) => {
  const url = new URL(ruta, urlBase);
  const opts = { method: metodo, headers };
  if (body !== undefined) opts.body = JSON.stringify(body);
  return fetchImpl(url.toString(), opts);
};

export const ejecutarCli = async (argv = process.argv.slice(2), deps = {}) => {
  const {
    env = process.env,
    fetchImpl = fetch,
    log = console.log,
    error = console.error,
  } = deps;

  const [comando, sub, ...resto] = argv;
  const urlBase = obtenerUrlBase(env);

  if (!comando || comando === 'help' || comando === '--help' || comando === '-h') {
    imprimirAyuda(log);
    return 0;
  }

  if (comando === 'token') {
    const { flags } = parsearFlags([sub, ...resto].filter(Boolean));
    const rondas = Number(flags.rondas || 10);
    const hash = await bcrypt.hash('I know your secret', Number.isNaN(rondas) ? 10 : rondas);
    log(hash);
    return 0;
  }

  if (comando === 'ping') {
    const res = await peticion({
      fetchImpl,
      urlBase,
      ruta: '/ping',
    });
    const payload = await leerRespuesta(res);
    imprimirRespuesta(payload, log);
    return res.ok ? 0 : 1;
  }

  if (comando === 'notas') {
    const accion = sub || 'listar';
    const { flags, posicionales } = parsearFlags(resto);

    const token = requerirToken(env, error);
    if (!token) return 1;

    const rol = env.NOTEEDIT_ROL || 'usuario';

    if (accion === 'listar') {
      const allowed = [
        'page',
        'limit',
        'sort',
        'order',
        'tituloContiene',
        'contenidoContiene',
        'categoria',
        'creadaDesde',
        'creadaHasta',
        'actualizadaDesde',
        'actualizadaHasta',
      ];

      const url = new URL('/notas', urlBase);
      allowed.forEach((k) => {
        if (flags[k] !== undefined) url.searchParams.set(k, flags[k]);
      });

      const res = await fetchImpl(url.toString(), {
        method: 'GET',
        headers: construirHeaders({ token, rol }),
      });

      const payload = await leerRespuesta(res);
      imprimirRespuesta(payload, log);
      if (!res.ok) {
        error(`fallo listando notas (${res.status})`);
        return 1;
      }
      return 0;
    }

    if (accion === 'ver') {
      const id = posicionales[0];
      if (!id) {
        error('falta id');
        return 1;
      }

      const res = await peticion({
        fetchImpl,
        urlBase,
        ruta: `/notas/${id}`,
        metodo: 'GET',
        headers: construirHeaders({ token, rol }),
      });

      const payload = await leerRespuesta(res);
      imprimirRespuesta(payload, log);
      return res.ok ? 0 : 1;
    }

    if (accion === 'crear') {
      const { titulo } = flags;
      if (!titulo) {
        error('falta --titulo');
        return 1;
      }

      const body = {
        titulo,
        contenido: flags.contenido || '',
        categoria: flags.categoria || 'general',
      };

      const res = await peticion({
        fetchImpl,
        urlBase,
        ruta: '/notas',
        metodo: 'POST',
        headers: construirHeaders({ token, rol, json: true }),
        body,
      });

      const payload = await leerRespuesta(res);
      imprimirRespuesta(payload, log);
      return res.ok ? 0 : 1;
    }

    if (accion === 'editar') {
      const id = posicionales[0];
      if (!id) {
        error('falta id');
        return 1;
      }

      const body = {};
      if (flags.titulo !== undefined) body.titulo = flags.titulo;
      if (flags.contenido !== undefined) body.contenido = flags.contenido;
      if (flags.categoria !== undefined) body.categoria = flags.categoria;

      if (Object.keys(body).length === 0) {
        error('falta algun cambio: --titulo o --contenido o --categoria');
        return 1;
      }

      const res = await peticion({
        fetchImpl,
        urlBase,
        ruta: `/notas/${id}`,
        metodo: 'PUT',
        headers: construirHeaders({ token, rol, json: true }),
        body,
      });

      const payload = await leerRespuesta(res);
      imprimirRespuesta(payload, log);
      return res.ok ? 0 : 1;
    }

    if (accion === 'borrar') {
      const id = posicionales[0];
      if (!id) {
        error('falta id');
        return 1;
      }

      const usuario = flags.usuario || env.NOTEEDIT_USUARIO || env.ADMIN_USER || 'admin';
      const rolBorrar = flags.rol || rol;

      const res = await peticion({
        fetchImpl,
        urlBase,
        ruta: `/notas/${id}`,
        metodo: 'DELETE',
        headers: construirHeaders({
          token,
          rol: rolBorrar,
          usuario,
        }),
      });

      const payload = await leerRespuesta(res);
      imprimirRespuesta(payload, log);
      return res.ok ? 0 : 1;
    }

    error(`accion desconocida: ${accion}`);
    return 1;
  }

  error(`comando desconocido: ${comando}`);
  imprimirAyuda(log);
  return 1;
};

const rutaActual = fileURLToPath(import.meta.url);
const esEjecucionDirecta = () => path.resolve(process.argv[1] || '') === rutaActual;

if (esEjecucionDirecta()) {
  ejecutarCli().then((codigo) => {
    process.exitCode = codigo;
  });
}

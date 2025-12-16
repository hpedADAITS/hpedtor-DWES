const fs = require('fs');
const { spawn } = require('child_process');

const baseUrl = 'http://localhost:3000';
const maxRetries = 10;
const retryDelay = 1000;

// Verificar si la API está disponible
const verificarApi = async (intento = 1) => {
  try {
    const res = await fetch(`${baseUrl}/ping`);
    return res.ok;
  } catch (e) {
    if (intento < maxRetries) {
      console.log(`  Reintentando (${intento}/${maxRetries})...`);
      await new Promise(r => setTimeout(r, retryDelay));
      return verificarApi(intento + 1);
    }
    return false;
  }
};

// Iniciar Docker si está disponible
const iniciarDocker = () => {
  return new Promise((resolve) => {
    console.log('  Iniciando contenedor Docker...');
    const docker = spawn('docker', ['compose', 'up', '-d']);

    docker.on('close', (code) => {
      if (code === 0) {
        console.log('  Contenedor iniciado. Esperando que esté listo...');
        resolve(true);
      } else {
        console.log('  No se pudo iniciar Docker. Continuando...');
        resolve(false);
      }
    });

    docker.on('error', () => {
      console.log('  Docker no disponible. Continuando...');
      resolve(false);
    });
  });
};

// Procesar colección Postman
const hacerSolicitud = async (url, metodo = 'GET', body = null, headers = {}) => {
  try {
    const opciones = {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (body) {
      opciones.body = JSON.stringify(body);
    }

    const res = await fetch(url, opciones);
    const text = await res.text();

    return {
      status: res.status,
      headers: res.headers,
      body: text,
    };
  } catch (e) {
    return { status: 0, error: e.message };
  }
};

const procesarItems = async (items, parentNombre = '') => {
  let totalRequests = 0;
  let passedRequests = 0;
  let failedRequests = 0;
  const resultados = [];

  for (const item of items) {
    if (item.item) {
      const subResultados = await procesarItems(item.item, item.name);
      totalRequests += subResultados.totalRequests;
      passedRequests += subResultados.passedRequests;
      failedRequests += subResultados.failedRequests;
      resultados.push(...subResultados.resultados);
      continue;
    }

    if (!item.request) continue;

    const request = item.request;
    const metodo = request.method || 'GET';
    let url = request.url;

    if (typeof url === 'object') {
      if (url.raw) {
        url = url.raw;
      } else {
        const pathStr = url.path ? `/${url.path.join('/')}` : '';
        const queryStr = url.query ? `?${url.query.map(q => `${q.key}=${q.value}`).join('&')}` : '';
        url = `${baseUrl}${pathStr}${queryStr}`;
      }
    } else if (!url.startsWith('http')) {
      url = `${baseUrl}${url}`;
    }

    // Reemplazar variables Postman
    url = url.replace(/{{baseUrl}}/g, baseUrl);
    url = url.replace(/{{notaId}}/g, '123456789-test');

    // Saltar si aún tiene variables sin resolver
    if (url.includes('{{')) {
      continue;
    }

    totalRequests++;
    const nombreEndpoint = `${parentNombre} > ${item.name}`.trim();

    try {
      const headers = {};
      if (request.header) {
        request.header.forEach(h => {
          headers[h.key] = h.value;
        });
      }

      let body = null;
      if (request.body) {
        if (typeof request.body === 'string') {
          body = JSON.parse(request.body);
        } else if (request.body.raw) {
          body = JSON.parse(request.body.raw);
        }
      }

      const respuesta = await hacerSolicitud(url, metodo, body, headers);

      const exitoso = respuesta.status >= 200 && respuesta.status < 300;

      if (exitoso) {
        passedRequests++;
        resultados.push({
          nombre: nombreEndpoint,
          metodo,
          url: url.replace(baseUrl, ''),
          status: respuesta.status,
          resultado: '✓ PASÓ',
        });
      } else {
        failedRequests++;
        resultados.push({
          nombre: nombreEndpoint,
          metodo,
          url: url.replace(baseUrl, ''),
          status: respuesta.status || 0,
          resultado: '✗ FALLÓ',
          error: respuesta.error,
        });
      }
    } catch (error) {
      failedRequests++;
      resultados.push({
        nombre: nombreEndpoint,
        metodo,
        url: url.replace(baseUrl, ''),
        status: 0,
        resultado: '✗ ERROR',
        error: error.message,
      });
    }

    await new Promise(r => setTimeout(r, 100));
  }

  return { totalRequests, passedRequests, failedRequests, resultados };
};

const ejecutar = async () => {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  PRUEBAS AUTOMATIZADAS POSTMAN - NoteEdit');
  console.log('═══════════════════════════════════════════════════════\n');

  // Verificar si la API está disponible
  console.log('Verificando API en ' + baseUrl + '...');
  let apiDisponible = await verificarApi();

  if (!apiDisponible) {
    console.log('\nAPI no disponible. Intentando iniciar...');
    await iniciarDocker();

    console.log('Esperando que la API esté lista...');
    apiDisponible = await verificarApi();
  }

  if (!apiDisponible) {
    console.log('\n✗ ERROR: No se puede conectar a la API en ' + baseUrl);
    console.log('\nAsegúrate de que la aplicación está ejecutándose:');
    console.log('  docker compose up -d');
    console.log('  npm run dev\n');
    process.exit(1);
  }

  console.log('✓ API disponible\n');

  const coleccion = JSON.parse(fs.readFileSync('postman_collection.json', 'utf8'));
  const inicio = Date.now();

  let datos = { totalRequests: 0, passedRequests: 0, failedRequests: 0, resultados: [] };

  if (coleccion.item) {
    datos = await procesarItems(coleccion.item);
  }

  const tiempo = Date.now() - inicio;
  const { totalRequests, passedRequests, failedRequests, resultados } = datos;

  console.log('───────────────────────────────────────────────────────');
  resultados.forEach(r => {
    const icono = r.resultado.includes('PASÓ') ? '✓' : '✗';
    const status = r.status ? `[${r.status}]` : '[ERROR]';
    console.log(`${icono} ${r.metodo.padEnd(6)} ${r.url.padEnd(35)} ${status.padEnd(8)} ${r.resultado}`);
  });
  console.log('───────────────────────────────────────────────────────\n');

  console.log('Resumen:');
  console.log(`  Total de solicitudes: ${totalRequests}`);
  console.log(`  Pasadas: ${passedRequests} ✓`);
  console.log(`  Fallidas: ${failedRequests} ✗`);
  console.log(`  Tasa de éxito: ${totalRequests > 0 ? ((passedRequests / totalRequests) * 100).toFixed(2) : '0'}%`);
  console.log(`  Tiempo: ${tiempo}ms\n`);

  console.log('═══════════════════════════════════════════════════════\n');

  process.exit(failedRequests > 0 ? 1 : 0);
};

ejecutar().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});

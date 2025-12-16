import readline from 'readline';
import chalk from 'chalk';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config({ quiet: true });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const urlBase = process.env.NOTEEDIT_URL || `http://localhost:${process.env.PORT || 3000}`;
let token = process.env.NOTEEDIT_TOKEN;
const rol = process.env.NOTEEDIT_ROL || 'usuario';

function mostrarMenu() {
  console.clear();
  console.log(chalk.blue('=== GESTOR DE NOTAS ==='));
  console.log(chalk.underline('1. Crear nota'));
  console.log(chalk.underline('2. Listar notas'));
  console.log(chalk.underline('3. Ver nota'));
  console.log(chalk.underline('4. Editar nota'));
  console.log(chalk.underline('5. Eliminar nota'));
  console.log(chalk.underline('6. Generar token'));
  console.log(chalk.underline('0. Salir'));
  rl.question(chalk.yellow('Elige una opción: '), manejarMenu);
}

function manejarMenu(opcion) {
  switch (opcion.trim()) {
    case '1':
      crearNota();
      break;
    case '2':
      listarNotas();
      break;
    case '3':
      verNota();
      break;
    case '4':
      editarNota();
      break;
    case '5':
      eliminarNota();
      break;
    case '6':
      generarToken();
      break;
    case '0':
      rl.close();
      console.log(chalk.green('Hasta luego'));
      process.exit(0);
      break;
    default:
      console.log(chalk.red('Opción no válida'));
      setTimeout(mostrarMenu, 1000);
  }
}

async function verificarToken() {
  if (!token) {
    console.log(chalk.red('Token no configurado. Usa opción 6 para generar uno.'));
    setTimeout(mostrarMenu, 2000);
    return false;
  }
  return true;
}

async function crearNota() {
  if (!(await verificarToken())) return;

  rl.question(chalk.cyan('Título: '), (titulo) => {
    if (!titulo.trim()) {
      console.log(chalk.red('El título no puede estar vacío'));
      setTimeout(mostrarMenu, 1500);
      return;
    }

    rl.question(chalk.cyan('Categoría (general): '), (categoria) => {
      console.log(chalk.cyan('Contenido (escribe dos líneas vacías para terminar):'));

      leerMultilinea((contenido) => {
        hacerPeticion('POST', '/notas', {
          titulo,
          contenido,
          categoria: categoria.trim() || 'general',
        })
          .then((res) => {
            if (res.ok) {
              console.log(chalk.green('Nota creada correctamente'));
            } else {
              console.log(chalk.red(`Error: ${res.status}`));
            }
            setTimeout(mostrarMenu, 1500);
          })
          .catch((err) => {
            console.log(chalk.red(`Error: ${err.message}`));
            setTimeout(mostrarMenu, 1500);
          });
      });
    });
  });
}

async function listarNotas() {
  if (!(await verificarToken())) return;

  try {
    const res = await hacerPeticion('GET', '/notas?limit=100');
    const data = await res.json();

    console.clear();
    console.log(chalk.blue('=== TUSS NOTAS ==='));

    if (Array.isArray(data.data) && data.data.length > 0) {
      data.data.forEach((nota, i) => {
        console.log(`${i + 1}. ${chalk.green(nota.titulo)} (${nota.categoria})`);
        console.log(`   ${chalk.gray(nota.contenido?.substring(0, 50) || '...')}`);
      });
    } else {
      console.log(chalk.yellow('No hay notas'));
    }

    rl.question(chalk.yellow('\nPresiona Enter para volver al menú'), () => {
      mostrarMenu();
    });
  } catch (err) {
    console.log(chalk.red(`Error: ${err.message}`));
    setTimeout(mostrarMenu, 1500);
  }
}

async function verNota() {
  if (!(await verificarToken())) return;

  rl.question(chalk.cyan('ID de la nota: '), async (id) => {
    if (!id.trim()) {
      console.log(chalk.red('ID requerido'));
      setTimeout(mostrarMenu, 1500);
      return;
    }

    try {
      const res = await hacerPeticion('GET', `/notas/${id.trim()}`);
      if (!res.ok) {
        console.log(chalk.red(`Nota no encontrada (${res.status})`));
        setTimeout(mostrarMenu, 1500);
        return;
      }

      const nota = await res.json();
      console.clear();
      console.log(chalk.blue(`=== ${nota.titulo} ===`));
      console.log(chalk.gray(`Categoría: ${nota.categoria}`));
      console.log(chalk.gray(`ID: ${nota._id}`));
      console.log('');
      console.log(nota.contenido);

      rl.question(chalk.yellow('\nPresiona Enter para volver'), () => {
        mostrarMenu();
      });
    } catch (err) {
      console.log(chalk.red(`Error: ${err.message}`));
      setTimeout(mostrarMenu, 1500);
    }
  });
}

async function editarNota() {
  if (!(await verificarToken())) return;

  rl.question(chalk.cyan('ID de la nota a editar: '), async (id) => {
    if (!id.trim()) {
      console.log(chalk.red('ID requerido'));
      setTimeout(mostrarMenu, 1500);
      return;
    }

    try {
      const res = await hacerPeticion('GET', `/notas/${id.trim()}`);
      if (!res.ok) {
        console.log(chalk.red(`Nota no encontrada (${res.status})`));
        setTimeout(mostrarMenu, 1500);
        return;
      }

      const nota = await res.json();
      console.clear();
      console.log(chalk.blue(`Editando: ${nota.titulo}`));

      rl.question(chalk.cyan('Nuevo título (Enter para mantener): '), (titulo) => {
        rl.question(chalk.cyan('Nueva categoría (Enter para mantener): '), (categoria) => {
          console.log(chalk.cyan('Nuevo contenido (dos líneas vacías para terminar):'));

          leerMultilinea((contenido) => {
            const body = {};
            if (titulo.trim()) body.titulo = titulo.trim();
            if (categoria.trim()) body.categoria = categoria.trim();
            if (contenido.trim()) body.contenido = contenido.trim();

            if (Object.keys(body).length === 0) {
              console.log(chalk.yellow('Sin cambios'));
              setTimeout(mostrarMenu, 1500);
              return;
            }

            hacerPeticion('PUT', `/notas/${id.trim()}`, body)
              .then((res) => {
                if (res.ok) {
                  console.log(chalk.green('Nota actualizada'));
                } else {
                  console.log(chalk.red(`Error: ${res.status}`));
                }
                setTimeout(mostrarMenu, 1500);
              })
              .catch((err) => {
                console.log(chalk.red(`Error: ${err.message}`));
                setTimeout(mostrarMenu, 1500);
              });
          });
        });
      });
    } catch (err) {
      console.log(chalk.red(`Error: ${err.message}`));
      setTimeout(mostrarMenu, 1500);
    }
  });
}

async function eliminarNota() {
  if (!(await verificarToken())) return;

  rl.question(chalk.cyan('ID de la nota a eliminar: '), async (id) => {
    if (!id.trim()) {
      console.log(chalk.red('ID requerido'));
      setTimeout(mostrarMenu, 1500);
      return;
    }

    rl.question(chalk.red('¿Estás seguro? (s/n): '), async (confirmacion) => {
      if (confirmacion.toLowerCase() !== 's') {
        console.log(chalk.yellow('Cancelado'));
        setTimeout(mostrarMenu, 1000);
        return;
      }

      try {
        const res = await hacerPeticion('DELETE', `/notas/${id.trim()}`);
        if (res.ok) {
          console.log(chalk.green('Nota eliminada'));
        } else {
          console.log(chalk.red(`Error: ${res.status}`));
        }
        setTimeout(mostrarMenu, 1500);
      } catch (err) {
        console.log(chalk.red(`Error: ${err.message}`));
        setTimeout(mostrarMenu, 1500);
      }
    });
  });
}

async function generarToken() {
  rl.question(chalk.cyan('Número de rondas de hash (10): '), async (rondas) => {
    const rnd = Number(rondas.trim()) || 10;
    const nuevoToken = await bcrypt.hash('I know your secret', rnd);

    console.clear();
    console.log(chalk.green('Token generado:'));
    console.log(chalk.yellow(nuevoToken));
    console.log('');
    console.log(chalk.gray('Cópialo en tu .env como NOTEEDIT_TOKEN=<token>'));

    token = nuevoToken;
    rl.question(chalk.yellow('\nPresiona Enter para continuar'), () => {
      mostrarMenu();
    });
  });
}

function leerMultilinea(callback) {
  let lineas = [];
  let lineasVacias = 0;

  function pedirLinea() {
    rl.question('> ', (linea) => {
      if (linea.trim() === '') {
        lineasVacias++;
        if (lineasVacias === 2) {
          return callback(lineas.join('\n'));
        }
      } else {
        lineasVacias = 0;
      }
      lineas.push(linea);
      pedirLinea();
    });
  }
  pedirLinea();
}

async function hacerPeticion(metodo, ruta, body = null) {
  const url = new URL(ruta, urlBase);
  const headers = {
    Authorization: `Bearer ${token}`,
    'x-rol': rol,
  };

  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  const opciones = {
    method: metodo,
    headers,
  };

  if (body) {
    opciones.body = JSON.stringify(body);
  }

  return fetch(url.toString(), opciones);
}

console.clear();
console.log(chalk.blue('=== NOTEEDIT CLI ==='));
if (token) {
  console.log(chalk.green('✓ Token auth verified'));
} else {
  console.log(chalk.yellow('⚠️  Sin token configurado'));
  console.log(chalk.gray('Usa opción 6 para generar uno'));
}
console.log('');

mostrarMenu();

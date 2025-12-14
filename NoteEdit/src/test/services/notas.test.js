import {
  listarNotas,
  crearNotaNueva,
  buscarNota,
  actualizarNota,
  borrarNota,
  limpiarNotas,
} from '../../services/notas.js';

describe('servicio notas', () => {
  beforeEach(() => {
    limpiarNotas();
  });

  test('crea y recupera nota', async () => {
    const creada = await crearNotaNueva({ titulo: 'nota servicio', contenido: 'contenido' });
    const hallada = await buscarNota(creada.id);
    expect(hallada?.titulo).toBe('nota servicio');
  });

  test('actualiza y borra nota', async () => {
    const creada = await crearNotaNueva({ titulo: 'nota a borrar', contenido: 'algo' });
    const actualizada = await actualizarNota(creada.id, { titulo: 'nota cambiada' });
    expect(actualizada?.titulo).toBe('nota cambiada');
    const borrada = await borrarNota(creada.id);
    expect(borrada).toBe(true);
  });

  test('listar retorna arreglo', async () => {
    const lista = await listarNotas();
    expect(Array.isArray(lista)).toBe(true);
  });
});

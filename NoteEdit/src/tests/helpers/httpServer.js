import express from 'express';

export const iniciarServidorExpress = (configurar) => new Promise((resolve) => {
  const app = express();
  app.use(express.json());
  configurar(app);

  const conexiones = new Set();
  const server = app.listen(0, '127.0.0.1', () => {
    const { port } = server.address();
    resolve({
      urlBase: `http://127.0.0.1:${port}`,
      cerrar: () => new Promise((listo) => {
        conexiones.forEach((socket) => socket.destroy());
        server.close(listo);
      }),
    });
  });

  server.on('connection', (socket) => {
    conexiones.add(socket);
    socket.on('close', () => conexiones.delete(socket));
  });
});

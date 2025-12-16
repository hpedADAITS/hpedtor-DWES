import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';

const spec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'NoteEdit API',
      version: '1.0.0',
    },
  },
  apis: [path.join(process.cwd(), 'src', 'core', 'docs', 'openapi.jsdoc.js')],
});

export default spec;

import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const config = {
  puerto: Number.isNaN(Number(process.env.PORT)) ? 3000 : Number(process.env.PORT),
  entorno: process.env.NODE_ENV || 'development',
  adminUsuario: process.env.ADMIN_USER || 'admin',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/noteedit',
  mongoHabilitado: process.env.MONGO_ENABLED === 'true' && process.env.NODE_ENV !== 'test',
  horaApiBase: process.env.HORA_API_BASE || 'https://worldtimeapi.org/api/timezone',
  horaApiZona: process.env.HORA_API_ZONA || 'Europe/Madrid',
};

export default config;

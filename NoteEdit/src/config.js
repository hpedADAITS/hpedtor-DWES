import dotenv from 'dotenv';

dotenv.config();

const config = {
  puerto: process.env.PORT || 3000,
  entorno: process.env.NODE_ENV || 'development',
};

export default config;

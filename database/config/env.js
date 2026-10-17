import dotenv from 'dotenv';
dotenv.config();

export const config = {
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aurora',
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development'
};

export default config;

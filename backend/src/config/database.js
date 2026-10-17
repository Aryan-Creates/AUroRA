/**
 * Database Connection Configuration
 * Establishes and monitors Mongoose connection to local MongoDB.
 */

import mongoose from 'mongoose';
import config from './env.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
    });

    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    console.error('Please verify that local mongod service is active on 127.0.0.1:27017.');
    throw error;
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Connection disconnected.');
});

mongoose.connection.on('reconnected', () => {
  console.log('[MongoDB] Connection re-established.');
});

export default connectDB;

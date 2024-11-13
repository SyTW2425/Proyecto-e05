import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

import express from 'express';
import mongoose from 'mongoose';
import swaggerJSDoc from 'swagger-jsdoc';
import SwaggerUi from 'swagger-ui-express';

// Initialize Express app
// const app = express();

// Get MongoDB URI from environment variables or fallback to a default value
const mongoURI = process.env.MONGO_URI!;

// Connect to MongoDB
export const db = mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch((err) => {
    console.error('Error de conexion a MongoDB:', err);
  });

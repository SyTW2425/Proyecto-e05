import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express';

const swaggerOptions: swaggerJsDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CineTrunk API',
      version: '1.0.0',
      description: 'API documentation for CineTrunk application',
    },
  },
  apis: ['./dist/routes/*.js'],
};

let swaggerDocs;
try {
  swaggerDocs = swaggerJsDoc(swaggerOptions);
} catch (error) {
  console.error('Error generating Swagger docs:', error);
  swaggerDocs = null;
}

export const setupSwaggerDocs = (app: express.Application) => {
  if (swaggerDocs) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  } else {
    console.error('Swagger docs could not be generated.');
  }
};
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with TypeScript',
      version: '1.0.0',
      description: 'A library API',
    },
  },
  apis: ['./routes/*.ts'],
};

const swaggerDocs = swaggerJsdoc(options);
export default swaggerDocs;

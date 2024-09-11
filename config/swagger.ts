import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library API',
      version: '1.0.0',
      description: 'This is a mock library API designed for managing users, books, and book lending processes. It provides endpoints for user and book management, as well as tracking and handling book loans.',
    },
  },
  apis: ['./routes/*.ts'],
};


const swaggerDocs = swaggerJsdoc(options);
export default swaggerDocs;

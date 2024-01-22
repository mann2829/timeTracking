const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Redmine Report API',
      version: '1.0.0',
      description: 'A simple Node.js API with Swagger documentation',
    },
    servers: [
      {
        url: 'http://localhost:3003/api',
        description: "Local Development Server"
      },
      {
        url: "http://192.168.1.93:3003/api",
        description: "Production Server"
      },
    ],
  },
  apis: ['../src/controllers/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };

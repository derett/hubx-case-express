import swaggerJSDoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';

const specs = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hubx Case Study',
      description: 'API Service fro Books and Authors',
      version: '1.0.0',
    },
  },
  apis: ['./modules/**/*.controller.ts'],
});

export { specs, swaggerUi };

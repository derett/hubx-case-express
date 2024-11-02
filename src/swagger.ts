import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { version } from '../package.json';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hubx Case Study',
      description: 'API Service for Books and Authors',
      version,
    },
  },
  apis: ['./**/*.router.ts', './**/*.schema.ts', './**/*.dto.ts'],
};

const specs = swaggerJSDoc(options);

export { specs, swaggerUi };

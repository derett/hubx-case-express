import * as dotenv from 'dotenv';
import express from 'express';
import * as pc from 'picocolors';

import bodyParser from 'body-parser';
import { pinoHttp } from 'pino-http';
import { connectDB } from './database';
import { exceptionHandler } from './middleware/exception.middleware';
import authorsRouter from './modules/authors/authors.router';
import booksRouter from './modules/books/books.router';
import serverLogger from './shared/loggers/server.logger';
import { specs, swaggerUi } from './swagger';

dotenv.config();

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 500;
const remote = process.env.REMOTE || '127.0.0.1';
const mongooseConnection = process.env.DATABASE_URI;

let app, server;

async function bootstrap() {
  app = express();

  if (process.env.NODE_ENV !== 'test') {
    await connectDB(mongooseConnection);
    app.use(pinoHttp(serverLogger));
  }

  app.use(bodyParser.json());
  app.use('/doc', swaggerUi.serve, swaggerUi.setup(specs));

  app.use('/books', booksRouter);
  app.use('/authors', authorsRouter);
  app.use(exceptionHandler);

  if (process.env.NODE_ENV !== 'test') {
    server = app.listen(port, host, () => {
      console.log(
        `${pc.blue(pc.bold(`[PID: ${process.pid}]`))} ${pc.green(
          pc.bold('✓'),
        )} Server is running on port ${pc.white(
          pc.bold(port),
        )} in production mode`,
      );

      console.log(
        `${pc.blue(pc.bold(`[PID: ${process.pid}]`))} ${pc.green(
          pc.bold('✓'),
        )} Server is running on http://${pc.white(pc.bold(remote))}:${pc.white(
          pc.bold(port),
        )}`,
      );
      console.log(
        `${pc.blue(pc.bold(`[PID: ${process.pid}]`))} ${pc.green(
          pc.bold('✓'),
        )} Access Docs: http://${remote}:${port}/doc`,
      );
    });
  }
}

bootstrap();

export { app, server };

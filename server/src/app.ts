import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { apiRouter } from './routes/api.routes.js';
import { sessionMiddleware } from './middleware/session.middleware.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import { env } from './config/env.js';

export const app = express();
app.disable('x-powered-by');
if (env.CLIENT_ORIGIN) app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: '32kb' }));
app.use(cookieParser());
app.use('/api/v1', sessionMiddleware, apiRouter);
app.use('/api/v1', notFound);
const clientBuild = resolve(dirname(fileURLToPath(import.meta.url)), '../../client/dist');
if (existsSync(clientBuild)) {
  app.use(express.static(clientBuild, { index: false, maxAge: '1h' }));
  app.get('*', (_req, res) => res.sendFile(resolve(clientBuild, 'index.html')));
} else {
  app.use(notFound);
}
app.use(errorHandler);

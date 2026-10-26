import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { apiRouter } from './routes/api.routes.js';
import { sessionMiddleware } from './middleware/session.middleware.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import { env } from './config/env.js';

export const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: '32kb' }));
app.use(cookieParser());
app.use('/api/v1', sessionMiddleware, apiRouter);
app.use(notFound);
app.use(errorHandler);

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import apiRouter from './routes/index.js';

export function createApp() {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS — only allow the Vite dev server (and same origin in prod)
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type'],
    })
  );

  // Request logging
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  // Body parsing
  app.use(express.json({ limit: '10kb' }));

  // Global rate limiter
  app.use(
    '/api',
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 min
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, error: 'Too many requests, slow down.' },
    })
  );

  // Health check
  app.get('/health', (_req, res) =>
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  );

  // API routes
  app.use('/api', apiRouter);

  // 404 → error handler
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

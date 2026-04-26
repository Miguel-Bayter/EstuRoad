import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import apiRouter from './routes/index.js';

export function createApp() {
  const app = express();

  // Explicit CSP instead of Helmet defaults
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc:  ["'self'"],
          scriptSrc:   ["'self'"],
          styleSrc:    ["'self'", 'https://fonts.googleapis.com'],
          fontSrc:     ["'self'", 'https://fonts.gstatic.com'],
          connectSrc:  ["'self'", 'https://eduroad-api.vercel.app'],
          imgSrc:      ["'self'", 'data:'],
          frameSrc:    ["'none'"],
          objectSrc:   ["'none'"],
        },
      },
      hsts: {
        maxAge: 63072000, // 2 years
        includeSubDomains: true,
        preload: true,
      },
    })
  );

  // credentials: true required for httpOnly session cookie
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
      methods: ['GET', 'POST', 'PATCH'],
      allowedHeaders: ['Content-Type'],
      credentials: true,
    })
  );

  // Required before authenticate middleware reads req.cookies
  app.use(cookieParser());

  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  // 10kb limit guards against oversized payloads
  app.use(express.json({ limit: '10kb' }));

  // Global rate limiter
  app.use(
    '/api',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, error: 'Too many requests, slow down.' },
    })
  );

  app.get('/health', (_req, res) =>
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  );

  app.use('/api', apiRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import auditRoutes from './routes/auditRoutes.js';
import authRoutes from './routes/authRoutes.js';
import configurationRoutes from './routes/configurationRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

export const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.clientOrigin }));
app.use(express.json({ limit: env.jsonBodyLimit }));

if (env.nodeEnv !== 'test') app.use(morgan(env.logFormat));

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/config', configurationRoutes);
app.use('/api/events', eventRoutes);
app.use(notFound);
app.use(errorHandler);

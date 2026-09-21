import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/', (req, res) => {
  const databaseStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];

  res.status(200).json({
    status: 'ok',
    service: 'campus-connect-api',
    database: databaseStates[mongoose.connection.readyState] ?? 'unknown',
    timestamp: new Date().toISOString(),
  });
});

export default router;

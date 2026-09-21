import { app } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';

let server;

async function startServer() {
  await connectDatabase();
  server = app.listen(env.port, () => {
    console.log(`CampusConnect API listening on port ${env.port}`);
  });
}

async function shutdown(signal) {
  console.log(`${signal} received. Closing server.`);

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  await disconnectDatabase();
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer().catch((error) => {
  console.error('Server startup failed:', error.message);
  process.exit(1);
});

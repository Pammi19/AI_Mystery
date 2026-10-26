import { app } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';

try {
  await connectDatabase();
  app.listen(env.PORT, () => console.info(`Mystery Room API listening on port ${env.PORT}`));
} catch (error) {
  console.error('Server startup failed. Check MONGODB_URI and database availability.', error instanceof Error ? error.message : 'unknown error');
  process.exit(1);
}

import 'dotenv/config';
import { createApp } from './app.js';
import { connectDB } from './config/database.js';

const PORT = Number(process.env.PORT ?? 3001);

async function main() {
  await connectDB();
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`🚀  EstuRoad API running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

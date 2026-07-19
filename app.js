import { pathToFileURL } from 'node:url';
import app from './src/app.js';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT || 3001;
const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Backend server is running on port ${PORT}...`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

if (isMainModule) {
  startServer();
}

export default app;

import { pathToFileURL } from 'node:url';
import app from './src/app.js';

const PORT = process.env.PORT || 3001;
const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}...`);
  });
}

export default app;

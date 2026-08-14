import serverless from 'serverless-http';
import app from '../../src/app.js';
import connectDB from '../../src/config/db.js';

const expressHandler = serverless(app);

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connectDB();

  const normalizedEvent = {
    ...event,
    path: event.path.replace(/^\/\.netlify\/functions\/api/, '') || '/'
  };

  return expressHandler(normalizedEvent, context);
};

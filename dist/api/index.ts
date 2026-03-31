import express from 'express';

const app = express();

app.get('/api/health', (_, res) => {
  res.json({
    status: 'OK',
    uri_exists: !!process.env.MONGODB_URI,
    jwt_exists: !!process.env.JWT_SECRET,
    uri_preview: process.env.MONGODB_URI?.slice(0, 40) || 'NOT SET',
    node_env: process.env.NODE_ENV,
  });
});

export default app;
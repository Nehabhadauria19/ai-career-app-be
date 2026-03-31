import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import analysisRoutes from './routes/analysis';
import { connectDB } from './lib/mongodb';

const app = express();

app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'http://localhost:3000',
    /\.vercel\.app$/,
  ],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect DB middleware — runs before every request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection failed:', err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/analyses', analysisRoutes);

app.get('/api/health', async (_, res) => {
  try {
    await connectDB();
    const mongoose = await import('mongoose');
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      mongodb: mongoose.default.connection.readyState === 1
        ? 'connected'
        : 'disconnected',
    });
  } catch {
    res.json({ status: 'OK', mongodb: 'error' });
  }
});

export default app;
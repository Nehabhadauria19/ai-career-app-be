import mongoose from 'mongoose';
import cors from 'cors';
import express from 'express';
import authRoutes from '../routes/auth';
import analysisRoutes from '../routes/analysis';

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

// MongoDB connection cache
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI not set');
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  
  isConnected = true;
  console.log('✅ MongoDB connected');
}

// Connect before every request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/analyses', analysisRoutes);

app.get('/api/health', async (_, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1
      ? 'connected'
      : 'disconnected',
    uri_exists: !!process.env.MONGODB_URI,
  });
});

export default app;
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../routes/auth"));
const analysis_1 = __importDefault(require("../routes/analysis"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        process.env.CLIENT_URL || 'http://localhost:3000',
        'http://localhost:3000',
        /\.vercel\.app$/,
    ],
    credentials: true,
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// MongoDB connection cache
let isConnected = false;
async function connectDB() {
    if (isConnected)
        return;
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI not set');
    }
    await mongoose_1.default.connect(process.env.MONGODB_URI, {
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
    }
    catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database connection failed' });
    }
});
app.use('/api/auth', auth_1.default);
app.use('/api/analyses', analysis_1.default);
app.get('/api/health', async (_, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        mongodb: mongoose_1.default.connection.readyState === 1
            ? 'connected'
            : 'disconnected',
        uri_exists: !!process.env.MONGODB_URI,
    });
});
exports.default = app;

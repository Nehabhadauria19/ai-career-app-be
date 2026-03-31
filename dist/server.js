"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const analysis_1 = __importDefault(require("./routes/analysis"));
const app = (0, express_1.default)();
console.log('=== SERVER STARTING ===');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
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
app.use('/api/auth', auth_1.default);
app.use('/api/analyses', analysis_1.default);
app.get('/api/health', (_, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        mongodb: mongoose_1.default.connection.readyState === 1 ? 'connected' : 'disconnected',
    });
});
// Connect MongoDB
if (process.env.MONGODB_URI) {
    mongoose_1.default
        .connect(process.env.MONGODB_URI)
        .then(() => console.log('✅ MongoDB connected'))
        .catch((err) => console.error('❌ MongoDB error:', err.message));
}
else {
    console.error('❌ MONGODB_URI not set');
}
// Export for Vercel serverless
exports.default = app;

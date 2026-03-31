"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function test() {
    const uri = process.env.MONGODB_URI;
    console.log('URI preview:', uri?.slice(0, 50));
    if (!uri) {
        console.error('❌ MONGODB_URI is not set in .env file');
        return;
    }
    try {
        await mongoose_1.default.connect(uri);
        console.log('✅ MongoDB connected successfully!');
        await mongoose_1.default.disconnect();
        console.log('✅ Disconnected cleanly');
    }
    catch (err) {
        console.error('❌ Connection failed:', err);
    }
}
test();

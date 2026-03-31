 
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const uri = process.env.MONGODB_URI;
  console.log('URI preview:', uri?.slice(0, 50));
  
  if (!uri) {
    console.error('❌ MONGODB_URI is not set in .env file');
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected successfully!');
    await mongoose.disconnect();
    console.log('✅ Disconnected cleanly');
  } catch (err) {
    console.error('❌ Connection failed:', err);
  }
}

test();
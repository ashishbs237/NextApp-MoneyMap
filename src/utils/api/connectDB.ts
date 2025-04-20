import mongoose from 'mongoose';
import { envUtil } from '@/utils/envUtil';

export default async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(envUtil.MONGODB_URI, {
      dbName: 'moneymap',
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

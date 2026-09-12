import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

type Cached = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const globalWithMongoose = globalThis as typeof globalThis & { mongoose?: Cached };
const cached = globalWithMongoose.mongoose ?? { conn: null, promise: null };
globalWithMongoose.mongoose = cached;

export async function connectDb() {
  if (!uri) return null;
  if (cached.conn) return cached.conn;
  cached.promise ??= mongoose.connect(uri);
  cached.conn = await cached.promise;
  return cached.conn;
}

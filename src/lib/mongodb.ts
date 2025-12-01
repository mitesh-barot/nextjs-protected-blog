import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// ❌ Do NOT throw here — it breaks Jest and SSR
// We only validate the env when connectToDatabase() is called.

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // allow global var in Node
  var _mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  // Mocked in tests → instantly returns
  if (!MONGODB_URI) {
    console.warn('⚠ MONGODB_URI missing (expected in Jest tests). Skipping DB connection.');
    return Promise.resolve(null) as Promise<typeof mongoose | null>;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      })
      .then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  global._mongoose = cached;
  return cached.conn;
}

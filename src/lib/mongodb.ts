import mongoose from "mongoose";

const cached = global.mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  cached.promise =
    cached.promise ||
    mongoose.connect(process.env.MONGODB_URI, {
      dbName: "nextjs-blog",
      bufferCommands: false,
    });

  cached.conn = await cached.promise;
  global.mongoose = cached;
  return cached.conn;
}

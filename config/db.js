const mongoose = require('mongoose');

let cached = global.__mongoose;
if (!cached) cached = global.__mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not set');

    cached.promise = mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB || undefined,
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    }).then((m) => m.connection);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;

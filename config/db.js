// config/db.js
const mongoose = require('mongoose');

let cached = global.__mongoose; // { conn, promise }
if (!cached) {
  cached = global.__mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    // Ya conectada: reusar
    return cached.conn;
  }
  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not set');

    // Opciones razonables para serverless
    const opts = {
      // dbName opcional si no viene en el URI
      dbName: process.env.MONGODB_DB || undefined,
      maxPoolSize: 5, // pools pequeños en serverless
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // evita IPv6 issues en algunos proveedores
      // keepAlive: true, keepAliveInitialDelay: 300000, // (opcional)
    };

    // Guarda la promesa para evitar carreras
    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      return mongoose.connection;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;

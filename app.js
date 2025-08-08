// app.js (desarrollo local)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Rutas
const authRoutes = require('./src/routes/auth');
const customerRoutes = require('./src/routes/customers');
const tourRoutes = require('./src/routes/tours');
const reservationRoutes = require('./src/routes/reservations');

const app = express();

// Conexión a DB (usa la versión cacheada en config/db.js)
connectDB();

// CORS: permite tu front local y el de Vercel
const vercelRegex = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;

const allowedOrigins = [
  'http://localhost:5173',
  'https://frontend-tour-reservation-system-me.vercel.app',
  process.env.FRONTEND_ORIGIN,
  vercelRegex,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    const ok = allowedOrigins.some(o => o instanceof RegExp ? o.test(origin) : o === origin);
    cb(ok ? null : new Error(`Not allowed by CORS: ${origin}`), ok);
  },
  credentials: true,
}));


app.use(express.json());

// Prefijo /api en local (coincide con tu frontend)
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/reservations', reservationRoutes);

// Healthcheck
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// 404
app.use((_req, res) => res.status(404).json({ message: 'Not found' }));

// Manejo de errores
app.use((err, _req, res, _next) => {
  console.error(err?.stack || err);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 API escuchando en http://localhost:${PORT}`));

// api/index.js
require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const connectDB = require('../config/db');

const authRoutes = require('../src/routes/auth');
const customerRoutes = require('../src/routes/customers');
const tourRoutes = require('../src/routes/tours');
const reservationRoutes = require('../src/routes/reservations');

const app = express();
connectDB();

// CORS: permite tu front en Vercel
const allowedOrigins = [
  'https://frontend-tour-reservation-system-me.vercel.app',
  process.env.FRONTEND_ORIGIN,      // opcional extra
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    const ok = allowedOrigins.some(o =>
      (o instanceof RegExp ? o.test(origin) : o === origin)
    );
    cb(ok ? null : new Error(`Not allowed by CORS: ${origin}`), ok);
  },
  credentials: true,
}));

app.use(express.json());

// 👇 En Vercel NO antepongas /api (Vercel ya monta /api/index.js en /api)
app.use('/auth', authRoutes);
app.use('/customers', customerRoutes);
app.use('/tours', tourRoutes);
app.use('/reservations', reservationRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use((_req, res) => res.status(404).json({ message: 'Not found' }));
app.use((err, _req, res, _next) => {
  console.error(err?.stack || err);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = serverless(app);

// api/index.js
require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const connectDB = require('./config/db'); // ✅

// Rutas (ajusta paths según tu repo)
const authRoutes = require('./src/routes/auth');
const customerRoutes = require('./src/routes/customers');
const tourRoutes = require('./src/routes/tours');
const reservationRoutes = require('./src/routes/reservations');

const app = express();

// Conexión a DB (usa singleton en connectDB para reusar conexión entre invocaciones)
connectDB(); // inicia la conexión al “boot” de la función

// CORS: permite tu frontend local y tu dominio de Vercel
const allowedOrigins = [
  process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  /\.vercel\.app$/i, // cualquier subdominio de Vercel
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    const ok = allowedOrigins.some((o) =>
      (o instanceof RegExp ? o.test(origin) : o === origin)
    );
    cb(ok ? null : new Error('Not allowed by CORS'), ok);
  },
  credentials: true,
}));

app.use(express.json());

// Rutas (NOTA: aquí van SIN /api porque Vercel ya monta esto en /api)
app.use('/auth', authRoutes);
app.use('/customers', customerRoutes);
app.use('/tours', tourRoutes);
app.use('/reservations', reservationRoutes);

// Healthcheck
app.get('/health', (req, res) => res.json({ ok: true }));

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err?.stack || err);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Exporta la función serverless (NO app.listen)
module.exports = serverless(app);

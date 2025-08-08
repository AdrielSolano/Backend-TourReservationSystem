require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

// Conexión a la base de datos
connectDB();

// Lista de orígenes permitidos
const allowedOrigins = [
  'http://localhost:5173',
  'https://frontend-tour-reservation-system.vercel.app',
  process.env.FRONTEND_ORIGIN // opcional si quieres setearlo por env
].filter(Boolean);

// Configurar CORS antes de las rutas
app.use(cors({
  origin: (origin, callback) => {
    // Permitir solicitudes sin origin (Postman, curl, same-origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true
}));

// Middleware
app.use(express.json());

// Rutas
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/customers', require('./src/routes/customers'));
app.use('/api/tours', require('./src/routes/tours'));
app.use('/api/reservations', require('./src/routes/reservations'));

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

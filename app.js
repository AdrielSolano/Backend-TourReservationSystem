require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

// Conexión a la base de datos
connectDB();

// Configurar CORS ANTES de definir las rutas y el body parser
app.use(cors({
  origin: 'http://localhost:5173', // asegúrate que este sea el puerto del frontend
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

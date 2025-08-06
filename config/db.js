const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout después de 5 segundos
      maxPoolSize: 10 // Número máximo de conexiones
    });
    console.log('Conectado a MongoDB Atlas');
  } catch (err) {
    console.error('Error de conexión a Atlas:', err.message);
    process.exit(1);
  }
};

// Manejar eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('Mongoose conectado a Atlas');
});

mongoose.connection.on('error', (err) => {
  console.log('Error en la conexión Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose desconectado');
});

// Cerrar conexión al terminar la aplicación
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = connectDB;
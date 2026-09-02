const mongoose = require('mongoose');

// Función asincrónica para conectar a la base de datos MongoDB
const conectarDB = async () => {
  try {
    // Lee la variable de entorno de Render/MongoDB Atlas, o usa local si no existe
    const DB_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/authdb';
    
    await mongoose.connect(DB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = conectarDB;
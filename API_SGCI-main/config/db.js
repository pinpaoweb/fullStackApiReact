const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    // Esto lee la variable segura que configuraste en Render
    const DB_URI = process.env.MONGO_URI;
    
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
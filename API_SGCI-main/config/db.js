const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    // Pega tu cadena de conexión de MongoDB Atlas aquí dentro de las comillas
    const DB_URI = 'mongodb+srv://pinpao92:<db_password>@cluster0.gupvv.mongodb.net/?appName=Cluster0';
    
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
const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    // Si existe la variable en Render (en línea), usará la de la nube con su nombre respectivo.
    // Si estás en tu PC (sin esa variable), usará por defecto la local 'authdb'.
    const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/authdb';
    
    await mongoose.connect(DB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    console.log(`MongoDB conectado correctamente a: ${DB_URI.includes('localhost') ? 'LOCAL (authdb)' : 'LÍNEA (Nube)'}`);
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = conectarDB;
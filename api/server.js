const express = require('express');
const conectarDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productosRoutes = require('./routes/productosRoutes');
const pedidosRoutes = require('./routes/pedidosRoutes');
const cors = require('cors');
const path = require('path');

conectarDB();

const app = express();

// CONFIGURACIÓN UNIFICADA DE CORS
// Usamos una función para permitir dinámicamente varios orígenes si es necesario
const corsOptions = {
  // El asterisco permite cualquier origen, útil para desarrollo
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200
};


app.use(cors(corsOptions));

// Middleware para analizar JSON
app.use(express.json());

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api', productosRoutes);
app.use('/api', pedidosRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
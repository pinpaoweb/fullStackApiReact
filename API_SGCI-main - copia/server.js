const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const conectarDB = require('./config/db');
const path = require('path');
const app = express();

// 1. IMPORTAR MODELOS Y MIDDLEWARES
const IMC = require('./models/IMC'); // <--- IMPORTANTE: Asegúrate de tener este archivo
const authenticateToken = require('./middleware/authMiddleware');
 // <--- Asegúrate de tener este middleware

// 🔌 DB
conectarDB();

// 🔥 MIDDLEWARES
app.use(cors({
  origin: ['http://localhost:5173', 'http://192.168.1.40:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// 📦 RUTAS (Deben estar arriba para ser usadas)
const authRoutes = require('./routes/authRoutes');
const productosRoutes = require('./routes/productosRoutes');
const pedidosRouter = require('./routes/pedidosRouter');
const salesRouter = require('./routes/salesRouter');

app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos', pedidosRouter);
app.use('/api/sales', salesRouter);

// 🌐 RUTAS IMC
// Guardar IMC
app.post("/api/imc", authenticateToken, async (req, res) => {
  try {
    // CAMBIO: usa req.user.userId (que es como lo defines en el token)
    if (!req.user || !req.user.userId) {
        return res.status(401).json({ error: "Usuario no autenticado correctamente" });
    }

    const nuevo = new IMC({ 
      ...req.body, 
      usuarioId: req.user.userId // <--- CORREGIDO AQUÍ
    });
    
    await nuevo.save();
    res.status(201).json({ mensaje: "Guardado" });
  } catch (error) {
    console.error("ERROR DETALLADO:", error);
    res.status(500).json({ error: "Error al guardar en BD" });
  }
});

// Obtener historial
app.get("/api/imc/mis-calculos", authenticateToken, async (req, res) => {
  try {
    // CAMBIO: usa req.user.userId
    const calculos = await IMC.find({ usuarioId: req.user.userId }).sort({ createdAt: -1 });
    res.json(calculos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener historial" });
  }
});

// 3. Configuración archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🚀 SERVER
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
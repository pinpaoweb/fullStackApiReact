const express = require('express');
const conectarDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productosRoutes = require('./routes/productosRoutes');
const pedidosRoutes = require('./routes/pedidosRoutes');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// Crear una instancia de Express
const app = express();
//const port = 5000;
// Conectar a la base de datos
conectarDB().catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
});

// Configuración de CORS
const corsOptions = {
    origin: 'http://127.0.0.1:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json()); // Para parsear JSON en el cuerpo de las solicitudes
app.use('/api', pedidosRoutes);

app.post('/login', (req, res) => {
    // ...
    console.log('Request headers:', req.headers); // Verifica los encabezados de la solicitud
    console.log('Response headers:', res.getHeaders()); // Verifica los encabezados de la respuesta
    // ...
  });
// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());

// Middleware para analizar cookies
app.use(cookieParser());

// Ruta para servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos', pedidosRoutes);
//const pedidosRoutes = require('./routes/pedidosRoutes'); // Ajusta la ruta según tu estructura
//app.use('/api', pedidosRoutes);


// Ejemplo de cómo establecer una cookie en una ruta
app.post('/login', (req, res) => {
    // Lógica de autenticación
    res.cookie('token', 'valor_del_token', {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: 'None',
        secure: true
    });
    res.json({ message: 'Inicio de sesión exitoso' });
});

// Configurar el puerto en el que escuchará el servidor
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

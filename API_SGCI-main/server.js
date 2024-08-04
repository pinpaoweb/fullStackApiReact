const express = require('express');
const conectarDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productosRoutes = require('./routes/productosRoutes');
const pedidosRoutes = require('./routes/pedidosRoutes');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// Crear una instancia de Express
const app = express();

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

// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.json()); // Para parsear JSON en el cuerpo de las solicitudes
app.use(cookieParser()); // Para analizar cookies

// Ruta para servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/', pedidosRoutes);

// Ruta para el inicio de sesión (ejemplo con cookies)
app.post('/login', (req, res) => {
    // Aquí deberías tener tu lógica de autenticación
    // Establecer una cookie de autenticación
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

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

// IMPORTANTE para Render (cookies seguras detrás de un proxy)
app.set('trust proxy', 1);

// Conectar a la base de datos
conectarDB().catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
});

// Configuración de CORS dinámica para Vercel y Localhost
const allowedOrigins = [
    'http://127.0.0.1:5173', 
    'http://localhost:5173', 
    'https://react1api.vercel.app' // Asegúrate de que esta sea tu URL exacta de Vercel
];

const corsOptions = {
    origin: function (origin, callback) {
        // Permitir solicitudes sin origen (como Postman o apps móviles) 
        // o si el origen está en la lista o termina en vercel.app
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Bloqueado por la política CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200 // Soluciona problemas de compatibilidad con navegadores antiguos en peticiones OPTIONS
};

// Aplicar CORS antes de cualquier ruta
app.use(cors(corsOptions));

// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.json()); 
app.use(cookieParser()); 

// Ruta para servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/', pedidosRoutes);

// Ruta para el inicio de sesión
app.post('/login', (req, res) => {
    res.cookie('token', 'valor_del_token', {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: 'None',
        secure: true
    });
    res.json({ message: 'Inicio de sesión exitoso' });
});

// Configurar el puerto dinámico para Render o local por defecto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
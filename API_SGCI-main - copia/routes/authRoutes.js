const express = require('express');
const { register, login, updateUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Ruta para cerrar sesión
router.post('/logout', (req, res) => {
  // Si estás usando cookies para el token
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'None',
    secure: true
  });
  res.status(200).json({ message: 'Sesión cerrada correctamente' });
});

// Ruta protegida de ejemplo
router.get('/protected', authMiddleware, (req, res) => {
  res.status(200).json({ mensaje: 'Accediste a una ruta protegida', user: req.user });
});

// Ruta protegida para actualizar datos del usuario
router.put('/update', authMiddleware, updateUser);

module.exports = router;

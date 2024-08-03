const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Intentar obtener el token de la cookie primero
  const token = req.cookies.authToken || req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado, token no proporcionado' });
  }
  
  try {
    const verified = jwt.verify(token, 'your_jwt_secret');
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Token no válido' });
  }
};

module.exports = authMiddleware;

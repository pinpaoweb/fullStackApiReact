const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // 1. Capturamos el header para depuración
  const authHeader = req.header('Authorization');
  console.log("Header recibido en servidor:", authHeader);

  // 2. Extraemos el token
  // Nota: Asegúrate de que tu frontend envíe "Bearer <token>"
  const token = (req.cookies && req.cookies.authToken) || 
                (authHeader && authHeader.replace('Bearer ', ''));
  
  if (!token) {
    console.log("No se encontró token en la petición");
    return res.status(401).json({ error: 'Acceso denegado, token no proporcionado' });
  }

  try {
    // 3. Verificamos el token
    // ELIMINÉ: { expiresIn: '24h' } porque eso va en jwt.sign, NO en jwt.verify
    const verified = jwt.verify(token, 'your_jwt_secret');
    
    // 4. Asignamos el usuario decodificado a req.user
    req.user = verified;
    next();
  } catch (error) {
    console.log("Error al verificar token:", error.message);
    // Cambiamos el status a 401 para indicar claramente que el token falló (Unauthorized)
    return res.status(401).json({ error: 'Token no válido o expirado' });
  }
};

module.exports = authMiddleware;






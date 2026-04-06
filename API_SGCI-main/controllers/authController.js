const bcrypt = require('bcryptjs');
const Joi = require('joi');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Esquema de validación para el registro de usuario
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});





// Función para registrar un nuevo usuario
exports.register = async (req, res) => {
  // Validar los datos de entrada usando Joi
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { username, email, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'El usuario ya existe' });

    // Crear un nuevo usuario
    user = new User({
      username,
      email,
      password: await bcrypt.hash(password, 10) // Cifrar la contraseña
    });

    await user.save(); // Guardar el usuario en la base de datos
    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

// Esquema de validación para el inicio de sesión
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// Función para iniciar sesión
exports.login = async (req, res) => {
  // Validar los datos de entrada usando Joi
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, password } = req.body;

  try {
    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });

    // Verificar si la contraseña es correcta
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Credenciales inválidas' });

    // Generar un token JWT
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    // Configurar la cookie con el token JWT
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    });
    
    // Agregar la cabecera Set-Cookie: Secure manualmente
    res.setHeader('Set-Cookie', res.getHeader('Set-Cookie') + '; Secure');
    

    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      username: user.username,
      role: user.role,
      userId: user._id,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

// Esquema de validación para actualizar el usuario
const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(50),
  email: Joi.string().email(),
  password: Joi.string().min(6)
});

// Función para actualizar los datos del usuario
exports.updateUser = async (req, res) => {
  // Validar los datos de entrada usando Joi
  const { error } = updateUserSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const updates = req.body;

  try {
    // Verificar si el email ya está en uso por otro usuario
    if (updates.email) {
      const existingUser = await User.findOne({ email: updates.email });
      if (existingUser && existingUser._id.toString() !== req.user.userId) {
        return res.status(400).json({ error: 'El email ya está en uso, usar otro' });
      }
    }

    // Cifrar la nueva contraseña si se proporciona
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    // Actualizar el usuario en la base de datos
    const user = await User.findByIdAndUpdate(req.user.userId, updates, { new: true });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.status(200).json({
      mensaje: 'Datos del usuario actualizados exitosamente',
      user
    });
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

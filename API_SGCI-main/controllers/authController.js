const bcrypt = require('bcryptjs');
const Joi = require('joi');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// --- ESQUEMAS DE VALIDACIÓN ---
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('usuario', 'admin', 'vendedor')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// --- CONTROLADORES ---

// 1. Registro
exports.register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  
  const { username, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'El usuario ya existe' });

    user = new User({
      username,
      email,
      password: await bcrypt.hash(password, 10),
      role: role || 'usuario'
    });

    await user.save();
    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

// 2. Login
exports.login = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
    { userId: user._id.toString() }, // <--- FORZA A STRING
      'your_jwt_secret', 
      { expiresIn: '24h' }
    );

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

// 3. Actualizar Usuario
exports.updateUser = async (req, res) => {
  // Usamos el ID que viene del token (puesto por el middleware authMiddleware)
  const id = req.user.userId; 
  const updates = req.body;

  try {
    if (updates.email) {
      const existingUser = await User.findOne({ email: updates.email });
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(400).json({ error: 'El email ya está en uso' });
      }
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.status(200).json({ mensaje: 'Datos actualizados exitosamente', user });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// 4. Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// 5. Eliminar usuario
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.status(200).json({ mensaje: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};
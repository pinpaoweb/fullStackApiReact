const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const { body, param, validationResult } = require('express-validator');
const multer = require('multer');
const Joi = require('joi');

// Configuración de Multer para la carga de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Tipo de archivo no permitido'), false);
    }
    cb(null, true);
  }
});

// Esquema de validación con Joi
const productoSchema = Joi.object({
  nombre: Joi.string().min(3).max(30).required().messages({
    'string.base': 'El nombre debe ser un texto.',
    'string.empty': 'El nombre no puede estar vacío.',
    'string.min': 'El nombre debe tener al menos 3 caracteres.',
    'string.max': 'El nombre no puede tener más de 30 caracteres.',
    'any.required': 'El nombre es un campo obligatorio.'
  }),
  descripcion: Joi.string().max(500).optional().messages({
    'string.base': 'La descripción debe ser un texto.',
    'string.max': 'La descripción no puede tener más de 500 caracteres.'
  }),
  precio: Joi.number().positive().required().messages({
    'number.base': 'El precio debe ser un número.',
    'number.positive': 'El precio debe ser un valor positivo.',
    'any.required': 'El precio es un campo obligatorio.'
  }),
  stock: Joi.number().integer().min(0).required().messages({
    'number.base': 'El stock debe ser un número.',
    'number.integer': 'El stock debe ser un número entero.',
    'number.min': 'El stock no puede ser negativo.',
    'any.required': 'El stock es un campo obligatorio.'
  }),
  imagen: Joi.string().optional()
});

// Middleware de validación para los datos del producto
const validarProducto = async (req, res, next) => {
  try {
    const { error } = await productoSchema.validateAsync(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map(detail => ({
        message: detail.message,
        path: detail.path
      }));
      return res.status(400).json({ errors });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error de validación interna' });
  }
};

// Crear un nuevo producto
exports.nuevoProducto = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nombre, descripcion, precio, stock } = req.body;
  const imagen = req.file ? req.file.path : null; // Obtener la ruta del archivo subido

  // Crear el nuevo producto en la base de datos
  // ...

  res.status(201).json({ message: 'Producto creado exitosamente.', producto: nuevoProducto });
};

// Nuevos productos
router.post('/',
  upload.single('imagen'), // Asegúrate de que el archivo se llama 'imagen' en el formulario
  validarProducto,
  productosController.nuevoProducto
);

// Muestra todos los productos
router.get('/',
  productosController.mostrarProductos
);

// Muestra un producto específico por su ID
router.get('/:idProducto',
  param('idProducto').isMongoId().withMessage('ID de producto inválido'),
  productosController.mostrarProducto
);

// Actualizar Productos
router.put('/:idProducto',
  upload.single('imagen'),
  param('idProducto').isMongoId().withMessage('ID de producto inválido'),
  validarProducto,
  productosController.actualizarProducto
);

// Eliminar Productos
router.delete('/:idProducto',
  param('idProducto').isMongoId().withMessage('ID de producto inválido'),
  productosController.eliminarProducto
);

// Búsqueda de Productos
exports.buscarProducto = async (req, res) => {
  try {
    const { query } = req.params;
    // Suponiendo que tienes un modelo Producto
    const productos = await Producto.find({ nombre: { $regex: new RegExp(query, 'i') } });
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar productos', error: error.message });
  }
};

router.get('/busqueda/:query',
  param('query').isString().withMessage('La búsqueda debe ser un texto'),
  productosController.buscarProducto
);

module.exports = router;

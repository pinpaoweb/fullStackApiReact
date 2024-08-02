const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController'); // Ajusta la ruta según tu estructura



// productsController.js
const { validationResult } = require('express-validator');


// Crear un nuevo producto
exports.nuevoProducto = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { nombre,   
   descripcion, precio, stock, imagen } = req.body;
  
    // Crear el nuevo producto en la base de datos
    // ...
  
    res.status(201).json(nuevoProducto);
  };

// Nuevos productos
router.post('/', 
    productosController.subirArchivo,
    productosController.nuevoProducto
);
// Definir las rutas
//router.get('/productos/:id', productosController.getProductoById);

// Muestra todos los productos
router.get('/', 
    productosController.mostrarProductos);

// Muestra un producto específico por su ID
router.get('/:idProducto', 
    productosController.mostrarProducto);

// Actualizar Productos
router.put('/:idProducto', 
    productosController.subirArchivo,
    productosController.actualizarProducto
);

// Eliminar Productos
router.delete('/:idProducto', 
    productosController.eliminarProducto
);

// Búsqueda de Productos
router.get('/busqueda/:query',
    productosController.buscarProducto);


// Definir rutas para productos
router.get('/', productosController.getAllProducts); // Ejemplo de ruta para obtener todos los productos


module.exports = router;
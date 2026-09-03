const Producto = require('../models/Producto');
const multer = require('multer');
const shortid = require('shortid');
const path = require('path');

// Detecta automáticamente si estás en producción (Render) o en local
const HOST_URL = process.env.BACKEND_URL || 'http://localhost:5000';

const configuracionMulter = {
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadsDir = path.join(__dirname, '../uploads');
            cb(null, uploadsDir);
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Formato No válido'));
        }
    }
};

const upload = multer(configuracionMulter).single('imagen');

exports.subirArchivo = (req, res, next) => {
    upload(req, res, function (error) {
        if (error) {
            return res.status(400).json({ mensaje: error.message });
        }
        next();
    });
};

exports.nuevoProducto = async (req, res, next) => {
    const producto = new Producto(req.body);

    try {
        if (req.file) {
            producto.imagen = req.file.filename;
        }
        await producto.save();
        res.json({ mensaje: 'Se agregó un nuevo producto' });
    } catch (error) {
        console.log(error);
        next();
    }
};

exports.mostrarProductos = async (req, res, next) => {
    try {
        const productos = await Producto.find({});
        const productosConUrl = productos.map(producto => {
            const prod = producto.toObject();
            if (prod.imagen && !prod.imagen.startsWith('http')) {
                prod.imagen = `${HOST_URL}/uploads/${prod.imagen}`;
            }
            return prod;
        });
        res.json(productosConUrl);
    } catch (error) {
        console.log(error);
        next();
    }
};

exports.mostrarProducto = async (req, res, next) => {
    try {
        const producto = await Producto.findById(req.params.idProducto);

        if (!producto) {
            res.json({ mensaje: 'Ese Producto no existe' });
            return next();
        }

        const prod = producto.toObject();
        if (prod.imagen && !prod.imagen.startsWith('http')) {
            prod.imagen = `${HOST_URL}/uploads/${prod.imagen}`;
        }

        res.json(prod);
    } catch (error) {
        console.log('Error al buscar el producto:', error);
        next();
    }
};

exports.actualizarProducto = async (req, res, next) => {
    try {
        const { idProducto } = req.params;
        const nuevoProducto = req.body;

        if (!nuevoProducto.nombre || !nuevoProducto.precio) {
            return res.status(400).json({ error: 'Nombre y precio del producto son requeridos' });
        }

        if (req.file) {
            nuevoProducto.imagen = req.file.filename;
        } else {
            const productoAnterior = await Producto.findById(idProducto);
            if (!productoAnterior) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            nuevoProducto.imagen = productoAnterior.imagen;
        }

        const producto = await Producto.findByIdAndUpdate(idProducto, nuevoProducto, {
            new: true
        });

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const prod = producto.toObject();
        if (prod.imagen && !prod.imagen.startsWith('http')) {
            prod.imagen = `${HOST_URL}/uploads/${prod.imagen}`;
        }

        res.json(prod);
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

exports.eliminarProducto = async (req, res, next) => {
    try {
        await Producto.findByIdAndDelete({ _id: req.params.idProducto });
        res.json({ mensaje: 'El Producto se ha eliminado' });
    } catch (error) {
        console.log(error);
        next();
    }
};

exports.buscarProducto = async (req, res, next) => {
    try {
        const { query } = req.params;
        const productos = await Producto.find({ nombre: new RegExp(query, 'i') });
        const productosConUrl = productos.map(producto => {
            const prod = producto.toObject();
            if (prod.imagen && !prod.imagen.startsWith('http')) {
                prod.imagen = `${HOST_URL}/uploads/${prod.imagen}`;
            }
            return prod;
        });
        res.json(productosConUrl);
    } catch (error) {
        console.log(error);
        next();
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const productos = await Producto.find();
        const productosConUrl = productos.map(producto => {
            const prod = producto.toObject();
            if (prod.imagen && !prod.imagen.startsWith('http')) {
                prod.imagen = `${HOST_URL}/uploads/${prod.imagen}`;
            }
            return prod;
        });
        res.json(productosConUrl);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};
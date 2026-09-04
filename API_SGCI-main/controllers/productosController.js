const Producto = require('../models/Producto');
const multer = require('multer');
const shortid = require('shortid');
const path = require('path');

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

// Función auxiliar para corregir la URL de la imagen dinámicamente
const corregirUrlImagen = (imagen) => {
    if (!imagen) return imagen;
    const host = process.env.HOST_URL || 'https://apireact1-1.onrender.com';
    
    // Si la imagen viene con localhost, lo reemplazamos por el HOST_URL de Render
    if (imagen.includes('localhost:5000')) {
        return imagen.replace(/http:\/\/localhost:5000/g, host);
    }
    // Si es solo el nombre del archivo o una ruta relativa, le anteponemos el host
    if (!imagen.startsWith('http')) {
        const rutaLimpia = imagen.startsWith('/') ? imagen : `/uploads/${imagen}`;
        return `${host}${rutaLimpia}`;
    }
    return imagen;
};

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
            const host = process.env.HOST_URL || 'https://apireact1-1.onrender.com';
            producto.imagen = `${host}/uploads/${req.file.filename}`;
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
        // Corregimos las URLs de las imágenes de todos los productos sobre la marcha
        const productosCorregidos = productos.map(prod => {
            const prodObj = prod.toObject();
            prodObj.imagen = corregirUrlImagen(prodObj.imagen);
            return prodObj;
        });
        res.json(productosCorregidos);
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

        const prodObj = producto.toObject();
        prodObj.imagen = corregirUrlImagen(prodObj.imagen);
        res.json(prodObj);
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

        const host = process.env.HOST_URL || 'https://apireact1-1.onrender.com';

        if (req.file) {
            nuevoProducto.imagen = `${host}/uploads/${req.file.filename}`;
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

        const prodObj = producto.toObject();
        prodObj.imagen = corregirUrlImagen(prodObj.imagen);
        res.json(prodObj);
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
        const productosCorregidos = productos.map(prod => {
            const prodObj = prod.toObject();
            prodObj.imagen = corregirUrlImagen(prodObj.imagen);
            return prodObj;
        });
        res.json(productosCorregidos);
    } catch (error) {
        console.log(error);
        next();
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const productos = await Producto.find();
        const productosCorregidos = productos.map(prod => {
            const prodObj = prod.toObject();
            prodObj.imagen = corregirUrlImagen(prodObj.imagen);
            return prodObj;
        });
        res.json(productosCorregidos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};
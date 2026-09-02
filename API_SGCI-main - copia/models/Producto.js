const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductoSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    imagen: {
        type: String
    }
}, {
    timestamps: true // Habilita createdAt y updatedAt automáticamente
});
// Ejemplo de cómo debe estar tu controlador para aceptar los 20 productos de una vez
const Producto = require('../models/Producto'); // O como se llame tu modelo

exports.crearProducto = async (req, res) => {
    try {
        // ⚡ SI REQ.BODY ES UN ARREGLO (COMO TUS 20 PRODUCTOS), LOS INSERTA TODOS DE GOLPE
        if (Array.isArray(req.body)) {
            const productosInsertados = await Producto.insertMany(req.body);
            return res.status(201).json({
                mensaje: "¡Los 20 productos fueron subidos con éxito!",
                productos: productosInsertados
            });
        } 
        
        // SI ES UN SOLO PRODUCTO (POST INDIVIDUAL)
        const nuevoProducto = new Producto(req.body);
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Hubo un error al subir los productos" });
    }
};
module.exports = mongoose.model('Producto', ProductoSchema);

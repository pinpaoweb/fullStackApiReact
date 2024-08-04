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

module.exports = mongoose.model('Producto', ProductoSchema);

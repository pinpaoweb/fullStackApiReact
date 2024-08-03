const mongoose = require('mongoose');

// Asegúrate de que este archivo no esté redefiniendo el modelo 'Producto'
const pedidoSchema = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pedido: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Producto' // Este debe coincidir con el modelo 'Producto'
            },
            quantity: Number
        }
    ],
    total: Number,
    paymentCode: Number,
    nombreEnvio: String,
    telefonoEnvio: String,
    direccionEnvio: String,
    barrioEnvio: String,
    municipioEnvio: String,
    departamentoEnvio: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pedido', pedidoSchema);

// models/Pedido.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pedidoSchema = new Schema({
    cliente: {
        type: Schema.ObjectId, 
        ref: 'User',  
        required: true
    },
    pedido: [{
        producto: {
            type: Schema.ObjectId,
            ref: 'Producto',
            required: true
        },
        cantidad: {
            type: Number,
            required: true
        }
    }],
    total: {
        type: Number,
        required: true
    },
    estado: {
        type: String,
        enum: ['PENDIENTE', 'PAGADO', 'ENVIADO'],
        default: 'PENDIENTE'
    },
    paymentCode: {
        type: Number,
        required: true
    },    
    nombreEnvio: {
        type: String,
        required: true
    },
    telefonoEnvio: {
        type: String,
        required: true
    },
    direccionEnvio: {
        type: String,
        required: true
    },
    barrioEnvio: {
        type: String,
        required: true
    },
    municipioEnvio: {
        type: String,
        required: true
    },
    departamentoEnvio: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Pedido', pedidoSchema);

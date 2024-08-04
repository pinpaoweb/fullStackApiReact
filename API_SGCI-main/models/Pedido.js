const mongoose = require('mongoose');

// Definir el esquema de pedido
const pedidoSchema = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Coincide con el modelo 'User'
        required: true
    },
    pedido: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Producto' // Asegúrate de que este nombre coincida con el modelo 'Producto'
            },
            quantity: Number
        }
    ],
    total: {
        type: Number,
        required: true
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
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
const fetchPedidos = async () => {
    try {
        const response = await axios.get('/api/pedidos/cliente/667fa2a1a6f8bc5d3c806e33');
        // Procesa la respuesta...
    } catch (error) {
        console.error('Error al obtener los pedidos', error);
    }
};

// Hook para actualizar el campo 'updatedAt' antes de guardar el documento
pedidoSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Exportar el modelo de pedido
module.exports = mongoose.model('Pedido', pedidoSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema; // <--- ¡ESTA LÍNEA ES OBLIGATORIA!

const pedidoSchema = new Schema({
    cliente: { 
        type: Schema.Types.ObjectId, // Se recomienda usar Schema.Types.ObjectId
        ref: 'User', 
        required: true 
    },
    pedido: [{
        producto: { 
            type: Schema.Types.ObjectId, 
            ref: 'Producto', 
            required: true 
        },
        nombre: String,
        cantidad: { type: Number, required: true },
        precio: Number,
        imagen: String
    }],
    total: { type: Number, required: true },
    estado: { 
        type: String, 
        enum: ['PENDIENTE', 'PAGADO', 'ENVIADO'], 
        default: 'PENDIENTE' 
    },
    paymentCode: { type: Number, required: true },    
    nombreEnvio: { type: String, required: true },
    telefonoEnvio: { type: String, required: true },
    direccionEnvio: { type: String, required: true },
    barrioEnvio: { type: String, required: true },
    municipioEnvio: { type: String, required: true },
    departamentoEnvio: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Pedido', pedidoSchema);
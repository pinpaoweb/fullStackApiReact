const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  total: Number,
  items: [{
    producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
    nombre: String,
    cantidad: Number,
    precio: Number
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

// MODIFICACIÓN AQUÍ: Si el modelo ya existe en el cache, lo reutiliza; si no, lo crea.
module.exports = mongoose.models.Sale || mongoose.model('Sale', saleSchema);
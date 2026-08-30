const mongoose = require('mongoose');

const IMCSchema = new mongoose.Schema({
  usuarioId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  peso: { type: Number, required: true },
  altura: { type: Number, required: true },
  edad: { type: Number },
  imc: { type: Number, required: true },
  estado: { type: String, required: true },
  // 🚀 AGREGA ESTOS DOS CAMPOS:
  cintura: { type: Number, default: null },
  riesgoCintura: { type: String, default: "" },
  // ------------------------------------------
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('IMC', IMCSchema);
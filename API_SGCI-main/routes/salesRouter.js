const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Producto = require('../models/Producto');

router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find().lean();
    
    for (let sale of sales) {
      if (sale.items && Array.isArray(sale.items)) {
        for (let item of sale.items) {
          if (item.producto) {
            const prodEncontrado = await Producto.findById(item.producto).lean();
            if (prodEncontrado) {
              item.nombre = prodEncontrado.nombre;
              item.descripcion = prodEncontrado.descripción || prodEncontrado.descripcion;
              item.precio = prodEncontrado.precio;
            } else {
              item.nombre = "Producto";
            }
          }
        }
      }
    }

    res.json(sales);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener las ventas" });
  }
});

router.post('/', async (req, res) => {
  try {
    const sale = await Sale.create(req.body);
    res.json(sale);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al registrar la venta" });
  }
});

module.exports = router;
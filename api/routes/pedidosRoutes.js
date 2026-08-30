const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');


// Nuevos pedidos
router.post('/pedidos/nuevo', pedidosController.nuevoPedido);

// Muestra todos los pedidos
router.get('/pedidos', pedidosController.mostrarPedidos);

// Muestra un pedido por su ID
router.get('/pedidos/:idPedido', pedidosController.mostrarPedido);


// Actualizar pedidos
router.put('/pedidos/:idPedido', pedidosController.actualizarPedido);
// En tu backend (API_SGCI-main)
router.put('/pedidos/:id', async (req, res) => {
  try {
    const { estado } = req.body;
    const pedidoActualizado = await Pedido.findByIdAndUpdate(
      req.params.id, 
      { estado }, 
      { new: true }
    );
    res.json(pedidoActualizado);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar" });
  }
});

// Elimina un pedido
router.delete('/pedidos/:idPedido', pedidosController.eliminarPedido);

// Muestra todos los pedidos del cliente por su ID
router.get('/pedidos/cliente/:idCliente', pedidosController.mostrarPedidosCliente);

module.exports = router;

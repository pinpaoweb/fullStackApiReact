const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');

// Crear pedido
router.post('/', pedidosController.nuevoPedido);

// Obtener todos los pedidos
router.get('/', pedidosController.mostrarPedidos);

// Obtener pedido por ID
router.get('/:idPedido', pedidosController.mostrarPedido);

// Actualizar pedido
router.put('/:idPedido', pedidosController.actualizarPedido);

// Eliminar pedido
router.delete('/:idPedido', pedidosController.eliminarPedido);

// Pedidos por cliente
router.get('/cliente/:idCliente', pedidosController.mostrarPedidosCliente);

module.exports = router;
// routes/pedidosRouter.js
const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');

// Crear un nuevo pedido
router.post('/pedidos/nuevo', pedidosController.nuevoPedido);

// Mostrar todos los pedidos
router.get('/pedidos', pedidosController.mostrarPedidos);

// Mostrar un pedido por su ID
router.get('/pedidos/:idPedido', pedidosController.mostrarPedido);

// Actualizar un pedido por su ID
router.put('/pedidos/:idPedido', pedidosController.actualizarPedido);

// Eliminar un pedido por su ID
router.delete('/pedidos/:idPedido', pedidosController.eliminarPedido);

// Mostrar todos los pedidos de un cliente específico
router.get('/pedidos/cliente/:idCliente', pedidosController.mostrarPedidosCliente);

module.exports = router;

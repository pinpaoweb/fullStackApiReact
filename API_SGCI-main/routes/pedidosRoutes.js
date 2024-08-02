const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');


router.post('/pedidos', (req, res) => {
    // Aquí es donde se procesa la solicitud POST
    console.log('Se ha recibido un nuevo pedido:', req.body);
  
    // Lógica para guardar el pedido en la base de datos, enviar un email, etc.
    // ...
  
    res.json({ message: 'Pedido recibido correctamente' });
  });

// Nuevos pedidos
router.post('/pedidos/nuevo', pedidosController.create);
//exports.nuevoPedido = (req, res) => {
    // Lógica para crear un nuevo pedido
  //};

// Muestra todos los pedidos
router.get('/pedidos/:idPedido', pedidosController.mostrarPedidos);

// Muestra un pedido por su ID
router.get('/pedidos/:idPedido', pedidosController.mostrarPedido);


// Actualizar pedidos
router.put('/pedidos/:idPedido', pedidosController.actualizarPedido);

// Elimina un pedido
router.delete('/pedidos/:idPedido', pedidosController.eliminarPedido);

// Muestra todos los pedidos del cliente por su ID
router.get('/pedidos/cliente/:idCliente', pedidosController.mostrarPedidosCliente);

module.exports = router;
const Pedido = require('../models/Pedido');
const mongoose = require('mongoose');

// Crear un nuevo pedido
exports.create = async (req, res) => {
    try {
        const pedidoData = req.body;
        const nuevoPedido = new Pedido(pedidoData);
        await nuevoPedido.save();
        res.status(201).json(nuevoPedido);
    } catch (error) {
        console.error('Error al crear el pedido:', error);
        res.status(500).json({ error: 'Error al crear el pedido' });
    }
};

// Mostrar todos los pedidos
exports.mostrarPedidos = async (req, res, next) => {
    try {
        // Encuentra todos los pedidos
        const pedidos = await Pedido.find({})
            .populate('cliente', '-password') // Poblar el campo cliente sin la contraseña
            .populate({
                path: 'pedido.product', // Ruta para poblar los productos dentro del pedido
                populate: {
                    path: 'product', // El campo 'product' en 'pedido' debe coincidir con el esquema de Producto
                    select: 'nombre imagen' // Asegúrate de seleccionar los campos necesarios del producto
                }
            });
        res.json(pedidos);
    } catch (error) {
        console.log(error);
        next(error); // Pasar el error al siguiente middleware
    }
};

// Mostrar un pedido por su ID
exports.mostrarPedido = async (req, res, next) => {
    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(req.params.idPedido)) {
        return res.status(400).json({ error: 'ID de pedido no válido' });
    }

    try {
        const pedido = await Pedido.findById(req.params.idPedido)
            .populate('cliente', '-password') // Poblar el campo cliente sin la contraseña
            .populate({
                path: 'pedido.product', // Ruta para poblar los productos dentro del pedido
                populate: {
                    path: 'product', // El campo 'product' en 'pedido' debe coincidir con el esquema de Producto
                    select: 'nombre imagen' // Asegúrate de seleccionar los campos necesarios del producto
                }
            });

        if (!pedido) {
            return res.status(404).json({ mensaje: 'Ese pedido no existe' });
        }
        res.json(pedido);
    } catch (error) {
        console.log(error);
        next(error); // Pasar el error al siguiente middleware
    }
};

// Actualizar un pedido por su ID
exports.actualizarPedido = async (req, res, next) => {
    try {
        const pedido = await Pedido.findOneAndUpdate(
            { _id: req.params.idPedido },
            req.body,
            { new: true } // Devuelve el documento actualizado
        )
        .populate('cliente', '-password') // Poblar el campo cliente sin la contraseña
        .populate({
            path: 'pedido.product', // Ruta para poblar los productos dentro del pedido
            populate: {
                path: 'product', // El campo 'product' en 'pedido' debe coincidir con el esquema de Producto
                select: 'nombre imagen' // Asegúrate de seleccionar los campos necesarios del producto
            }
        });

        res.json(pedido);
    } catch (error) {
        console.log(error);
        next(error); // Pasar el error al siguiente middleware
    }
};

// Eliminar un pedido por su ID
exports.eliminarPedido = async (req, res, next) => {
    try {
        await Pedido.findByIdAndDelete(req.params.idPedido);
        res.json({ mensaje: 'El pedido se ha eliminado' });
    } catch (error) {
        console.log(error);
        next(error); // Pasar el error al siguiente middleware
    }
};

// Mostrar todos los pedidos de un cliente específico
exports.mostrarPedidosCliente = async (req, res, next) => {
    try {
        const pedidos = await Pedido.find({ cliente: req.params.idCliente })
            .populate('cliente', '-password') // Poblar el campo cliente sin la contraseña
            .populate({
                path: 'pedido.product', // Ruta para poblar los productos dentro del pedido
                populate: {
                    path: 'product', // El campo 'product' en 'pedido' debe coincidir con el esquema de Producto
                    select: 'nombre imagen' // Asegúrate de seleccionar los campos necesarios del producto
                }
            });
        res.json(pedidos);
    } catch (error) {
        console.log(error);
        next(error); // Pasar el error al siguiente middleware
    }
};

const Pedido = require('../models/Pedido');

exports.nuevoPedido = async (req, res, next) => {
    const pedido = new Pedido(req.body);
    try {
        await pedido.save();
        res.json({ mensaje: 'Se agregó un nuevo pedido' });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.mostrarPedidos = async (req, res, next) => {
    try {
        const pedidos = await Pedido.find({})
            .populate('cliente', '-password')
            .populate({
                path: 'pedido.producto',
                select: 'nombre imagen' // Seleccionar los campos de imagen y nombre
            });
        res.json(pedidos);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.mostrarPedido = async (req, res, next) => {
    try {
        const pedido = await Pedido.findById(req.params.idPedido)
            .populate('cliente', '-password')
            .populate({
                path: 'pedido.producto',
                select: 'nombre imagen'
            });

        if (!pedido) {
            return res.status(404).json({ mensaje: 'Ese pedido no existe' });
        }
        res.json(pedido);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.actualizarPedido = async (req, res, next) => {
    try {
        const pedido = await Pedido.findOneAndUpdate(
            { _id: req.params.idPedido },
            req.body,
            { new: true }
        )
        .populate('cliente', '-password')
        .populate({
            path: 'pedido.producto',
            select: 'nombre imagen'
        });

        if (!pedido) {
            return res.status(404).json({ mensaje: 'Ese pedido no existe' });
        }
        res.json(pedido);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.eliminarPedido = async (req, res, next) => {
    try {
        const pedido = await Pedido.findByIdAndDelete(req.params.idPedido);
        if (!pedido) {
            return res.status(404).json({ mensaje: 'Ese pedido no existe' });
        }
        res.json({ mensaje: 'El pedido se ha eliminado' });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.mostrarPedidosCliente = async (req, res, next) => {
    try {
        const pedidos = await Pedido.find({ cliente: req.params.idCliente })
            .populate('cliente', '-password')
            .populate({
                path: 'pedido.producto',
                select: 'nombre imagen'
            });
        res.json(pedidos);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

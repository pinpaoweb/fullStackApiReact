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

// 1. Muestra todos los pedidos
exports.mostrarPedidos = async (req, res, next) => {
    try {
        const pedidos = await Pedido.find({})
            .populate('cliente', '-password')
            .populate('pedido.producto', 'nombre imagen precio descripción'); 

        // Mapeamos para garantizar que el campo 'nombre' siempre viaje al frontend
        const pedidosMapeados = pedidos.map(p => {
            const pedidoObj = p.toObject();
            if (pedidoObj.pedido && Array.isArray(pedidoObj.pedido)) {
                pedidoObj.pedido = pedidoObj.pedido.map(item => ({
                    ...item,
                    nombre: item.nombre || (item.producto && item.producto.nombre) || "Producto"
                }));
            }
            return pedidoObj;
        });

        res.json(pedidosMapeados);
    } catch (error) {
        console.log(error);
        next();
    }
};

// 2. Muestra un pedido por su ID
exports.mostrarPedido = async (req, res, next) => {
    try {
        const pedido = await Pedido.findById(req.params.idPedido)
            .populate('cliente', '-password')
            .populate('pedido.producto', 'nombre imagen precio descripción');

        if(!pedido) {
            res.json({mensaje : 'Ese pedido no existe'});
            return next();
        }

        const pedidoObj = pedido.toObject();
        if (pedidoObj.pedido && Array.isArray(pedidoObj.pedido)) {
            pedidoObj.pedido = pedidoObj.pedido.map(item => ({
                ...item,
                nombre: item.nombre || (item.producto && item.producto.nombre) || "Producto"
            }));
        }

        res.json(pedidoObj);
    } catch (error) {
        console.log(error);
        next();
    }
}; 

// 3. Actualizar el pedido via ID
exports.actualizarPedido = async (req, res, next) => {
    try {
        const pedido = await Pedido.findOneAndUpdate({_id: req.params.idPedido}, req.body, {new: true})
            .populate('cliente', '-password')
            .populate('pedido.producto', 'nombre imagen precio descripción');

        const pedidoObj = pedido.toObject();
        if (pedidoObj.pedido && Array.isArray(pedidoObj.pedido)) {
            pedidoObj.pedido = pedidoObj.pedido.map(item => ({
                ...item,
                nombre: item.nombre || (item.producto && item.producto.nombre) || "Producto"
            }));
        }

        res.json(pedidoObj);
    } catch (error) {
        console.log(error);
        next();
    }
};

// 4. Elimina un pedido por su ID
exports.eliminarPedido = async (req, res, next) => {
    try {
        await Pedido.findByIdAndDelete(req.params.idPedido);
        res.json({ mensaje : 'El pedido se ha eliminado' });
    } catch (error) {
        console.log(error);
        next();
    }
};

// 5. Muestra todos los pedidos de un cliente específico
exports.mostrarPedidosCliente = async (req, res, next) => {
    try {
        const pedidos = await Pedido.find({ cliente: req.params.idCliente })
            .populate('cliente', '-password')
            .populate({
                path: 'pedido.producto',
                select: 'nombre imagen precio descripción'
            });
            
        const pedidosMapeados = pedidos.map(p => {
            const pedidoObj = p.toObject();
            if (pedidoObj.pedido && Array.isArray(pedidoObj.pedido)) {
                pedidoObj.pedido = pedidoObj.pedido.map(item => ({
                    ...item,
                    nombre: item.nombre || (item.producto && item.producto.nombre) || "Producto"
                }));
            }
            return pedidoObj;
        });

        res.json(pedidosMapeados);
    } catch (error) {
        console.log(error);
        next();
    }
};
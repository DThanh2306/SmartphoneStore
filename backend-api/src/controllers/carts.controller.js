const ApiError = require('../api-error');
const JSend = require('../jsend');
const knex = require('../database/knex');
const cartService = require('../services/carts.service');

async function addToCart(req, res) {
    const product_id  = req.params.product_id; // Lấy product_id từ tham số đường dẫn
    const u_acc = req.params.u_acc; // Lấy u_acc
    console.log(product_id, u_acc);
    // Kiểm tra thông tin bắt buộc
    if (!u_acc || !product_id) {
        return res.status(400).json({
            status: 'fail',
            message: 'Thiếu thông tin người dùng hoặc sản phẩm',
        });
    }

    try {
        const result = await cartService.addToCart(u_acc, product_id);
        return res.status(201).json(result);
    } catch (err) {
        console.error('Lỗi khi thêm sản phẩm vào giỏ hàng: ', err);
        return res.status(500).json({
            status: 'error',
            message: 'Lỗi server',
            error: err.message,
        });
    }
}

async function getCart(req, res) {
    const { u_acc } = req.params; // Lấy u_acc từ params URL

    if (!u_acc) {
        return res.status(400).json({
            status: 'fail',
            message: 'Thiếu thông tin tài khoản người dùng',
        });
    }

    try {
        const result = await cartService.getCartByUAcc(u_acc);

        if (!result || result.length === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'Giỏ hàng trống',
            });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error(`Lỗi server: ${error.message}`);
        return res.status(500).json({
            status: 'error',
            message: 'Lỗi server, không thể lấy thông tin giỏ hàng',
        });
    }
}

async function removeProduct(req, res) {
    const u_acc = req.params.u_acc; // Lấy u_acc từ params URL
    const product_id = req.params.product_id; // Lấy product_id từ params URL

    if (!u_acc || !product_id) {
        return res.status(400).json({
            status: "fail",
            message: "Thiếu thông tin người dùng hoặc sản phẩm",
        });
    }

    try {
        const deletedCount = await cartService.removeProductFromCart(u_acc, product_id);
        if (deletedCount === 0) {
            return res.status(404).json({ status: "fail", message: "Sản phẩm không tồn tại trong giỏ hàng" });
        }
        return res.status(200).json({ status: "success", message: "Sản phẩm đã được xóa khỏi giỏ hàng" });
    } catch (err) {
        console.error("Lỗi khi xóa sản phẩm:", err.message);
        return res.status(500).json({ status: "error", message: "Lỗi server", error: err.message });
    }
}

async function decreaseQuantity(req, res) {
    const u_acc = req.params.u_acc; // Lấy u_acc từ params
    const product_id = req.params.product_id; // Lấy product_id từ params

    if (!u_acc || !product_id) {
        return res.status(400).json({
            status: "fail",
            message: "Thiếu thông tin người dùng hoặc sản phẩm",
        });
    }

    try {
        // Tìm sản phẩm trong giỏ hàng
        const cartItem = await cartService.getCartItemByUserAndProduct(u_acc, product_id);

        if (!cartItem) {
            return res.status(404).json({ status: "fail", message: "Product not found in cart" });
        }

        // Kiểm tra nếu số lượng là 1 thì xóa sản phẩm
        if (cartItem.cart_quantity === 1) {
            await cartService.removeProductFromCart(u_acc, product_id);
            return res.status(200).json({ status: "success", message: "Product removed from cart" });
        } else {
            // Giảm số lượng đi 1
            await cartService.updateCartQuantity(u_acc, product_id, cartItem.cart_quantity - 1);
            return res.status(200).json({ status: "success", message: "Product quantity decreased by 1" });
        }
    } catch (err) {
        console.error("Lỗi khi giảm số lượng sản phẩm trong giỏ hàng:", err.message);
        return res.status(500).json({ status: "error", message: "Server error", error: err.message });
    }
}

module.exports = {
    addToCart,
    getCart,
    removeProduct,
    decreaseQuantity,
};
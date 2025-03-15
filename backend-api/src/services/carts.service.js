const knex = require("../database/knex");

function cartRepository() {
    return knex("Cart");
}

function readCart(payload) {
    return {
        cart_id: payload.cart_id,
        u_acc: payload.u_acc,
        product_id: payload.product_id,
        cart_quantity: payload.cart_quantity,
    };
}

async function addToCart(u_acc, product_id) {
    if (!u_acc || !product_id) {
        throw new Error("Thiếu thông tin người dùng hoặc sản phẩm.");
    }

    try {
        const existingCartItem = await cartRepository().where({ u_acc, product_id }).first();

        if (existingCartItem) {
            // Cập nhật số lượng nếu sản phẩm đã có trong giỏ hàng
            await cartRepository()
                .where({ cart_id: existingCartItem.cart_id })
                .update({ cart_quantity: existingCartItem.cart_quantity + 1 });
        } else {
            // Thêm sản phẩm mới vào giỏ hàng
            await cartRepository().insert({
                u_acc,
                product_id,
                cart_quantity: 1,
            });
        }

        return { status: "success", message: "Sản phẩm đã được thêm vào giỏ hàng" };
    } catch (err) {
        console.error("Lỗi khi thêm vào giỏ hàng:", err.message);
        throw new Error("Lỗi server");
    }
}

async function getCartByUAcc(u_acc) {
    if (!u_acc) {
        throw new Error("Thiếu thông tin tài khoản người dùng.");
    }

    try {
        const cartItems = await cartRepository()
            .join("Products", "Cart.product_id", "=", "Products.id")
            .select(
                "Cart.product_id",
                "Cart.cart_id",
                "Cart.u_acc",
                "Products.name as product_name",
                "Products.avatar as product_image",
                "Products.ram",
                "Products.rom",
                "Products.price",
                "Cart.cart_quantity"
            )
            .where("Cart.u_acc", u_acc);

        if (cartItems.length === 0) {
            return {
                status: "success",
                message: `Giỏ hàng của người dùng ${u_acc} trống.`,
            };
        }

        return {
            status: "success",
            data: cartItems,
        };
    } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error.message);
        throw new Error("Lỗi server, không thể lấy thông tin giỏ hàng.");
    }
}

async function removeProductFromCart(u_acc, product_id) {
    if (!u_acc || !product_id) {
        throw new Error("Thiếu thông tin người dùng hoặc sản phẩm.");
    }
    return knex("Cart")
        .where({ u_acc, product_id }) // Tìm giỏ hàng theo u_acc và product_id
        .del(); // Xóa sản phẩm
}

async function getCartItemByUserAndProduct(u_acc, product_id) {
    if (!u_acc || !product_id) {
        throw new Error("Thiếu thông tin người dùng hoặc sản phẩm.");
    }

    try {
        return await cartRepository().where({ u_acc, product_id }).first();
    } catch (err) {
        console.error("Lỗi khi lấy sản phẩm trong giỏ hàng:", err.message);
        throw new Error("Lỗi server, không thể lấy sản phẩm.");
    }
}

async function updateCartQuantity(u_acc, product_id, newQuantity) {
    if (!u_acc || !product_id || newQuantity < 1) {
        throw new Error("Thông tin không hợp lệ.");
    }

    try {
        return await cartRepository()
            .where({ u_acc, product_id })
            .update({ cart_quantity: newQuantity });
    } catch (err) {
        console.error("Lỗi khi cập nhật số lượng sản phẩm:", err.message);
        throw new Error("Lỗi server, không thể cập nhật số lượng.");
    }
}

module.exports = {
    addToCart,
    readCart,
    getCartByUAcc,
    removeProductFromCart,
    getCartItemByUserAndProduct,
    updateCartQuantity,
};
const knex = require("../database/knex.js");

// Lấy chi tiết đơn hàng theo `orderId`
async function getOrderDetails(orderId = null) {
  try {
    const query = knex("Order")
      .join("OrderDetails", "Order.order_id", "OrderDetails.order_id")
      .select(
        "Order.order_id",
        "Order.user_id",
        "Order.total_price",
        "Order.order_date",
        "Order.status",
        "OrderDetails.product_name",
        "OrderDetails.product_avatar",
        "OrderDetails.product_brand",
        "OrderDetails.product_ram",
        "OrderDetails.product_rom",
        "OrderDetails.quantity",
        "OrderDetails.product_price"
      );

    if (orderId) {
      query.where("Order.order_id", orderId);
    }

    const orderDetails = await query;

    if (!orderDetails.length) {
      throw new Error(orderId ? "Không tìm thấy chi tiết đơn hàng" : "Không có đơn hàng nào");
    }

    return orderDetails;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin đơn hàng:", error);
    throw error;
  }
}

// Tạo đơn hàng mới
async function createOrder(userId) {
  try {
    // Lấy giỏ hàng của user
    const cartItems = await knex("Cart")
      .join("Products", "Cart.product_id", "Products.id")
      .select(
        "Cart.*",
        "Products.name",
        "Products.avatar",
        "Products.brand",
        "Products.ram",
        "Products.rom",
        "Products.price",
        "Products.stock_quantity"
      )
      .where("Cart.u_acc", userId);

    if (!cartItems.length) {
      throw new Error("Giỏ hàng trống");
    }

    // Tính tổng giá trị đơn hàng và kiểm tra số lượng tồn kho
    let totalPrice = 0;
    for (const item of cartItems) {
      if (item.cart_quantity > item.stock_quantity) {
        throw new Error(
          `Sản phẩm ${item.name} không đủ số lượng (hiện có: ${item.stock_quantity})`
        );
      }
      totalPrice += item.cart_quantity * item.price;
    }

    // Tạo đơn hàng mới trong bảng Order
    const [orderId] = await knex("Order").insert({
      user_id: userId,
      total_price: totalPrice,
      status: "pending",
      order_date: new Date(),
    });

    // Lưu chi tiết đơn hàng và trừ số lượng tồn kho
    for (const item of cartItems) {
      await knex("OrderDetails").insert({
        order_id: orderId,
        product_name: item.name,
        product_avatar: item.avatar,
        product_brand: item.brand,
        product_ram: item.ram,
        product_rom: item.rom,
        quantity: item.cart_quantity,
        product_price: item.price,
      });

      await knex("Products")
        .where("id", item.product_id)
        .decrement("stock_quantity", item.cart_quantity);
    }

    // Xóa giỏ hàng sau khi tạo đơn hàng
    await knex("Cart").where("u_acc", userId).del();

    return orderId;
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    throw error;
  }
}

// Lấy danh sách đơn hàng theo `userId`
async function getOrdersByUserId(userId) {
  try {
    const orders = await knex("Order")
      .where("user_id", userId)
      .join("OrderDetails", "Order.order_id", "OrderDetails.order_id")
      .select(
        "Order.order_id",
        "Order.user_id",
        "Order.total_price",
        "Order.order_date",
        "Order.status",
        "OrderDetails.product_name",
        "OrderDetails.product_avatar",
        "OrderDetails.product_brand",
        "OrderDetails.product_ram",
        "OrderDetails.product_rom",
        "OrderDetails.quantity",
        "OrderDetails.product_price"
      );

    if (!orders.length) {
      return "Người dùng này chưa có đơn hàng";
    }

    return orders;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng của người dùng:", error);
    throw error;
  }
}

async function getAllOrders() {
  try {
    const orders = await knex("Order")
      .join("OrderDetails", "Order.order_id", "OrderDetails.order_id")
      .select(
        "Order.order_id",
        "Order.user_id",
        "Order.total_price",
        "Order.order_date",
        "Order.status",
        "OrderDetails.product_name",
        "OrderDetails.product_avatar",
        "OrderDetails.product_brand",
        "OrderDetails.product_ram",
        "OrderDetails.product_rom",
        "OrderDetails.quantity",
        "OrderDetails.product_price"
      );

    return orders;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    throw error;
  }
}

module.exports = {
  getOrderDetails,
  createOrder,
  getOrdersByUserId,
  getAllOrders
};
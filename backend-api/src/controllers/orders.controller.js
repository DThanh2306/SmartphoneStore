const db = require("../database/knex");
const ApiError = require("../api-error");
const JSend = require("../jsend");
const knex = require("../database/knex.js");
const orderService = require("../services/orders.service.js");

const createOrder = async (req, res) => {
  try {
    const userId = req.params.u_acc; // Nhận userId từ body

    if (!userId) {
      return res.status(401).json({ message: "Bạn cần đăng nhập để đặt hàng" });
    }

    const orderId = await orderService.createOrder(userId);
    return res
      .status(201)
      .json({ message: "Đơn hàng đã được tạo thành công", orderId });
  } catch (error) {
    if (error.message.includes("Giỏ hàng trống")) {
      return res.status(400).json({ message: "Giỏ hàng của bạn đang trống" });
    }
    if (error.message.includes("không đủ số lượng")) {
      return res.status(400).json({ message: error.message });
    }

    console.error(error);
    return res.status(500).json({ message: "Đã xảy ra lỗi hệ thống" });
  }
};

async function getAllOrders(req, res, next) {
  try {
    console.log("Fetching all orders..."); // Debug bắt đầu xử lý
    const orders = await orderService.getAllOrders();
    console.log("Orders fetched:", orders); // Debug dữ liệu trả về

    return res.status(200).json({
      status: "success",
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error.message); // Ghi lại lỗi chi tiết
    return next(new ApiError(500, "Failed to fetch orders"));
  }
}

const getOrderByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // Lấy userId từ params
    console.log("Received userId:", userId); // Debug giá trị nhận được

    if (!userId) {
      return res.status(400).json({ message: "Cần phải cung cấp tài khoản người dùng" });
    }

    const orders = await orderService.getOrdersByUserId(userId);
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error in getOrderByUserId:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params; // Lấy order_id từ URL params

    const orderDetails = await orderService.getOrderDetails(id);
    return res.status(200).json(orderDetails);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllOrders,
  createOrder,
  getOrderByUserId,
  getOrderDetails,
};
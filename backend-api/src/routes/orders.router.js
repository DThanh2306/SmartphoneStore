const express = require("express");
const { methodNotAllowed } = require("../controllers/errors.controller");
const router = express.Router();
const orderController = require("../controllers/orders.controller");

module.exports.setup = (app) => {
  app.use("/api/v1", router);

  /**
   * @swagger
   * /api/v1/orders/{u_acc}:
   *   post:
   *     summary: Tạo đơn hàng mới
   *     description: Tạo đơn hàng mới từ giỏ hàng hiện tại của người dùng.
   *     tags:
   *       - Orders
   *     parameters:
   *       - in: path
   *         name: u_acc
   *         required: true
   *         schema:
   *           type: string
   *           example: "john_doe"
   *     responses:
   *       '201':
   *         description: Đơn hàng đã được tạo thành công
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Đơn hàng đã được tạo thành công"
   *                 orderId:
   *                   type: integer
   *       '401':
   *         description: Người dùng chưa đăng nhập
   *       '500':
   *         description: Lỗi hệ thống
   */
  router.post("/orders/:u_acc", orderController.createOrder);

  /**
   * @swagger
   * /api/v1/orders:
   *   get:
   *     summary: Lấy danh sách tất cả đơn hàng trên hệ thống
   *     description: Trả về danh sách tất cả đơn hàng bao gồm thông tin cơ bản như ID đơn hàng, ID người dùng, tổng giá, ngày tạo và trạng thái.
   *     tags:
   *       - Orders
   *     responses:
   *       '200':
   *         description: Danh sách tất cả đơn hàng
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Order'
   *       '500':
   *         description: Lỗi hệ thống
   */
  router.get("/orders", orderController.getAllOrders);

  /**
   * @swagger
   * /api/v1/orders/{userId}:
   *   get:
   *     summary: Lấy danh sách các đơn hàng theo tài khoản người dùng
   *     description: Trả về danh sách đơn hàng của người dùng dựa trên tài khoản người dùng.
   *     tags:
   *       - Orders
   *     parameters:
   *       - in: path
   *         name: userId
   *         schema:
   *           type: string
   *         required: true
   *         description: ID của người dùng
   *     responses:
   *       '200':
   *         description: Danh sách đơn hàng
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Order'
   *       '400':
   *         description: Thiếu tài khoản người dùng
   *       '500':
   *         description: Lỗi hệ thống hoặc không có đơn hàng
   */
  router.get("/orders/:userId", orderController.getOrderByUserId);

  /**
   * @swagger
   * /api/v1/orders/details/{id}:
   *   get:
   *     summary: Lấy chi tiết đơn hàng theo mã đơn hàng
   *     description: Lấy thông tin chi tiết của một đơn hàng bao gồm thông tin của tất cả sản phẩm đã mua, số lượng.
   *     tags:
   *       - Orders
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID của đơn hàng
   *     responses:
   *       '200':
   *         description: Chi tiết đơn hàng
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 order:
   *                   $ref: '#/components/schemas/Order'
   *                 products:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       order_id:
   *                         type: integer
   *                       product_name:
   *                         type: string
   *                       quantity:
   *                         type: integer
   *                       price:
   *                         type: number
   *                       product_image:
   *                         type: string
   *       '404':
   *         description: Không tìm thấy đơn hàng
   *       '500':
   *         description: Lỗi hệ thống
   */
  router.get("/orders/details/:id", orderController.getOrderDetails);

  // Các endpoint không được hỗ trợ
  router.all("/", methodNotAllowed);
  router.all("/:id", methodNotAllowed);
};

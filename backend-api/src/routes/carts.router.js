const express = require("express");
const { methodNotAllowed } = require("../controllers/errors.controller");
const router = express.Router();

const multer = require("multer"); // sử dụng multipart/form-data
const upload = multer(); // cấu hình multer
const cartController = require("../controllers/carts.controller");

module.exports.setup = (app) => {
    app.use("/api/v1/cart", router);

    /**
     * @swagger
     * /api/v1/cart/{u_acc}/{product_id}:
     *   post:
     *     summary: Thêm sản phẩm vào giỏ hàng
     *     tags: [Cart]
     *     parameters:
     *       - in: path
     *         name: product_id
     *         required: true
     *         schema:
     *           type: integer
     *           example: 1
     *       - in: path
     *         name: u_acc
     *         required: true
     *         schema:
     *           type: string
     *           example: thanh
     *     responses:
     *       201:
     *         description: Sản phẩm đã được thêm vào giỏ hàng
     *       400:
     *         description: Thiếu thông tin người dùng hoặc sản phẩm
     *       500:
     *         description: Lỗi server
     */
    router.post("/:u_acc/:product_id", upload.none(), cartController.addToCart);

    /**
     * @swagger
     * /api/v1/cart/{u_acc}:
     *   get:
     *     summary: Get cart items for a specific user
     *     tags: [Cart]
     *     parameters:
     *       - in: path
     *         name: u_acc
     *         schema:
     *           type: string
     *         required: true
     *         description: The user account name
     *     responses:
     *       200:
     *         description: Successful retrieval of cart items
     *       404:
     *         description: Cart is empty or user not found
     *       500:
     *         description: Server error
     */
    router.get("/:u_acc", cartController.getCart);

    /**
     * @swagger
     * /api/v1/cart/{u_acc}/product/{product_id}:
     *   delete:
     *     summary: Xóa sản phẩm khỏi giỏ hàng theo u_acc
     *     tags: [Cart]
     *     parameters:
     *       - in: path
     *         name: u_acc
     *         required: true
     *         schema:
     *           type: string
     *           example: "john_doe"
     *       - in: path
     *         name: product_id
     *         required: true
     *         schema:
     *           type: integer
     *           example: 1
     *     responses:
     *       200:
     *         description: Xóa sản phẩm thành công
     *       404:
     *         description: Sản phẩm không tồn tại trong giỏ hàng
     *       500:
     *         description: Lỗi server
     */
    router.delete("/:u_acc/product/:product_id", cartController.removeProduct);

    /**
     * @swagger
     * /api/v1/cart/{u_acc}/product/{product_id}/decrease:
     *   put:
     *     summary: Giảm số lượng sản phẩm trong giỏ hàng theo u_acc
     *     tags: [Cart]
     *     parameters:
     *       - in: path
     *         name: u_acc
     *         required: true
     *         schema:
     *           type: string
     *           example: "john_doe"
     *       - in: path
     *         name: product_id
     *         required: true
     *         schema:
     *           type: integer
     *           example: 1
     *     responses:
     *       200:
     *         description: Số lượng sản phẩm đã được giảm
     *       404:
     *         description: Sản phẩm không tồn tại trong giỏ hàng
     *       500:
     *         description: Lỗi server
     */
    router.put("/:u_acc/product/:product_id/decrease", cartController.decreaseQuantity);

    router.all("/", methodNotAllowed);
};
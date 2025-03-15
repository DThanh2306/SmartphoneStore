const express = require("express");
const productsController = require("../controllers/products.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");
const avatarUpload = require(`../middlewares/avatar-upload.middleware`);
const router = express.Router();

module.exports.setup = (app) => {
  app.use("/api/v1/products", router);

  /**
   * @swagger
   * /api/v1/products:
   *   get:
   *     summary: Lấy danh sách sản phẩm hoặc tìm kiếm theo tên và các tiêu chí lọc
   *     description: Lấy danh sách sản phẩm theo các tiêu chí lọc như tên, độ phân giải, kích thước màn hình, RAM, ROM, giá, và các từ khóa khác.
   *     parameters:
   *       - in: query
   *         name: name
   *         schema:
   *           type: string
   *         description: Tên của sản phẩm để tìm kiếm
   *       - in: query
   *         name: brand
   *         schema:
   *           type: string
   *         description: Lọc theo hãng sản xuất
   *       - in: query
   *         name: operating_system
   *         schema:
   *           type: string
   *         description: Lọc theo hệ điều hành
   *       - in: query
   *         name: ram
   *         schema:
   *           type: string
   *         description: Lọc theo dung lượng RAM
   *       - in: query
   *         name: rom
   *         schema:
   *           type: string
   *         description: Lọc theo dung lượng ROM
   *       - in: query
   *         name: price_min
   *         schema:
   *           type: number
   *         description: Giá thấp nhất của sản phẩm
   *       - in: query
   *         name: price_max
   *         schema:
   *           type: number
   *         description: Giá cao nhất của sản phẩm
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         default: 1
   *         description: Trang hiện tại (phân trang)
   *       - in: query
   *         name: pageSize
   *         schema:
   *           type: integer
   *         default: 10
   *         description: Số sản phẩm mỗi trang (phân trang)
   *     tags:
   *       - products
   *     responses:
   *       '200':
   *         description: Danh sách sản phẩm hoặc thông tin sản phẩm tìm thấy
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Product'
   *       '400':
   *         $ref: '#/components/responses/400BadRequest'
   *       '404':
   *         $ref: '#/components/responses/404NotFound'
   *       '500':
   *         $ref: '#/components/responses/500InternalServerError'
   */
  router.get("/", productsController.getFilteredProducts);

  /**
   * @swagger
   * /api/v1/products/add:
   *   post:
   *     summary: Thêm sản phẩm
   *     description: Thêm sản phẩm với các thông tin cần thiết
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/Product'
   *             required:
   *               - name
   *               - brand
   *               - refresh_rate
   *               - resolution
   *               - screen_size
   *               - brightness
   *               - operating_system
   *               - ram
   *               - rom
   *               - price
   *               - stock_quantity
   *     tags:
   *       - products
   *     responses:
   *       201:
   *         description: A new product created
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   description: The response status
   *                   enum: [success]
   *                 data:
   *                   type: object
   *                   properties:
   *                     product:
   *                       type: object
   *                       properties:
   *                         Product:
   *                           $ref: '#/components/schemas/Product'
   *       400:
   *         description: Invalid input data
   *       404:
   *         description: Not found
   *       500:
   *         description: Internal Server Error
   *         $ref: '#/components/responses/500InternalServerError'
   */
  router.post("/add", avatarUpload, productsController.addProduct);

  /**
   * @swagger
   * /api/v1/products/delete:
   *   delete:
   *     summary: Xóa sản phẩm
   *     description: Xóa sản phẩm dựa trên tên, RAM và ROM
   *     parameters:
   *       - in: query
   *         name: name
   *         description: Tên sản phẩm cần xóa
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: ram
   *         description: Dung lượng RAM của sản phẩm
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: rom
   *         description: Dung lượng ROM của sản phẩm
   *         required: true
   *         schema:
   *           type: string
   *     tags:
   *       - products
   *     responses:
   *       '200':
   *         description: Sản phẩm đã được xóa thành công
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: "Sản phẩm đã được xóa thành công"
   *       '404':
   *         $ref: '#/components/responses/404NotFound'
   *       '405':
   *         $ref: '#/components/responses/405MethodNotAllowed'
   *       '500':
   *         $ref: '#/components/responses/500InternalServerError'
   */
  router.delete("/delete", productsController.deleteProduct);

  /**
   * @swagger
   * /api/v1/products/update:
   *   patch:
   *     summary: Cập nhật giá hoặc số lượng tồn kho của sản phẩm
   *     description: Cập nhật giá hoặc số lượng tồn kho dựa trên tên, RAM và ROM của sản phẩm. Sử dụng cho quản trị viên hoặc khi khách hàng đặt hàng.
   *     parameters:
   *       - in: query
   *         name: name
   *         description: Tên của sản phẩm
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: ram
   *         description: Dung lượng RAM của sản phẩm
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: rom
   *         description: Dung lượng ROM của sản phẩm
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       description: Giá mới hoặc số lượng tồn kho cần cập nhật
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               price:
   *                 type: number
   *                 example: 2999.99
   *                 description: Giá mới của sản phẩm (nếu có)
   *               stock_quantity:
   *                 type: integer
   *                 example: 15
   *                 description: Số lượng tồn kho mới hoặc số lượng cần điều chỉnh
   *     tags:
   *       - products
   *     responses:
   *       '200':
   *         description: Sản phẩm đã được cập nhật thành công
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: "The product updated"
   *
   *       '404':
   *         $ref: '#/components/responses/404NotFound'
   *       '405':
   *         $ref: '#/components/responses/405MethodNotAllowed'
   *       '500':
   *         $ref: '#/components/responses/500InternalServerError'
   */
  router.patch("/update", productsController.updateProductWithOption);

  /**
   * @swagger
   * /api/v1/products/{id}:
   *   patch:
   *     summary: Cập nhật thông tin sản phẩm
   *     description: Cho phép cập nhật các thông tin của một sản phẩm cụ thể dựa trên ID sản phẩm
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID của sản phẩm cần cập nhật
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Product' # Sử dụng schema Product để mô tả các trường có thể cập nhật
   *     tags:
   *       - products
   *     responses:
   *       '200':
   *         description: Sản phẩm đã được cập nhật thành công
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/responses/200NoData'
   *       '400':
   *         $ref: '#/components/responses/400BadRequest'
   *       '404':
   *         $ref: '#/components/responses/404NotFound'
   *       '500':
   *         $ref: '#/components/responses/500InternalServerError'
   */
  router.patch("/:id", productsController.updateProductById);

  router.all("/", methodNotAllowed);
  router.all("/:id", methodNotAllowed);
};

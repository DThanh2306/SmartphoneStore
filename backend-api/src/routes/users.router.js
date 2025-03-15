const express = require('express');
const {methodNotAllowed } = require('../controllers/errors.controller');
const router = express.Router();

const multer = require('multer'); // sử dụng multipart/form-data
const upload = multer(); // cấu hình multer
const userController = require('../controllers/users.controller');

module.exports.setup = (app) => {
    app.use('/api/v1/user',router);
 /**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               u_acc:
 *                 type: string
 *                 example: "john_doe"
 *               acc_pwd:
 *                 type: string
 *                 example: "password123"
 *               u_name:
 *                 type: string
 *                 example: "John Doe"
 *               u_phone:
 *                 type: string
 *                 example: "0123456789"
 *               u_add_street:
 *                 type: string
 *                 example: "123 Main St"
 *               u_add_district:
 *                 type: string
 *                 example: "District 1"
 *               u_add_city:
 *                 type: string
 *                 example: "Ho Chi Minh City"
 *               u_add_province:
 *                 type: string
 *                 example: "Southern Vietnam"
 *     responses:
 *       201:
 *         description: Người dùng đã đăng ký thành công
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
 *                   example: Người dùng đã đăng ký thành công
 *       400:
 *         description: Thiếu thông tin bắt buộc
 *       500:
 *         description: Lỗi server
 *         $ref: '#/components/responses/500InternalServerError'
 */
  router.post('/register',upload.none(), (req, res, next) => {
  console.log("Request tới /register");
  next();
  }, userController.registerUser);

  /**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               u_acc:
 *                 type: string
 *                 example: "john_doe"
 *               acc_pwd:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
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
 *                   example: Đăng nhập thành công
 *                 user:
 *                   type: object
 *                   properties:
 *                     u_acc:
 *                       type: string
 *                       example: "john_doe"
 *                     u_name:
 *                       type: string
 *                       example: "John Doe"
 *                     u_phone:
 *                       type: string
 *                       example: "0123456789"
 *       400:
 *         description: Thiếu thông tin đăng nhập
 *       401:
 *         description: Tài khoản không tồn tại hoặc mật khẩu không đúng
 *       500:
 *         description: Lỗi server
 */
 router.post('/login', upload.none(), userController.loginUser);

 // Swagger cho API lấy thông tin người dùng
 /**
 * @swagger
 * /api/v1/user/getUser/{u_acc}:
 *   get:
 *     summary: Lấy thông tin hiện tại của người dùng
 *     tags: [User]
 *     parameters:
 *       - name: u_acc
 *         in: path
 *         required: true
 *         description: Tài khoản của người dùng
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 user:
 *                   type: object
 *                   properties:
 *                     u_name:
 *                       type: string
 *                       example: "John Doe"
 *                     u_phone:
 *                       type: string
 *                       example: "0123456789"
 *                     u_add_street:
 *                       type: string
 *                       example: "123 Main St"
 *                     u_add_district:
 *                       type: string
 *                       example: "District 1"
 *                     u_add_city:
 *                       type: string
 *                       example: "Ho Chi Minh City"
 *                     u_add_province:
 *                       type: string
 *                       example: "Southern Vietnam"
 *       401:
 *         description: Unauthorized (không có user_session)
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
  router.get('/getUser/:u_acc', userController.getUserInfo);

  /**
 * @swagger
 * /api/v1/user/filter:
 *   get:
 *     summary: Lọc danh sách người dùng với các tiêu chí
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: u_acc
 *         schema:
 *           type: string
 *         description: Lọc theo tài khoản người dùng (username)
 *       - in: query
 *         name: u_name
 *         schema:
 *           type: string
 *         description: Lọc theo tên người dùng
 *       - in: query
 *         name: u_phone
 *         schema:
 *           type: string
 *         description: Lọc theo số điện thoại
 *       - in: query
 *         name: u_add_street
 *         schema:
 *           type: string
 *         description: Lọc theo địa chỉ đường phố
 *       - in: query
 *         name: u_add_district
 *         schema:
 *           type: string
 *         description: Lọc theo quận/huyện
 *       - in: query
 *         name: u_add_city
 *         schema:
 *           type: string
 *         description: Lọc theo thành phố
 *       - in: query
 *         name: u_add_province
 *         schema:
 *           type: string
 *         description: Lọc theo tỉnh/thành phố
 *       - in: query
 *         name: searchQuery
 *         schema:
 *           type: string
 *         description: Tìm kiếm từ khóa (tìm kiếm tài khoản hoặc tên)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang (mặc định là 1)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng kết quả mỗi trang (mặc định là 10)
 *     responses:
 *       200:
 *         description: Danh sách người dùng đã lọc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 total:
 *                   type: integer
 *                   example: 100
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       u_acc:
 *                         type: string
 *                         example: "john_doe"
 *                       u_name:
 *                         type: string
 *                         example: "John Doe"
 *                       u_phone:
 *                         type: string
 *                         example: "0123456789"
 *                       u_add_street:
 *                         type: string
 *                         example: "123 Main St"
 *                       u_add_district:
 *                         type: string
 *                         example: "District 1"
 *                       u_add_city:
 *                         type: string
 *                         example: "Ho Chi Minh City"
 *                       u_add_province:
 *                         type: string
 *                         example: "Southern Vietnam"
 *                       registrationDate:
 *                         type: string
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.get('/filter', userController.getFilteredUsers);

  /**
 * @swagger
 * /api/v1/user/update/{u_acc}:
 *   patch:
 *     summary: Cập nhật thông tin người dùng (không bao gồm tài khoản và mật khẩu)
 *     tags: [User]
 *     description: Thông tin người dùng sẽ được xác định dựa trên giá trị `user_session` trong cookie.
 *     parameters:
 *       - name: u_acc
 *         in: path
 *         required: true
 *         description: Tài khoản của người dùng cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               u_name:
 *                 type: string
 *                 example: "John Doe"
 *               u_phone:
 *                 type: string
 *                 example: "0123456789"
 *               u_add_street:
 *                 type: string
 *                 example: "123 Main St"
 *               u_add_district:
 *                 type: string
 *                 example: "District 1"
 *               u_add_city:
 *                 type: string
 *                 example: "Ho Chi Minh City"
 *               u_add_province:
 *                 type: string
 *                 example: "Southern Vietnam"
 *     responses:
 *       200:
 *         description: Cập nhật thông tin thành công
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
 *                   example: "Cập nhật thông tin thành công"
 *       400:
 *         description: Thiếu thông tin cần thiết
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
 router.patch('/update/:u_acc', upload.none(), userController.updateUserInfor); // Patch cho phép thay đổi đổi tương khi chỉ gửi 1 phần 
/**
 * @swagger
 * /api/v1/user/{u_acc}:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     tags: [User]
 *     parameters:
 *       - name: u_acc
 *         in: path
 *         required: true
 *         description: Tài khoản của người dùng cần cập nhật
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               u_name:
 *                 type: string
 *                 example: "John Doe"
 *               u_phone:
 *                 type: string
 *                 example: "0123456789"
 *               u_add_street:
 *                 type: string
 *                 example: "123 Main St"
 *               u_add_district:
 *                 type: string
 *                 example: "District 1"
 *               u_add_city:
 *                 type: string
 *                 example: "Ho Chi Minh City"
 *               u_add_province:
 *                 type: string
 *                 example: "Southern Vietnam"
 *     responses:
 *       200:
 *         description: Thông tin người dùng đã được cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Cập nhật thông tin thành công"
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "fail"
 *                 message:
 *                   type: string
 *                   example: "Vui lòng cung cấp u_acc và dữ liệu cần cập nhật"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Lỗi server khi cập nhật thông tin người dùng"
 */

router.put('/:u_acc', upload.none(), userController.updateUserAdmin);
 
 /**
  * @swagger
  * /api/v1/user/{u_acc}/changepassword:
  *   post:
  *     summary: Thay đổi mật khẩu người dùng
  *     tags: [User]
  *     parameters:
  *       - name: u_acc
  *         in: path
  *         required: true
  *         description: Tài khoản của người dùng cần cập nhật
  *         schema:
  *           type: string
  *     requestBody:
  *       required: true
  *       content:
  *         multipart/form-data:
  *           schema:
  *             type: object
  *             properties:
  *               oldPassword:
  *                 type: string
  *                 description: Mật khẩu hiện tại
  *               newPassword:
  *                 type: string
  *                 description: Mật khẩu mới
  *     responses:
  *       200:
  *         description: Mật khẩu đã được thay đổi thành công
  *       400:
  *         description: Thông tin đăng nhập không hợp lệ hoặc mật khẩu không đúng
  *       500:
  *         description: Lỗi server
 */
router.post('/:u_acc/changepassword', upload.none(), userController.changePassword);
/**
 * @swagger
 * /api/v1/user/logout:
 *   post:
 *     summary: Đăng xuất người dùng
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
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
 *                   example: User logged out successfully
 *       500:
 *         description: Lỗi server
 */
router.post('/logout', userController.logoutUser);
  router.all('/', methodNotAllowed);
};
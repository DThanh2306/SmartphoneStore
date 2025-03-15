const ApiError = require("../api-error");
const JSend = require("../jsend");
const knex = require("../database/knex.js");
const userService = require("../services/users.service.js"); // Import service
const bcrypt = require("bcrypt");
const saltRounds = 10;

async function registerUser(req, res) {
    const {
        u_acc,
        acc_pwd,
        u_name,
        u_phone,
        u_add_street,
        u_add_district,
        u_add_city,
        u_add_province,
    } = req.body;

    if (!u_acc || !acc_pwd || !u_name || !u_phone) {
        return res.status(400).json({ status: "fail", message: "Thiếu thông tin bắt buộc" });
    }

    try {
        const hashedPassword = await bcrypt.hash(acc_pwd, saltRounds);
        const userData = {
            u_acc,
            acc_pwd: hashedPassword,
            acc_role: 0,
            u_name,
            u_phone,
            u_add_street,
            u_add_district,
            u_add_city,
            u_add_province,
            RegistrationDate: new Date(),
        };

        const result = await userService.addUser(userData);
        return res.status(201).json({
            status: "success",
            message: result.message,
        });
    } catch (err) {
        console.error("Lỗi khi đăng ký người dùng: ", err);
        return res.status(500).json({
            status: "error",
            message: "Lỗi truy vấn cơ sở dữ liệu",
            error: err.message,
        });
    }
}

async function loginUser(req, res) {
    const { u_acc, acc_pwd } = req.body;

    if (!u_acc || !acc_pwd) {
        return res.status(400).json({ status: "fail", message: "Thiếu thông tin đăng nhập" });
    }

    try {
        const result = await userService.compareUser(u_acc);

        if (result.status === "fail") {
            return res.status(401).json(result);
        }

        const isMatch = await bcrypt.compare(acc_pwd, result.user.acc_pwd);
        if (!isMatch) {
            return res.status(401).json({ status: "fail", message: "Mật khẩu không đúng" });
        }

        return res.status(200).json({
            status: "success",
            message: "Đăng nhập thành công",
            user: result.user,
        });
    } catch (err) {
        console.error("Lỗi khi đăng nhập: ", err);
        return res.status(500).json({
            status: "error",
            message: "Lỗi server",
            error: err.message,
        });
    }
}

async function logoutUser(req, res) {
    try {
        const result = await userService.logout();
        return res.status(200).json(result);
    } catch (err) {
        console.error("Lỗi khi đăng xuất: ", err);
        return res.status(500).json({
            status: "error",
            message: "Lỗi server",
            error: err.message,
        });
    }
}

async function getUserInfo(req, res) {
    try {
        // Lấy u_acc từ params
        const { u_acc } = req.params;

        // Kiểm tra nếu không có u_acc
        if (!u_acc) {
            return res.status(400).json({ status: 'fail', message: 'Username is required' });
        }

        // Gọi service để lấy thông tin người dùng
        const userInfo = await userService.userInfor(u_acc);

        // Nếu không tìm thấy thông tin người dùng
        if (!userInfo || userInfo.status === 'fail') {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        // Trả về thông tin người dùng
        return res.status(200).json({ status: 'success', user: userInfo.user });
    } catch (error) {
        console.error('Error fetching user info:', error.message);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}


async function updateUserInfor(req, res) {
    try {
        const username = req.params.u_acc; // Lấy username từ URL params
        const updateData = req.body; // Dữ liệu từ form-data

        console.log("Received username:", username); // Log để kiểm tra
        console.log("Update data:", updateData); // Log để kiểm tra

        // Kiểm tra thông tin đầu vào
        if (!username || Object.keys(updateData).length === 0) {
            return res.status(400).json({ status: 'fail', message: 'Thiếu thông tin cần thiết' });
        }

        // Loại bỏ `username` khỏi dữ liệu nếu cần

        // Gọi service để cập nhật thông tin
        const result = await userService.updateUserInfor(username, updateData);

        // Xử lý kết quả trả về
        if (result.status === 'fail') {
            return res.status(404).json(result); // Người dùng không tồn tại
        }

        return res.status(200).json(result); // Trả về thành công
    } catch (err) {
        console.error('Lỗi khi cập nhật thông tin người dùng:', err);
        return res.status(500).json({
            status: 'error',
            message: 'Lỗi server',
            error: err.message,
        });
    }
}

async function changePassword(req, res) {
    const username = req.params.u_acc;
    const { oldPassword, newPassword } = req.body;

    if (!username || !oldPassword || !newPassword) {
        return res.status(400).json({ status: "fail", message: "Thiếu thông tin bắt buộc" });
    }

    try {
        const userResult = await userService.compareUser(username);
        const isMatch = await bcrypt.compare(oldPassword, userResult.user.acc_pwd);
        if (!isMatch) {
            return res.status(400).json({ status: "fail", message: "Mật khẩu hiện tại không đúng" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
        const result = await userService.changePassword(username, hashedNewPassword);
        return res.status(200).json(result);
    } catch (err) {
        console.error("Lỗi khi thay đổi mật khẩu: ", err);
        return res.status(500).json({
            status: "error",
            message: "Lỗi server",
            error: err.message,
        });
    }
}

async function getFilteredUsers(req, res) {
    try {
        const { results, total } = await userService.getFilteredUsers(req.query);

        return res.status(200).json({
            status: "success",
            data: results,
            total,
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
        return res.status(500).json({ status: "error", message: "Lỗi hệ thống" });
    }
}

async function updateUserAdmin(req, res) {
    try {
        const { u_acc } = req.params;
        const updateData = req.body;

        if (!u_acc || Object.keys(updateData).length === 0) {
            return res.status(400).json({
                status: "fail",
                message: "Vui lòng cung cấp u_acc và dữ liệu cần cập nhật",
            });
        }

        const result = await userService.updateUserByAdmin(u_acc, updateData);

        if (result.status === "fail") {
            return res.status(404).json(result);
        }

        return res.status(200).json(result);
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Lỗi server khi cập nhật thông tin người dùng",
        });
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUserInfo,
    updateUserInfor,
    updateUserAdmin,
    changePassword,
    logoutUser,
    getFilteredUsers,
};
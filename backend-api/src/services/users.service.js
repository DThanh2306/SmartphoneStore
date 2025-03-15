const knex = require("../database/knex");
const paginator = require("./paginator");

function userRepository() {
  return knex("User");
}

function readUser(payload) {
  return {
    u_acc: payload.u_acc,
    acc_pwd: payload.acc_pwd,
    u_name: payload.u_name,
    u_phone: payload.u_phone,
    u_add_street: payload.u_add_street,
    u_add_district: payload.u_add_district,
    u_add_city: payload.u_add_city,
    u_add_province: payload.u_add_province,
  };
}

async function addUser(userData) {
  try {
    await userRepository().insert(userData);
    return { status: "success", message: "Người dùng đã đăng ký thành công" };
  } catch (err) {
    console.error("Lỗi khi thêm người dùng: ", err);
    throw new Error("Lỗi truy vấn cơ sở dữ liệu");
  }
}

async function compareUser(u_acc) {
  try {
    const user = await userRepository().where({ u_acc }).first();
    if (!user) {
      return { status: "fail", message: "Tài khoản không tồn tại" };
    }
    return { status: "success", user };
  } catch (err) {
    console.error("Lỗi khi lấy thông tin người dùng: ", err);
    throw new Error("Lỗi server");
  }
}

function logout() {
  return {
    status: "success",
    message: "User logged out successfully",
  };
}

async function userInfor(username) {
  try {
    const user = await userRepository().where({ u_acc: username }).first();
    if (!user) {
      return { status: "fail", message: "Không tìm thấy người dùng" };
    }
    return { status: "success", user };
  } catch (err) {
    console.error("Lỗi khi lấy thông tin người dùng: ", err);
    throw new Error("Lỗi Server");
  }
}

async function updateUserInfor(username, updateData) {
  try {
    const { acc_pwd, u_acc: accToRemove, ...allowedUpdates } = updateData;
    const updatedRows = await userRepository()
      .where({ u_acc: username })
      .update(allowedUpdates);

    if (!updatedRows) {
      return { status: "fail", message: "Không tìm thấy người dùng" };
    }
    return { status: "success", message: "Cập nhật thông tin thành công" };
  } catch (err) {
    console.error("Lỗi khi cập nhật thông tin người dùng: ", err);
    throw new Error("Lỗi server");
  }
}

async function updateUserByAdmin(u_acc, updateData) {
  try {
    const { acc_pwd, u_acc: accToRemove, ...allowedUpdates } = updateData;
    const updatedRows = await userRepository()
      .where({ u_acc })
      .update(allowedUpdates);

    if (!updatedRows) {
      return { status: "fail", message: "Không tìm thấy người dùng" };
    }
    return { status: "success", message: "Cập nhật thông tin thành công" };
  } catch (err) {
    console.error("Lỗi khi cập nhật thông tin người dùng: ", err);
    throw new Error("Lỗi server");
  }
}

async function changePassword(username, hashedNewPassword) {
  try {
    const updatedRows = await userRepository()
      .where({ u_acc: username })
      .update({ acc_pwd: hashedNewPassword });

    if (!updatedRows) {
      return { status: "fail", message: "Tài khoản không tồn tại" };
    }
    return {
      status: "success",
      message: "Mật khẩu đã được thay đổi thành công",
    };
  } catch (err) {
    console.error("Lỗi khi thay đổi mật khẩu: ", err);
    throw new Error("Lỗi server");
  }
}

async function getFilteredUsers({
  u_acc,
  u_name,
  u_phone,
  u_add_street,
  u_add_district,
  u_add_city,
  u_add_province,
  searchQuery = "",
  page = 1,
  pageSize = 10,
}) {
  try {
    let query = userRepository().select(
      "u_acc",
      "u_name",
      "u_phone",
      "u_add_street",
      "u_add_district",
      "u_add_city",
      "u_add_province",
      "registrationDate"
    );

    if (u_acc) query.where("u_acc", "like", `%${u_acc}%`);
    if (u_name) query.where("u_name", "like", `%${u_name}%`);
    if (u_phone) query.where("u_phone", "like", `%${u_phone}%`);
    if (u_add_street) query.where("u_add_street", "like", `%${u_add_street}%`);
    if (u_add_district)
      query.where("u_add_district", "like", `%${u_add_district}%`);
    if (u_add_city) query.where("u_add_city", "like", `%${u_add_city}%`);
    if (u_add_province)
      query.where("u_add_province", "like", `%${u_add_province}%`);
    if (searchQuery) {
      query.where((builder) =>
        builder
          .where("u_acc", "like", `%${searchQuery}%`)
          .orWhere("u_name", "like", `%${searchQuery}%`)
      );
    }

    return await paginator(query, page, pageSize);
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Không thể lấy danh sách người dùng");
  }
}

module.exports = {
  addUser,
  readUser,
  compareUser,
  userInfor,
  updateUserInfor,
  updateUserByAdmin,
  changePassword,
  logout,
  getFilteredUsers,
};
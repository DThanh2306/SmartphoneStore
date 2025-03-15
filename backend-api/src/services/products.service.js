const knex = require("../database/knex.js");
const { unlink } = require("node:fs");
const paginator = require('./paginator');

function productRepository() {
  return knex("Products");
}

function readProduct(payload) {
  return {
    name: payload.name,
    avatar: payload.avatar,
    brand: payload.brand,
    refresh_rate: payload.refresh_rate,
    resolution: payload.resolution,
    screen_size: payload.screen_size,
    brightness: payload.brightness,
    operating_system: payload.operating_system,
    additional_features: payload.additional_features,
    ram: payload.ram,
    rom: payload.rom,
    price: payload.price,
    stock_quantity: payload.stock_quantity,
  };
}

async function getFilteredProducts({
  name,
  brand,
  operating_system,
  ram,
  rom,
  price_min,
  price_max,
  features_contains,
  searchQuery = '',
  page = 1,
  pageSize = 10
}) {
  try {
    let query = productRepository().where(1, 1); // Tạo truy vấn cơ bản

    // Nếu có `name`, thêm điều kiện tìm kiếm theo tên
    if (name) query.where("name", "like", `%${name}%`);
    // Thêm các điều kiện lọc nếu có
    if (brand) query.where("brand", brand);
    if (operating_system) query.where("operating_system", operating_system);
    if (ram) query.where("ram", ram);
    if (rom) query.where("rom", rom);
    if (price_min) query.where("price", ">=", price_min);
    if (price_max) query.where("price", "<=", price_max);
    if (searchQuery) query.where("name", "like", `%${searchQuery}%`);

    // Áp dụng phân trang
    return await paginator(query, page, pageSize);
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Không thể lấy danh sách sản phẩm");
  }
}

// Tạo sản phẩm mới
async function addProduct(payload) {
  const product = readProduct(payload); // Đọc thông tin sản phẩm từ payload
  const [id] = await productRepository().insert(product); // Chèn sản phẩm vào DB và lấy ID
  return { id, ...product }; // Trả về đối tượng chứa ID và thông tin sản phẩm
}

async function deleteProduct(name, ram, rom) {
  const deletedProduct = await productRepository()
    .where("name", name)
    .where("ram", ram)
    .where("rom", rom)
    .select("avatar")
    .first();
  if (!deletedProduct) {
    return null;
  }
  await productRepository()
    .where("name", name)
    .where("ram", ram)
    .where("rom", rom)
    .del();
  if (
    deletedProduct.avatar &&
    deletedProduct.avatar.startsWith("/public/uploads")
  ) {
    unlink(`.${deletedProduct.avatar}`, (err) => {});
  }
  return deletedProduct;
}

async function updateProductWithOption(name, ram, rom, { price, stock_quantity }) {
  try {
    const updateData = {};

    if (price !== undefined) updateData.price = price;
    if (stock_quantity !== undefined) updateData.stock_quantity = stock_quantity;

    if (Object.keys(updateData).length === 0) {
      console.warn("No valid data to update");
      return false;
    }

    const result = await productRepository()
      .where('name', name)
      .where('ram', ram)
      .where('rom', rom)
      .update(updateData);

    // Kiểm tra nếu có ít nhất một bản ghi được cập nhật
    return result > 0;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error(`Error updating product: ${error.message}`);
  }
}


async function updateProductById(id, updateData) {
  try {
    const result = await productRepository()
      .where("id", id)
      .update(updateData)
      .returning("*"); // Trả về sản phẩm đã được cập nhật

    return result[0] || null;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Không thể cập nhật sản phẩm");
  }
}

module.exports = {
  productRepository,
  readProduct,
  addProduct,
  deleteProduct,
  updateProductWithOption,
  updateProductById,
  getFilteredProducts
};

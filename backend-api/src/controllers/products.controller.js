const db = require("../database/knex");
const ApiError = require("../api-error");
const JSend = require("../jsend");
const knex = require("../database/knex.js");
const productService = require("../services/products.service.js");

// Hàm thêm sản phẩm
async function addProduct(req, res, next) {
  console.log("Request Body:", req.body); // Log để kiểm tra req.body
  console.log("Request File:", req.file); // Log để kiểm tra req.file

  const {
    name,
    brand,
    refresh_rate,
    resolution,
    screen_size,
    brightness,
    operating_system,
    ram,
    rom,
    price,
    stock_quantity,
  } = req.body;

  if (
    !name ||
    !brand ||
    !refresh_rate ||
    !resolution ||
    !screen_size ||
    !brightness ||
    !operating_system ||
    !ram ||
    !rom ||
    !price ||
    !stock_quantity
  ) {
    return next(new ApiError(400, "All fields are required"));
  }

  try {
    // Kiểm tra sản phẩm đã tồn tại hay chưa bằng cách lọc từ cơ sở dữ liệu
    const { results } = await productService.getFilteredProducts({
      name,
      ram,
      rom,
      pageSize: 1, // Lấy tối đa 1 sản phẩm để kiểm tra
    });

    if (results.length > 0) {
      // Nếu sản phẩm đã tồn tại, cập nhật số lượng tồn kho
      const existingProduct = results[0];
      const newStockQuantity =
        parseInt(existingProduct.stock_quantity) + parseInt(stock_quantity);

      await productService.updateProductWithOption(name, ram, rom, {
        stock_quantity: newStockQuantity,
      });

      return res.status(200).json(
        JSend.success({
          message: "Stock quantity updated successfully",
          product: {
            ...existingProduct,
            stock_quantity: newStockQuantity,
          },
        })
      );
    } else {
      // Thêm sản phẩm mới
      const product = await productService.addProduct({
        ...req.body,
        avatar: req.file ? `public/uploads/${req.file.filename}` : null, // Đặt avatar nếu có file tải lên
      });

      return res
        .status(201)
        .set({
          Location: `${req.baseUrl}/${product.id}`,
        })
        .json(JSend.success({ product }));
    }
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "An error occurred while creating the product"));
  }
}

// Hàm lọc sản phẩm
async function getFilteredProducts(req, res) {
  try {
    const { results, total } = await productService.getFilteredProducts(req.query);

    return res.status(200).json({
      status: "success",
      data: results,
      total,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    return res.status(500).json({ status: "error", message: "Lỗi hệ thống" });
  }
}

// Hàm xóa sản phẩm
async function deleteProduct(req, res, next) {
  try {
    const { name, ram, rom } = req.query;

    if (!name || !ram || !rom) {
      return res.status(400).json({
        status: "fail",
        message: "Need all fields name, ram, rom to delete product",
      });
    }

    const deletedProduct = await productService.deleteProduct(name, ram, rom);

    if (!deletedProduct) {
      return res.status(404).json({
        status: "fail",
        message: `Product with name '${name}', RAM '${ram}', ROM '${rom}' not found`,
      });
    }

    return res.status(200).json({
      status: "success",
      message: `Product with name '${name}', RAM '${ram}', ROM '${rom}' deleted`,
    });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "Server Error when deleting product"));
  }
}

// Hàm cập nhật sản phẩm
async function updateProductWithOption(req, res, next) {
  const { name, ram, rom } = req.query;
  const { price, stock_quantity } = req.body;

  try {
    if (!name || !ram || !rom) {
      return res.status(400).json({
        status: "fail",
        message: "Require product name, ram, and rom",
      });
    }

    const updated = await productService.updateProductWithOption(name, ram, rom, {
      price,
      stock_quantity,
    });

    if (!updated) {
      return next(new ApiError(500, "Cannot update the product"));
    }

    return res.json({
      status: "success",
      message: `Product '${name}', RAM '${ram}', ROM '${rom}' updated successfully`,
    });
  } catch (error) {
    console.error("Update error:", error);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

// Hàm cập nhật thông tin sản phẩm theo ID
async function updateProductById(req, res, next) {
  const { id } = req.params;
  const updateData = req.body;

  try {
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "Không có dữ liệu để cập nhật",
      });
    }

    const updatedProduct = await productService.updateProductById(id, updateData);

    if (!updatedProduct) {
      return res.status(404).json({
        status: "fail",
        message: `Không tìm thấy sản phẩm với ID ${id}`,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Sản phẩm đã được cập nhật thành công",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    return next(new ApiError(500, "Lỗi khi cập nhật sản phẩm"));
  }
}

module.exports = {
  addProduct,
  getFilteredProducts,
  deleteProduct,
  updateProductWithOption,
  updateProductById,
};
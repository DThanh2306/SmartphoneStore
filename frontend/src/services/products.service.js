/**
 * @param {string} url
 * @param {RequestInit} options
 * @returns Promise<Response>
 */
async function efetch(url, options = {}) {
  try {
    const result = await fetch(url, {
      ...options,
      credentials: 'include', // Gửi cookie trong mọi request
  });
      const json = await result.json();
      // Kiểm tra nếu fetch không thành công
      if (!result.ok) {
          throw new Error("Fetch error: " + result.statusText);
      }

      return json;
  } catch (error) {
      console.error("Fetch Error:", error.message);
      throw new Error(error.message);
  }
}

const productUrl = '/api/v1/products';

function ProductsService() {
  // Phương thức lọc sản phẩm
  async function filterProducts({
    search,
    brand,
    refresh_rate,
    resolusion,
    sreen_size,
    brightness,
    stock_quantity,
    operating_system,
    ram,
    rom,
    price_min,
    price_max,
    page,
    pageSize
  } = {}) {
    const params = new URLSearchParams({});
    if (search) params.append('name', search);
    // Thêm từng tiêu chí vào URL nếu có giá trị
    if (stock_quantity) params.append('stock_quantity', stock_quantity);
    if (brightness) params.append('brightness', brightness);
    if (sreen_size) params.append('sreen_size', sreen_size);
    if (resolusion) params.append('resolusion', resolusion);
    if (refresh_rate) params.append('refresh_rate', refresh_rate);
    if (brand) params.append('brand', brand);
    if (operating_system) params.append('operating_system', operating_system);
    if (ram) params.append('ram', ram);
    if (rom) params.append('rom', rom);
    if (price_min) params.append('price_min', price_min);
    if (price_max) params.append('price_max', price_max);
    params.append('page', page);
    params.append('pageSize', pageSize);

    const queryString = params.toString();
    const url = `${productUrl}?${queryString}`;
    return efetch(url, {
      method: 'GET'
    });
  }

  // Phương thức thêm sản phẩm mới
  async function addProduct(product) {
    const url = `${productUrl}/add`;
    return efetch(url, {
      method: 'POST',
      body: product
    });
  }

  // Phương thức xóa sản phẩm
  async function deleteProduct(name, ram, rom) {
    const queryString = new URLSearchParams({ name, ram, rom }).toString();
    const url = `${productUrl}/delete?${queryString}`;
    return efetch(url, {
      method: 'DELETE'
    });
  }

  // Phương thức cập nhật sản phẩm
  async function updateProduct(name, ram, rom, updateData) {
    const queryString = new URLSearchParams({ name, ram, rom }).toString(); // Mã hóa query params
    const url = `${productUrl}/update?${queryString}`; // Kết hợp URL với query string
  
    console.log('Updating product with URL:', url); // Log URL để debug
    console.log('Update data being sent:', updateData); // Log dữ liệu body để kiểm tra
  
    return efetch(url, {
      method: 'PATCH', // Sử dụng phương thức PATCH
      headers: {
        'Content-Type': 'application/json', // Đảm bảo header đúng
      },
      body: JSON.stringify(updateData), // Chuyển dữ liệu body sang dạng JSON
    });
  }

  // Trả về các phương thức để sử dụng
  return {
    filterProducts,
    addProduct,
    deleteProduct,
    updateProduct
  };
}

export default ProductsService();

/**
 * Hàm áp dụng phân trang cho một truy vấn
 * @param {Object} query - Truy vấn Knex
 * @param {number} page - Trang hiện tại (mặc định là 1)
 * @param {number} pageSize - Số lượng bản ghi trên mỗi trang (mặc định là 10)
 * @returns {Object} - Dữ liệu đã phân trang gồm `results`, `total`, `totalPages`, `currentPage`
 */
async function paginator(query, page = 1, pageSize = 10) {
  try {
    // Tính tổng số bản ghi
    const totalResult = await query.clone().count('* as count').first();
    const total = totalResult ? totalResult.count : 0;

    // Tính toán offset
    const offset = (page - 1) * pageSize;

    // Áp dụng giới hạn và offset
    const results = await query.limit(pageSize).offset(offset);

    // Trả về kết quả
    return {
      results,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
    };
  } catch (error) {
    console.error('Pagination error:', error);
    throw new Error('Không thể áp dụng phân trang');
  }
}

module.exports = paginator;
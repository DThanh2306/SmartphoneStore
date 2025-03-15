<script setup>
import { defineProps, defineEmits, reactive, watch } from 'vue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import Paginator from '@/components/Paginator.vue';
import productsService from '@/services/products.service';

const queryClient = useQueryClient();
// Định nghĩa props
const props = defineProps({
  products: { type: Array, default: () => [] }, // Danh sách sản phẩm
  selectedIndex: { type: Number, default: 0 }, // Chỉ số của sản phẩm được chọn
  currentPage: { type: Number, default: 1 }, // Trang hiện tại
  totalPages: { type: Number, default: 1 }, // Tổng số trang
});

// Định nghĩa emit để gửi event ra ngoài
const emit = defineEmits(['pageChange', 'update:selectedIndex']);

// Biến reactive để lưu sản phẩm đang chỉnh sửa
const editableProduct = reactive({});

// Theo dõi selectedIndex và cập nhật editableProduct
watch(
  () => props.selectedIndex,
  (newIndex) => {
    if (newIndex !== -1 && props.products[newIndex]) {
      // Clone dữ liệu sản phẩm được chọn vào editableProduct
      Object.assign(editableProduct, { ...props.products[newIndex] });
    } else {
      // Xóa dữ liệu nếu không có sản phẩm được chọn
      Object.assign(editableProduct, {});
    }
  },
);

const deleteMutation = useMutation({
  mutationFn: ({name, ram, rom}) => 
  productsService.deleteProduct(name, ram, rom),
  onSuccess: () => {
    alert('Đã xóa sản phẩm thành công!');
    queryClient.invalidateQueries(['products']);
    if (props.selectedIndex !== -1) {
      Object.assign(props.products[props.selectedIndex], editableProduct);
    }
  },
  onError: (error) => {
    console.error('Lỗi khi Xóa sản phẩm:', error);
    alert('Xóa sản phẩm thất bại!');
  },
})

//function xóa sản phẩm
function deleteProduct(){
  if (props.selectedIndex === -1) return;

const { name, ram, rom } = editableProduct;
  deleteMutation.mutate({ name, ram, rom });
}
// Mutation để cập nhật sản phẩm
const updateMutation = useMutation({
  mutationFn: ({ name, ram, rom, updateData }) =>
    productsService.updateProduct(name, ram, rom, updateData),
  onSuccess: () => {
    alert('Cập nhật sản phẩm thành công!');
    queryClient.invalidateQueries(['products']);
    // Đồng bộ lại sản phẩm đã chỉnh sửa vào danh sách gốc
    if (props.selectedIndex !== -1) {
      Object.assign(props.products[props.selectedIndex], editableProduct);
    }
  },
  onError: (error) => {
    console.error('Lỗi khi cập nhật sản phẩm:', error);
    alert('Cập nhật sản phẩm thất bại!');
  },
});

// Hàm lưu chỉnh sửa sản phẩm
function saveProduct() {
  if (props.selectedIndex === -1) return;

  const { name, ram, rom, ...updateData } = editableProduct;
  updateMutation.mutate({ name, ram, rom, updateData });
}

// Hàm xử lý khi người dùng thay đổi trang
function handlePageChange(page) {
  emit('pageChange', page);
}

// Hàm định dạng giá tiền
function formatPrice(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}
</script>

<template>
  <div class="container mb-5">
    <div class="row">
      <!-- Danh sách sản phẩm -->
      <div class="col-lg-4 product-list">
        <div class="card shadow-sm product-list-card">
          <div class="card-header text-center text-white">
            <h5 class="mb-0">DANH SÁCH SẢN PHẨM</h5>
          </div>
          <ul class="list-group list-group-flush">
            <li
              v-for="(product, index) in products"
              :key="product.id"
              :class="['list-group-item', index === selectedIndex ? 'active-product' : '']"
              @click="$emit('update:selectedIndex', index)"
            >
              {{ product.name }}
            </li>
          </ul>
          <div class="card-footer text-center">
            <Paginator
              v-if="totalPages > 1"
              :currentPage="currentPage"
              :totalPages="totalPages"
              @pageChange="handlePageChange"
            />
          </div>
        </div>
      </div>

      <!-- Chi tiết sản phẩm -->
      <div class="col-lg-8">
        <div v-if="Object.keys(editableProduct).length" class="card shadow-sm">
          <div class="card-body">
            <div class="">
              <img
                class="product-image mb-3"
                :src="`http://localhost:3000/${editableProduct.avatar}` || 'http://localhost:3000/public/uploads/Default_user.png'"
                alt="Product Image"
              />
              <h5 class="card-title">{{ editableProduct.name }}</h5>
            </div>
            <hr />
            <form class="d-flex flex-column align-items-left" >
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label class="form-label">Hãng: {{ editableProduct.brand }}</label>
                  </div>
                </div>
              </div>
              <div class="row mt-3">
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">RAM: {{ editableProduct.ram }}</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">ROM: {{ editableProduct.rom }}</label>
                  </div>
                </div>
              </div>
              <div class="row mt-3">
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">Giá</label>
                    <input type="text" class="form-control" v-model="editableProduct.price" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">Số lượng</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="editableProduct.stock_quantity"
                    />
                  </div>
                </div>
              </div>
              <div class="d-flex justify-content-around mt-4 w-60">
                <button
                  type="button"
                  class="btn btn-secondary"
                  :disabled="deleteMutation.isLoading"
                  @click="deleteProduct"
                >
                  <span v-if="deleteMutation.isLoading">Đang xóa...</span>
                  <span v-else>Xóa sản phẩm</span>
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  :disabled="updateMutation.isLoading"
                  @click="saveProduct"
                >
                  <span v-if="updateMutation.isLoading">Đang lưu...</span>
                  <span v-else>Lưu chỉnh sửa</span>
                </button>
              </div>
            </form>
          </div>
        </div>
        <div v-else class="text-center mt-5">
          <p class="text-muted">Hãy chọn một sản phẩm để xem thông tin chi tiết.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-header {
  background-color: #232425;
}

.container {
  font-family: 'Arial', sans-serif;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
}
.product-list-card {
  max-height: 600px;
  overflow-y: auto;
}

.product-list-card .active-product {
  background-color: #535a60;
  color: white;
  cursor: pointer;
}

.product-list-card .list-group-item {
  cursor: pointer;
  transition: all 0.3s;
}

.product-list-card .list-group-item:hover {
  background-color: #e9ecef;
}

.product-image {
  width: 120px;
  height: 120px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid black;
}

.form-label {
  font-weight: bold;
}

.form-control {
  border-radius: 5px;
  min-width: 350px;
}

.btn-secondary {
  background-color: #d60404;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
}

.btn-secondary:hover  {
  background-color: #780909;
}
.btn-primary:hover {
  background-color: rgb(5, 106, 5);
}

.btn-primary {
  background-color: rgb(11, 153, 11);
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
}

.btn-primary:disabled {
  background-color: #b8daff;
  cursor: not-allowed;
}

.card {
  border: none;
  border-radius: 10px;
}
</style>

<script setup>
import { ref, reactive } from 'vue';
import productsService from '@/services/products.service'; // Đảm bảo file này chứa API thêm sản phẩm
import { useMutation } from '@tanstack/vue-query';

const form = reactive({
  name: '',
  brand: '',
  refresh_rate: '',
  resolution: '',
  screen_size: '',
  brightness: '',
  operating_system: '',
  ram: '',
  rom: '',
  price: '',
  stock_quantity: '',
  additional_features: '',
  avatar: null // File upload
});
// Xử lý mutation khi thêm sản phẩm
const addProductMutation = useMutation({
  mutationFn: async () => {
    const formData = new FormData();
    for (const key in form) {
      if (form[key]) {
        formData.append(key, form[key]);
      }
    }
    return productsService.addProduct(formData); // Gọi API
  },
  onSuccess: () => {
    alert('Thêm sản phẩm thành công!');
  },
  onError: (error) => {
    alert('Thêm sản phẩm thất bại. Vui lòng thử lại.');
    console.error(error);
  }
});

// Xử lý sự kiện submit form
function submitForm() {
  addProductMutation.mutate();
}

function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    form.avatarFile = file; // Gán file vào form.avatar
  }
}
</script>

<template>
  <div class="container card-0 justify-content-center">
    <div class="card-body">
      <h5 class="text-center">Thêm Sản Phẩm Mới</h5>
      <form @submit.prevent="submitForm">
        <div class="row">
          <div class="col-lg-4">
            <div class="form-group">
              <label for="name">Tên sản phẩm</label>
              <input
                v-model="form.name"
                type="text"
                class="form-control"
                id="name"
                required
              />
            </div>
            <div class="form-group">
              <label for="brand">Hãng sản xuất</label>
              <input
                v-model="form.brand"
                type="text"
                class="form-control"
                id="brand"
                required
              />
            </div>
            <div class="form-group">
              <label for="refresh_rate">Tần số quét</label>
              <input
                v-model="form.refresh_rate"
                type="text"
                class="form-control"
                id="refresh_rate"
              />
            </div>
            <div class="form-group">
              <label for="resolution">Độ phân giải</label>
              <input
                v-model="form.resolution"
                type="text"
                class="form-control"
                id="resolution"
              />
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <label for="screen_size">Kích thước màn hình</label>
              <input
                v-model="form.screen_size"
                type="text"
                class="form-control"
                id="screen_size"
              />
            </div>
            <div class="form-group">
              <label for="brightness">Độ sáng</label>
              <input
                v-model="form.brightness"
                type="text"
                class="form-control"
                id="brightness"
              />
            </div>
            <div class="form-group">
              <label for="operating_system">Hệ điều hành</label>
              <input
                v-model="form.operating_system"
                type="text"
                class="form-control"
                id="operating_system"
              />
            </div>
            <div class="form-group">
              <label for="ram">RAM</label>
              <input
                v-model="form.ram"
                type="text"
                class="form-control"
                id="ram"
              />
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <label for="rom">ROM</label>
              <input
                v-model="form.rom"
                type="text"
                class="form-control"
                id="rom"
              />
            </div>
            <div class="form-group">
              <label for="price">Giá</label>
              <input
                v-model="form.price"
                type="number"
                class="form-control"
                id="price"
                required
              />
            </div>
            <div class="form-group">
              <label for="stock_quantity">Số lượng tồn kho</label>
              <input
                v-model="form.stock_quantity"
                type="number"
                class="form-control"
                id="stock_quantity"
                required
              />
            </div>
            <div class="form-group">
              <label for="additional_features">Thông tin công nghệ khác</label>
              <textarea
                v-model="form.additional_features"
                class="form-control"
                id="additional_features"
                rows="2"
              ></textarea>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="avatar">Ảnh đại diện</label>
          <input
            type="file"
            class="form-control"
            id="avatar"
            @change="handleFileChange"
          />
        </div>
        <div class="text-center mt-3">
          <button
            type="submit"
            class="btn btn-dark"
            :disabled="addProductMutation.isLoading"
          >
            <span v-if="addProductMutation.isLoading">Đang thêm...</span>
            <span v-else>Thêm Sản Phẩm</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.container {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
}

.card {
  border-radius: 10px;
}

.card-header {
  background-color: #232425;
  border-radius: 10px 10px 0 0;
  font-size: 18px;
  font-weight: bold;
}

.form-label {
  font-weight: bold;
  font-size: 14px;
}

.form-control {
  border-radius: 5px;
  font-size: 14px;
}

.btn-dark {
  background-color: #232425;
  border: none;
  font-size: 16px;
  font-weight: bold;
}

.btn-dark:hover {
  background-color: #1a1b1c;
}
</style>

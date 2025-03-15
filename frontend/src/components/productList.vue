<script setup>
import cartsService from '@/services/carts.service';
import { defineProps, ref } from 'vue';
import { useUserStore } from '@/store/UserStore';


const props = defineProps({
  products: { type: Object, default: () => [] },
  openModal: { type: Function, required: true }
});

const userStore = useUserStore(); // Lấy trạng thái người dùng từ Pinia
const username = ref(userStore.user?.username || null);
const alertMessage = ref("");
const showAlertBox = ref(false);

async function addToCart(product_id) {
  try {
    const response = await cartsService.addToCart(username.value,product_id);
    console.log(response);
    showCustomAlert('Thêm sản phẩm vào giỏ hàng thành công!');
  } catch (error) {
    showCustomAlert('Bạn cần đăng nhập để thêm sản phẩm');
    console.log(error);
  }
}

function formatPrice(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

function showCustomAlert(message) {
  alertMessage.value = message;
  showAlertBox.value = true;

  setTimeout(() => {
    showAlertBox.value = false; // Tự động ẩn thông báo sau 2 giây
  }, 2000); // 2000ms = 2 giây
}
</script>

<template>
  <!-- Thông báo tùy chỉnh -->
  <div
    v-if="showAlertBox"
    class="custom-alert"
  >
    <p>{{ alertMessage }}</p>
  </div>

  <div class="row mt-3">
    <div
      class="col-xl-2_4 col-lg-4 col-md-6 col-12 mb-4"
      v-for="(product, index) in products"
      :key="product.id"
    >
      <div class="card text-black rounded-3 h-100 product-card">
        <img
          :src="product.avatar ?`http://localhost:3000/${product.avatar}` : 'http://localhost:3000/public/uploads/Default.png'"
          class="card-img-top rounded-top product-img"
          alt="Product Image"
          @click="props.openModal(product)"
        />
        <div class="card-body d-flex flex-column justify-content-between">
          <div
            class="text-center card-title"
            @click="props.openModal(product)"
          >
            <b class="card-title">{{ product.name }}</b>
          </div>
          <div
            class="text-center product-info"
            @click="props.openModal(product)"
          >
            <p>{{ product.ram }} / {{ product.rom }}</p>
          </div>
          <div
            class="text-center product-price"
            @click="props.openModal(product)"
          >
            <h5>{{ formatPrice(product.price) }}</h5>
          </div>
          <div class="btn-buy mt-2 text-center">
            <button
              v-if="product.stock_quantity > 0"
              type="button"
              class="btn btn-outline-primary btn-rounded buy-button"
              @click="addToCart(product.id)"
            >
              Thêm vào giỏ hàng
            </button>
            <button
              v-else
              type="button"
              class="btn btn-out-of-stock btn-rounded"
              disabled
            >
              Hết hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-alert {
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #232425;
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
  z-index: 9999;
  animation: fade-in-out 2.5s forwards;
}

@keyframes fade-in-out {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.btn-out-of-stock {
  color: #ffffff;
  background-color: #dc3545;
  border-color: #dc3545;
  cursor: not-allowed;
}

.btn-out-of-stock:hover {
  background-color: #c82333;
  border-color: #bd2130;
}

.col-xl-2_4 {
  width: 20%;
}

.product-card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.product-img {
  height: 200px;
  object-fit: cover;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  transition: transform 0.3s ease;
}

.product-card:hover .product-img {
  transform: scale(1.05);
}

.card-title {
  font-size: 1rem;
  color: #333;
  font-weight: 700;
  transition: color 0.3s;
  min-height: 50px;
}

.card-title:hover {
  color: #007bff;
}

.product-info {
  color: #666;
  font-size: 0.85rem;
}

.product-price h5 {
  color: #e33;
  font-weight: 700;
}

.buy-button {
  font-weight: bold;
  color: #007bff;
  border-color: #007bff;
  border-radius: 20px;
  transition: background-color 0.3s, color 0.3s;
}

.buy-button:hover {
  background-color: #007bff;
  color: #ffffff;
}

@media (max-width: 1200px) {
  .col-xl-2_4 {
    width: 25%;
  }
}

@media (max-width: 992px) {
  .col-xl-2_4 {
    width: 33.33%;
  }
}

@media (max-width: 768px) {
  .col-xl-2_4 {
    width: 50%;
  }
}

@media (max-width: 576px) {
  .col-xl-2_4 {
    width: 100%;
  }
}

.row > * {
  padding-right: 7px;
  padding-left: 7px;
  margin-top: var(--bs-gutter-y);
}
</style>
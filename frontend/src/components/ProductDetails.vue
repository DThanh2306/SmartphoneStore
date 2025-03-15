<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import cartsService from '@/services/carts.service';
import { useUserStore } from '@/store/UserStore';

const userStore = useUserStore();
const username = ref(userStore.user?.username || null);
const alertMessage = ref("");
const showAlertBox = ref(false);

async function addToCart(product_id) {
  try {
    const response = await cartsService.addToCart(username.value, product_id);
    console.log(response);
    showCustomAlert('Thêm sản phẩm vào giỏ hàng thành công!');
  } catch (error) {
    showCustomAlert('Bạn cần đăng nhập để thêm sản phẩm');
    console.log(error);
  }
}

function showCustomAlert(message) {
  alertMessage.value = message;
  showAlertBox.value = true;

  setTimeout(() => {
    showAlertBox.value = false; // Tự động ẩn thông báo sau 2 giây
  }, 2000); // 2000ms = 2 giây
}

const props = defineProps({
  show: { type: Boolean, required: true },
  product: { type: Object, required: false, default: () => ({}) }
});

function formatPrice(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

const emit = defineEmits(['close']);

function closeModal() {
  emit('close');
}
</script>
<template>
    <div
    v-if="showAlertBox"
    class="custom-alert"
  >
    <p>{{ alertMessage }}</p>
  </div>
  <div
    class="modal fade"
    :class="{ show: show }"
    tabindex="-1"
    role="dialog"
    style="display: block"
    v-if="show"
    @click.self="closeModal"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header me-4 d-flex justify-content-between">
          <h2 class="modal-title">Thông tin sản phẩm</h2>
          <button
            type="button"
            class="close display-6"
            @click="closeModal"
          >
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <div class="container">
            <div class="row">
            </div>
            <div class="row d-flex justify-content-start">
              <h2 class="text-center mb-4">
              {{ product?.name || '' }}<br />
            </h2>
              <div class="col-xs-3 col-md-3 me-3">
                <img
                  class="img-fluid product-avt"
                  :src=" `http://localhost:3000/${product?.avatar}` || 'http://localhost:3000/public/uploads/Default.png'"
                  alt="Product Image"
                />
                <h2 class="mt-3">{{ formatPrice(product.price) }}</h2>
              </div>
              <div class="col-xs-6 col-md-6 ms-5">
                <ul type="none">
                  <li class="details">
                    <aside><b>Hãng sản xuất:</b></aside>
                    <aside>{{ product?.brand }}</aside>
                  </li>
                  <li class="details">
                    <aside><b>Hệ điều hành:</b></aside>
                    <aside>{{ product?.operating_system }}</aside>
                  </li>
                  <li class="details">
                    <aside><b>RAM:</b></aside>
                    <aside>{{ product?.ram }}</aside>
                  </li>
                  <li class="details">
                    <aside><b>ROM:</b></aside>
                    <aside>{{ product?.rom }}</aside>
                  </li>
                  <li class="details">
                    <aside><b>Kích cỡ màn hình:</b></aside>
                    <aside>{{ product?.screen_size }}</aside>
                  </li>
                  <li class="details">
                    <aside><b>Độ phân giải:</b></aside>
                    <aside>{{ product?.resolution }}</aside>
                  </li>
                  <li class="details">
                    <aside><b>Độ sáng:</b></aside>
                    <aside>{{ product?.brightness }}</aside>
                  </li>
                  <li class="details">
                    <aside><b>Tần số quét:</b></aside>
                    <aside>{{ product?.refresh_rate }}</aside>
                  </li>
                  <li class="details">
                    <aside><b>Tính năng khác:</b></aside>
                    <aside>{{ product?.additional_features }}</aside>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal footer -->
        <div class="modal-footer">
          <button 
            v-if="product.stock_quantity > 0" 
            type="button"
              class="btn btn-outline-primary btn-rounded buy-button" 
              @click="addToCart(product.id)">
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
  cursor: not-allowed; /* Thêm cảm giác không thể nhấn */
}

.btn-out-of-stock:hover {
  background-color: #c82333;
  border-color: #bd2130;
}
.modal-dialog {
  max-width: 900px;
}

.product-avt {
  min-height: 270px;
  min-width: 300px;
}

.details {
  border-bottom: 0.5px solid black;
  padding: 10px;
  width: 500px;
  margin: auto;
}

li aside:first-child {
  float: left;
  width: 150px;
  margin-right: 100px;
}

.close {
  border: none;
  background-color: white;
  font-weight: 700;
}

.close:hover {
  color: rgb(108, 108, 108);
}

.modal.fade {
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
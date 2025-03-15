<script setup>
import { defineProps, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { useUserStore } from '@/store/UserStore';
import cartsService from '@/services/carts.service';
import ordersService from '@/services/orders.service';

const props = defineProps({
  carts: { type: Array, default: () => [] }
});

const router = useRouter();
const queryClient = useQueryClient();
const userStore = useUserStore(); // Lấy trạng thái người dùng từ Pinia
const username = ref(userStore.user?.username || null);


// Tính tổng giá trị của giỏ hàng
const totalPrice = computed(() => {
  return props.carts.reduce((sum, item) => {
    return sum + item.price * item.cart_quantity;
  }, 0);
});

// Mutation để tạo đơn hàng
const createOrderMutation = useMutation({
  mutationFn: () => ordersService.createOrder(username.value),
  onSuccess: () => {
    queryClient.invalidateQueries(['cartItems']);
    alert('Bạn đã đặt hàng thành công!');
  },
  onError: (error) => {
    if (error.status === 400) {
      alert(error.message); // Hiển thị lỗi từ server
    } else {
      alert('Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.');
    }
    console.error('Error:', error);
  }
});

// Mutation để tăng số lượng sản phẩm
const increaseMutation = useMutation({
  mutationFn: (id) => cartsService.addToCart(username.value, id),
  onSuccess: () => {
    queryClient.invalidateQueries(['cartItems']);
  }
});

// Mutation để giảm số lượng sản phẩm
const decreaseMutation = useMutation({
  mutationFn: (id) => cartsService.decreaseQuantity(username.value, id),
  onSuccess: () => {
    queryClient.invalidateQueries(['cartItems']);
  }
});

// Mutation để xóa sản phẩm khỏi giỏ hàng
const removeMutation = useMutation({
  mutationFn: (id) => cartsService.removeProductFromCart(username.value, id),
  onSuccess: () => {
    queryClient.invalidateQueries(['cartItems']);
  }
});

// Hàm tăng số lượng sản phẩm
function increaseQuantity(item, id) {
  if (item.cart_quantity < 99) {
    item.cart_quantity++;
    increaseMutation.mutate(id);
  }
}

// Hàm giảm số lượng sản phẩm
function decreaseQuantity(item, id) {
  if (item.cart_quantity > 1) {
    item.cart_quantity--;
    decreaseMutation.mutate(id);
  }
}

// Hàm xóa sản phẩm
function remove(id) {
  removeMutation.mutate(id);
}

// Hàm tạo đơn hàng
function createOrder() {
  createOrderMutation.mutate();
}

// Định dạng giá tiền
function formatPrice(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}
</script>

<template>
  <div class="container-fluid cart-container">
    <h1 class="text-center mb-3">GIỎ HÀNG</h1>
    <div class="row">
      <!-- Main Cart Section -->
      <aside class="col-lg-9">
        <div class="card cart-card">
          <div class="table-responsive">
            <ul class="cart-list">
              <li class="cart-header text-muted small text-uppercase">
                <span class="cart-column product-column">Tên sản phẩm</span>
                <span class="cart-column">Số lượng</span>
                <span class="cart-column">Giá</span>
                <span class="cart-column remove-column"></span>
              </li>
              <li
                class="cart-item"
                v-for="item in props.carts"
                :key="item.cart_id"
              >
                <span class="cart-column product-column">
                  <figure class="cart-item d-flex align-items-center justify-content-start">
                    <div class="cart-item-image">
                      <img
                        :src=" `http://localhost:3000/${item.product_image}` || 'http://localhost:3000/public/uploads/Default.png'"
                        class="img-cart"
                        alt="Product Image"
                      />
                    </div>
                    <figcaption class="cart-item-info">
                      <a href="#" class="cart-item-title text-dark">{{
                        item.product_name
                      }}</a>
                      <p class="text-muted small">
                        RAM: {{ item.ram }} / ROM: {{ item.rom }}
                      </p>
                    </figcaption>
                  </figure>
                </span>
                <span class="cart-column">
                  <div class="quantity-control d-flex justify-content-center">
                    <button
                      class="btn btn-outline-secondary btn-sm"
                      @click="decreaseQuantity(item, item.product_id)"
                    >
                      -
                    </button>
                    <span class="quantity ms-2 me-2">{{
                      item.cart_quantity
                    }}</span>
                    <button
                      class="btn btn-outline-secondary btn-sm"
                      @click="increaseQuantity(item, item.product_id)"
                    >
                      +
                    </button>
                  </div>
                </span>
                <span class="cart-column">
                  <div class="cart-price-wrap">
                    <var class="cart-price">{{ formatPrice(item.price * item.cart_quantity) }}</var>
                    <br>
                    <small class="text-muted"> {{ formatPrice(item.price) }}/1 sản phẩm</small>
                  </div>
                </span>
                <span class="cart-column remove-column">
                  <a
                    href="#"
                    class="btn btn-light btn-remove"
                    @click.prevent="remove(item.product_id)"
                  >
                    Remove
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      <!-- Sidebar Section for Summary -->
      <aside class="col-lg-3">
        <div class="card cart-summary-card">
          <div class="card-body">
            <dl class="dlist-align cart-summary-details">
              <dt>Tổng giá:</dt>
              <dd class="text-right ml-3">{{ formatPrice(totalPrice) }}</dd>
            </dl>
            <hr />
            <a
              href="#"
              class="btn btn-primary btn-square cart-checkout-btn"
              @click.prevent="createOrder()"
            >
              ĐẶT HÀNG
            </a>
            <router-link :to="{ name: 'Homepage' }">
              <a class="btn btn-success btn-square cart-continue-btn mt-2"> Tiếp tục mua sắm </a>
            </router-link>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans&display=swap');

/* Main Cart Container Styling */
.cart-container {
  font-family: 'Open Sans', sans-serif;
  padding: 20px;
  background-color: #f8f9fa;
}

/* Cart Card */
.cart-card {
  padding: 1.4rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}

/* Cart List Styling */
.cart-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cart-header,
.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #ddd;
}

.cart-header {
  font-weight: bold;
  color: #6c757d;
  text-transform: uppercase;
  text-align: center;
}

.cart-item:last-child {
  border-bottom: none;
}

/* Column Styling */
.cart-column {
  flex: 1;
  text-align: center;
}

/* Adjust Product and Remove Button Columns */
.product-column {
  flex: 2; /* Mở rộng cột "Tên sản phẩm" */
}

.remove-column {
  flex: 0.3; /* Thu nhỏ cột "Remove button" */
}

/* Hover effect for cart items */
.cart-item:hover {
  background-color: #f1f1f1;
  transition: background-color 0.3s ease;
}

/* Image Styling */
.cart-item-image img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.cart-item-image img:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Cart Item Info */
.cart-item-info {
  padding: 10px;
}

.cart-item-title {
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 5px;
  text-decoration: none;
}

.cart-item-title:hover {
  color: #007bff;
}

.cart-item-info p {
  margin: 0;
  font-size: 14px;
  color: #6c757d;
}

/* Quantity Controls */
.quantity-control {
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-control button {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 1px solid #ccc;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
}

.quantity-control button:hover {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}

.quantity {
  font-size: 16px;
  font-weight: bold;
  margin: 0 10px;
}

/* Price Styling */
.cart-price-wrap {
  text-align: center;
}

.cart-price {
  font-weight: bold;
  font-size: 18px;
  color: #333;
}

.cart-price small {
  display: block;
  font-size: 13px;
  color: #6c757d;
}

/* Remove Button */
.btn-remove {
  color: #ffffff;
  background-color: #f44336;
  border: none;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 4px;
  text-transform: uppercase;
}

.btn-remove:hover {
  background-color: #e53935;
}

/* Cart Summary Card */
.cart-summary-card {
  margin-top: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}

.cart-summary-details {
  margin-bottom: 20px;
}

.cart-summary-details dt {
  font-weight: 600;
  color: #333;
}

.cart-summary-details dd {
  font-weight: bold;
  font-size: 20px;
  color: #ff5722; /* Thay đổi màu nổi bật hơn */
  margin: 0;
}

/* Buttons */
.cart-checkout-btn,
.cart-continue-btn {
  width: 100%;
  font-size: 16px;
  padding: 12px;
  text-transform: uppercase;
  border-radius: 4px;
}

.cart-checkout-btn {
  background-color: #007bff;
  border: none;
  color: #fff;
}

.cart-checkout-btn:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.cart-continue-btn {
  background-color: #28a745;
  border: none;
  color: #fff;
  margin-top: 10px;
}

.cart-continue-btn:hover {
  background-color: #218838;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Responsive Design */
.cart-header,
.cart-item {
  flex-wrap: wrap;
}

.cart-column {
  flex: 100%;
  text-align: left;
  margin-bottom: 10px;
}

@media (min-width: 576px) {
  .cart-column {
    flex: 1;
    text-align: center;
  }
}
</style>

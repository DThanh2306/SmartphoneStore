<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  orders: { type: Array, default: () => [] },
});

function formatPrice(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}
</script>

<template>
  <div class="container mb-5">
    <div class="d-flex justify-content-center row">
      <div class="order-title text-center mb-4 mt-4">
        <h1>DANH SÁCH ĐƠN HÀNG</h1>
      </div>
      <div class="col-md-10 list">
        <!-- Vòng lặp hiển thị từng đơn hàng -->
        <div
          v-for="(order, index) in orders"
          :key="order.order_id"
          class="order-card bg-white shadow-sm rounded p-3 mb-4"
        >
          <p class="order-id">
            <b>MÃ ĐƠN HÀNG:</b> {{ order.order_id }}
          </p>
          <p><b>NGÀY ĐẶT:</b> {{ new Date(order.order_date).toLocaleDateString() }}</p>
          <p>
            <b>TRẠNG THÁI:</b>
            <span :class="['status', order.status.toLowerCase()]">
              {{ order.status }}
            </span>
          </p>
          <p><b>TỔNG GIÁ:</b> {{ formatPrice(order.total_price) }}</p>
          <p class="mt-3"><b>CHI TIẾT ĐƠN HÀNG</b></p>

          <!-- Hiển thị từng sản phẩm trong đơn hàng -->
          <div
            v-for="(item, itemIndex) in order.items || []"
            :key="itemIndex"
            class="item-card row align-items-center p-2 bg-light border rounded mt-2"
          >
            <div class="col-md-3">
              <img
                class="img-fluid img-responsive rounded product-image"
                :src="item.product_avatar ? `http://localhost:3000/${item.product_avatar}` : 'http://localhost:3000/public/uploads/Default.png'"
                alt="Product Image"
              />
            </div>
            <div class="col-md-6">
              <h5 class="item-title">{{ item.product_name }}</h5>
              <div class="spec-1">
                <span>{{ item.product_ram || 'N/A' }} / {{ item.product_rom || 'N/A' }}</span>
              </div>
              <p>Số lượng: {{ item.quantity || 'N/A' }}</p>
            </div>
            <div class="col-md-3 text-end">
              <h4 class="item-price">{{ formatPrice(item.product_price || 0) }}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans&display=swap');

/* Body Styling */
body {
  background: #f9f9f9;
  font-family: 'Open Sans', sans-serif;
}

.container {
  background-color: #f8f9fa;
}

/* Order Title */
.order-title h1 {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.list {
  max-height: 500px;
  overflow: auto;
}

/* Order Card */
.order-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  padding: 20px;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.order-card:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Order Details */
.order-id {
  font-size: 1.1rem;
  font-weight: 500;
  color: #007bff;
}

.status {
  text-transform: capitalize;
  font-weight: 600;
}

.status.completed {
  color: #28a745; /* Green for completed orders */
}

.status.pending {
  color: #ffc107; /* Yellow for pending orders */
}

.status.cancelled {
  color: #f44336; /* Red for cancelled orders */
}

/* Item Card */
.item-card {
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-top: 10px;
  transition: box-shadow 0.2s ease;
}

.item-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Product Image */
.product-image {
  width: 100%;
  max-height: 120px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ddd;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-image:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Item Title */
.item-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.item-title:hover {
  color: #007bff;
  cursor: pointer;
}

/* Item Details */
.spec-1 {
  color: #6c757d;
  font-size: 0.9rem;
}

.item-price {
  font-size: 1.25rem;
  font-weight: bold;
  color: #343a40;
}

/* General Styling */
.shadow-sm {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Responsive Design */
@media (max-width: 576px) {
  .order-card {
    padding: 15px;
  }

  .item-card {
    flex-wrap: wrap;
    text-align: center;
  }

  .product-image {
    margin-bottom: 10px;
  }

  .item-price {
    margin-top: 10px;
  }
}
</style>
<script setup>
import { ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import ordersService from '../services/orders.service';
import OrderList from '@/components/OrderList.vue'; // Component hiển thị danh sách đơn hàng

const error = ref(null);

function groupOrdersByOrderId(orderList) {
  // Đảm bảo orderList luôn là mảng
  if (!Array.isArray(orderList)) {
    console.error('Expected an array but got:', orderList); // Debug lỗi
    return [];
  }

  const groupedOrders = {};
  orderList.forEach((order) => {
    if (!groupedOrders[order.order_id]) {
      groupedOrders[order.order_id] = { ...order, items: [] };
    }
    groupedOrders[order.order_id].items.push(order);
  });
  return Object.values(groupedOrders);
}

// Sử dụng `useQuery` để lấy danh sách tất cả các đơn hàng
const {
  data: orders,
  error: queryError,
  refetch
} = useQuery({
  queryKey: ['allOrders'],
  queryFn: async () => {
    const response = await ordersService.getAllOrders();

    // Đảm bảo response luôn là một mảng
    if (!Array.isArray(response.data)) {
      console.error('Expected an array from API but got:', response);
      throw new Error('Dữ liệu trả về không hợp lệ');
    }

    return groupOrdersByOrderId(response.data);
  },
  retry: false, // Không tự động retry nếu có lỗi
  onError: (err) => {
    error.value = err.message || 'Không thể tải danh sách đơn hàng.';
  }
});
</script>

<template>
  <div>
    <!-- Hiển thị thông báo lỗi nếu có -->
    <h1
      class="text-center mt-5"
      v-if="error || queryError"
    >
      {{ error || queryError.message }}
    </h1>

    <!-- Nếu không có lỗi, hiển thị danh sách đơn hàng -->
    <OrderList
      v-else
      :orders="orders"
    />
  </div>
</template>

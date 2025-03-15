<script setup>
import { ref, watch } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { useUserStore } from '@/store/UserStore';
import ordersService from '../services/orders.service';
import OrderList from '@/components/OrderList.vue';

const userStore = useUserStore();
const username = ref(userStore.user?.username || null);
const error = ref(null);

// Hàm nhóm các đơn hàng theo `order_id`
function groupOrdersByOrderId(orderList) {
  if (!Array.isArray(orderList)) {
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

const {
  data: orders,
  error: queryError,
  refetch
} = useQuery({
  queryKey: ['userOrders', username.value],
  queryFn: async () => {
    if (!username.value) {
      throw new Error('Bạn cần đăng nhập để xem đơn hàng');
    }
    const response = await ordersService.getOrdersByUserId(username.value);
    return groupOrdersByOrderId(response || []); // Đảm bảo trả về mảng, kể cả khi response là null hoặc undefined
  },
  enabled: !!username.value,
  retry: false,
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

    <!-- Nếu không có lỗi và danh sách đơn hàng rỗng -->
    <h1
      class="text-center mt-5" style="min-height: 480px;"
      v-else-if="orders && orders.length === 0"
    >
      Không có đơn hàng nào!
    </h1>

    <!-- Nếu có đơn hàng, hiển thị danh sách đơn hàng -->
    <OrderList
      v-else
      :orders="orders"
    />
  </div>
</template>
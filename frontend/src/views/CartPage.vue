<script setup>
import { ref, watch } from 'vue';
import cartService from '@/services/carts.service';
import { useUserStore } from '@/store/UserStore'; // Store chứa thông tin người dùng
import CartList from '@/components/CartList.vue';
import { useQuery } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
const userId = ref(userStore.user?.username || null); // Sử dụng `user.id` từ store

const {
  data: carts,
  isLoading,
  error,
  refetch
} = useQuery({
  queryKey: ['cartItems', userId],
  queryFn: async () => {
    if (!userId.value) {
      throw new Error('Bạn cần đăng nhập để xem giỏ hàng');
    }
    const response = await cartService.getCartByUser(userId.value);
    return response.data || [];
  },
  enabled: !!userId.value, // Chỉ fetch khi userId tồn tại
  onError: (err) => {
    console.error('Lỗi khi fetch giỏ hàng:', err.message);
  }
});

// Theo dõi sự thay đổi của trạng thái `user` và refetch dữ liệu
watch(
  () => userStore.user,
  (newUser) => {
    userId.value = newUser?.id || null; // Lấy `id` từ `user` mới
    if (newUser?.id) {
      refetch();
    }
  }
);
</script>

<template>
  <!-- Kiểm tra nếu người dùng chưa đăng nhập -->
  <div
    class="d-flex justify-content-center flex-column align-items-center"
    v-if="!userId"
  >
    <h1 class="text-center mt-5 mb-5">Vui lòng đăng nhập để xem thông tin giỏ hàng</h1>
    <router-link :to="{ name: 'Auth' }">
      <button class="btn btn-primary">Đăng nhập</button>
    </router-link>
  </div>

  <!-- Nội dung giỏ hàng -->
  <div v-else>
    <!-- Hiển thị thông báo lỗi nếu có -->
    <h1 v-if="error">{{ error.message }}</h1>

    <!-- Hiển thị loading khi đang fetch dữ liệu -->
    <h2 v-if="isLoading">Đang tải giỏ hàng...</h2>

    <!-- Kiểm tra nếu giỏ hàng trống -->
    <div
      v-else-if="carts && carts.length === 0"
      class="d-flex flex-column align-items-center justify-content-center my-5"
    >
      <h2 class="text-center">Opps, Giỏ hàng của bạn đang trống!</h2>
      <img
        src="https://images.unsplash.com/photo-1585151245608-e184ba4aa1a5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Empty cart"
        class="mb-3"
        style="width: 500px; height: 300px"
      />
      <router-link :to="{ name: 'Homepage' }">
        <a class="btn btn-success btn-square cart-continue-btn mt-2">Quay lại mua sắm</a>
      </router-link>
    </div>

    <!-- Hiển thị danh sách giỏ hàng -->
    <CartList
      v-else
      :carts="carts"
      @update:carts="carts = $event"
    />
  </div>
</template>

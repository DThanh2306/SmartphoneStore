<script setup>
import EditProfileForm from '@/components/EditProfileForm.vue';
import usersService from '@/services/users.service';
import { useUserStore } from '@/store/UserStore';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';

const userStore = useUserStore();
const router = useRouter();

// Lấy username từ UserStore
const username = ref(userStore.user?.username || null);

const {
  data: userData,
  error,
  isLoading,
} = useQuery({
  queryKey: ['userProfile', username],
  queryFn: async () => {
    if (!username.value) {
      router.push('/'); // Điều hướng về trang chủ nếu không có username
      return null;
    }
    const response = await usersService.fetchUser(username.value);
    return response;
  },
  onError: (err) => {
    console.error('Lỗi khi lấy thông tin người dùng:', err.message);
    router.push('/'); // Điều hướng về trang chủ nếu có lỗi
  },
  enabled: !!username.value, // Chỉ fetch nếu có username
});
</script>

<template>
  <!-- Hiển thị loading khi đang fetch dữ liệu -->
  <div v-if="isLoading">Đang tải thông tin người dùng...</div>

  <!-- Hiển thị lỗi nếu có -->
  <div v-if="error">Lỗi khi lấy thông tin người dùng</div>

  <!-- Hiển thị thông tin người dùng nếu dữ liệu đã được load -->
  <EditProfileForm v-if="userData" :user="userData" />
</template>
<script setup>
import Profile from '@/components/Profile.vue';
import usersService from '@/services/users.service';
import { useUserStore } from '@/store/UserStore';
import { useRouter } from 'vue-router';
import { ref, watch } from 'vue';
import { useQuery } from '@tanstack/vue-query';

const userStore = useUserStore();
const router = useRouter();

// Lấy username từ userStore
const username = ref(userStore.user?.username || null);

// Log trạng thái của `username` để kiểm tra
console.log('Current username from userStore:', username.value);

// Theo dõi sự thay đổi của `userStore.user`
watch(
  () => userStore.user,
  (newUser) => {
    username.value = newUser?.username || null;
    console.log('Updated username from userStore:', username.value);
  },
  { immediate: true } // Theo dõi ngay từ đầu
);

const {
  data: userData,
  error,
  isLoading,
} = useQuery({
  queryKey: ['userProfile', username],
  queryFn: async () => {
    if (!username.value) {
      console.warn('No username found, redirecting to home.');
      router.push('/'); // Điều hướng về trang chủ nếu không có username
      return null;
    }
    console.log('Fetching user data for username:', username.value);
    const response = await usersService.fetchUser(username.value);
    console.log('Fetched user data:', response);
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
  <Profile v-if="userData" :user="userData" />
</template>
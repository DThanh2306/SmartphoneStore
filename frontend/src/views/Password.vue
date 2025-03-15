<script setup>
import Password from '@/components/Password.vue';
import { useUserStore } from '@/store/UserStore';
import { useRouter } from 'vue-router';
import { onMounted} from 'vue';

const userStore = useUserStore();
const router = useRouter();

onMounted( async() => {
  if (!userStore.userSession) {
    router.push('/'); // Điều hướng về trang chủ nếu không có session
  }
});
</script>
<template>
    <Password />
</template>
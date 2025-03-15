<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from '@/components/Header.vue';
import Footer from './components/Footer.vue';

const route = useRoute(); // Lấy thông tin route hiện tại
const showHeaderFooter = computed(() => route.meta.showHeaderFooter !== false);

import { useUserStore } from '@/store/UserStore';

const userStore = useUserStore();

// Khôi phục trạng thái từ localStorage khi ứng dụng khởi động
if (localStorage.getItem('user')) {
  const user = JSON.parse(localStorage.getItem('user'));
  userStore.setUser(user); // Cập nhật Pinia store
}

</script>
<template>
    <Header/>
  
    <div class="container-fluid mt-3">
      <router-view />
    </div>
    <Footer/>
  </template>
  
  <style>
  .container-fluid {
    max-width: 96%;
  }
  .page {
    max-width: 400px;
    margin: auto;
  }
  </style>
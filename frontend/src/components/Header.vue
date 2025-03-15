<script setup>
import { ref } from 'vue';
import { useSearchStore } from '@/store/SearchStore';
import usersService from '@/services/users.service';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/store/UserStore';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const searchStore = useSearchStore();
const searchQuery = ref('');

// Hàm logout
async function handleLogout() {
  try {
    await usersService.logout();
    userStore.clearUser();
    router.push('/Auth'); // Điều hướng đến trang đăng nhập
  } catch (error) {
    console.error('Logout failed:', error.message);
  }
}
// Hàm phát sự kiện tìm kiếm
function emitSearch() {
  searchStore.setQuery(searchQuery.value); // Cập nhật `query` trong store
  console.log('Search Query:', searchQuery.value); // Kiểm tra giá trị searchQuery
}
</script>

<template>
  <nav class="header_navbar">
    <div class="top navbar navbar-expand-lg d-flex justify-content-between">
      <div class="ms-3">
        <router-link :to="{ name: 'Homepage' }">
          <img class="logo" src="/logo.png" alt="">
        </router-link>
      </div>
      <div class="me-3 d-flex justify-content-end align-items-center">
        <div class="search-form">
          <form class="d-flex align-item-center me-3" role="search" @submit.prevent="emitSearch">
            <input
              class="form-input"
              type="search"
              v-model="searchQuery"
              placeholder="Nhập tên sản phẩm để tìm kiếm"
              aria-label="Search"
            />
            <button class="btn btn-input" type="submit">
              <i class="fas fa-search"></i> Tìm
            </button>
          </form>
        </div>
        <div v-if="userStore.user && userStore.user.role == 1 ">
          <router-link :to="{ name: 'Admin' }">
            <span class="icon d-flex flex-row align-items-center">
              <i class="fas fa-database me-2 fs-4"></i>Quản lý
            </span>
          </router-link>
        </div>
        <div v-else>
          <span class=" d-flex flex-row align-items-center">
              <i class=" me-2 fs-4" style="width:90px;"></i>
            </span>
        </div>
        <router-link :to="{ name: 'Orders' }">
          <span class="icon d-flex flex-row align-items-center">
            <i class="fas fa-file-lines me-2 fs-4"></i>Đơn hàng
          </span>
        </router-link>
        <router-link :to="{ name: 'Cart' }">
          <span class="icon d-flex flex-row align-items-center">
            <i class="fas fa-shopping-cart me-2 fs-4"></i>Giỏ hàng
          </span>
        </router-link>
        <div>
          <!-- Kiểm tra nếu chưa đăng nhập -->
          <div v-if="!userStore.user">
            <router-link :to="{ name: 'Auth' }">
              <span class="icon d-flex flex-row align-items-center">
                <i class="fas fa-user me-2 fs-4"></i>Đăng nhập
              </span>
            </router-link>
          </div>
          <!-- Dropdown cho người dùng đã đăng nhập -->
          <div v-else class="dropdown">
            <span class="icon d-flex flex-row align-items-center dropdown-toggle" style="cursor: pointer">
              <i class="fas fa-user me-2 fs-4"></i> {{ userStore.user.username }}
            </span>
            <ul class="dropdown-menu">
              <li>
                <router-link class="dropdown-item" :to="{ name: 'AccountInfo' }">
                  Thông tin tài khoản
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" :to="{ name: 'ChangePassword' }">
                  Đổi mật khẩu
                </router-link>
              </li>
              <li>
                <button class="dropdown-item" @click="handleLogout()">
                  Đăng xuất
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>


<style scoped>
.logo {
  width: 200px;
  height: 60px;
}

.header_navbar {
  background: linear-gradient(#32373c, #333333);
}

.icon {
  margin-left: 24px;
  color: white;
  border-radius: 20px;
  height: 40px;
  padding: 10px;
}

.icon:hover {
  background-color: rgb(67, 74, 81);
  cursor: pointer;
}

.form-input {
  background-color: rgb(255, 255, 255);
  width: 400px;
  height: 40px;
  padding: 10px;
  color: black;
  border-radius:  20px 0px 0px 20px;
  border: 1px solid #ccc;
  position: relative; /* Đảm bảo input được căn chỉnh đúng */
}

.btn-input {
  top: 50%; /* Căn giữa theo chiều dọc */
  right: 10px; /* Vị trí cách mép phải */
  height: 40px;
  width: 90px;
  background-color: #3045cf;
  color: white;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0px 20px 20px 0px;
}
.btn-input:hover {
  background-color: #434fb4;
}

.dropdown-menu {
  display: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  position: absolute;
}

.dropdown:hover .dropdown-menu,
.dropdown-menu.show {
  display: block;
  opacity: 1;
}

a.router-link-active,
a.router-link-exact-active,
a {
  text-decoration: none !important;
}
</style>
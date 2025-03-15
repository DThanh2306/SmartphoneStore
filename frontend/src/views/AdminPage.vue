<script setup>
import { ref, watch, nextTick } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import AdminOrderList from '@/components/AdminOrderList.vue';
import AdminUserList from '@/components/AdminUserList.vue';
import AdminProductList from '@/components/AdminProductList.vue';
import AdminProductAdd from '@/components/AdminProductAdd.vue';
import productsService from '@/services/products.service';
import usersService from '@/services/users.service';

const activeTab = ref('products');
const currentPage = ref(1);
const totalPages = ref(1);
const userCurrentPage = ref(1);
const userTotalPages = ref(1);

const userFilters = ref({});
const filters = ref({}); // default cho Product

const pageSize = 10;
const selectedIndex = ref(0);

const changeTab = async (tab) => {
  activeTab.value = tab;
  await nextTick(); // Chờ DOM cập nhật trước khi gọi refetch
  if (tab === 'products' && !products?.data) refetch();
  if (tab === 'profiles' && !users?.data) refetchUsers();
};

const { data: products, refetch, isLoading, error } = useQuery({
  queryKey: ['products', currentPage, filters],
  queryFn: async () =>
    await productsService.filterProducts({
      ...filters.value,
      page: currentPage.value,
      pageSize,
    }),
  onError: (error) => console.error('Error fetching products:', error.message),
});

// Fetch Users
const { data: users, refetch: refetchUsers, isLoading: isLoadingUsers, error: userError } = useQuery({
  queryKey: ['users', userCurrentPage, userFilters],
  queryFn: async () =>
    await usersService.filterUsers({
      ...userFilters.value,
      page: userCurrentPage.value,
      pageSize,
    }),
  onError: (error) => console.error('Error fetching users:', error.message),
});

function updateSelectedIndex(index) {
  selectedIndex.value = index;
}

// Cập nhật số trang khi dữ liệu thay đổi
watch(products, (newProducts) => {
  totalPages.value = newProducts?.total
    ? Math.ceil(newProducts.total / pageSize)
    : 1;
}, {immediate: true});
watch(users, (newUsers) => {
  userTotalPages.value = newUsers?.total
    ? Math.ceil(newUsers.total / pageSize)
    : 1;
}, {immediate: true});

// Hàm xử lý thay đổi trang
function handlePageChange(page) {
  currentPage.value = page;
  refetch();
}
function handleUserPageChange(page) {
  userCurrentPage.value = page;
  refetchUsers();
}
</script>

<template>
  <div class="container">
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'products' }"
          @click="changeTab('products')"
        >
          <i class="fas fa-home"></i> Sản Phẩm
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'profiles' }"
          @click="changeTab('profiles')"
        >
          <i class="fas fa-user-astronaut"></i> Người Dùng
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'orders' }"
          @click="changeTab('orders')"
        >
          <i class="fas fa-user"></i> Đơn Hàng
        </button>
      </li>
      <li
        v-if="activeTab === 'products'"
       class="nav-item add">
        <button
          class="nav-link"
          style="color: aliceblue;"
          @click="changeTab('add')"
        >
          <i class="fas fa-plus"></i> Thêm SP mới
        </button>
      </li>
    </ul>
    <div class="tab-content">
      <div v-if="activeTab === 'products' && products">
        <AdminProductList
          :products="products?.data || []"
          :currentPage="currentPage"
          :totalPages="totalPages"
          :selectedIndex="selectedIndex"
          @update:selectedIndex="updateSelectedIndex"
          @pageChange="handlePageChange"
        />
      </div>
      <div v-if="activeTab === 'profiles' && users">
        <AdminUserList
          :users="users?.data || []"
          :currentPage="userCurrentPage"
          :totalPages="userTotalPages"
          :selectedIndex="selectedIndex"
          @update:selectedIndex="updateSelectedIndex"
          @pageChange="handleUserPageChange"
        />
      </div>
      <div v-if="activeTab === 'orders'">
        <AdminOrderList />
      </div>
      <div v-if="activeTab === 'add'">
        <AdminProductAdd />
      </div>
    </div>
  </div>
</template>


<style scoped>
.nav-item.add {
  background-color: #232425;
  position: absolute;
  right: 0;
  margin-right: 100px;
  border-radius: 5px;
}

/* .nav-link {

} */

.nav-link.active {
  font-weight: bold;
  background-color:  #232425;;
  color: white;
}
</style>

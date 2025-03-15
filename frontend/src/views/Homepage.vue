<script setup>
import { ref, watch, onMounted, watchEffect } from 'vue';
import { useSearchStore } from '@/store/SearchStore';
import productList from '@/components/productList.vue';
import Paginator from '@/components/Paginator.vue';
import FilterProduct from '@/components/FilterProduct.vue';
import { useMutation, useQuery } from '@tanstack/vue-query';
import productsService from '../services/products.service';
import ProductDetails from '@/components/ProductDetails.vue';

const pageSize = 10;
const searchStore = useSearchStore();
const currentPage = ref(1);
const totalPages = ref(0);
const searchQuery = ref(searchStore.query); // Nhận giá trị từ searchStore

const showModal = ref(false);
const selectedProduct = ref(null);

function openModal(product) {
  selectedProduct.value = product;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  selectedProduct.value = null;
}

const defaultFilters = {
  resolution: null,
  screen_size: null,
  brightness: null,
  operating_system: null,
  ram: null,
  rom: null,
  price_min: null,
  price_max: null,
  searchQuery: null
};

// Khởi tạo filters với giá trị mặc định
const filters = ref({ ...defaultFilters });

function handleApplyFilter(newFilters) {
  filters.value = newFilters; // Cập nhật filters với giá trị mới
  const page = 1; // Reset về trang đầu
  refetch(page); // Gọi lại API
}

function handleCancelFilter() {
  filters.value = { ...defaultFilters }; // Đặt filters về trạng thái mặc định
  refetch(1); // Tải lại từ trang đầu tiên
}


const {
  data: products,
  refetch,
  isLoading,
  error
} = useQuery({
  queryKey: ['products', currentPage, filters, searchQuery],
  queryFn: async () => {
    const searchText = searchQuery.value || '';
    return await productsService.filterProducts({
      ...filters.value,
      page: currentPage.value,
      pageSize,
      search: searchText
    });
  },
  onSuccess: (data) => {
    totalPages.value = Math.ceil(data.total / 10);
  },
  onError: (error) => {
    console.error('Lỗi khi fetch dữ liệu:', error.message);
  }
});

function handlePageChange(page) {
  currentPage.value = page;
  refetch();
}
watchEffect(() => {
  searchQuery.value = searchStore.query;
  refetch(); // Gọi lại API khi từ khóa tìm kiếm thay đổi
});

watch(
  products,
  (newProducts) => {
    if (newProducts && newProducts.total) {
      totalPages.value = Math.ceil(newProducts.total / 10);
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="grid">
    <div class="row">
      <!-- Sidebar Filter -->
      <div class="mt-3 col-md-2">
        <FilterProduct @apply-filter="handleApplyFilter" @cancel-filter="handleCancelFilter"/>
      </div>

      <!-- Product List -->
      <div class="col-md-10">
        <!-- Chỉ truyền products.data vào productList nếu products không phải là undefined -->
        <productList
          :products="products?.data || []"
          :openModal="openModal"
        />

        <!-- Modal để hiển thị chi tiết sản phẩm -->
        <ProductDetails
          :show="showModal"
          :product="selectedProduct"
          @close="closeModal"
        />
      </div>
      <Paginator
        :currentPage="currentPage"
        :totalPages="totalPages"
        @pageChange="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped>
.grid {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
}
.mt-3 .col-md-2 {
  padding: 0 4px 0 0;
}
</style>

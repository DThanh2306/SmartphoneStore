<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, props.currentPage - 1);
  const end = Math.min(props.totalPages, props.currentPage + 1);

  if (start > 1) pages.push(1); // Trang đầu tiên
  if (start > 2) pages.push('...'); // Dấu "..."

  for (let i = start; i <= end; i++) {
    pages.push(i); // Các trang ở giữa
  }

  if (end < props.totalPages - 1) pages.push('...'); // Dấu "..."
  if (end < props.totalPages) pages.push(props.totalPages); // Trang cuối cùng

  return pages;
});

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
});

const emits = defineEmits(['pageChange']);

function goToPage(page) {
  console.log('currentPage', props.currentPage);
  console.log('totalPage', props.totalPages);
  if (page >= 1 && page <= props.totalPages) {
    emits('pageChange', page);
    console.log(page);
  }
}
</script>
<template>
  <nav aria-label="Page navigation">
    <ul class="pagination justify-content-center">
      <!-- Nút Previous -->
      <li
        class="page-item"
        :class="{ disabled: currentPage === 1 }"
      >
        <button
          class="page-link"
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
        >
          Previous
        </button>
      </li>

      <!-- Hiển thị các nút số trang -->
      <li
        v-for="page in visiblePages"
        :key="page"
        class="page-item"
        :class="{ active: page === currentPage, disabled: page === '...' }"
      >
        <button
          v-if="page !== '...'"
          class="page-link"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <span
          v-else
          class="page-link"
          >...</span
        >
      </li>

      <!-- Nút Next -->
      <li
        class="page-item"
        :class="{ disabled: currentPage === totalPages }"
      >
        <button
          class="page-link"
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
        >
          Next
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.pagination {
  --bs-pagination-color: black;
}
</style>

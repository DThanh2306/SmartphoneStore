<script setup>
import {reactive,defineEmits, watch,computed } from 'vue';
import Paginator from '@/components/Paginator.vue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import usersService from '@/services/users.service';

const queryClient = useQueryClient();
const props = defineProps({
  users: { type: Array, default: () => [] }, // Danh sách người dùng
  selectedIndex: { type: Number, default: 0 }, // Index người dùng được chọn
  currentPage: { type: Number, default: 1 }, // Trang hiện tại
  totalPages: { type: Number, default: 1 } // Tổng số trang
});

const emit = defineEmits(['pageChange', 'update:selectedIndex']);

const editableUser = reactive({});
// Đồng bộ editableUser với người dùng được chọn
watch(
  () => props.selectedIndex,
  (newIndex) => {
    if (newIndex !== -1 && props.users[newIndex]) {
      Object.assign(editableUser, { ...props.users[newIndex] }); // Clone người dùng vào editableUser
    } else {
      Object.assign(editableUser, {});
    }
  }
);

// Mutation để cập nhật người dùng
const updateMutation = useMutation({
  mutationFn: ({ u_acc, updateData }) => usersService.updateUserbyAdmin(u_acc, updateData),
  onSuccess: () => {
    alert('Cập nhật người dùng thành công!');
    queryClient.invalidateQueries(['users']);
    if (props.selectedIndex !== -1) {
      Object.assign(props.users[props.selectedIndex], editableUser);
    }
  },
  onError: (error) => {
    console.error('Lỗi khi cập nhật người dùng:', error);
    alert('Cập nhật người dùng thất bại!');
  }
});

function saveUser() {
  if (props.selectedIndex === -1) return;

  const { u_acc, ...updateData } = editableUser;
  updateMutation.mutate({ u_acc, updateData });
}

// Hàm xử lý thay đổi trang
function handlePageChange(page) {
  emit('pageChange', page);
}

// Xử lý định dạng ngày
const formattedDate = computed(() => {
  if (props.selectedIndex !== -1 && props.users[props.selectedIndex]?.registrationDate) {
    const date = new Date(props.users[props.selectedIndex].registrationDate);
    return date.toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }
  return 'N/A'; // Giá trị mặc định nếu không có ngày
});

</script>

<template>
  <div class="container mb-5">
    <div class="row">
      <!-- Danh sách người dùng -->
      <div class="col-lg-4">
        <div class="card shadow-sm user-list-card">
          <div class="card-header text-center text-white">
            <h5 class="mb-0">DANH SÁCH NGƯỜI DÙNG</h5>
          </div>
          <ul class="list-group list-group-flush">
            <li
              v-for="(user, index) in users"
              :key="user.u_acc"
              :class="['list-group-item', index === selectedIndex ? 'active-user' : '']"
              @click="$emit('update:selectedIndex', index)"
            >
              {{ user.u_name }}
            </li>
          </ul>
          <div class="card-footer text-center">
            <Paginator
              v-if="totalPages > 1"
              :currentPage="currentPage"
              :totalPages="totalPages"
              @pageChange="handlePageChange"
            />
          </div>
        </div>
      </div>

      <!-- Thông tin chi tiết người dùng -->
      <div class="col-lg-8">
        <!-- Chỉ hiển thị form nếu editableUser có giá trị -->
        <div v-if="Object.keys(editableUser).length" class="card shadow-sm">
          <div class="card-body">
            <div class="text-center">
              <img
                class="user-avatar mb-3"
                :src="`http://localhost:3000/public/uploads/Default_user.png`"
                alt="User Avatar"
              />
              <h5 class="card-title">{{ editableUser.u_name }}</h5>
              <p class="text-muted">{{ formattedDate }}</p>
            </div>
            <hr />
            <form @submit.prevent="saveUser">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">Tên người dùng</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="editableUser.u_name"
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">Số điện thoại</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="editableUser.u_phone"
                    />
                  </div>
                </div>
              </div>
              <div class="row mt-3">
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">Địa chỉ đường</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="editableUser.u_add_street"
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">Phường/Xã</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="editableUser.u_add_district"
                    />
                  </div>
                </div>
              </div>
              <div class="row mt-3">
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">Quận/Huyện</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="editableUser.u_add_city"
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">Tỉnh/Thành phố</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="editableUser.u_add_province"
                    />
                  </div>
                </div>
              </div>
              <div class="text-center mt-4">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="updateMutation.isLoading"
                >
                  <span v-if="updateMutation.isLoading">Đang lưu...</span>
                  <span v-else>Lưu chỉnh sửa</span>
                </button>
              </div>
            </form>
          </div>
        </div>
        <div v-else class="text-center mt-5">
          <p class="text-muted">Hãy chọn một người dùng để xem thông tin chi tiết.</p>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>
/* Giao diện đẹp mắt và hiện đại */
.container {
  font-family: 'Arial', sans-serif;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
}

.user-list-card {
  max-height: 600px;
  overflow-y: auto;
}

.user-list-card .active-user {
  background-color: #535a60;
  color: white;
  cursor: pointer;
}

.user-list-card .list-group-item {
  cursor: pointer;
  transition: all 0.3s;
}

.user-list-card .list-group-item:hover {
  background-color: #e9ecef;
}

.user-avatar {
  width: 120px;
  height: 120px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid black;
}

.form-label {
  font-weight: bold;
}

.form-control {
  border-radius: 5px;
}

.btn-primary:hover {
  background-color: rgb(5, 106, 5);
}

.btn-primary {
  background-color: rgb(11, 153, 11);
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
}

.btn-primary:disabled {
  background-color: #b8daff;
  cursor: not-allowed;
}

.card {
  border: none;
  border-radius: 10px;
}

.card-header {
  background-color: #232425;
  font-size: 1.2rem;
  font-weight: bold;
}

.card-body {
  padding: 20px;
}
</style>

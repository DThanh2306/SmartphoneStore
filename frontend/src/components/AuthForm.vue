<script setup>
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
  formType: {
    type: String,
    required: true,
    validator: (value) => ['login', 'register'].includes(value),
  },
  user: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['submitForm']);
const userData = ref({ ...props.user }); // Sao chép dữ liệu từ props.user

const handleSubmit = async () => {
  emit('submitForm', userData.value); // Gửi dữ liệu từ userData thay vì props.user
};
</script>

<template>
  <div class="p-3">
    <form @submit.prevent="handleSubmit">
      <fieldset enable>
        <div class="mb-3 m-5">
          <h4 class="text-center">
            {{ props.formType === 'login' ? 'Đăng Nhập' : 'Đăng Ký' }}
          </h4>
        </div>

        <!-- Các trường form -->
        <div class="mb-3 my-4">
          <input v-model="userData.u_acc" type="text" class="form-control" placeholder="Nhập Tên Đăng Nhập" />
        </div>
        <div class="mb-3 my-4">
          <input v-model="userData.acc_pwd" type="password" class="form-control" placeholder="Nhập Mật Khẩu" />
        </div>

        <!-- Các trường bổ sung khi đăng ký -->
        <template v-if="props.formType === 'register'">
          <div class="mb-3 my-4">
            <input v-model="userData.u_name" type="text" class="form-control" placeholder="Họ và Tên" />
          </div>
          <div class="mb-3 my-4">
            <input v-model="userData.u_phone" type="text" class="form-control" placeholder="Số Điện Thoại" />
          </div>
          <div class="mb-3 my-4">
            <input v-model="userData.u_add_street" type="text" class="form-control" placeholder="Địa Chỉ" />
          </div>
          <div class="mb-3 my-4">
            <input v-model="userData.u_add_district" type="text" class="form-control" placeholder="Quận" />
          </div>
          <div class="mb-3 my-4">
            <input v-model="userData.u_add_city" type="text" class="form-control" placeholder="Thành Phố" />
          </div>
          <div class="mb-3 my-4">
            <input v-model="userData.u_add_province" type="text" class="form-control" placeholder="Tỉnh" />
          </div>
        </template>

        <!-- Nút submit -->
        <div class="d-flex flex-column">
          <button type="submit" class="btn btn-primary">
            {{ props.formType === 'login' ? 'Đăng nhập' : 'Đăng ký' }}
          </button>
        </div>
      </fieldset>
    </form>
  </div>
</template>
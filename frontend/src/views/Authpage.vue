<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/store/UserStore.js';
import AuthForm from '@/components/AuthForm.vue';
import usersService from '@/services/users.service';
import { useMutation } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = ref({
  u_acc: '',
  acc_pwd: '',
  acc_role: '',
  u_name: '',
  u_phone: '',
  u_add_street: '',
  u_add_district: '',
  u_add_city: '',
  u_add_province: '',
});
const message = ref('');
const formType = ref('login');
const userStore = useUserStore();

const mutation = useMutation({
  mutationFn: async (newUser) => {
    await usersService.createUser(newUser);
  },
  onSuccess: () => {
    message.value = 'Tài khoản đã đăng ký thành công!';
  },
  onError: () => {
    message.value = 'Lỗi khi đăng ký';
  },
});

async function addUser(userData) {
  await mutation.mutateAsync(userData);
}

async function loginUser(userData) {
  try {
    const response = await usersService.login(userData);
    message.value = `Đăng nhập thành công! Chào mừng ${response.user.u_acc}`;
    userStore.setUser({
      username: response.user.u_acc,
      role: response.user.acc_role,
    });
    router.push('/'); // Điều hướng về trang chủ
  } catch (error) {
    message.value = 'Lỗi khi đăng nhập';
  }
}

async function handleSubmitForm(userData) {
  if (formType.value === 'login') {
    await loginUser(userData);
  } else {
    await addUser(userData);
  }
}

const toggleFormType = () => {
  formType.value = formType.value === 'login' ? 'register' : 'login';
};
</script>

<template>
  <div class="page border p-3" style="min-height: 500px;">
    <AuthForm :formType="formType" :user="user" @submitForm="handleSubmitForm" />
    <p class="text-center text-success">{{ message }}</p>
    <div class="form-text text-center my-4">
      <template v-if="formType === 'login'">
        Bạn chưa có tài khoản?
        <a href="javascript:void(0)" @click.prevent="toggleFormType">Đăng ký</a>
      </template>
      <template v-else>
        Bạn đã có tài khoản?
        <a href="javascript:void(0)" @click.prevent="toggleFormType">Đăng nhập</a>
      </template>
    </div>
  </div>
</template>
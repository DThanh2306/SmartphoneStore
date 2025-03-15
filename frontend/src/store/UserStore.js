import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null, // Khôi phục từ localStorage nếu có
  }),
  actions: {
    setUser(user) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user)); // Lưu vào localStorage
    },
    clearUser() {
      this.user = null;
      localStorage.removeItem('user'); // Xóa khỏi localStorage
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.user, // Kiểm tra trạng thái đăng nhập
  },
});
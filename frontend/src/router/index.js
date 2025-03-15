import App from '@/App.vue';
import { createWebHistory, createRouter } from 'vue-router';
import Homepage from '@/views/Homepage.vue';
import Authpage from '@/views/Authpage.vue';
import OrderPage from '@/views/OrderPage.vue';
import CartPage from '@/views/CartPage.vue';
import User from '@/views/User.vue';
import Admin from '@/views/AdminPage.vue';
import Password from '@/components/Password.vue';
import EditProfile from '@/views/EditProfile.vue';
import NotFound from '@/views/NotFound.vue';
const routes = [
  {
    path: '/',
    name: 'Homepage',
    component: Homepage,
    meta: { showHeaderFooter: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: OrderPage,
    meta: { showHeaderFooter: true }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: CartPage,
    meta: { showHeaderFooter: true }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Authpage,
    meta: { showHeaderFooter: true }
  },
  {
    path: '/profile',
    name: 'AccountInfo',
    component: User,
    meta: { showHeaderFooter: true }
  },
  {
    path: '/profile/edit',
    name: 'EditProfile',
    component: EditProfile,
    meta: { showHeaderFooter: true }
  },
  {
    path: '/password',
    name: 'ChangePassword',
    component: Password,
    meta: { showHeaderFooter: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { showHeaderFooter: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    component: NotFound,
    meta: { showHeaderFooter: false } // Không hiển thị Header và Footer
  }
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});
export default router;

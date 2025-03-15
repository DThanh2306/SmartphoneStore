import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';

import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
const pinia = createPinia();
const queryClient = new QueryClient();
createApp(App)
.use(router)
.use(VueQueryPlugin, {queryClient}).use(pinia)
.mount('#app');

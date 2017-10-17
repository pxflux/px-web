import Vue from 'vue';
import Router from 'vue-router';

import Content from '@/components/Content';
import Auth from '@/components/Auth';

Vue.use(Router);

export default new Router({
  routes: [
    { path: '/', component: Content, name: 'home' },
    { path: '/auth', component: Auth, name: 'auth' },
  ],
});

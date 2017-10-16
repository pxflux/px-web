import Vue from 'vue';
import Router from 'vue-router';
import Content from '@/components/Content';
import Auth from '@/components/Auth';
import SiteFooter from '@/components/Footer';

Vue.use(Router);

export default new Router({
  routes: [
    { path: '/', component: { Content, footer: SiteFooter }, name: 'home' },
    { path: '/auth', component: Auth, name: 'auth' },
  ],
});

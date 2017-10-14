// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import firebaseApp from '@/firebase';
import App from './App';
import router from './router';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  created() {
    firebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$router.push('/');
      } else {
        this.$router.push('/auth');
      }
    });
  },
  router,
  template: '<App/>',
  components: { App },
});

import Vue from 'vue';
import Vuex from 'vuex';
import { firebaseMutations } from 'vuexfire';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null, // Will be bound as an object
  },
  actions: {
  },
  mutations: {
    UPDATE_USER(state, user) {
      // eslint-disable-next-line no-param-reassign
      state.user = user;
    },
    ...firebaseMutations,
  },
  getters: {
  },
});

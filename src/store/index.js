import Vue from 'vue'
import Vuex from 'vuex'
import { firebaseMutations, firebaseAction } from 'vuexfire'

Vue.use(Vuex)

export default new Vuex.Store({
  // VuexFire will check the type of the property to bind as an array or as an object
  // strict: true,
  state: {
    artworks: [],
    items: [],
    item: null,
    user: null // Will be bound as an object
  },
  actions: {
    setArtworksRef: firebaseAction(({bindFirebaseRef}, ref) => {
      bindFirebaseRef('artworks', ref, {wait: true})
    }),
    setItemsRef: firebaseAction(({bindFirebaseRef}, ref) => {
      bindFirebaseRef('items', ref, {wait: true})
    }),
    setItemRef: firebaseAction(({bindFirebaseRef}, ref) => {
      bindFirebaseRef('item', ref, {wait: true})
    })
  },
  mutations: {
    UPDATE_USER (state, user) {
      state.user = user
    },
    ...firebaseMutations
  }
})

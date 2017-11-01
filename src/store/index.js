import Vue from 'vue'
import Vuex from 'vuex'
import { firebaseMutations, firebaseAction } from 'vuexfire'

Vue.use(Vuex)

export default new Vuex.Store({
  // VuexFire will check the type of the property to bind as an array or as an object
  // strict: true,
  state: {
    user: null, // Will be bound as an object

    artworks: [],
    artwork: null,
    artists: [],
    artist: null,
    shows: [],
    show: null,

    accountArtworks: [],
    accountArtwork: null,
    accountArtists: [],
    accountArtist: null,
    accountShows: [],
    accountShow: null,
    accountPlaces: [],
    accountPlace: null
  },
  actions: {
    setRef: firebaseAction(({bindFirebaseRef}, payload) => {
      bindFirebaseRef(payload.key, payload.ref, {wait: true})
    })
  },
  mutations: {
    UPDATE_USER (state, user) {
      state.user = user
    },
    REMOVE_ACCOUNT_ARTWORKS (state) {
      state.accountArtworks = []
    },
    REMOVE_ACCOUNT_ARTWORK (state) {
      state.accountArtwork = []
    },
    REMOVE_ACCOUNT_ARTISTS (state) {
      state.accountArtists = []
    },
    REMOVE_ACCOUNT_ARTIST (state) {
      state.accountArtist = []
    },
    REMOVE_ACCOUNT_SHOWS (state) {
      state.accountShows = []
    },
    REMOVE_ACCOUNT_SHOW (state) {
      state.accountShow = []
    },
    REMOVE_ACCOUNT_PLACES (state) {
      state.accountPlaces = []
    },
    REMOVE_ACCOUNT_PLACE (state) {
      state.accountPlace = []
    },
    ...firebaseMutations
  }
})

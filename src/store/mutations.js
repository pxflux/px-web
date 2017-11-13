import Vue from 'vue'
import { firebaseMutations } from 'vuexfire'

export default {
  UPDATE_USER (state, payload) {
    if (payload === null) {
      state.user = null
      state.userAccount = null
      state.accounts = []
      state.account = null
      state.accountArtworks = []
      state.accountArtwork = null
      state.accountArtists = []
      state.accountArtist = null
      state.accountShows = []
      state.accountShow = null
      state.accountPlaces = []
      state.accountPlace = null
      state.accountIteration = null
    } else {
      state.user = payload.user
      if (payload.account) {
        state.userAccount = payload.account
      }
    }
  },
  REMOVE_ACCOUNT (state) {
    state.account = null
  },
  REMOVE_ACCOUNT_ARTWORK (state) {
    state.accountArtwork = null
  },
  REMOVE_ACCOUNT_ARTIST (state) {
    state.accountArtist = null
  },
  REMOVE_ACCOUNT_SHOW (state) {
    state.accountShow = null
  },
  REMOVE_ACCOUNT_PLACE (state) {
    state.accountPlace = null
  },
  ...firebaseMutations,

  SET_ITEMS: (state, {items}) => {
    items.forEach(item => {
      if (item) {
        Vue.set(state.items, item.__key, item)
      }
    })
  }
}

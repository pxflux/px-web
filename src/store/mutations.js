import Vue from 'vue'
import { firebaseMutations } from 'vuexfire'

export default {
  UPDATE_USER (state, user) {
    state.user = user
  },
  REMOVE_ACCOUNT_ARTWORKS (state) {
    state.accountArtworks = []
  },
  REMOVE_ACCOUNT_ARTWORK (state) {
    state.accountArtwork = null
  },
  REMOVE_ACCOUNT_ARTISTS (state) {
    state.accountArtists = []
  },
  REMOVE_ACCOUNT_ARTIST (state) {
    state.accountArtist = null
  },
  REMOVE_ACCOUNT_SHOWS (state) {
    state.accountShows = []
  },
  REMOVE_ACCOUNT_SHOW (state) {
    state.accountShow = null
  },
  REMOVE_ACCOUNT_PLACES (state) {
    state.accountPlaces = []
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

import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
      user: null,
      userAccount: null,

      artworks: [],
      artwork: null,
      artists: [],
      artist: null,
      shows: [],
      show: null,
      places: [],
      place: null,
      collector: null,
      curator: null,
      publication: null,

      accounts: [],
      account: null,
      invitations: [],

      accountArtworks: [],
      accountArtwork: null,

      accountArtist: null,
      accountArtists: [],
      accountShow: null,
      accountShows: [],
      accountPlace: null,
      accountPlaces: [],
      accountIteration: null,

      items: {/* [id: string]: {} */}
    },
    actions,
    mutations,
    getters
  })
}

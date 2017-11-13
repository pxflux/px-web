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
      place: null,
      collector: null,
      curator: null,
      publication: null,

      accounts: [],
      account: null,
      invitations: [],

      accountArtworks: [],
      accountArtwork: null,

      accountArtists: [],
      accountArtist: null,
      accountShows: [],
      accountShow: null,
      accountPlaces: [],
      accountPlace: null,
      accountIteration: null,

      items: {/* [id: string]: {} */}
    },
    actions,
    mutations,
    getters
  })
}

import { createStore as createVuexStore } from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'



export function createStore () {
  return createVuexStore({
    state: {
      loading: false,

      config: null,

      user: null,
      userAccount: null,

      playerPin: null,

      artworks: [],
      publicArtwork: null,
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

      accountPlayers: [],

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

import { createRouter, createWebHistory } from 'vue-router'

import UserUpdate from '@/components/UserUpdate.vue'
import Auth from '@/components/Auth.vue'

import About from '@/components/About.vue'
// import Overview from '@/components/public/About'
import Download from '@/components/public/Download.vue'
import ArtworkList from '@/components/public/ArtworkList.vue'
import ArtworkDetail from '@/components/public/Artwork.vue'
import ArtistDetail from '@/components/public/Artist.vue'
import ShowDetail from '@/components/public/Show.vue'
import PlaceDetail from '@/components/public/Place.vue'
import PlayerClient from '@/components/public/PlayerClient.vue'

import AccountNew from '@/components/account/AccountNew.vue'
import AccountDetail from '@/components/account/AccountDetail.vue'
import AccountInvitationList from '@/components/account/InvitationList.vue'

import AccountPlayerNew from '@/components/account/PlayerNew.vue'
import AccountPlayerList from '@/components/account/PlayerList.vue'
import AccountArtworkIterationDetail from '@/components/account/IterationDetail.vue'
import AccountArtworkEditor from '@/components/account/ArtworkEditor.vue'
import AccountArtistList from '@/components/account/ArtistList.vue'
import AccountArtistDetail from '@/components/account/ArtistDetail.vue'
import AccountArtistEditor from '@/components/account/ArtistEditor.vue'
import AccountShowList from '@/components/account/ShowList.vue'
import AccountShowDetail from '@/components/account/ShowDetail.vue'
import AccountShowEditor from '@/components/account/ShowEditor.vue'
import AccountPlaceList from '@/components/account/PlaceList.vue'
import AccountPlaceDetail from '@/components/account/PlaceDetail.vue'
import AccountPlaceEditor from '@/components/account/PlaceEditor.vue'

export function createAppRouter () {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      {path: '/', component: About, name: 'home'},
      {path: '/user/update', component: UserUpdate, name: 'user-update'},
      {path: '/auth', component: Auth, name: 'auth'},

      {path: '/download', component: Download, name: 'download'},

      {path: '/artworks', component: ArtworkList},
      {path: '/artwork/:id', component: ArtworkDetail, name: 'artwork-detail'},

      {path: '/artist/:id', component: ArtistDetail, name: 'artist-detail'},
      {path: '/show/:id', component: ShowDetail, name: 'show-detail'},
      {path: '/place/:id', component: PlaceDetail, name: 'place-detail'},

      {path: '/p/:id', component: PlayerClient, name: 'player-client'},

      {path: '/account/new', component: AccountNew},
      {path: '/account/update', component: AccountDetail},
      {path: '/account/invitations', component: AccountInvitationList},

      {path: '/account/players', component: AccountPlayerList},
      {path: '/account/player/new', component: AccountPlayerNew},

      {path: '/account/artwork/:artworkId/iterations/:id', component: AccountArtworkIterationDetail},
      {path: '/account/artwork/new', component: AccountArtworkEditor, props: {isNew: true}},
      {path: '/account/artwork/:id/edit', component: AccountArtworkEditor, props: {isNew: false}},

      {path: '/account/artists', component: AccountArtistList},
      {path: '/account/artist/new', component: AccountArtistEditor, props: {isNew: true}},
      {path: '/account/artist/:id/edit', component: AccountArtistEditor, props: {isNew: false}},
      {path: '/account/artist/:id', component: AccountArtistDetail},

      {path: '/account/shows', component: AccountShowList},
      {path: '/account/show/new', component: AccountShowEditor, props: {isNew: true}},
      {path: '/account/show/:id/edit', component: AccountShowEditor, props: {isNew: false}},
      {path: '/account/show/:id', component: AccountShowDetail},

      {path: '/account/places', component: AccountPlaceList},
      {path: '/account/place/new', component: AccountPlaceEditor, props: {isNew: true}},
      {path: '/account/place/:id/edit', component: AccountPlaceEditor, props: {isNew: false}},
      {path: '/account/place/:id', component: AccountPlaceDetail}
    ]
  })

  return router
}

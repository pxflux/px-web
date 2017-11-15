import Vue from 'vue'
import Router from 'vue-router'

import Homepage from '@/components/Homepage'
import UserUpdate from '@/components/UserUpdate'
import Auth from '@/components/Auth'

import ArtworkList from '@/components/public/Artworks'
import ArtworkDetail from '@/components/public/Artwork'
import ArtistList from '@/components/public/Artists'
import ArtistDetail from '@/components/public/Artist'
import ShowList from '@/components/public/Shows'
import ShowDetail from '@/components/public/Show'
import PlaceDetail from '@/components/public/Place'
import CollectorDetail from '@/components/public/Collector'
import CuratorDetail from '@/components/public/Curator'
import PublicationDetail from '@/components/public/Publication'

import AccountNew from '@/components/account/AccountNew'
import AccountDetail from '@/components/account/AccountDetail'
import AccountInvitationList from '@/components/account/InvitationList'

import AccountArtworkList from '@/components/account/ArtworkList'
import AccountArtworkDetail from '@/components/account/ArtworkDetail'
import AccountArtworkIterationDetail from '@/components/account/IterationDetail'
import AccountArtworkUpdate from '@/components/account/ArtworkUpdate'
import AccountArtistList from '@/components/account/ArtistList'
import AccountArtistDetail from '@/components/account/ArtistDetail'
import AccountArtistUpdate from '@/components/account/ArtistUpdate'
import AccountShowList from '@/components/account/ShowList'
import AccountShowDetail from '@/components/account/ShowDetail'
import AccountShowUpdate from '@/components/account/ShowUpdate'
import AccountPlaceList from '@/components/account/PlaceList'
import AccountPlaceDetail from '@/components/account/PlaceDetail'
import AccountPlaceUpdate from '@/components/account/PlaceUpdate'

Vue.use(Router)

export function createRouter () {
  return new Router({
    routes: [
      {path: '/', component: Homepage, name: 'home'},
      {path: '/user/update', component: UserUpdate, name: 'user-update'},
      {path: '/auth', component: Auth, name: 'auth'},

      {path: '/artworks', component: ArtworkList, name: 'artworks'},
      {path: '/artwork/:id', component: ArtworkDetail, name: 'artwork-detail'},
      {path: '/artists', component: ArtistList, name: 'artists'},
      {path: '/artist/:id', component: ArtistDetail, name: 'artist-detail'},
      {path: '/shows', component: ShowList, name: 'shows'},
      {path: '/show/:id', component: ShowDetail, name: 'show-detail'},
      {path: '/place/:id', component: PlaceDetail, name: 'place-detail'},
      {path: '/collector/:id', component: CollectorDetail, name: 'collector-detail'},
      {path: '/curator/:id', component: CuratorDetail, name: 'curator-detail'},
      {path: '/publication/:id', component: PublicationDetail, name: 'publication-detail'},

      {path: '/account/new', component: AccountNew},
      {path: '/account/update', component: AccountDetail},
      {path: '/account/invitations', component: AccountInvitationList},

      {path: '/account/artworks', component: AccountArtworkList},
      {path: '/account/artwork/:artworkId/iterations/:id', component: AccountArtworkIterationDetail},
      {path: '/account/artwork/new', component: AccountArtworkUpdate, props: {isNew: true}},
      {path: '/account/artwork/:id/update', component: AccountArtworkUpdate, props: {isNew: false}},
      {path: '/account/artwork/:id', component: AccountArtworkDetail},

      {path: '/account/artists', component: AccountArtistList},
      {path: '/account/artist/new', component: AccountArtistUpdate, props: {isNew: true}},
      {path: '/account/artist/:id/update', component: AccountArtistUpdate, props: {isNew: false}},
      {path: '/account/artist/:id', component: AccountArtistDetail},

      {path: '/account/shows', component: AccountShowList},
      {path: '/account/show/new', component: AccountShowUpdate, props: {isNew: true}},
      {path: '/account/show/:id/update', component: AccountShowUpdate, props: {isNew: false}},
      {path: '/account/show/:id', component: AccountShowDetail},

      {path: '/account/places', component: AccountPlaceList},
      {path: '/account/place/new', component: AccountPlaceUpdate, props: {isNew: true}},
      {path: '/account/place/:id/update', component: AccountPlaceUpdate, props: {isNew: false}},
      {path: '/account/place/:id', component: AccountPlaceDetail}
    ]
  })
}

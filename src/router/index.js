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
import AccountArtworkList from '@/components/account/ArtworkList'
import AccountArtworkDetail from '@/components/account/ArtworkDetail'
import AccountArtworkIterationDetail from '@/components/account/IterationDetail'
import AccountArtistList from '@/components/account/ArtistList'
import AccountArtistDetail from '@/components/account/ArtistDetail'
import AccountShowList from '@/components/account/ShowList'
import AccountShowDetail from '@/components/account/ShowDetail'
import AccountPlaceList from '@/components/account/PlaceList'
import AccountPlaceDetail from '@/components/account/PlaceDetail'

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

      {path: '/account/new', component: AccountNew, name: 'account-new'},
      {path: '/account/update', component: AccountDetail, name: 'account-detail'},
      {path: '/account/artworks', component: AccountArtworkList, name: 'account-artworks'},
      {path: '/account/artwork/:artworkId/iterations/:id', component: AccountArtworkIterationDetail, name: 'account-artwork-iteration-detail'},
      {path: '/account/artwork/:id', component: AccountArtworkDetail, name: 'account-artwork-detail'},
      {path: '/account/artists', component: AccountArtistList, name: 'account-artists'},
      {path: '/account/artist/:id', component: AccountArtistDetail, name: 'account-artist-detail'},
      {path: '/account/shows', component: AccountShowList, name: 'account-shows'},
      {path: '/account/show/:id', component: AccountShowDetail, name: 'account-show-detail'},
      {path: '/account/places', component: AccountPlaceList, name: 'account-places'},
      {path: '/account/place/:id', component: AccountPlaceDetail, name: 'account-place-detail'}
    ]
  })
}

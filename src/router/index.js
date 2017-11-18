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
import AccountArtworkEditor from '@/components/account/ArtworkEditor'
import AccountArtistList from '@/components/account/ArtistList'
import AccountArtistDetail from '@/components/account/ArtistDetail'
import AccountArtistEditor from '@/components/account/ArtistEditor'
import AccountShowList from '@/components/account/ShowList'
import AccountShowDetail from '@/components/account/ShowDetail'
import AccountShowEditor from '@/components/account/ShowEditor'
import AccountPlaceList from '@/components/account/PlaceList'
import AccountPlaceDetail from '@/components/account/PlaceDetail'
import AccountPlaceEditor from '@/components/account/PlaceEditor'

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
      {path: '/account/artwork/new', component: AccountArtworkEditor, props: {isNew: true}},
      {path: '/account/artwork/:id/edit', component: AccountArtworkEditor, props: {isNew: false}},
      {path: '/account/artwork/:id', component: AccountArtworkDetail},

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
}

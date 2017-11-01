import Vue from 'vue'
import Router from 'vue-router'

import Homepage from '@/components/Homepage'
import UserUpdate from '@/components/UserUpdate'
import Auth from '@/components/Auth'

import ArtworkList from '@/components/browse/ArtworkList'
import ArtworkDetail from '@/components/browse/ArtworkDetail'
import ArtistList from '@/components/browse/ArtistList'
import ArtistDetail from '@/components/browse/ArtistDetail'
import ShowList from '@/components/browse/ShowList'
import ShowDetail from '@/components/browse/ShowDetail'

import AccountArtworkList from '@/components/account/ArtworkList'
import AccountArtworkDetail from '@/components/account/ArtworkDetail'
import AccountArtistList from '@/components/account/ArtistList'
import AccountArtistDetail from '@/components/account/ArtistDetail'
import AccountShowList from '@/components/account/ShowList'
import AccountShowDetail from '@/components/account/ShowDetail'
import AccountPlaceList from '@/components/account/PlaceList'
import AccountPlaceDetail from '@/components/account/PlaceDetail'

Vue.use(Router)

export default new Router({
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

    {path: '/account/artworks', component: AccountArtworkList, name: 'account-artworks'},
    {path: '/account/artwork/:id', component: AccountArtworkDetail, name: 'account-artwork-detail'},
    {path: '/account/artists', component: AccountArtistList, name: 'account-artists'},
    {path: '/account/artist/:id', component: AccountArtistDetail, name: 'account-artist-detail'},
    {path: '/account/shows', component: AccountShowList, name: 'account-shows'},
    {path: '/account/show/:id', component: AccountShowDetail, name: 'account-show-detail'},
    {path: '/account/places', component: AccountPlaceList, name: 'account-places'},
    {path: '/account/place/:id', component: AccountPlaceDetail, name: 'account-place-detail'}
  ]
})

import Vue from 'vue'
import Router from 'vue-router'

import Content from '@/components/Content'
import ArtistList from '@/components/ArtistList'
import ArtistDetail from '@/components/ArtistDetail'
import Artworks from '@/components/Artworks'
import ArtworkCreate from '@/components/ArtworkCreate'
import ArtworkDetail from '@/components/ArtworkDetail'
import ArtworkUpdate from '@/components/ArtworkUpdate'
import UserUpdate from '@/components/UserUpdate'
import Auth from '@/components/Auth'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', component: Content, name: 'home'},
    {path: '/artists', component: ArtistList, name: 'artists'},
    {path: '/artist/:id', component: ArtistDetail, name: 'artist-detail'},
    {path: '/artworks', component: Artworks, name: 'artworks'},
    {path: '/artwork-create', component: ArtworkCreate, name: 'artwork-create'},
    {path: '/artworks/:id', component: ArtworkDetail, name: 'artwork-detail'},
    {path: '/artworks/:id/update', component: ArtworkUpdate, name: 'artwork-update'},
    {path: '/user/update', component: UserUpdate, name: 'user-update'},
    {path: '/auth', component: Auth, name: 'auth'}
  ]
})

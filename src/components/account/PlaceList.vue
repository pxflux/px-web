<template>
  <main>
    <div v-if="userAccount" class="wrap-content">
      <ul>
        <li v-for="place in accountPlaces" :key="place['.key']">
          <router-link :to="'/account/place/' + place['.key']">{{ place.title }}</router-link>
        </li>
      </ul>
      <span class="nothing-found" v-if="accountPlaces.length == 0">Places not found.</span>
      <router-link to="/account/place/new/update">Add Place</router-link>
    </div>
  </main>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import firebase from '../../firebase-app'

  export default {
    created () {
      this.init()
    },
    computed: {
      ...mapState(['userAccount', 'accountPlaces']),

      accountId () {
        if (!this.userAccount) {
          return null
        }
        return this.userAccount['.key']
      }
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        if (this.accountId) {
          this.setRef({key: 'accountPlaces', ref: firebase.database().ref('accounts/' + this.accountId + '/places')})
        }
      }
    },
    watch: {
      $route () {
        this.init()
      },
      'userAccount' () {
        this.init()
      }
    }
  }
</script>

<template>
  <main>
    <div v-if="userAccount && accountShow" class="wrap-content text-block">
      <router-link to="/account/shows/">Shows</router-link>
      <h1>{{ accountShow.title }}</h1>
      <img v-show="image.displayUrl" :src="image.displayUrl" width="100" height="100">
      <h2>Places</h2>
      <ul>
        <li v-for="place in places" :key="place['.key']">
          <router-link :to="'/places/' + place['.key']">{{ place.title }}</router-link>
        </li>
      </ul>
      <router-link :to="'/account/show/' + showId + '/edit'" class="button">Update</router-link>
      <button @click="removeShow">Remove</button>
      <button v-if=" ! accountShow.published"><a @click="togglePublished(true)">Publish</a></button>
      <button v-if="accountShow.published"><a @click="togglePublished(false)">Un publish</a></button>
    </div>
  </main>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { ref, remove } from 'firebase/database'
  import { log } from '../../helper'
  import { db, store } from '../../firebase-app'

  export default {
    created () {
      this.init()
    },
    computed: {
      ...mapState(['userAccount', 'accountShow']),

      accountId () {
        if (!this.userAccount) {
          return null
        }
        return this.userAccount['.key']
      },
      showId () {
        return this.$route.params.id
      },
      image () {
        return this.accountShow && this.accountShow.image ? this.accountShow.image : {
          displayUrl: null,
          storageUri: null
        }
      },
      places () {
        return Object.keys(this.accountShow.places || {}).map(id => {
          return {...this.accountShow.places[id], ...{'.key': id}}
        })
      }
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        if (this.accountId) {
          this.setRef({
            key: 'accountShow',
            ref: ref(db, 'accounts/' + this.accountId + '/shows/' + this.showId)
          })
        }
      },
      togglePublished (published) {
        if (!this.accountId) {
          return
        }
        store(this.accountId, this.showId, 'shows', {published: published}).catch(log)
      },
      removeShow () {
        if (!this.accountId) {
          return
        }
        remove(ref(db, 'accounts/' + this.accountId + '/shows/' + this.showId)).then(function () {
          this.$router.push('/account/shows')
        }.bind(this)).catch(log)
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

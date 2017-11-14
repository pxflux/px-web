<template>
  <main>
    <div v-if="userAccount" class="wrap-content grid">
      <ul>
        <li v-for="show in accountShows" :key="show['.key']">
          <router-link :to="'/account/show/' + show['.key']">{{ show.title }}</router-link>
        </li>
      </ul>
      <span class="nothing-found" v-if="accountShows.length == 0">Shows not found.</span>
      <button v-if="showForm === false" @click="showForm = true">Add Show</button>
      <form v-if="showForm" id="form-show" @submit.prevent="createShow">
        <input id="title" type="text" v-model="title" title="Show title" required="required">
        <input type="submit" value="Create"/>
        <button @click.prevent="showForm = false">Cancel</button>
      </form>
    </div>
  </main>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { log } from '../../helper'
  import firebase from '../../firebase-app'

  export default {
    created () {
      this.init()
    },
    data () {
      return {
        showForm: false,
        title: ''
      }
    },
    computed: {
      ...mapState(['userAccount', 'shows']),

      accountShows () {
        if (!this.userAccount || !this.shows) {
          return []
        }
        return this.shows.filter(show => show.accountId === this.userAccount['.key'])
      }
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        this.source = firebase.database().ref('shows')
        this.setRef({key: 'shows', ref: this.source})
      },
      createShow () {
        this.showForm = false
        if (this.source && this.userAccount) {
          const account = {
            accountId: this.userAccount['.key'],
            title: this.title
          }
          this.source.push(account).then(function (data) {
            this.$router.push('/account/show/' + data.key)
          }.bind(this)).catch(log)
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

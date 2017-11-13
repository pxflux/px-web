<template>
  <main>
    <div v-if="user" class="wrap-content grid">
      <ul>
        <li v-for="show in accountShows" :key="show['.key']">
          <router-link :to="'/account/show/' + show['.key']">{{ show.title }}</router-link>
        </li>
      </ul>
      <span class="nothing-found" v-if="accountShows.length == 0">Shows not found.</span>
      <ul v-if="showForm === false">
        <li><a @click="showForm = true" class="button">Add Show</a></li>
      </ul>
      <form v-if="showForm" id="form-show" @submit.prevent="createShow">
        <input id="title" type="text" v-model="title" title="Show title" required="required">
        <button class="right">Create</button>
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
        title: '',
        showUpdateForm: false
      }
    },
    computed: {
      ...mapState(['user', 'accountShows'])
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        if (this.user.uid) {
          this.setRef({
            key: 'accountShows',
            ref: firebase.database().ref('users/' + this.user.uid + '/shows')
          })
        }
      },
      createShow () {
        const newShow = {
          title: this.title,
          publicId: ''
        }
        const key = firebase.database().ref('users/' + this.user.uid + '/shows').push(newShow, log).key
        this.$router.push('/account/show/' + key)
      }
    },
    watch: {
      $route () {
        this.init()
      },
      'user' () {
        this.init()
      }
    }
  }
</script>

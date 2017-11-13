<template>
  <main>
    <div v-if="account" class="wrap-content text-block">
      <h1 v-if="!showForm">
        {{ account.title }}
        <button @click="showForm = true">Update</button>
      </h1>
      <form v-if="showForm" id="form-account" @submit.prevent="updateAccount">
        <input id="title" type="text" v-model="title" title="Team title" required="required">
        <input type="submit" value="Save"/>
        <button @click="showForm = false">Cancel</button>
      </form>
      <button @click="leaveAccount">Leave</button>
      <h2>People</h2>
      <ul>
        <li v-for="people in users" :key="user['.key']">{{ people.displayName }}</li>
      </ul>
    </div>
  </main>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import firebase from '../../firebase-app'
  import { log } from '../../helper'

  export default {
    created () {
      this.init()
    },
    computed: {
      ...mapState(['user', 'userAccount', 'account']),
      users () {
        const account = this.account || {}
        return Object.keys(account.users || {}).map(userId => {
          const user = account.users[userId]
          user['.key'] = userId
          return user
        })
      }
    },
    data () {
      return {
        title: '',
        showForm: false
      }
    },
    methods: {
      ...mapActions(['setRef']),
      ...mapMutations(['REMOVE_ACCOUNT']),

      init () {
        if (!this.account || this.userAccount['.key'] !== this.account['.key']) {
          this.REMOVE_ACCOUNT()
          this.source = null
        }
        if (this.userAccount) {
          this.source = firebase.database().ref('accounts/' + this.userAccount['.key'])
          this.setRef({key: 'account', ref: this.source})
        }
      },

      updateAccount () {
        this.showForm = false
        firebase.database().ref('accounts/' + this.userAccount['.key'] + '/title').set(this.title).catch(log)
      },

      leaveAccount () {
        this.showForm = false
        firebase.database().ref('accounts/' + this.userAccount['.key'] + '/users/' + this.user.uid).remove().catch(log)
      }
    },
    watch: {
      $route () {
        this.init()
      },
      'userAccount' () {
        this.init()
      },
      'account' () {
        this.title = this.account.title
      }
    }
  }
</script>

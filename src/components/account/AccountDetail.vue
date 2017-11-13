<template>
  <main>
    <div v-if="account" class="wrap-content text-block">
      <h1>{{ account.title }}</h1>
      <button v-on:click="leaveAccount(account['.key'])">Leave</button>
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

      leaveAccount (accountId) {
        firebase.database().ref('accounts/' + accountId + '/users/' + this.user.uid).remove().catch(log)
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

<template>
  <main>
    <div v-if="user" class="wrap-content grid">
      <ul>
        <li v-for="account in accounts" :key="account['.key']">
          <router-link :to="'/account/account/' + account['.key']">{{ account.title }}</router-link>
        </li>
      </ul>
      <span class="nothing-found" v-if="accounts.length == 0">Teams not found.</span>
      <ul v-if="accountForm === false">
        <li><a @click="accountForm = true" class="button">Add team</a></li>
      </ul>
      <form v-if="accountForm" id="form-account" @submit.prevent="createAccount">
        <input id="title" type="text" v-model="title" title="Title" required="required">
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
        accountForm: false
      }
    },
    computed: {
      ...mapState(['user', 'accounts'])
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        if (this.user.uid) {
          this.setRef({
            key: 'accounts',
            ref: firebase.database().ref('users/' + this.user.uid + '/accounts')
          })
        }
      },

      createAccount () {
        const account = {
          title: this.title
        }
        const db = firebase.database()
        db.ref('accounts').push(account).then(function (data) {
          const accountId = data.key
          return db.ref('accounts/' + accountId + '/users/' + this.user.uid).set(true).then(function () {
            this.$router.push('/account/account/' + accountId)
          }.bind(this))
        }.bind(this)).catch(log)
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

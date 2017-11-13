<template>
  <main>
    <div v-if="user && userAccount" class="wrap-content grid">
      <form id="form-account" @submit.prevent="createAccount">
        <input id="title" type="text" v-model="title" title="Title" required="required">
        <button>Create</button>
      </form>
    </div>
  </main>
</template>

<script>
  import { mapState } from 'vuex'
  import firebase from '../../firebase-app'
  import { log } from '../../helper'

  export default {
    data () {
      return {
        title: ''
      }
    },
    computed: {
      ...mapState(['user', 'userAccount'])
    },
    methods: {
      createAccount () {
        const account = {
          title: this.title
        }
        const db = firebase.database()
        db.ref('accounts').push(account).then(function (data) {
          const accountId = data.key
          return db.ref('accounts/' + accountId + '/users/' + this.user.uid).set({
            'displayName': this.user.displayName,
            'photoUrl': this.user.photoURL
          }).then(function () {
            this.$router.push('/account/update')
          }.bind(this))
        }.bind(this)).catch(log)
      }
    }
  }
</script>

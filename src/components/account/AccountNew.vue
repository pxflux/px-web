<template>
  <main>
    <div v-if="user && userAccount" class="wrap-content grid">
      <form id="form-account" @submit.prevent="createAccount">
        <fieldset>
          <label>Title</label>
          <input id="title" type="text" v-model.trim="title" title="Title" required="required">
        </fieldset>
        <button>Create</button>
      </form>
    </div>
  </main>
</template>

<script>
  import { mapState } from 'vuex'
  import { ref, push, set } from 'firebase/database'
  import { db } from '../../firebase-app'
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
        push(ref(db, 'accounts'), account).then(function (data) {
          const accountId = data.key
          return set(ref(db, 'accounts/' + accountId + '/users/' + this.user.uid), {
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

<template>
  <main>
    <ul>
      <li v-for="invitation in accountInvitations" :key="invitation['.key']">
        {{ invitation['.key'] }}&nbsp;
        <button @click="removeInvitation(invitation)" class="button">Cancel</button>
      </li>
    </ul>
    <span class="nothing-found" v-if="accountInvitations.length == 0">Invitations not found.</span>
    <button v-if="showForm === false" @click="showForm = true" class="button">Add Invitation</button>
    <form v-if="showForm" id="form-invitation" @submit.prevent="createInvitation">
      <input type="text" v-model="email" title="email">
      <button class="button">Save</button>
    </form>
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
        showUpdateForm: false,
        email: ''
      }
    },
    computed: {
      ...mapState(['user', 'accountInvitations'])
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        if (this.user) {
          this.source = firebase.database().ref('invitations')
          this.setRef({
            key: 'invitations',
            ref: this.source
          })
        }
      },
      createInvitation () {
        const newInvitation = {
          ownerId: this.user.uid,
          email: this.email,
          photoUrl: '',
          _search_index: {
            full_name: latinize(this.email.toLowerCase()),
            reversed_full_name: latinize(this.email.toLowerCase().split(' ').reverse().join(' '))
          }
        }
        searchInvitations(this.source, newInvitation.email, 1).then(function (invitations) {
          const invitationIds = Object.keys(invitations)
          if (invitationIds.length === 0) {
            firebase.database().ref('invitations').push(newInvitation).then(function (data) {
              this.$router.push('/account/invitation/' + data.key)
            }.bind(this)).catch(log)
          } else {
            this.showUpdateForm = false
          }
        }.bind(this))
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

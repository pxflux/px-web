<template>
  <main>
    <div v-if="account" class="wrap-content text-block">
      <h1 v-if="!showUpdateForm">
        {{ account.title }}
        <button @click="showUpdateForm = true">Update</button>
      </h1>
      <form v-if="showUpdateForm" id="form-account" @submit.prevent="updateAccount">
        <input id="title" type="text" v-model="title" title="Team title" required="required">
        <input type="submit" value="Save"/>
        <button @click="showUpdateForm = false">Cancel</button>
      </form>
      <button @click="leaveAccount">Leave team</button>
      <h2>People</h2>
      <ul>
        <li v-for="people in peoples" :key="user['.key']">
          <img v-if="people.photoUrl" :src="people.photoUrl" :alt="people.displayName" class="user-photo" width="48" height="48">
          {{ people.displayName }}
        </li>
      </ul>
      <h2>Invitations</h2>
      <ul>
        <li v-for="invitation in accountInvitations" :key="invitation['.key']">
          {{ invitation.email }}
          <button @click="removeInvitation(invitation['.key'])">Remove</button>
        </li>
      </ul>
      <button @click="showInviteForm = true">Invite people</button>
      <form v-if="showInviteForm" id="form-invite" @submit.prevent="invite">
        <input id="email" type="text" v-model="email" title="Email address" required="required">
        <input type="submit" value="Invite"/>
        <button @click="showInviteForm = false">Cancel</button>
      </form>
    </div>
  </main>
</template>

<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
  import firebase from '../../firebase-app'
  import { log } from '../../helper'

  export default {
    created () {
      this.init()
    },
    computed: {
      ...mapState(['user', 'userAccount', 'account']),
      ...mapGetters(['accountInvitations']),
      peoples () {
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
        email: '',
        showUpdateForm: false,
        showInviteForm: false
      }
    },
    methods: {
      ...mapActions(['setRef']),
      ...mapMutations(['REMOVE_ACCOUNT']),

      init () {
        if (this.userAccount) {
          this.setRef({key: 'account', ref: firebase.database().ref('accounts/' + this.userAccount['.key'])})
          this.setRef({key: 'invitations', ref: firebase.database().ref('invitations')})
        }
      },

      updateAccount () {
        this.showUpdateForm = false
        firebase.database().ref('accounts/' + this.userAccount['.key'] + '/title').set(this.title).catch(log)
      },

      invite () {
        this.showInviteForm = false
        const invitation = {
          'account': {
            'id': this.userAccount['.key'],
            'title': this.userAccount.title
          },
          'email': this.email
        }
        firebase.database().ref('invitations').push(invitation).catch(log)
      },

      removeInvitation (invitationId) {
        firebase.database().ref('invitations/' + invitationId).remove().catch(log)
      },

      leaveAccount () {
        this.showUpdateForm = false
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

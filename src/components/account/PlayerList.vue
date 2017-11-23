<template>
  <main>
    <div v-if="userAccount" class="wrap-content">
      <ul>
        <li v-for="player in players" :key="player['.key']">
          {{ player.pin }}
        </li>
      </ul>
      <span class="nothing-found" v-if="players.length == 0">Players not found.</span>
      <router-link to="/account/player/new">Add Player</router-link>
    </div>
  </main>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    computed: {
      ...mapState(['userAccount']),

      accountId () {
        if (!this.userAccount) {
          return null
        }
        return this.userAccount['.key']
      },
      players () {
        return Object.keys((this.userAccount || {}).players || {}).map(id => {
          return {...this.userAccount.players[id], ...{'.key': id}}
        })
      }
    }
  }
</script>

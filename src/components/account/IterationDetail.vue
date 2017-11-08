<template>
  <main>
    <div v-if="user && accountIteration" class="wrap-content text-block">
      <input type="text" v-model="title">
      <button @click="saveIteration" class="button">Save</button>
      <button v-if="accountIteration['.key'] === 'draft'" @click="publishIteration" class="button">Publish</button>
    </div>
  </main>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import firebase from '../../firebase-app'
  import { cloneIteration } from '../../models/iteration'
  import { log } from '../../helper'

  export default {
    created () {
      this.init()
    },
    computed: {
      ...mapState(['user', 'accountIteration'])
    },
    data () {
      return {
        title: ''
      }
    },
    methods: {
      ...mapActions(['setRef']),
      ...mapMutations(['REMOVE_ACCOUNT_ITERATION']),

      init () {
        if (this.user.uid) {
          this.source = firebase.database().ref('users/' + this.user.uid + '/artworks/' + this.$route.params.artworkId + '/iterations/' + this.$route.params.id)
          this.setRef({key: 'accountIteration', ref: this.source})
        } else {
          this.source = null
          this.REMOVE_ACCOUNT_ITERATION()
        }
      },
      saveIteration () {
        if (this.source) {
          const o = {
            'title': this.title
          }
          this.source.update(o, function (error) {
            this.$router.push('/account/artwork/' + this.$route.params.artworkId)
            log(error)
          }.bind(this))
        }
      },
      publishIteration () {
        if (this.source && this.accountIteration['.key'] === 'draft') {
          const path = 'users/' + this.user.uid + '/artworks/' + this.$route.params.artworkId + '/iterations'
          firebase.database().ref(path).push(cloneIteration(this.accountIteration), function (error) {
            if (!error) {
              this.source.remove(function (error) {
                this.$router.push('/account/artwork/' + this.$route.params.artworkId)
                log(error)
              }.bind(this))
            }
            log(error)
          }.bind(this))
        }
      }
    },
    watch: {
      $route () {
        this.init()
      },
      'user' () {
        this.init()
      },
      'accountIteration' () {
        this.title = this.accountIteration.title || 'Untitled'
      }
    }
  }
</script>

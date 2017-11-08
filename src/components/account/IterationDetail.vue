<template>
  <main>
    <div v-if="user && accountIteration" class="wrap-content text-block">
      <span v-show="!title.edit" @click="toggleTitle()">{{ title.val }}</span>
      <input v-show="title.edit" type="text" ref="inputTitle" v-model="title.val" @blur="saveTitle()">

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
        title: {
          val: '',
          edit: false
        }
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

      toggleTitle: function () {
        this.$set(this.title, 'edit', !this.title.edit)
        // Focus input field
        if (this.title.edit) {
          this.$nextTick(function () {
            this.$refs.inputTitle.focus()
          })
        }
      },

      saveTitle: function () {
        this.toggleTitle()
        if (this.source) {
          this.source.update({'title': this.title.val}, log)
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
        this.title.val = this.accountIteration.title || 'Untitled'
      }
    }
  }
</script>

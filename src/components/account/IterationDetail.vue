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
  import { mapState, mapActions } from 'vuex'
  import { ref, update } from 'firebase/database'
  import { db } from '../../firebase-app'
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

      init () {
        if (this.user.uid) {
          this.source = ref(db, 'users/' + this.user.uid + '/artworks/' + this.$route.params.artworkId + '/iterations/' + this.$route.params.id)
          this.setRef({key: 'accountIteration', ref: this.source})
        } else {
          this.source = null
        }
      },

      toggleTitle: function () {
        this.title.edit = !this.title.edit
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
          update(this.source, {'title': this.title.val}).catch(log)
        }
      },

      publishIteration () {
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

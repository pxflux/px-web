<template>
  <main>
    <div v-if="user && accountShow" class="wrap-content text-block">
      <h1>{{ accountShow.title }}</h1>
      <ul>
        <li><a @click="removeShow" class="button">Remove</a></li>
        <li v-if=" ! accountShow.publicId"><a @click="publishShow" class="button">Publish</a></li>
        <li v-if="accountShow.publicId"><a @click="unPublishShow" class="button">Un publish</a></li>
      </ul>
    </div>
  </main>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import { cloneShow } from '../../models/show'
  import { log } from '../../helper'
  import firebase from '../../firebase'

  export default {
    created () {
      this.init()
    },
    computed: {
      ...mapState(['user', 'accountShow'])
    },
    methods: {
      ...mapActions(['setRef']),
      ...mapMutations(['REMOVE_ACCOUNT_SHOW']),

      init () {
        if (this.user.uid) {
          this.source = firebase.database().ref('users/' + this.user.uid + '/shows/' + this.$route.params.id)
          this.setRef({key: 'accountShow', ref: this.source})
        } else {
          this.source = null
          this.REMOVE_ACCOUNT_SHOW()
        }
      },
      publishShow () {
        if (this.source && this.accountShow.publicId === '') {
          const id = firebase.database().ref('/shows').push(cloneShow(this.accountShow), log).key
          this.source.update({
            'publicId': id
          }, log)
        }
      },
      unPublishShow () {
        if (this.source && this.accountShow.publicId !== '') {
          firebase.database().ref('/shows/' + this.accountShow.publicId).remove()
          this.source.update({publicId: ''}, log)
        }
      },
      removeShow () {
        if (this.source) {
          this.source.remove(log)
          this.$router.push('/account/shows')
        }
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

<template>
  <main>
    <div v-if="user && accountPlace" class="wrap-content text-block">
      <h1>{{ accountPlace.title }}</h1>
      <ul>
        <li><a @click="removePlace" class="button">Remove</a></li>
        <li v-if=" ! accountPlace.publicId"><a @click="publishPlace" class="button">Publish</a></li>
        <li v-if="accountPlace.publicId"><a @click="unPublishPlace" class="button">Un publish</a></li>
      </ul>
    </div>
  </main>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import { clonePlace } from '../../models/place'
  import { log } from '../../helper'
  import firebase from '../../firebase-app'

  export default {
    created () {
      this.init()
    },
    computed: {
      ...mapState(['user', 'accountPlace'])
    },
    methods: {
      ...mapActions(['setRef']),
      ...mapMutations(['REMOVE_ACCOUNT_PLACE']),

      init () {
        if (this.user.uid) {
          this.source = firebase.database().ref('users/' + this.user.uid + '/places/' + this.$route.params.id)
          this.setRef({key: 'accountPlace', ref: this.source})
        } else {
          this.source = null
          this.REMOVE_ACCOUNT_PLACE()
        }
      },
      publishPlace () {
        if (this.source && this.accountPlace.publicId === '') {
          const id = firebase.database().ref('/places').push(clonePlace(this.accountPlace), log).key
          this.source.update({
            'publicId': id
          }, log)
        }
      },
      unPublishPlace () {
        if (this.source && this.accountPlace.publicId !== '') {
          firebase.database().ref('/places/' + this.accountPlace.publicId).remove()
          this.source.update({publicId: ''}, log)
        }
      },
      removePlace () {
        if (this.source) {
          this.source.remove(log)
          this.$router.push('/account/places')
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

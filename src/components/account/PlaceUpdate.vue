<template>
  <main>
    <div v-if="userAccount" class="wrap-content text-block">
      <router-link to="/account/places/">Places</router-link>
      <template v-if="! isNew">
        &gt;
        <router-link :to="'/account/place/' + placeId">{{ accountPlace.title }}</router-link>
      </template>
      <image-upload :imageUrl="image.displayUrl" @input-file="setImageFile"
                    @remove-image="setImageRemoved"></image-upload>
      <form id="form-place" @submit.prevent="submitPlace">
        <input type="text" v-model.trim="title" title="Place title" required="required">
        <router-link v-if="isNew" to="/account/places">Cancel</router-link>
        <router-link v-if="! isNew" :to="'/account/place/' + placeId">Cancel</router-link>
        <input v-if="isNew" type="submit" value="Create"/>
        <input v-if="! isNew" type="submit" value="Update"/>
      </form>
    </div>
  </main>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { log } from '../../helper'
  import firebase, { store } from '../../firebase-app'

  export default {
    props: ['isNew'],
    created () {
      this.init()
    },
    computed: {
      ...mapState(['userAccount', 'accountPlace']),

      accountId () {
        if (!this.userAccount) {
          return null
        }
        return this.userAccount['.key']
      },
      placeId () {
        return this.$route.params.id
      },
      image () {
        return this.accountPlace && this.accountPlace.image ? this.accountPlace.image : {
          displayUrl: null,
          storageUri: null
        }
      }
    },
    data () {
      return {
        imageFile: null,
        imageRemoved: false,
        title: ''
      }
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        if (!this.isNew && this.accountId) {
          this.source = firebase.database().ref('accounts/' + this.accountId + '/places/' + this.placeId)
          this.setRef({key: 'accountPlace', ref: this.source})
        } else {
          this.source = null
        }
      },

      setImageFile (file) {
        this.imageFile = file
      },
      setImageRemoved (flag) {
        this.imageRemoved = flag
      },

      submitPlace () {
        if (!this.accountId) {
          return
        }
        const place = {
          title: this.title
        }
        const path = '/accounts/' + this.accountId + '/places'
        store(this.placeId, place, path, this.imageRemoved, this.imageFile).then(function (ref) {
          this.$router.push('/account/place/' + ref.key)
        }.bind(this)).catch(log())
      }
    },
    watch: {
      $route () {
        this.init()
      },
      'userAccount' () {
        this.init()
      },
      'accountPlace' () {
        this.title = this.accountPlace.title
      }
    }
  }
</script>

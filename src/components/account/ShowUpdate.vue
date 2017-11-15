<template>
  <main>
    <div v-if="accountShow" class="wrap-content text-block">
      <router-link to="/account/shows/">Shows</router-link>
      <template v-if="! isNew">
        &gt;
        <router-link :to="'/account/show/' + showId">{{ accountShow.title }}</router-link>
      </template>
      <image-upload :imageUrl="image.displayUrl" @input-file="setImageFile"
                    @remove-image="setImageRemoved"></image-upload>
      <form id="form-show" @submit.prevent="submitShow">
        <input type="text" v-model.trim="title" title="Show title" required="required">
        <select v-model="placeId">
          <option disabled value="">Выберите один из вариантов</option>
          <option v-for="place in places" v-bind:value="place['.key']">{{ place.title }}</option>
        </select>

        <router-link v-if="isNew" to="/account/shows">Cancel</router-link>
        <router-link v-if="! isNew" :to="'/account/show/' + showId">Cancel</router-link>
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
  import ImageUpload from '../elements/ImageUpload'

  export default {
    props: ['isNew'],
    created () {
      this.init()
    },
    components: {
      ImageUpload
    },
    computed: {
      ...mapState(['userAccount', 'accountShow', 'places']),

      accountId () {
        if (!this.userAccount) {
          return null
        }
        return this.userAccount['.key']
      },
      showId () {
        return this.$route.params.id
      },
      image () {
        return this.accountShow && this.accountShow.image ? this.accountShow.image : {
          displayUrl: null,
          storageUri: null
        }
      }
    },
    data () {
      return {
        imageFile: null,
        imageRemoved: false,
        title: '',
        placeId: null
      }
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        if (!this.isNew && this.accountId) {
          this.source = firebase.database().ref('accounts/' + this.accountId + '/shows/' + this.showId)
          this.setRef({key: 'accountShow', ref: this.source})
        } else {
          this.source = null
        }
        this.setRef({key: 'places', ref: firebase.database().ref('places')})
      },

      setImageFile (file) {
        this.imageFile = file
      },
      setImageRemoved (flag) {
        this.imageRemoved = flag
      },

      submitShow () {
        if (!this.accountId) {
          return
        }
        if (!this.placeId) {
          return
        }
        const items = this.places.filter(place => place['.key'] === this.placeId)
        if (items.length === 0) {
          return
        }
        const show = {
          title: this.title,
          place: {
            id: items[0]['.key'],
            title: items[0].title
          }
        }
        const path = '/accounts/' + this.accountId + '/shows'
        store(this.showId, show, path, this.imageRemoved, this.imageFile).then(function (ref) {
          this.$router.push('/account/show/' + ref.key)
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
      'accountShow' () {
        this.title = this.accountShow.title
        this.placeId = this.accountShow.place ? this.accountShow.place.id : null
      }
    }
  }
</script>

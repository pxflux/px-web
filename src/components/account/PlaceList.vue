<template>
  <main>
    <div v-if="user" class="wrap-content grid">
      <PlaceItem v-for="place in accountPlaces" :place="place" :key="place['.key']"></PlaceItem>
      <span class="nothing-found" v-if="accountPlaces.length == 0">Places not found.</span>
      <ul v-if="showForm === false">
        <li><a @click="showForm = true" class="button">Add Place</a></li>
      </ul>
      <form v-if="showForm" id="form-place" @submit.prevent="createPlace">
        <input id="title" type="text" v-model="title" title="Place title" required="required">
        <button class="right">Create</button>
      </form>
    </div>
  </main>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import { log } from '../../helper'
  import firebase from '../../firebase'
  import PlaceItem from './PlaceItem'

  export default {
    created () {
      this.init()
    },
    data () {
      return {
        title: '',
        showForm: false
      }
    },
    computed: {
      ...mapState(['user', 'accountPlaces'])
    },
    methods: {
      ...mapActions(['setRef']),
      ...mapMutations(['REMOVE_ACCOUNT_PLACES']),

      init () {
        if (this.user.uid) {
          this.setRef({
            key: 'accountPlaces',
            ref: firebase.database().ref('users/' + this.user.uid + '/places')
          })
        } else {
          this.REMOVE_ACCOUNT_PLACES()
        }
      },
      createPlace () {
        const newPlace = {
          title: this.title,
          publicId: ''
        }
        const key = firebase.database().ref('users/' + this.user.uid + '/places').push(newPlace, log).key
        this.$router.push('/account/place/' + key)
      }
    },
    components: {
      PlaceItem
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

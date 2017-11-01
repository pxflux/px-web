<template>
  <main>
    <div class="wrap-content text-block">
      <template v-if="user">
        <p :title="item.title">{{ item.title }}</p>
        <p :title="item.author">{{ item.author }}</p>
        <p :title="item.url">{{ item.url }}</p>
        <ul>
          <li>
            <router-link :to="'/artworks/' + item['.key']+ '/update'" class="button">Update</router-link>
          </li>
          <li><a v-if="user" @click="removeArtwork" class="button">Remove</a></li>
          <li><a v-if="user" @click="publishArtwork" class="button">Publish</a></li>
        </ul>
      </template>
    </div>
  </main>
</template>

<script>
  import { mapState } from 'vuex'
  import firebase from '../firebase'

  export default {
    created () {
      this.init()
    },
    computed: {
      ...mapState(['user', 'item'])
    },
    methods: {
      init () {
        this.source = firebase.database().ref('users/' + this.user.uid + '/artworks/' + this.$route.params.id)
        this.$store.dispatch('setItemRef', this.source)
      },
      publishArtwork () {
        const newArtwork = {
          title: this.item.title,
          author: this.item.author,
          url: this.item.url,
          controls: []
        }
        if (this.item.imageUrl) {
          newArtwork.imageUrl = this.item.imageUrl
        }
        this.item.controls.forEach(control => {
          const newControl = {
            label: control.label,
            type: control.type
          }
          if (control.type === 'keyboard') {
            newControl.value = {
              type: control.value.type
            }
            if (control.value.keyCode) {
              newControl.value.keyCode = control.value.keyCode
            }
            if (control.value.altKey) {
              newControl.value.altKey = control.value.altKey
            }
            if (control.value.ctrlKey) {
              newControl.value.ctrlKey = control.value.ctrlKey
            }
            if (control.value.shiftKey) {
              newControl.value.shiftKey = control.value.shiftKey
            }
            if (control.value.metaKey) {
              newControl.value.metaKey = control.value.metaKey
            }
          } else if (control.type === 'function') {
            newControl.value = {
              'function': control.value.function
            }
          }
          newArtwork.controls.push(newControl)
        })
        firebase.database().ref('/artworks').push(newArtwork, function (error) {
          if (error) {
            console.log(error)
          }
        })
      },
      removeArtwork () {
        this.source.remove()
      }
    },
    watch: {
      $route () {
        this.init()
      }
    }
  }
</script>

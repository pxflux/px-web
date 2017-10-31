<template>
  <main>
    <div class="wrap-content">
      <template v-if="user && item">
        <p :title="item.title">{{ item.title }}</p>
        <p :title="item.author">{{ item.author }}</p>
        <p :title="item.url">{{ item.url }}</p>
        <ul>
          <li>
            <router-link :to="'/artworks/' + item['.key']+ '/update'" class="button">Update</router-link>
          </li>
          <li><a @click="removeArtwork" class="button">Remove</a></li>
          <li v-if=" ! item.publicId"><a @click="publishArtwork" class="button">Publish</a></li>
          <li v-if="item.publicId"><a @click="unpublishArtwork" class="button">Unpublish</a></li>
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
        const id = firebase.database().ref('/artworks').push(newArtwork, function (error) {
          if (error) {
            console.log(error)
          }
        }).key
        this.source.update({
          'publicId': id
        })
      },
      unpublishArtwork () {
        if (this.item.publicId) {
          firebase.database().ref('/artworks/' + this.item.publicId).remove()
          firebase.database().ref('users/' + this.user.uid + '/artworks/' + this.$route.params.id + '/publicId').remove()
        }
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

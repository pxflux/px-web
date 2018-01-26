<template>
    <select id="artistIds" v-model="selectedIds" v-on:change="updateValue" multiple required>
      <option v-for="artist in artists" v-bind:value="artist['.key']">{{ artist.fullName }}</option>
    </select>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    props: {
      value: Array
    },
    computed: {
      ...mapState(['artists'])
    },
    data () {
      return {
        selectedIds: this.value.map(it => it.id)
      }
    },
    methods: {
      updateValue: function (event) {
        const keys = this.selectedIds
        this.$emit('input', this.artists.filter(artist => keys.includes(artist['.key'])).map(artist => ({
          id: artist['.key'],
          fullName: artist.fullName
        })))
      }
    }
  }
</script>

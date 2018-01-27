<template>
  <v-select multiple taggable
            v-model="value"
            label="displayName"
            :options="artists"
            class="px"/>
</template>

<script>
  import { mapState } from 'vuex'
  import vSelect from './Select/components/Select'

  export default {
    props: ['value'],
    components: {
      vSelect
    },
    computed: {
      ...mapState(['artists']),
      contributersList () {
        return []
      }
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
    },
    watch: {
      value: function () {
        this.selectedIds = this.value.map(it => it.id)
      }
    }
  }
</script>

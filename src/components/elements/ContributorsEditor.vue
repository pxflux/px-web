<template>
  <v-select
    multiple taggable
    v-model="value"
    label="displayName"
    :options="contributersList"
    :closeOnSelect="false"
    :pushTags="true"
    class="px">
    <template slot="selected-option" slot-scope="option">
      <div class="option">{{ option.displayName }}</div>
      
      <!-- TODO: interface for setting the roles of contributors. Probably a popup bubble (like Popper.js) -->
      <!-- Here is a version with an extra inline select.. could work for now.. -->
      <inline-select
        v-if="withRoles"
        :options="roles"
        taggable
        :pushTags="true"/>
    </template>
  </v-select>
</template>

<script>
  import { mapState } from 'vuex'
  import vSelect from './Select/components/Select'
  import inlineSelect from './Select/components/SelectInline'

  export default {
    props: ['value', 'withRoles'],
    components: {
      vSelect,
      inlineSelect
    },
    computed: {
      ...mapState(['artists']),
      contributersList () {
        return this.artists.map(artist => ({ displayName: artist.fullName, id: artist['.key'] }))
      }
    },
    data () {
      return {
        selectedIds: this.value ? this.value.map(it => it.id) : [],
        roles: [
          'programming',
          'editing',
          'sound',
          'music',
          'production',
          'manager',
          'assistance'
        ]
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

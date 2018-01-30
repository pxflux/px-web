<template>
  <v-select multiple taggable
            v-model="value"
            label="displayName"
            :options="contributersList"
            :closeOnSelect="false"
            :pushTags="true"
            class="px">
    <template slot="selected-option" slot-scope="option">
      <div class="option">{{ option.displayName }}</div>
    <!--
    TODO: interface for setting the Roles of contributors:
    here is an attempt to do so.. an extra inline select..-->
      <inline-select
                :options="roles"
                :pushTags="true"/>
    </template>
  </v-select>
</template>

<script>
  import { mapState } from 'vuex'
  import vSelect from './Select/components/Select'
  import inlineSelect from './SelectInline'

  export default {
    props: ['value'],
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
        selectedIds: this.value.map(it => it.id),
        roles: [
          'artist',
          'artistAssistant',
          'interpreter',
          'curator',
          'exhibitionDesigner',
          'mediaTechnician',
          'conservator',
          'registrar',
          'fabricator',
          'artHandler',
          'externalCompany',
          'other'
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

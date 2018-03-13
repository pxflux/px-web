<template>
  <v-select multiple taggable
            label="fullName"
            :value="value"
            :options="contributors"
            @input="updateValue"
            :closeOnSelect="false"
            :pushTags="true"
            class="px">
    <template slot="selected-option" slot-scope="option">
      <div class="option">{{ option.fullName }}</div>
      <!-- TODO: interface for setting the roles of contributors. Probably a popup bubble (like Popper.js) -->
      <!-- Here is a version with an extra inline select.. could work for now.. -->
      <inline-select v-if="withRoles" :options="roles" taggable :pushTags="true"/>
    </template>
  </v-select>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import firebase from '../../firebase-app'
  import vSelect from './UI/Select/components/Select'
  import inlineSelect from './UI/Select/components/SelectInline'
  import { ContributorRefs } from '../../models/ContributorRef'

  export default {
    props: {
      value: {type: Array, default: () => ContributorRefs.empty()},
      withRoles: {type: Boolean, default: false}
    },
    components: {
      vSelect,
      inlineSelect
    },
    created () {
      this.init()
    },
    computed: {
      ...mapState(['artists']),

      contributors () {
        return ContributorRefs.fromJson(this.artists)
      }
    },
    data () {
      return {
        selectedIds: this.value.map(it => it.id),
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
      ...mapActions(['setRef']),

      init () {
        this.setRef({key: 'artists', ref: firebase.database().ref('artists')})
      },
      updateValue: function (value) {
        this.$emit('input', value)
      }
    },
    watch: {
      $route: function (value) {
        this.init()
      },
      value: function (value) {
        this.selectedIds = value.map(it => it.id)
      }
    }
  }
</script>

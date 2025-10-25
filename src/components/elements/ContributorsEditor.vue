<template>
  <v-select class="px" multiple taggable :pushTags="true" :closeOnSelect="false"
            label="fullName"
            :value="mutableValue"
            :options="contributors"
            @input="updateValue">
    <template slot="selected-option" slot-scope="option">
      <div class="option">{{ option.fullName }}</div>
      <!-- TODO: interface for setting the roles of contributors. Probably a popup bubble (like Popper.js) -->
      <!-- Here is a version with an extra inline select.. could work for now.. -->
      <inline-select taggable :pushTags="true" v-if="withRoles" :value="option.role" :options="roles"
                     @input="(val) => {updateRole(option, val)}"/>
    </template>
  </v-select>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import firebase from '../../firebase-app'
  import vSelect from './UI/Select/components/Select.vue'
  import inlineSelect from './UI/Select/components/SelectInline.vue'
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
        mutableValue: this.value,
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
      },
      updateRole: function (option, value) {
        const selected = this.mutableValue.find(item => item.id === option.id)
        if (selected) {
          selected.role = value
        }
      }
    },
    watch: {
      $route: function () {
        this.init()
      },
      value: function (value) {
        this.mutableValue = value
      }
    }
  }
</script>

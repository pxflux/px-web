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

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ref as dbRef } from 'firebase/database'
import { db } from '../../firebase-app'
import vSelect from './UI/Select/components/Select.vue'
import inlineSelect from './UI/Select/components/SelectInline.vue'
import { ContributorRefs } from '../../models/ContributorRef'

const props = defineProps({
  value: { type: Array, default: () => ContributorRefs.empty() },
  withRoles: { type: Boolean, default: false }
})

const emit = defineEmits(['input'])

const storeInstance = useStore()
const route = useRoute()

const mutableValue = ref(props.value)
const roles = ref([
  'programming',
  'editing',
  'sound',
  'music',
  'production',
  'manager',
  'assistance'
])

const artists = computed(() => storeInstance.state.artists)

const contributors = computed(() => {
  return ContributorRefs.fromJson(artists.value)
})

const init = () => {
  storeInstance.dispatch('setRef', { key: 'artists', ref: dbRef(db, 'artists') })
}

const updateValue = (value) => {
  emit('input', value)
}

const updateRole = (option, value) => {
  const selected = mutableValue.value.find(item => item.id === option.id)
  if (selected) {
    selected.role = value
  }
}

onMounted(() => {
  init()
})

watch(() => route.path, () => {
  init()
})

watch(() => props.value, (value) => {
  mutableValue.value = value
})
</script>

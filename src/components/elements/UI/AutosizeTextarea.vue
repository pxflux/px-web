<template>
  <textarea
    :model="value"
    @input="input"
    :placeholder="placeholder"
    :class="[cssClass, 'autosize']"
    title="autosize textarea">
  </textarea>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import autoSize from 'autosize'

defineProps({
  value: String,
  placeholder: String,
  cssClass: String
})

const emit = defineEmits(['input'])

const textarea = ref(null)

const input = (e) => {
  emit('input', e.target.value)
}

onMounted(() => {
  if (textarea.value) {
    autoSize(textarea.value)
  }
})
</script>

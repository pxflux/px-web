<template>
  <div class="controls-panel">
    <div class="keypad">
      <div v-for="(button, n) in buttons" class="button-box">
        <div v-if="button" @click.stop="sendControl(n)" class="grid-cell button ready" :title="button.label">
          <span v-if="button.icon">{{ button.icon }}</span>
          <span v-if="button.label">{{ button.label }}</span>
        </div>
        <div v-else="" class="grid-cell button">
          <!--<div class="button medium center"></div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  controls: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select'])

const buttons = computed(() => {
  const list = new Array(9)
  if (props.controls) {
    for (let i = 0; i < props.controls.length; i++) {
      const control = props.controls[i]
      const number = control ? control.order || i : i
      if (control) {
        control.index = i
      }
      list[number] = control
    }
  }
  return list
})

const sendControl = (n) => {
  if (n >= 0 && buttons.value.length > n) {
    const control = buttons.value[n]
    if (control) {
      emit('select', control.index)
    }
  }
}
</script>

<template>
  <div class="controls-panel">
    <div class="keypad">
      <el-popover v-for="(button, i) in buttons" :key="i" placement="bottom-start" trigger="click" :ref="'popups-' + i">
        <div class="popper-content">
          <remote-button-options :button="button" :index="i" :title="'Button ' + (i + 1)" @update-button="updateButton"/>
          <div class="button frameless cancel narrow" @click="closeOptions(i)">
            <span class="icon cancel small"></span>
          </div>
        </div>

        <template #reference>
          <div class="button-box">
            <a class="grid-cell button"
               :class="[button? 'ready' : '']"
               :title="[button? 'Edit Button' : 'Add Button']">
              <div v-if="button">
                <span v-if="button.icon">{{ button.icon }}</span>
                <span v-if="button.label">{{ button.label }}</span>
              </div>
              <div v-else="">
                <i class="plus medium"></i>
              </div>
            </a>
          </div>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import RemoteButtonOptions from './RemoteButtonOptions.vue'
import { Controls } from '../../models/Control'

const props = defineProps({
  modelValue: { type: Array, default: () => Controls.empty() }
})

const emit = defineEmits(['update:modelValue'])

const setup = (value) => {
  const data = new Array(9)
  value.forEach(control => {
    if (control.order < data.length) {
      data[control.order] = control
    }
  })
  return data
}

const buttons = ref(setup(props.modelValue))
const index = ref(0)
const popups = ref({})

const closeOptions = (buttonIndex) => {
  if (popups.value['popups-' + buttonIndex]) {
    popups.value['popups-' + buttonIndex][0].hide()
  }
}

const updateButton = (buttonIndex, control) => {
  buttons.value[buttonIndex] = control
  emit('update:modelValue', buttons.value.slice().filter(_ => _))
}

watch(() => props.modelValue, (value) => {
  buttons.value = setup(value)
})
</script>

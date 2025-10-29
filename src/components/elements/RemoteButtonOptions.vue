<template>
  <div class="remote-button-options-box">
    <header>{{title}}</header>
    <div class="option">
      <label class="first">Button Text</label>
      <input type="text" id="label" placeholder="Button Text" v-model="label"/>
      <label>Trigger Event Type</label>
      <v-select v-model="eventType" :options="types" :default-value="'keyboard'"/>
      <div v-if="eventType === 'keyboard'">
        <label :for="'keys' + index">Keyboard Key (+ Modifier Keys)</label>
        <div ref="keysField"
             contenteditable="true"
             @click="refreshHelpMessage"
             @blur="blurKyeDisplay"
             :id="'keys' + index"
             class="key-code-display"
             placeholder="Click here to add KyeCode">
          {{keyCodeDisplayStr}}
          <span>{{keyCodeLiteralStr}}</span>
        </div>
        <span class="description with-arrow">
          {{helpMessage}}
        </span>
      </div>
      <div v-if="eventType === 'custom'">
        <!--<label>Custom Event Name</label>-->
        <!--<input v-model="type"/>-->
        <!--<label>Event Data</label>-->
        <!--<input v-model="detail"/>-->
        Not Supported yet :(<br>Working hard to get it done soon.
      </div>
      <div v-if="eventType === 'mouse'" class="description">
        Not Supported yet :(<br>Working hard to get it done soon.
      </div>
    </div>
    <footer>
      <div class="button frameless" @click="submit">
        <span>OK</span>
      </div>
      <div v-if="button" class="button frameless" @click="clear">
        <span>Clear</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, nextTick, watch, onMounted } from 'vue'
import keycodes from 'keycode'
import VSelect from './UI/Select/components/Select.vue'
import { Control, ControlValue } from '../../models/Control'

const props = defineProps({
  title: String,
  button: Object,
  index: Number
})

const emit = defineEmits(['update-button'])

const label = ref(props.button ? props.button.label : null)
const eventType = ref(props.button ? props.button.type : 'keyboard')
const types = ref(['keyboard', 'custom', 'mouse'])
const keyCodeDisplayStr = ref('')
const keyCodeLiteralStr = ref('')
const helpMessage = ref('')
const keyUpTimeout = ref(null)
const keysField = ref(null)

let keyCombination = {
  keyCode: '',
  modifiers: [],
  modifiersLabels: { altKey: '⌥', ctrlKey: 'Ctrl', metaKey: '⌘', shiftKey: '⇧' },
  modifiersCodes: [18, 17, 91, 93, 16],
  toHtmlString() {
    if (!this.keyCode) return ''
    let litSrt = ''
    let str = ''
    this.modifiers.forEach(m => {
      if (litSrt) litSrt += ' '
      str += this.modifiersLabels[m]
      litSrt += m
    })
    if (litSrt) litSrt += ' '
    if (this.modifiersCodes.indexOf(this.keyCode) === -1) str += keycodes(this.keyCode).toUpperCase()
    litSrt += this.keyCode
    keyCodeDisplayStr.value = str
    keyCodeLiteralStr.value = litSrt
    return str
  }
}

const blurKyeDisplay = () => {
  keyUpTimeout.value = setTimeout(() => {
    if (keysField.value) {
      keysField.value.blur()
    }
    refreshHelpMessage()
  }, 200)
}

const refreshHelpMessage = () => {
  let str = ''
  if (document.activeElement === keysField.value) {
    str = 'Press a key combination, which is expected by your program.'
  } else {
    str = 'Click to '
    str += keyCodeDisplayStr.value ? 'Modify' : 'Specify Key'
  }
  helpMessage.value = str
}

const getKeysCombination = (e) => {
  clearTimeout(keyUpTimeout.value)
  keyCombination.keyCode = e.keyCode
  keyCombination.modifiers = []
  const modifiers = ['altKey', 'ctrlKey', 'metaKey', 'shiftKey']
  modifiers.forEach(m => {
    if (e[m] === true) keyCombination.modifiers.push(m)
  })
  keyCombination.toHtmlString()
  e.preventDefault()
}

const clear = () => {
  emit('update-button', props.index, null)
}

const submit = () => {
  const modifiers = ['altKey', 'ctrlKey', 'metaKey', 'shiftKey']
  const controlValue = new ControlValue('keyup', keyCombination.keyCode, false, false, false, false)
  modifiers.forEach(m => {
    if (keyCombination.modifiers[m] === true) {
      controlValue[m] = true
    }
  })
  const control = new Control(props.index, null, label.value, eventType.value, controlValue)
  emit('update-button', props.index, control)
}

onMounted(() => {
  if (keysField.value) {
    keysField.value.addEventListener('keydown', getKeysCombination)
    keysField.value.addEventListener('keyup', blurKyeDisplay)
  }
  helpMessage.value = refreshHelpMessage()
})

watch(() => props.button, () => {
  label.value = props.button ? props.button.label : null
  eventType.value = props.button ? props.button.type : 'keyboard'
})

watch(eventType, () => {
  if (eventType.value === 'keyboard') {
    refreshHelpMessage()
    nextTick(() => {
      if (keysField.value) {
        keysField.value.addEventListener('keydown', getKeysCombination)
        keysField.value.addEventListener('keyup', blurKyeDisplay)
      }
    })
  }
})
</script>

<template>
  <div class="editable-with-submit">
    <span :contenteditable="editable"
          tabindex="0"
          ref="txt"
          :class="stringClass"
          class="editable with-submit">
    </span>
    <div v-if="!editable" class="button-wrap">
      <button @click="makeEditable"
              class="button frameless"
              contenteditable="false">
        Change
      </button>
    </div>
    <div v-else="" class="button-group button-wrap">

      <button @click="cancel"
              class="button frameless">
        Cancel
      </button>
      <button @click="submit"
              class="button frameless">
        <b>Save</b>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  value: { default: '', type: String },
  stringClass: { default: '', type: String },
  multiLine: { default: false, type: Boolean }
})

const emit = defineEmits(['input'])

const editable = ref(false)
const backup = ref(props.value)
const txt = ref(null)

const makeEditable = () => {
  backup.value = txt.value.innerText
  editable.value = true
  txt.value.focus()
  setCaret()
}

const submit = () => {
  emit('input', txt.value.innerText)
  blur()
}

const cancel = () => {
  txt.value.innerText = backup.value
  blur()
}

const blur = () => {
  txt.value.blur()
  editable.value = false
}

const setCaret = () => {
  const el = txt.value
  const range = document.createRange()
  const sel = window.getSelection()
  range.setStart(el.childNodes[0], el.innerText.length)
  range.collapse(true)
  sel.removeAllRanges()
  sel.addRange(range)
  el.focus()
}

onMounted(() => {
  txt.value.innerText = props.value
  txt.value.addEventListener('keydown', (e) => {
    if (!props.multiLine) {
      if (e.keyCode === 13) {
        submit()
        e.preventDefault()
      }
    }
    if (e.keyCode === 27) {
      cancel()
      e.preventDefault()
    }
  })
})

watch(() => props.value, () => {
  txt.value.innerText = props.value
})
</script>

<template>
  <div>
    <slot></slot>
    <div v-if="showPopper" :id="'vue-popper-'+popperId" class="vue-popper-component">
      <div
        v-if="closeButton"
        @click="showPopper = false"
        :id="'vue-popper-'+popperId+'-close'"
        type="button"
        class="js-popper-close popper-close">
        <slot name="close-button">{{ closeButton }}</slot>
      </div>

      <slot name="content">{{ content }}</slot>

      <div class="popper__arrow" x-arrow></div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  showPopper: {
    type: Boolean,
    required: false,
    default: false
  },
  placement: {
    type: String,
    required: false,
    default: 'top'
  },
  content: {
    type: String,
    required: false,
    default: ''
  },
  closeButton: {
    type: String,
    required: false,
    default: null
  }
})

const popperId = ref(null)
let popper = null

const uuid4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r, v
    r = Math.random() * 16 | 0
    v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const destroyPopper = () => {
  if (popper) {
    popper.destroy()
    popper = null
  }
}

const initPopper = () => {
  const el = document.querySelector('[data-popper-root]')
  if (!el) return

  const popperElement = el.querySelector('.vue-popper-component')
  if (!popperElement) {
    console.warn('Popper element not found in DOM, retrying...')
    setTimeout(() => {
      if (props.showPopper) {
        initPopper()
      }
    }, 50)
    return
  }

  popperId.value = uuid4()
}

onMounted(() => {
  nextTick(() => {
    if (props.showPopper) {
      initPopper()
    }
  })
})

watch(() => props.showPopper, (val) => {
  if (val) {
    nextTick(() => {
      initPopper()
    })
  }
})

onUnmounted(() => {
  destroyPopper()
})
</script>
<style type="scss" scoped>
  $popper-background-color: gold !default;

  .vue-popper-component {
    background: $popper-background-color;
    color: black;
    width: 320px;
    padding: 10px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
    z-index: 1100;
    -webkit-box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.1);
    -moz-box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.1);
    box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.1);

    .popper-close {
      position: absolute;
      top: 2px;
      right: 4px;
      color: black;
      background: transparent;
      border: none;

      &:active,
      &:focus {
        outline: none;
      }
    }

    .popper__arrow {
      width: 0;
      height: 0;
      border-style: solid;
      position: absolute;
      margin: 5px;
    }

    &[x-placement^="top"] {
      margin-bottom: 5px;

      .popper__arrow {
        border-width: 5px 5px 0 5px;
        border-color: $popper-background-color transparent transparent transparent;
        bottom: -5px;
        left: calc(50% - 5px);
        margin-top: 0;
        margin-bottom: 0;
      }
    }

    &[x-placement^="bottom"] {
      margin-top: 5px;

      .popper__arrow {
        border-width: 0 5px 5px 5px;
        border-color: transparent transparent $popper-background-color transparent;
        top: -5px;
        left: calc(50% - 5px);
        margin-top: 0;
        margin-bottom: 0;
      }
    }

    &[x-placement^="right"] {
      margin-left: 5px;

      .popper__arrow {
        border-width: 5px 5px 5px 0;
        border-color: transparent $popper-background-color transparent transparent;
        left: -5px;
        top: calc(50% - 5px);
        margin-left: 0;
        margin-right: 0;
      }
    }

    &[x-placement^="left"] {
      margin-right: 5px;

      .popper__arrow {
        border-width: 5px 0 5px 5px;
        border-color: transparent transparent transparent $popper-background-color;
        right: -5px;
        top: calc(50% - 5px);
        margin-left: 0;
        margin-right: 0;
      }
    }
  }
</style>

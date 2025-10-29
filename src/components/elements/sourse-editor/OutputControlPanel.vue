<template>
  <div class="panel" :class="code" ref="panel">
    <div class="button frameless">
      <div class="icon minus" @click="remove()"></div>
    </div>
    <div class="button frameless">
      <div class="icon plus" @click="append()"></div>
    </div>
    <div class="connectors">
      <header>{{title}}</header>
      <div class="sockets">
        <span v-for="i in data.length" class="socket" :class="code" ref="sockets"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'

const props = defineProps({
  code: String,
  title: String,
  data: Array
})

const emit = defineEmits(['update', 'append', 'remove'])

const panel = ref(null)
const sockets = ref(null)
const numSockets = ref(props.data ? props.data.length : 0)

const append = () => {
  if (numSockets.value < 18) {
    numSockets.value += 1
    emit('append', props.code)
  }
}

const remove = () => {
  if (numSockets.value > 0) {
    numSockets.value -= 1
    emit('remove', props.code)
  }
}

const collectBounds = () => {
  const bounds = []
  if (sockets.value) {
    const panelBounds = panel.value.getBoundingClientRect()
    sockets.value.forEach(el => {
      const socketBounds = el.getBoundingClientRect()
      bounds.push({
        type: 'socket',
        objectBounds: {
          left: socketBounds.left,
          top: socketBounds.top,
          right: socketBounds.right,
          bottom: panelBounds.bottom,
          x: socketBounds.x,
          y: socketBounds.y,
          width: socketBounds.width,
          height: panelBounds.bottom - socketBounds.top
        }
      })
    })
  }
  return bounds
}

onMounted(() => {
  nextTick(() => {
    emit('update')
  })
})

watch(() => props.data, (newValue) => {
  numSockets.value = newValue ? newValue.length : 0
})

defineExpose({
  collectBounds
})
</script>

<style lang="scss" scoped>
  @use 'sass:color';
  @use "../../../assets/sass/vars" as *;
  @use "../../../assets/sass/mixins" as *;
  @use "../../../assets/sass/hidpi" as *;
  @use "../../../assets/sass/components/hairline" as *;

  .panel {
    width: 50%;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    position: relative;
    background: $bg-color;
    @include hairline-border($positionRelative: true, $side: all, $color: #808080, $bg-color: $dark-bg);

    &.video {
      flex-flow: row-reverse nowrap;
    }
    .button {
      background: transparent;
      .icon:before,
      .icon:after {
        border-color: color.adjust($font-color-on-dark, $lightness: -30%);
      }
    }
    header {
      min-height: auto;
      height: auto;
      font-size: $font-size-caption;
      text-align: center;
      margin-bottom: 2px;
    }
    .connectors {
      flex-grow: 1;
      width: 2.5 * $module-size;
      padding: 0 12px;

      .sockets {
        display: flex;
        flex-flow: wrap;
        justify-content: center;
        align-items: center;

        .socket {
          display: block;
          width: 6px;
          height: 6px;
          margin: 2px;
          border-radius: 50%;
          background: #ccc;
          &.audio {
            background: $audio-color;
          }
          &.video {
            background: $video-color;
          }

        }
      }
    }
  }
</style>

<template>
  <div class="outputs-editor-wrapper">
    <connectors-canvas v-if="panelOpened" :start-connectors="outputSockets" :end-connectors="outputBoxes"
                       :trigger="trigger"/>
    <section class="outputs-editor-panel row" ref="outputEditor">
      <label class="with-icon" @click="panelOpened = !panelOpened">
        <span class="icon arrow-right small" :class="[panelOpened? 'open' : '']"></span>
        <span>Outputs</span>
      </label>

      <div v-if="panelOpened" class="outputs-control-panel field">
        <output-control-panel ref="audioOutputControls" code="audio" title="Audio" :data="channel.audioOutputs"
                              @append="appendOutputs($event)"
                              @remove="removeOutputs($event)"/>
        <output-control-panel ref="videoOutputControls" code="video" title="Video" :data="channel.videoOutputs"
                              @append="appendOutputs($event)"
                              @remove="removeOutputs($event)"/>
      </div>
      <div v-else="" class="field closed" @click="panelOpened = !panelOpened">
        <span class="description">{{description}}</span>
      </div>
    </section>

    <section>
      <div v-if="panelOpened" class="outputs-presentation">
        <audio-output-representation-bar ref="audioOutputBar" :value="channel.audioOutputs"
                                         @update="refreshOutputConnections()"/>
        <video-output-representation-bar ref="videoOutputBar" :value="channel.videoOutputs"
                                         @input="setVideoOutputs($event)"/>
      </div>
      <div v-if="panelOpened" class="row">
        <label><span>Summary</span></label>
        <div class="field">
          <span class="description">{{description}}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import OutputControlPanel from './OutputControlPanel.vue'
import AudioOutputRepresentationBar from './AudioOutputRepresentationBar.vue'
import VideoOutputRepresentationBar from './VideoOutputRepresentationBar.vue'
import ConnectorsCanvas from './ConnectorsCanvas.vue'
import VueSelect from '../UI/Select/components/Select.vue'
import { AWChannel } from '../../../models/AWChannel'
import { AWAudioOutputs } from '../../../models/AWAudioOutput'
import { AWVideoOutputs } from '../../../models/AWVideoOutput'

const props = defineProps({
  value: AWChannel
})

const emit = defineEmits(['input'])

const channel = ref(props.value || AWChannel.empty())
const panelOpened = ref(false)
const outputSockets = ref({ audio: [], video: [] })
const outputBoxes = ref({ audio: [], video: [] })
const trigger = ref(0)
const curPanelLeft = ref(0)
const scrollTimeout = ref(null)
const outputEditor = ref(null)
const audioOutputBar = ref(null)
const videoOutputBar = ref(null)
const audioOutputControls = ref(null)
const videoOutputControls = ref(null)

const description = computed(() => {
  return channel.value.toString()
})

const update = () => {
  emit('input', AWChannel.fromJson(JSON.parse(JSON.stringify(channel.value))))
  refreshOutputConnections()
}

const appendOutputs = (type) => {
  if (type === 'audio') {
    AWAudioOutputs.append(channel.value.audioOutputs)
    update()
  }
  if (type === 'video') {
    AWVideoOutputs.append(channel.value.videoOutputs)
    update()
  }
}

const removeOutputs = (type) => {
  if (type === 'audio') {
    AWAudioOutputs.remove(channel.value.audioOutputs)
    update()
  }
  if (type === 'video') {
    AWVideoOutputs.remove(channel.value.videoOutputs)
    update()
  }
}

const setVideoOutputs = (value) => {
  channel.value.videoOutputs = value
  update()
}

const refreshOutputConnections = () => {
  nextTick(() => {
    outputBoxes.value = {
      audio: audioOutputBar.value.collectBounds(),
      video: videoOutputBar.value.collectBounds()
    }
    outputSockets.value = {
      audio: audioOutputControls.value.collectBounds(),
      video: videoOutputControls.value.collectBounds()
    }
    trigger.value++
  })
}

const fixPanelsOnScroll = (e) => {
  clearTimeout(scrollTimeout.value)
  scrollTimeout.value = setTimeout(() => {
    animatePanelsLeft(e.target.scrollLeft)
  }, 100)
}

const animatePanelsLeft = (targetLeft, step) => {
  if (!step) step = (targetLeft - curPanelLeft.value) / 10
  curPanelLeft.value += step
  if (
    (step > 0 && curPanelLeft.value > targetLeft) ||
    (step < 0 && curPanelLeft.value < targetLeft)) {
    curPanelLeft.value = targetLeft
  }
  outputEditor.value.style.left = curPanelLeft.value + 'px'
  refreshOutputConnections()
  if (curPanelLeft.value !== targetLeft) {
    requestAnimationFrame(() => {
      animatePanelsLeft(targetLeft, step)
    })
  }
}

onMounted(() => {
  window.addEventListener('resize', () => {
    refreshOutputConnections()
  })
})

watch(() => props.value, (newValue) => {
  channel.value = newValue || AWChannel.empty()
})

defineExpose({
  fixPanelsOnScroll
})
</script>

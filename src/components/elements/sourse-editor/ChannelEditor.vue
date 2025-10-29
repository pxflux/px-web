<template>
  <div class="channel-wrapper">
    <div class="channel" ref="channel">
      <section class="source-editor-panel row">
        <label>
          <span>Source</span>
        </label>
        <div class="source-editor field">
          <div class="source-wrapper">
            <input type="url" :name="'url' + index" v-model="url" class="path" placeholder="Add source URL here"/>
            <span v-if="error" class="description">{{error}}</span>
            <span v-else class="description">{{sourceDescription}}</span>
          </div>
        </div>
      </section>

      <outputs-panel v-if="channel.source" ref="outputsPanel" :value="channel" @input="setChannel($event)"/>
    </div>
    <div v-if="index" class="button frameless secondary" @click="removeChannel()"><i class="cancel-small"></i></div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import VueSelect from '../UI/Select/components/Select.vue'
import OutputsPanel from './OutputsPanel.vue'
import { AWChannel } from '../../../models/AWChannel'
import { AWSource } from '../../../models/AWSource'

const props = defineProps({
  index: Number,
  value: Object
})

const emit = defineEmits(['remove', 'input'])

const channel = ref(props.value || AWChannel.empty())
const sourceUrl = ref(null)
const error = ref(null)
const outputsPanel = ref(null)

const url = computed({
  set (newValue) {
    sourceUrl.value = newValue
    setUrl(newValue)
  },
  get () {
    if (sourceUrl.value !== null) {
      return sourceUrl.value
    }
    return channel.value.source ? channel.value.source.url : null
  }
})

const sourceDescription = computed(() => {
  return channel.value.source ? channel.value.source.toString() : 'URL (HTML/Javascript or Vimeo video link)'
})

const removeChannel = () => {
  emit('remove', props.index)
}

const setUrl = (url) => {
  AWSource.fromUrl(url).then(source => {
    channel.value.source = source
    error.value = ''
    emit('input', AWChannel.fromJson(JSON.parse(JSON.stringify(channel.value))))
  }).catch(err => {
    error.value = err.message
  })
}

const setChannel = (ch) => {
  emit('input', ch)
}

const fixPanelsOnScroll = (e) => {
  if (outputsPanel.value) {
    outputsPanel.value.fixPanelsOnScroll(e)
  }
}

watch(() => props.value, (newValue) => {
  channel.value = newValue || AWChannel.empty()
})

defineExpose({
  fixPanelsOnScroll
})
</script>

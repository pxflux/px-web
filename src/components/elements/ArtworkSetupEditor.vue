<template>
  <div>
    <section class="config">
      <div class="row">
        <label>
          <span>Setup</span>
        </label>
        <div class="tabs field">
          <div v-for="(config, i) in setups" @click="setupIndex = i" class="tab"
               :class="[setupIndex === i ? 'active': '']">
            {{config.title||'Simple'}}
          </div>
          <div class="button frameless"><span class="icon plus" @click="addSetup()"></span></div>
          <div class="button frameless" v-if="setups.length > 1">
            <span class="icon minus" @click="removeSetup()"></span>
          </div>
        </div>
      </div>
      <div class="setup-editor">
        <div class="row">
          <label class="with-icon" @click="renameConfigOpen = !renameConfigOpen">
            <span class="icon small" :class="[renameConfigOpen? 'cancel' : 'arrow-right']"></span>
            <span>Rename</span>
          </label>
          <div v-if="renameConfigOpen" class="field">
            <input type="text" v-model="setupName"/>
          </div>
        </div>
        <div v-if="setupChannels.length" class="channels-tab-bar row">
          <label><span>Channels</span></label>
          <div v-for="i in setupChannels.length"
               class="tab channel-tab"
               :class="[(i - 1) === channelIndex? 'active': '']"
               @click="selectChannel(i - 1)"
               v-scroll-to="{el: '#'+channelID(i - 1), container: '#channels-container', x: true, y: false}">
            <div class="h1">{{i}}</div>
          </div>
          <div class="button frameless secondary" @click="addChannel()"><i class="plus"></i></div>
        </div>
        <section id="channels-container" class="scene">
          <channel-editor v-for="(channel, i) in setupChannels" :key="i" :id="channelID(i)" :index="i" :value="channel"
                          @input="setChannel(i, $event)" @remove="removeChannel($event)"/>
        </section>
        <section>
          <div class="row">
            <label><span>Video Preview</span></label>
            <div class="field">
              <video-attachment-editor v-model="setups[setupIndex].preview"/>
            </div>
          </div>
          <div class="row">
            <label><span>Images</span></label>
            <div class="field">
              <image-attachment-editor/>
            </div>
          </div>
        </section>
      </div>
    </section>

  </div>
</template>

<script setup>
  import { ref, computed, watch, nextTick } from 'vue'
  import { AWSetup, AWSetups } from '../../models/AWSetup'
  import { AWChannel, AWChannels } from '../../models/AWChannel'
  import ImageAttachmentEditor from './ImageAttachmentEditor.vue'
  import VideoAttachmentEditor from './VideoAttachmentEditor.vue'
  import ChannelEditor from './sourse-editor/ChannelEditor.vue'

  const props = defineProps({
    value: Array
  })

  const emit = defineEmits(['input'])

  const setups = ref((props.value && props.value.length) ? props.value : [AWSetup.empty()])
  const setupIndex = ref(0)
  const renameConfigOpen = ref(false)
  const channelIndex = ref(0)

  const setupName = computed({
    get() {
      return setups.value[setupIndex.value].title
    },
    set(newValue) {
      setups.value[setupIndex.value].title = newValue
      update()
    }
  })

  const setupChannels = computed(() => {
    let channels = setups.value[setupIndex.value].channels
    return channels.length ? channels : [AWChannel.empty()]
  })

  const addSetup = () => {
    AWSetups.append(setups.value)
    selectSetup(setups.value.length)
    update()
  }

  const removeSetup = () => {
    AWSetups.remove(setups.value, setupIndex.value)
    selectSetup(setupIndex.value - 1)
    update()
  }

  const selectSetup = (index) => {
    if (index < 0) {
      setupIndex.value = 0
    } else if (index >= setups.value.length) {
      setupIndex.value = setups.value.length - 1
    } else {
      setupIndex.value = index
    }
  }

  const addChannel = () => {
    AWChannels.append(setups.value[setupIndex.value].channels)
    selectChannel(setups.value[setupIndex.value].channels.length)
    nextTick(() => {
      const scrollToElement = document.querySelector('#' + channelID(channelIndex.value))
      if (scrollToElement) {
        scrollToElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
      }
    })
  }

  const setChannel = (index, event) => {
    setups.value[setupIndex.value].channels[index] = event
    update()
  }

  const removeChannel = (index) => {
    AWChannels.remove(setups.value[setupIndex.value].channels, index)
    selectChannel(index - 1)
    update()
  }

  const selectChannel = (index) => {
    if (index < 0) {
      channelIndex.value = 0
    } else if (index >= setups.value[setupIndex.value].channels.length) {
      channelIndex.value = setups.value[setupIndex.value].channels.length - 1
    } else {
      channelIndex.value = index
    }
  }

  const update = () => {
    emit('input', AWSetups.fromJson(JSON.parse(JSON.stringify(setups.value))))
  }

  const channelID = (index) => 'ch' + index

  watch(() => props.value, (newValue) => {
    if (Array.isArray(newValue) && newValue.length > 0) {
      setups.value = newValue
    } else {
      setups.value = [AWSetup.empty()]
    }
  })
</script>

<template>
  <div>
    <section class="config">
      <div class="row">
        <label>
          <span>Setup</span>
        </label>
        <div class="tabs field">
          <div v-for="(config, i) in setups" @click="configIndex = i" class="tab"
               :class="[configIndex === i ? 'active': '']">
            {{config.title||'Simple'}}
          </div>
          <div class="button frameless"><span class="icon plus" @click="addConfig()"></span></div>
          <div class="button frameless" v-if="setups.length > 1">
            <span class="icon minus" @click="removeConfig()"></span>
          </div>
        </div>
      </div>
      <div class="config-editor">
        <div class="row">
          <label class="with-icon" @click="renameConfigOpen = !renameConfigOpen">
            <span class="icon small" :class="[renameConfigOpen? 'cancel' : 'arrow-right']"></span>
            <span>Rename</span>
          </label>
          <div v-if="renameConfigOpen" class="field">
            <input type="text" v-model="setupName"/>
          </div>
        </div>
        <section class="scene" v-on:scroll="onScroll">
          <channel-editor v-for="(channel, i) in setupChannels"
                          ref="channelEditor"
                          v-model="setupChannels[i]" :key="'ch'+i"/>
        </section>
        <section>
          <div class="row">
            <label><span>Image</span></label>
            <div class="field">
              <image-attachment-editor/>
            </div>
          </div>
          <div class="row">
            <label><span>Video Preview</span></label>
            <div class="field">
              <video-attachment-editor v-model="setups[configIndex].preview"/>
            </div>
          </div>
        </section>
      </div>
    </section>

  </div>
</template>

<script>
  import { AWSetup, AWSetups } from '../../models/AWSetup'
  import VSelect from './UI/Select/components/Select'
  import ImageAttachmentEditor from './ImageAttachmentEditor'
  import VideoAttachmentEditor from './VideoAttachmentEditor'
  import ChannelEditor from './sourse-editor/ChannelEditor'

  export default {
    name: 'artwork-setup-editor',
    props: ['value'],
    components: {
      VSelect,
      ImageAttachmentEditor,
      VideoAttachmentEditor,
      ChannelEditor
    },
    data () {
      return {
        setups: this.value || AWSetups.empty(),
        configIndex: 0,
        scrolling: false,
        renameConfigOpen: false
      }
    },
    computed: {
      setupName: {
        set (newValue) {
          this.setups[this.configIndex].title = newValue
          this.update()
        },
        get () { return this.setups[this.configIndex].title }
      },
      setupChannels: {
        set (newValue) {
          this.setups[this.configIndex].channels = newValue
          this.update()
        },
        get () {
          return this.setups[this.configIndex].channels
        }
      }
    },
    methods: {
      onScroll (e) {
        this.$refs['channelEditor'].fixPanelsOnScroll(e)
      },
      addConfig () {
        this.configIndex++
        this.setups.push(AWSetup.empty())
        this.update()
      },
      removeConfig () {
        this.configIndex--
        this.setups.splice(this.configIndex, 1)
        this.update()
      },
      update () {
        this.$emit('input', AWSetups.fromJson(JSON.parse(JSON.stringify(this.setups))))
      }
    },
    watch: {
      value: function () {
        if (Array.isArray(this.value) && this.value.length > 0) {
          this.setups = this.value
        } else {
          this.setups = AWSetups.empty()
        }
      }
    }
  }
</script>

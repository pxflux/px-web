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
          <div v-for="(channel, i) in setupChannels"
               class="tab channel-tab"
               :class="[i === selectedChannelIndex? 'active': '']"
               @click="selectChannel(i)"
               v-scroll-to="{el: '#'+channelID(i), container: '#channels-container', x: true, y:false}">
            <h1>{{i + 1}}</h1>
          </div>
          <div class="button frameless secondary" @click="addChannel()"><i class="plus"></i></div>
        </div>
        <section id="channels-container" class="scene">
          <div v-for="(channel, i) in setupChannels" class="channel-wrapper">
            <channel-editor v-model="setupChannels[i]" :key="'ch'+i" :id="channelID(i)"/>
            <div v-if="i" class="button frameless secondary" @click="removeChannel()"><i
              class="cancel-small"></i></div>
          </div>
        </section>
        <section>
          <div class="row">
            <label><span>Images</span></label>
            <div class="field">
              <image-attachment-editor/>
            </div>
          </div>
          <div class="row">
            <label><span>Video Preview</span></label>
            <div class="field">
              <video-attachment-editor v-model="setups[setupIndex].preview"/>
            </div>
          </div>
        </section>
      </div>
    </section>
  
  </div>
</template>

<script>
  import { AWSetup, AWSetups } from '../../models/AWSetup'
  import { AWChannel } from '../../models/AWChannel'
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
        setupIndex: 0,
        scrolling: false,
        renameConfigOpen: false,
        selectedChannelIndex: 0
      }
    },
    computed: {
      setupName: {
        set (newValue) {
          this.setups[this.setupIndex].title = newValue
          this.update()
        },
        get () { return this.setups[this.setupIndex].title }
      },
      setupChannels: {
        set (newValue) {
          this.setups[this.setupIndex].channels = newValue
          this.update()
        },
        get () {
          return this.setups[this.setupIndex].channels
        }
      }
    },
    methods: {
      // onScroll (e) {
      //   this.$refs['channelEditor'].fixPanelsOnScroll(e)
      // },
      addSetup () {
        this.setupIndex++
        this.setups.push(AWSetup.empty())
        this.update()
      },
      removeSetup () {
        this.setupIndex--
        this.setups.splice(this.setupIndex, 1)
        this.update()
      },
      addChannel () {
        this.setupChannels.push(new AWChannel())
        this.$nextTick(function () {
          const id = this.setupChannels.length - 1
          this.selectChannel(id)
          this.$scrollTo('#' + this.channelID(id), { container: '#channels-container', x: true, y: false })
        })
      },
      removeChannel (index) {
        this.setupChannels.splice(index, 1)
        if (this.selectedChannelIndex === index) {
          this.selectChannel(index - 1)
        }
        this.update()
      },
      selectChannel (index) {
        this.selectedChannelIndex = index >= 0 && index < this.setupChannels.length ? index : 0
        // const el = document.getElementById(this.channelID(index))
        // if (!el) return
        // const left = el.getBoundingClientRect().left
      },
      update () {
        this.$emit('input', AWSetups.fromJson(JSON.parse(JSON.stringify(this.setups))))
      },
      channelID (index) { return 'ch' + index }
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

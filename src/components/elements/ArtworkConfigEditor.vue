<template>
  <div>
    <section class="config">
      <div class="row">
        <label>
          <span>Setup</span>
        </label>
        <div class="tabs field">
          <div v-model="configName"
               v-for="(config, i) in configs"
               @click="configIndex = i"
               class="tab"
               :class="[configIndex === i ? 'active': '']">
            {{config.title||'Simple'}}
          </div>
          <div class="button frameless"><span class="icon plus" @click="addConfig()"></span></div>
          <div class="button frameless" v-if="configs.length > 1">
            <span class="icon minus" @click="removeConfig()"></span>
          </div>
        </div>
      </div>
      <div class="config-editor">
        <div class="row">
          <label class="with-icon" @click="renameConfigOpen = !renameConfigOpen">
          <span class="icon small"
                :class="[renameConfigOpen? 'cancel' : 'arrow-right']"></span>
            <span>Rename</span>
          </label>
          <div v-if="renameConfigOpen" class="field">
            <input id="configName" type="text" v-model="configName"/>
          </div>
        </div>
        <section class="scene" v-on:scroll="onScroll">
          <source-channel
            ref="sourceChannel"
            v-model="configSource"/>
        </section>
        <!--<div class="row">-->
        <!--<label><span>Required Equipment</span></label>-->
        <!--<div class="field"></div>-->
        <!--</div>-->
        <!--<div class="row">-->
        <!--<label><span>Required Space Characteristics</span></label>-->
        <!--<div class="field"></div>-->
        <!--</div>-->
      </div>
    </section>

  </div>
</template>

<script>
  import { Setup, Setups } from '../../models/Setup'
  import VSelect from './Select/components/Select'
  import ImageAttachmentEditor from './ImageAttachmentEditor'
  import VideoAttachmentEditor from './VideoAttachmentEditor'
  import SourceChannel from './sourse-editor/SourceChannel'

  export default {
    name: 'artwork-configuration-editor',
    props: ['value'],
    components: {
      VSelect,
      ImageAttachmentEditor,
      VideoAttachmentEditor,
      SourceChannel
    },
    data () {
      return {
        configs: this.value || Setups.empty(),
        configIndex: 0,
        scrolling: false,
        renameConfigOpen: false
      }
    },
    computed: {
      configName: {
        set (newValue) {
          this.configs[this.configIndex].title = newValue
          this.update()
        },
        get () { return this.configs[this.configIndex].title }
      },
      configSource: {
        set (newValue) {
          this.configs[this.configIndex].source = newValue
          this.update()
        },
        get () {
          return this.configs[this.configIndex].source
        }
      }
    },
    methods: {
      onScroll (e) {
        this.$refs['sourceChannel'].fixPanelsOnScroll(e)
      },
      addConfig () {
        this.configIndex++
        this.configs.push(Setup.empty())
        this.update()
      },
      removeConfig () {
        this.configIndex--
        this.configs.splice(this.configIndex, 1)
        this.update()
      },
      update () {
        this.$emit('input', Setups.fromJson(JSON.parse(JSON.stringify(this.configs))))
      }
    },
    watch: {
      value: function () {
        if (Array.isArray(this.value) && this.value.length > 0) {
          this.configs = this.value
        } else {
          this.configs = Setups.empty()
        }
      }
    }
  }
</script>

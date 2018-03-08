<template>
  <div>
    <section class="config">
      <div class="row">
        <label>
          <span>Setup</span>
        </label>
        <div class="tabs field">
          <div v-model="curConfigName"
               v-for="(tab, i) in configList"
               @click="curConfigIndex = i"
               class="tab"
               :class="[curConfigIndex === i? 'active': '']">
            {{tab}}
          </div>
          <div class="button frameless"><span class="icon plus"></span></div>
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
            <input id="configName" type="text" v-model="curConfigName"/>
          </div>
        </div>
        <section class="scene" v-on:scroll="onScroll">
          <source-channel
            ref="sourceChannel"
            :source-data="configSource"
            :scrolling="scrolling"/>
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
  import VSelect from './UI/Select/components/Select'
  import ImageAttachmentEditor from './ImageAttachmentEditor'
  import VideoAttachmentEditor from './VideoAttachmentEditor'
  import SourceChannel from './sourse-editor/SourceChannel'

  export default {
    name: 'artwork-configuration-editor',
    props: ['artwork'],
    components: {
      VSelect,
      ImageAttachmentEditor,
      VideoAttachmentEditor,
      SourceChannel
    },
    data () {
      return {
        curConfigIndex: 0,
        configSource: false,
        scrolling: false,
        renameConfigOpen: false
      }
    },
    computed: {
      configList () { return ['Triple projection', 'Single'] },
      curConfigName: {
        set (newValue) {
          this.configList[this.curConfigIndex] = newValue
        },
        get () { return this.configList[this.curConfigIndex] }
      }
    },
    methods: {
      onScroll (e) {
        this.$refs['sourceChannel'].fixPanelsOnScroll(e)
      }
    }
  }
</script>

<template>
  <div>
    <section>
      <div class="row">
        <label>Setup</label>
        <div class="tabs field">
          <span v-model="curConfigName" v-for="(tab, i) in configList"
                @click="curConfigIndex = i"
                class="tab"
                :class="[curConfigIndex === i? 'active': '']">
            {{tab}}
          </span>
        </div>
      </div>
      <div class="config-editor dark space">
        <div class="row">
          <label for="configName">Setup Name</label>
          <div class="field">
            <input id="configName" type="text" v-model="curConfigName"/>
          </div>
        </div>
        <section class="scene">
          <source-channel v-if="configSource"/>
          <div v-else="" class="body">
            <button class="modal" @click="configSource=true">
              Add Source
              <span class="help">HTML/Javascript or video file</span>
            </button>
          </div>
          <!--<source-channel/>-->
        </section>
        <div class="row">
          <label>Required Equipment</label>
          <div class="field"></div>
        </div>
        <div class="row">
          <label>Required Space Characteristics</label>
          <div class="field"></div>
        </div>
      </div>
    </section>
    <section>
      <div class="row">
        <label>Image</label>
        <div class="field">
          <image-attachment-editor v-model="artwork.thumbnail"/>
        </div>
      </div>
      <div class="row">
        <label>Video Preview</label>
        <div class="field">
          <video-attachment-editor v-model="artwork.preview"/>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import VSelect from './Select/components/Select'
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
        configSource: false
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
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/sass/vars";
  @import "../../assets/sass/mixins";
  @import "../../assets/sass/hidpi";
  @import "../../assets/sass/components/hairline";
  @import "../../assets/sass/components/buttons";
  
  .tabs {
    display: flex;
    flex-flow: row nowrap;
    
    > * {
      padding: 0 $module-size / 4;
      line-height: $module-size;
      cursor: pointer;
    }
    .active {
      background: $dark-bg;
      color: $font-color-on-dark;
    }
  }
  
  .dark.space {
    width: 100vw;
    
    .scene {
      min-height: $module-size * 5;
      @include checker-bg-20(#313030, $module-size/4);
      margin: 0;
      
      display: flex;
      flex-flow: row nowrap;
      width: 100vw;
      overflow-x: scroll;
    
      .channel{
        //flex-grow: 1;
        flex-shrink: 0;
        //width: $module-size * 8;
        border-right: 1px dashed transparentize($bg-secondary-color, 0.9);
        padding: $module-size/2 $module-size $module-size $module-size*2.5;
      }
    }
    .row {
      background: $dark-bg;
      > * {
        &:before {
          box-shadow: none
        }
      }
      > *, input {
        background: $dark-bg;
        color: $font-color-on-dark;
      }
    }
  
    .body{
      margin-left: $module-size * 2.5;
    }
    button.modal {
      width: 100%;
      height: 100%;
      box-shadow: none;
      font-size: $font-size-h1 * 0.75;
      line-height: initial;
      color: $button-text-color;
      span.help {
        min-height: auto;
        display: block;
        color: #888888;
        font-size: $font-size-caption; // /1.2;
        line-height: initial;
      }
    }
  }
</style>
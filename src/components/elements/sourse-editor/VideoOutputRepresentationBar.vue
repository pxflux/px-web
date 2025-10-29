<template>
  <div>
    <div class="row output-bar-holder video">
      <label>
        <span>Video</span>
      </label>
      <div class="output-bar video">
        <el-popover v-for="(output, i) in value" :key="i" placement="bottom-start" trigger="click" :ref="'popups-' + i">
          <div class="popper-content">
            <video-options :bus="bus" :index="i" :value="output"/>
            <div class="button frameless cancel narrow" @click="closeOptions(i)">
              <span class="icon cancel small"></span>
            </div>
          </div>

          <template #reference>
            <div class="output-box video" :class="output.type" ref="boxes">
              <div class="description">
                <span class="name">{{i}}</span>
                <span class="type">{{output.type}}</span>
                <span class="description">Any resolution</span>
              </div>
              <div class="icon drop-down small"></div>
            </div>
          </template>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createApp } from 'vue'
import VideoOptions from './OutputVideoOptions.vue'
import { AWVideoOutputs } from '../../../models/AWVideoOutput'

defineProps({
  value: Array
})

const bus = ref(createApp({}))
const boxes = ref(null)
const popups = ref({})

const closeOptions = (index) => {
  if (popups.value['popups-' + index]) {
    popups.value['popups-' + index][0].hide()
  }
}

const collectBounds = () => {
  const bounds = []
  if (boxes.value) {
    boxes.value.forEach(el => {
      bounds.push({ type: 'projection', objectBounds: el.getBoundingClientRect() })
    })
  }
  return bounds
}

defineExpose({
  collectBounds
})
</script>

<style lang="scss" scoped>
  @use 'sass:math';
  @use "../../../assets/sass/vars" as *;
  @use "../../../assets/sass/mixins" as *;
  @use "../../../assets/sass/hidpi" as *;
  @use "../../../assets/sass/components/hairline" as *;
  @use "../../../assets/sass/components/buttons" as *;

  $audio-bar-height: $module-size * 2;
  $video-box-height: $module-size * 2;

  .output-bar-holder {
    position: relative;
    margin-top: $module-size;
    /*display: flex;*/
    /*flex-flow: column nowrap;*/
  }

  .drawer {
    height: 5 * $module-size;
    background: greenyellow;
    width: 100%;
  }

  .output-bar {
    position: relative;
    display: flex;
    align-items: flex-end;

    min-height: $module-size;

    .output-box {
      flex-shrink: 0;
      flex-grow: 0;
      display: flex;
      align-items: center;
      margin-right: math.div($module-size, 8);

      width: $module-size * 2;
      height: $module-size;
      padding: 0;

      @include hairline-border($positionRelative: true, $side: all, $color: #808080, $bg-color: $dark-bg);

      &.audio {
        background: $bg-secondary-color
      }
      .icon {
        position: absolute;
        top: 0;
        right: 0;
        width: math.div($module-size, 2);
        height: math.div($module-size, 2);
        @include button-icon(drop-down);
        &:before {
          border-color: #c7c7c7;
        }
      }
      .description {
        text-align: center;
        flex-grow: 1;
        span {
          display: block;
          &:last-child, &.type {
            font-size: math.div($font-size-caption, 1.2);
          }
        }
      }
    }
    .output-box.video {
      $screen-width: $module-size * 2 * math.div(16, 9);

      background: #fff;
      height: $module-size * 2;
      width: $screen-width;
      position: relative;

      &.projection {
        margin-top: math.div($module-size, 4);
      }
    }
  }
</style>

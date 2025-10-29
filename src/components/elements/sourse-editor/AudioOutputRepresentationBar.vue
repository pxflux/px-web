<template>
  <div>
    <div class="row output-bar-holder audio">
      <label>
        <span>Audio</span>
      </label>
      <div class="output-bar audio">
        <div v-for="output in value" class="output-box audio" ref="boxes">
          <div class="description">
            <span class="name">{{output.channel}}</span>
            <span class="type">audio</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  value: Array
})

const boxes = ref(null)

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

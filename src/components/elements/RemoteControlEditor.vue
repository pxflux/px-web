<template>
  <div class="controls-panel">
    <div class="keypad">
      <el-popover v-for="(button, i) in buttons" :key="i" placement="bottom-start" trigger="click" :ref="'popups-' + i">
        <div class="popper-content">
          <remote-button-options :button="button" :index="i" :title="'Button ' + (i + 1)" @update-button="updateButton"/>
          <div class="button frameless cancel narrow" @click="closeOptions(i)">
            <span class="icon cancel small"></span>
          </div>
        </div>

        <template #reference>
          <div class="button-box">
            <a class="grid-cell button"
               :class="[button? 'ready' : '']"
               :title="[button? 'Edit Button' : 'Add Button']">
              <div v-if="button">
                <span v-if="button.icon">{{ button.icon }}</span>
                <span v-if="button.label">{{ button.label }}</span>
              </div>
              <div v-else="">
                <i class="plus medium"></i>
              </div>
            </a>
          </div>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script>
  import RemoteButtonOptions from './RemoteButtonOptions.vue'
  import { Controls } from '../../models/Control'

  export default {
    components: {RemoteButtonOptions},
    props: {
      modelValue: {type: Array, default: () => Controls.empty()}
    },
    data () {
      return {
        buttons: this.setup(this.modelValue),
        index: 0
      }
    },
    methods: {
      setup (value) {
        const data = new Array(9)
        value.forEach(control => {
          if (control.order < data.length) {
            data[control.order] = control
          }
        })
        return data
      },
      closeOptions (index) {
        this.$refs['popups-' + index][0].hide()
      },
      updateButton (index, control) {
        this.buttons[index] = control
        this.$emit('update:modelValue', this.buttons.slice().filter(_ => _))
      }
    },
    watch: {
      modelValue: function (value) {
        this.buttons = this.setup(value)
      }
    }
  }
</script>

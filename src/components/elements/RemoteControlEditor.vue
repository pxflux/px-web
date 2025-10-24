<template>
  <div class="controls-panel">
    <div class="keypad">
      <el-popover v-for="(button, i) in buttons" :key="i" placement="bottom-start" trigger="click" :ref="'popups-' + i">
        <div class="popper-content">
          <remote-button-options :button="button" :index="i" :title="'Button ' + (i + 1)" :bus="bus"/>
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
  import { createApp } from 'vue'
  import RemoteButtonOptions from './RemoteButtonOptions'
  import { Controls } from '../../models/Control'

  export default {
    components: {RemoteButtonOptions},
    props: {
      value: {type: Array, default: () => Controls.empty()}
    },
    mounted () {
      // Vue 3 doesn't have $on, use mitt or similar for event bus
      // For now, we'll handle events directly in child components
    },
    data () {
      return {
        buttons: this.setup(this.value),
        index: 0,
        bus: createApp({})
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
      submit () {
        this.$emit('input', this.buttons.slice().filter(_ => _))
      }
    },
    watch: {
      value: function (value) {
        this.buttons = this.setup(value)
      }
    }
  }
</script>

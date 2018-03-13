<template>
  <div class="controls-panel">
    <div class="keypad">
      <popper v-for="(button, i) in buttons" :key="i" trigger="click" :options="{placement: 'bottom-start'}">
        <div class="popper">
          <remote-button-options :button="button" :index="i" :title="'Button ' + (i + 1)" :bus="bus"/>
          <div class="button frameless cancel narrow" @click="onPopperCancel(i)">
            <span class="icon cancel small"></span>
          </div>
        </div>

        <div class="button-box" slot="reference">
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
      </popper>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Popper from 'vue-popperjs'
  import RemoteButtonOptions from './RemoteButtonOptions'
  import { Controls } from '../../models/Control'

  export default {
    components: {Popper, RemoteButtonOptions},
    props: {
      value: {type: Array, default: () => Controls.empty()}
    },
    mounted () {
      this.bus.$on('updateButton', (index, options) => {
        console.log('bus.on.updateButton', options)
        this.buttons[index] = options
        this.submit()
      })
    },
    data () {
      return {
        buttons: this.setup(this.value),
        index: 0,
        bus: new Vue()
      }
    },
    methods: {
      setup (value) {
        const buttons = new Array(9)
        Controls.fromJson(value).forEach((button, i) => {
          const order = button.order || i
          if (order < buttons.length) {
            buttons[order] = button
          }
        })
        return buttons
      },
      onPopperCancel (i) {
        this.buttons[i] = null
        this.submit()
      },
      submit () {
        this.$emit('input', this.buttons.slice().filter(_ => _))
      }
    },
    watch: {
      value: function () {
        this.buttons = this.setup(this.value)
      }
    }
  }
</script>

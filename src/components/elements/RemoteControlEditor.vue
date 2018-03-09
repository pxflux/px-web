<template>
  <div class="controls-panel">
    <div class="keypad">
      <popper v-for="(button, i) in buttons"
              :key="i"
              trigger="click"
              :options="{placement: 'bottom-start'}">
        <div class="popper">
          <button-editor :button="button"
                         :index="index"
                         :title="'Button ' + (i + 1)"
                         :bus="bus"/>
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
  import { Buttons as ButtonsList } from '../../models/remote-control/RCButton'
  import Popper from 'vue-popperjs'
  import buttonEditor from './RemoteButtonOptions'

  export default {
    components: { Popper, buttonEditor },
    props: ['controls'],
    computed: {},
    data () {
      return {
        index: 0,
        label: '',
        keyboardType: '',
        keyboardKeyCode: '',
        keyboardAltKey: false,
        keyboardCtrlKey: false,
        keyboardShiftKey: false,
        keyboardMetaKey: false,

        x: 0,
        buttons: new Array(9),
        bus: new Vue()
      }
    },
    mounted () {
      this.bus.$on('updateButton', (options, index) => {
        this.buttons[index] = options
      })
    },
    watch: {
      controls () {
        /** @type RCButton[] */
        const controls = ButtonsList.fromJson(this.controls)
        this.buttons = new Array(9)
        if (controls.length) {
          controls.forEach((button, i) => {
            const order = button.order || i
            if (order < this.buttons.length) {
              this.buttons[order] = button
            }
          })
        }
      }
    },
    methods: {
      showKeyboardForm (n) {
        this.index = n

        const button = this.buttons[this.index] || { value: {} }
        this.label = button.label
        this.keyboardType = button.value.type || 'keydown'
        this.keyboardKeyCode = button.value.keyCode || ''
        this.keyboardAltKey = button.value.altKey || false
        this.keyboardCtrlKey = button.value.ctrlKey || false
        this.keyboardShiftKey = button.value.shiftKey || false
        this.keyboardMetaKey = button.value.metaKey || false
      },

      hideKeyboardForm () {
        this.index = -1
      },

      hasControl () {
        return this.buttons[this.index]
      },

      addControl () {
        const list = this.buttons.slice()
        list[this.index] = {
          order: this.index,
          label: this.label,
          type: 'keyboard',
          value: {
            type: this.keyboardType,
            keyCode: this.keyboardKeyCode,
            altKey: this.keyboardAltKey,
            ctrlKey: this.keyboardCtrlKey,
            shiftKey: this.keyboardShiftKey,
            metaKey: this.keyboardMetaKey
          }
        }
        this.submit(list)
      },

      removeControl () {
        const list = this.buttons.slice()
        list[this.index] = null
        this.submit(list)
      },

      submit (list) {
        this.$emit('update', list.filter(_ => _))
        this.hideKeyboardForm()
      }
    }
  }
</script>

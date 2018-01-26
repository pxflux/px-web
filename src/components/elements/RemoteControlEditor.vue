<template>
  <div class="controls-panel">
    <div class="keypad">
      <div v-for="(button, n) in buttons" class="button-box">
        <a v-if="button" @click.stop="showKeyboardForm(n)" class="grid-cell button ready" title="Update Button">
          <span v-if="button.icon">{{ button.icon }}</span>
          <span v-if="button.label">{{ button.label }}</span>
        </a>
        <a v-else="" @click.stop="showKeyboardForm(n)" class="grid-cell button" title="Add Button">
          <!--<div class="center">-->
            <div class="icon plus medium"></div>
          <!--</div>-->
        </a>
      </div>

      <div class="dialog" v-show="(index > -1)">
        <div class="bg" @click.stop="hideKeyboardForm"></div>

        <div class="dialog-box">
          <div class="dialog-header">
            <div class="button">Button #{{ index + 1 }}</div>
            <div class="button cancel" @click.stop="hideKeyboardForm"></div>
          </div>

          <div class="dialog-body button-editor">
            <label for="label">Text</label>
            <input type="text" id="label" placeholder="Button Text" v-model="label"/>

            <input type="radio" id="keydown" value="keydown" v-model="keyboardType">
            <label for="keydown">Key Down</label>
            <input type="radio" id="keyup" value="keyup" v-model="keyboardType">
            <label for="keyup">Key Up</label>
            <input type="radio" id="keypress" value="keypress" v-model="keyboardType">
            <label for="keypress">Key press</label>

            <label for="keyCode">KeyCode</label>
            <input type="text" id="keyCode" placeholder="KeyCode(s)" v-model="keyboardKeyCode"/>

            <input type="checkbox" id="altKey" value="altKey" v-model="keyboardAltKey">
            <label for="altKey">Alt</label>
            <input type="checkbox" id="ctrlKey" value="ctrlKey" v-model="keyboardCtrlKey">
            <label for="ctrlKey">Ctrl</label>
            <input type="checkbox" id="shiftKey" value="shiftKey" v-model="keyboardShiftKey">
            <label for="shiftKey">Shift</label>
            <input type="checkbox" id="metaKey" value="metaKey" v-model="keyboardMetaKey">
            <label for="metaKey">Meta</label>
          </div>

          <div class="dialog-buttons">
            <button v-if="hasControl" @click.stop="removeControl">
              <span>Remove</span>
            </button>
            <button @click.stop="addControl">
              <span v-if="hasControl">Update</span>
              <span v-else>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['controls'],
    computed: {
      buttons () {
        let list = new Array(9)
        if (this.controls) {
          for (let i = 0; i < this.controls.length; i++) {
            const control = this.controls[i]
            const position = control ? control.order || i : i
            list[position] = control
          }
        }
        return list
      }
    },

    data () {
      return {
        index: -1,

        label: '',
        keyboardType: '',
        keyboardKeyCode: '',
        keyboardAltKey: false,
        keyboardCtrlKey: false,
        keyboardShiftKey: false,
        keyboardMetaKey: false,

        x: 0
      }
    },

    methods: {
      showKeyboardForm (n) {
        this.index = n

        const button = this.buttons[this.index] || {value: {}}
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

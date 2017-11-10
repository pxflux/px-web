<template>
  <div class="controls-panel">
    <div class="keypad">
      <div v-for="(button, n) in buttons" v-model="x" class="button-box">
        <a v-if="button" @click="openButtonEditor(n)"
           class="grid-cell button ready" title="Update Button">
          <span v-if="buttons[n].icon">{{ buttons[n].icon }}</span>
          <span v-if="buttons[n].label">{{ buttons[n].label }}</span>
        </a>
        <a v-else="" @click="openButtonEditor(n)"
           class="grid-cell button" title="Add Button">
          <div class="button plus medium center"></div>
        </a>
      </div>
      <div class="dialog" v-if="(buttonEditorNumber > -1)">
        <div class="bg" @click="closeDialog"></div>
        <div class="dialog-box">
          <div class="dialog-header">
            <div class="button">{{ curDialogTitle }}</div>
            <div class="button cancel" @click="closeDialog"></div>
          </div>
          <div class="dialog-body button-editor">
            <medium-editor
              :text='curIconURL'
              :options='mediumSingleLineOptions'
              :data-placeholder="placeholders.keyIcon"
              :data-label="labels.keyIcon"
              :data-field-name="'curIconURL'"
              v-on:edit='processEditOperation' custom-tag='p'>
            </medium-editor>
            <medium-editor
              :text='curKeyLabel'
              :options='mediumSingleLineOptions'
              :data-placeholder="placeholders.keyLabel"
              :data-label="labels.keyLabel"
              :data-field-name="'curKeyLabel'"
              v-on:edit='processEditOperation' custom-tag='p'>
            </medium-editor>
            <medium-editor
              :text='curKeyCode'
              :options='mediumSingleLineOptions'
              :data-placeholder="placeholders.keyCode"
              :data-label="labels.keyCode"
              :data-field-name="'curKeyCode'"
              v-on:edit='processEditOperation' custom-tag='p'>
            </medium-editor>
            <medium-editor
              :text='curKeyModifier'
              :options='mediumSingleLineOptions'
              :data-placeholder="placeholders.keyModifier"
              :data-label="labels.keyModifier"
              :data-field-name="'curKeyModifier'"
              v-on:edit='processEditOperation' custom-tag='p'>
            </medium-editor>
          </div>
          <div class="dialog-buttons">
            <button v-if="checkButton(buttonEditorNumber)" @click="removeButton(buttonEditorNumber)">
              <span>Remove</span>
            </button>
            <button @click="addButton(buttonEditorNumber)">
              <span v-if="checkButton(buttonEditorNumber)">Update</span>
              <span v-else>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import vueMediumEditor from 'vue2-medium-editor'

  export default {
    created () {
    },
    components: {
      'medium-editor': vueMediumEditor
    },
    data () {
      return {
        buttonEditorNumber: -1,
        buttons: new Array(9),
        x: 0,

        curDialogTitle: '',
        curIconURL: '',
        curKeyLabel: '',
        curKeyCode: '',
        curKeyModifier: '',

        dialogTitle: 'Button #',

        labels: {
          keyIcon: 'Icon',
          keyLabel: 'Text',
          keyCode: 'KeyCode',
          keyModifier: 'Modifiers'
        },

        placeholders: {
          keyIcon: 'Icon',
          keyLabel: 'Button Text',
          keyCode: 'KeyCode(s)',
          keyModifier: 'Modifier Key(s)'
        },

        mediumSingleLineOptions: {
          toolbar: false,
          disableReturn: true,
          disableExtraSpaces: true
        }
      }
    },
    methods: {
      processEditOperation: function (operation) {
        const field = operation.api.origElements.dataset.fieldName
        if (this.hasOwnProperty(field)) {
          this[field] = operation.api.origElements.innerHTML
        }
      },

      checkButton (n) {
        console.log('this.buttons[' + n + ']: ' + this.buttons[n])
        return this.buttons[n]
      },

      openButtonEditor (n) {
        if (this.buttons[n]) {
          this.curIconURL = this.buttons[n].icon
          this.curKeyLabel = this.buttons[n].label
          this.curKeyCode = this.buttons[n].value.keyCode
          this.curKeyModifier = this.buttons[n].value.modifier
        }
        this.curDialogTitle = this.dialogTitle + (n + 1)
        this.buttonEditorNumber = n
      },

      addButton (n) {
        this.buttons[n] = {
          order: n,
          icon: this.curIconURL,
          label: this.curKeyLabel,
          type: 'keyboard',
          value: {
            keyCode: this.curKeyCode,
            modifier: this.curKeyModifier,
            type: 'keydown'
          }
        }
        this.closeDialog()
        this.x++
        console.log(this.buttons)
      },

      removeButton (n) {
        this.buttons[n] = null
        this.closeDialog()
        this.x--
        console.log(this.buttons)
      },

      closeDialog () {
        this.buttonEditorNumber = -1
        this.curIconURL = ''
        this.curKeyLabel = ''
        this.curKeyCode = ''
        this.curKeyModifier = ''
      }
    }
  }
</script>

<template>
  <div class="editable-with-submit">
      <span :contenteditable="editable"
            tabindex="0"
            ref="txt"
            :class="stringClass"
            class="editable with-submit"></span>
    <div v-if="!editable"
         @click="makeEditable"
         class="button frameless"
         contenteditable="false">
      <i class="edit"></i>
    </div>
    <div v-else=""
         class="button-group"
         contenteditable="false">
          <span @click="cancel"
                class="button frameless">
            <i class="cancel-text"></i>
          </span>
      <span @click="submit"
            class="button frameless">
            <i class="save"></i>
          </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'editable-string',
    props: {
      value: { default: '', type: String },
      stringClass: { default: '', type: String },
      multiLine: { default: false, type: Boolean }
    },
    data () {
      return {
        editable: false,
        backup: this.value
      }
    },
    methods: {
      makeEditable () {
        this.backup = this.$refs.txt.innerText
        this.editable = true
        this.$refs.txt.focus()
      },
      submit () {
        this.$emit('input', this.$refs.txt.innerText)
        this.blur()
      },
      cancel () {
        this.$refs.txt.innerText = this.backup
        this.blur()
      },
      blur () {
        this.$refs.txt.blur()
        this.editable = false
      }
    },
    mounted () {
      this.$refs.txt.innerText = this.value
      this.$refs.txt.addEventListener('keydown', (e) => {
        console.log('--> this.multiLine: >>>>>>')
        console.log(this.multiLine)
        if (!this.multiLine) {
          console.log('--> e: >>>>>>')
          console.log(e)
          if (e.key === 13) { // ENTER
            this.submit()
          }
          if (e.key === 27) { // ESC
            this.cancel()
          }
        }
      })
    },
    watch: {
      value () {
        this.$refs.txt.innerText = this.value
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/sass/vars";
  @import "../../../assets/sass/mixins";
  
  .editable-with-submit {
  }
</style>

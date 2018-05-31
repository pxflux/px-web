<template>
  <textarea
    :model="value"
    @input="input"
    :placeholder="placeholder"
    :class="[cssClass, 'autosize']"
    title="autosize textarea">
  </textarea>
</template>

<script>
  import autosize from 'autosize'

  export default {
    name: 'autosize-textarea',
    props: ['value', 'placeholder', 'css-class'],
    mounted () {
      autosize(this.$el)
    },
    methods: {
      input (e) {
        this.$emit('input', e.target.value)
      }
    }
  }
</script>

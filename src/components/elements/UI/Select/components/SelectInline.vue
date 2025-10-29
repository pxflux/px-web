<template>
  <div :dir="dir" class="dropdown inline-select" :class="dropdownClasses">
    <div ref="toggle" @mousedown.prevent="toggleDropdown"
         :class="[dropdownOpen? 'focused': '', 'dropdown-toggle']">

      <span class="selected-inline-tag"
            v-for="option in valueAsArray"
            v-bind:key="option.index">
        <slot name="selected-inline-option" v-bind="option">
          {{ getOptionLabel(option) }}
        </slot>
        <!--<button v-if="multiple" :disabled="disabled" @click="deselect(option)" type="button" class="close"-->
        <!--aria-label="Remove option">-->
        <!--<span aria-hidden="true">&times;</span>-->
        <!--</button>-->
      </span>

      <input
        type="search"
        class="inline-search"
        ref="search"
        v-model="search"
        @keydown.delete="maybeDeleteValue"
        @keyup.esc="onEscape"
        @keydown.up.prevent="typeAheadUp"
        @keydown.down.prevent="typeAheadDown"
        @keydown.enter.prevent="typeAheadSelect"
        @blur="onSearchBlur"
        @focus="onSearchFocus"
        :class="[isValueEmpty ? 'empty' : 'has-value']"
        autocomplete="false"
        :disabled="disabled"
        :placeholder="placeholderValue"
        :tabindex="tabindex"
        :readonly="!searchable"
        :id="inputId"
        aria-label="Search for option"
        v-autowidth=""
      />
      <button
        ref="openIndicator" class=" cancel"
        title="Clear selection">
        <span class="icon small">✕</span>
      </button>

      <slot name="spinner">
        <div class="spinner" v-show="mutableLoading">Loading...</div>
      </slot>
    </div>

    <transition :name="transition">
      <ul ref="dropdownMenu" v-if="dropdownOpen" class="dropdown-menu" :style="{ 'max-height': maxHeight }">
        <li v-for="(option, index) in filteredOptions" v-bind:key="index"
            :class="{ active: isOptionSelected(option), highlight: index === typeAheadPointer }"
            @mouseover="typeAheadPointer = index">
          <a @mousedown.prevent="select(option)">
            <slot name="option" v-bind="option">
              {{ getOptionLabel(option) }}
            </slot>
          </a>
        </li>
        <li v-if="!filteredOptions.length" class="no-options">
          <slot name="no-options">Sorry, no matching options.</slot>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import vSelect from './Select.vue'

defineProps({
  value: {
    default: null
  },
  modelValue: {
    default: null
  },
  defaultValue: {
    default: null
  },
  enableClearButton: {
    default: false
  },
  options: {
    type: Array,
    default () {
      return []
    }
  },
  disabled: {
    type: Boolean,
    default: false
  },
  maxHeight: {
    type: String,
    default: '400px'
  },
  searchable: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: ''
  },
  transition: {
    type: String,
    default: 'fade'
  },
  clearSearchOnSelect: {
    type: Boolean,
    default: true
  },
  closeOnSelect: {
    type: Boolean,
    default: true
  },
  label: {
    type: String,
    default: 'label'
  },
  getOptionLabel: {
    type: Function,
    default (option) {
      if (typeof option === 'object') {
        if (this.label && option[this.label]) {
          return option[this.label]
        }
      }
      return option
    }
  },
  onChange: {
    type: Function,
    default: function (val) {}
  },
  taggable: {
    type: Boolean,
    default: false
  },
  tabindex: {
    type: Number,
    default: null
  },
  pushTags: {
    type: Boolean,
    default: false
  },
  filterable: {
    type: Boolean,
    default: true
  },
  createOption: {
    type: Function,
    default (newOption) {
      return newOption
    }
  },
  resetOnOptionsChange: {
    type: Boolean,
    default: false
  },
  noDrop: {
    type: Boolean,
    default: false
  },
  inputId: {
    type: String
  },
  dir: {
    type: String,
    default: 'auto'
  },
  loading: {
    type: Boolean,
    default: false
  },
  onSearch: {
    type: Function,
    default: function (search, loading) {}
  }
})

const mutableValue = computed(() => {
  return null
})

const valueAsArray = computed(() => {
  if (mutableValue.value && mutableValue.value.multiple) {
    return mutableValue.value.mutableValue
  } else if (mutableValue.value) {
    return [mutableValue.value.mutableValue]
  }
  return ['select a role']
})

const placeholderValue = computed(() => {
  return mutableValue.value ? mutableValue.value.mutableValue : ''
})
</script>

<style scoped>

</style>

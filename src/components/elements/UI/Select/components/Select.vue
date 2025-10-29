<template>
  <div :dir="dir" class="dropdown v-select" :class="dropdownClasses">
    <div ref="toggle" @mousedown.prevent="toggleDropdown"
         :class="[dropdownOpen? 'focused': '', 'dropdown-toggle', 'clearfix']">

      <span class="selected-tag" v-for="option in valueAsArray" v-bind:key="option.index">
        <slot name="selected-option" v-bind="option">
          {{ getOptionLabelFn(option) }}
        </slot>
        <button v-if="multiple"
                @click="deselect(option)"
                :disabled="disabled"
                type="button"
                class="close frameless"
                aria-label="Remove option">
          <span aria-hidden="true">&times;</span>
        </button>
      </span>

      <input
        ref="search"
        v-model="search"
        @keydown.delete="maybeDeleteValue"
        @keyup.esc="onEscape"
        @keydown.up.prevent="typeAheadUp"
        @keydown.down.prevent="typeAheadDown"
        @keydown.enter.prevent="typeAheadSelect"
        @blur="onSearchBlur"
        @focus="onSearchFocus"
        type="search"
        class="form-control"
        autocomplete="false"
        :disabled="disabled"
        :placeholder="searchPlaceholder"
        :tabindex="tabindex"
        :readonly="!searchable"
        :id="inputId"
        aria-label="Search for option"/>

      <button
        v-show="showClearButton"
        :disabled="disabled"
        @click="clearSelection"
        type="button"
        class="frameless clear narrow"
        title="Clear selection">
        <i class="cancel small"></i>
      </button>

      <i v-if="!noDrop" ref="openIndicator" role="presentation" class="open-indicator"></i>

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
              {{ getOptionLabelFn(option) }}
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

<script>
export default {
  props: {
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
      default: null
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
      default: null
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
  }
}
</script>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
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
    default: null
  },
  onChange: {
    type: Function,
    default: null
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
    default: null
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

const emit = defineEmits(['input', 'update:modelValue', 'search:blur', 'search:focus', 'search'])

const toggle = ref(null)
const search = ref(null)
const openIndicator = ref(null)
const dropdownMenu = ref(null)

const search_text = ref('')
const open = ref(false)
const mutableValue = ref(props.modelValue !== null ? props.modelValue : props.value)
const mutableOptions = ref(props.options.slice(0))
const mutableLoading = ref(props.loading)
const typeAheadPointer = ref(-1)

const getOptionLabelFn = (option) => {
  if (props.getOptionLabel) {
    return props.getOptionLabel(option)
  }
  if (typeof option === 'object') {
    if (props.label && option[props.label]) {
      return option[props.label]
    }
  }
  return option
}

const createOptionFn = (newOption) => {
  if (props.createOption) {
    return props.createOption(newOption)
  }
  if (typeof mutableOptions.value[0] === 'object') {
    newOption = { [props.label]: newOption }
  }
  maybePushTag(newOption)
  return newOption
}

const onChangeFn = (val) => {
  if (props.onChange) {
    props.onChange(val)
  } else {
    emit('input', val)
    emit('update:modelValue', val)
  }
}

const searching = computed(() => {
  return !!search_text.value
})

const dropdownOpen = computed(() => {
  return props.noDrop ? false : open.value && !mutableLoading.value
})

const isValueEmpty = computed(() => {
  if (mutableValue.value) {
    if (typeof mutableValue.value === 'object') {
      return !Object.keys(mutableValue.value).length
    }
    return !mutableValue.value.length
  }

  return true
})

const valueAsArray = computed(() => {
  if (props.multiple) {
    return mutableValue.value
  } else if (mutableValue.value) {
    return [mutableValue.value]
  }

  return []
})

const filteredOptions = computed(() => {
  if (!props.filterable && !props.taggable) {
    return mutableOptions.value.slice()
  }
  let options = mutableOptions.value.filter((option) => {
    if (typeof option === 'object' && option.hasOwnProperty(props.label)) {
      const label = option[props.label]
      return label && label.toLowerCase().indexOf(search_text.value.toLowerCase()) > -1
    } else if (typeof option === 'object' && !option.hasOwnProperty(props.label)) {
      return console.warn(`[vue-select warn]: Label key "option.${props.label}" does not exist in options object.\nhttp://sagalbot.github.io/vue-select/#ex-labels`)
    }
    return option && option.toLowerCase().indexOf(search_text.value.toLowerCase()) > -1
  })
  if (props.taggable && search_text.value.length && !optionExists(search_text.value)) {
    options.unshift(search_text.value)
  }
  return options
})

const clearSearchOnBlur = computed(() => {
  return props.clearSearchOnSelect && !props.multiple
})

const searchPlaceholder = computed(() => {
  if (isValueEmpty.value && props.placeholder) {
    return props.placeholder
  }
})

const dropdownClasses = computed(() => {
  return {
    open: dropdownOpen.value,
    single: !props.multiple,
    searching: searching.value,
    searchable: props.searchable,
    unsearchable: !props.searchable,
    loading: mutableLoading.value,
    rtl: props.dir === 'rtl',
    disabled: props.disabled
  }
})

const showClearButton = computed(() => {
  return props.enableClearButton && !props.multiple && !open.value && mutableValue.value != null && mutableValue.value !== props.defaultValue
})

watch(() => props.value, (val) => {
  mutableValue.value = val
})

watch(() => props.modelValue, (val) => {
  mutableValue.value = val
})

watch(mutableValue, (val, old) => {
  let newVal = val
  if (newVal === null) newVal = props.defaultValue
  if (props.multiple) {
    onChangeFn(newVal)
  } else {
    newVal !== old ? onChangeFn(newVal) : null
  }
})

watch(() => props.options, (val) => {
  mutableOptions.value = val
})

watch(mutableOptions, () => {
  if (!props.taggable && props.resetOnOptionsChange) {
    mutableValue.value = props.multiple ? [] : null
  }
})

watch(() => props.multiple, (val) => {
  mutableValue.value = val ? [] : null
})

watch(filteredOptions, () => {
  typeAheadPointer.value = 0
})

watch(() => props.loading, (val) => {
  mutableLoading.value = val
})

watch(search_text, () => {
  if (search_text.value.length > 0) {
    props.onSearch(search_text.value, toggleLoading)
    emit('search', search_text.value, toggleLoading)
  }
})

const select = (option) => {
  if (isOptionSelected(option)) {
    deselect(option)
  } else {
    if (props.taggable && !optionExists(option)) {
      option = createOptionFn(option)
    }

    if (props.multiple && !mutableValue.value) {
      mutableValue.value = [option]
    } else if (props.multiple) {
      mutableValue.value.push(option)
    } else {
      mutableValue.value = option
    }
  }

  onAfterSelect(option)
}

const deselect = (option) => {
  if (props.multiple) {
    let ref = -1
    mutableValue.value.forEach((val) => {
      if (val === option || typeof val === 'object' && val[props.label] === option[props.label]) {
        ref = val
      }
    })
    const index = mutableValue.value.indexOf(ref)
    mutableValue.value.splice(index, 1)
  } else {
    mutableValue.value = null
  }
}

const clearSelection = () => {
  let def = props.defaultValue
  if (props.multiple) {
    if (props.defaultValue) {
      def = Array.isArray(props.defaultValue) ? props.defaultValue : [props.defaultValue]
    } else {
      def = []
    }
  }
  mutableValue.value = def
}

const onAfterSelect = (option) => {
  if (props.closeOnSelect) {
    open.value = !open.value
    search.value.blur()
  }

  if (props.clearSearchOnSelect) {
    search_text.value = ''
  }
}

const toggleDropdown = (e) => {
  if (e.target === openIndicator.value || e.target === search.value || e.target === toggle.value || e.target === e.currentTarget) {
    if (open.value) {
      search.value.blur()
    } else {
      if (!props.disabled) {
        open.value = true
        search.value.focus()
      }
    }
  }
}

const isOptionSelected = (option) => {
  if (props.multiple && mutableValue.value) {
    let selected = false
    mutableValue.value.forEach(opt => {
      if (typeof opt === 'object' && opt[props.label] === option[props.label]) {
        selected = true
      } else if (typeof opt === 'object' && opt[props.label] === option) {
        selected = true
      } else if (opt === option) {
        selected = true
      }
    })
    return selected
  }

  return mutableValue.value === option
}

const onEscape = () => {
  if (!search_text.value.length) {
    search.value.blur()
  } else {
    search_text.value = ''
  }
}

const onSearchBlur = () => {
  if (clearSearchOnBlur.value) {
    search_text.value = ''
  }
  open.value = false
  emit('search:blur')
}

const onSearchFocus = () => {
  open.value = true
  emit('search:focus')
}

const maybeDeleteValue = () => {
  if (!search.value.value.length && mutableValue.value) {
    return props.multiple ? mutableValue.value.pop() : mutableValue.value = null
  }
}

const optionExists = (option) => {
  let exists = false

  mutableOptions.value.forEach(opt => {
    if (typeof opt === 'object' && opt[props.label] === option) {
      exists = true
    } else if (opt === option) {
      exists = true
    }
  })

  return exists
}

const maybePushTag = (option) => {
  if (props.pushTags) {
    mutableOptions.value.push(option)
  }
}

const typeAheadUp = () => {
  if (typeAheadPointer.value > 0) {
    typeAheadPointer.value--
    maybeAdjustScroll()
  }
}

const typeAheadDown = () => {
  if (typeAheadPointer.value < filteredOptions.value.length - 1) {
    typeAheadPointer.value++
    maybeAdjustScroll()
  }
}

const typeAheadSelect = () => {
  if (filteredOptions.value[typeAheadPointer.value]) {
    select(filteredOptions.value[typeAheadPointer.value])
  } else if (props.taggable && search_text.value.length) {
    select(search_text.value)
  }

  if (props.clearSearchOnSelect) {
    search_text.value = ''
  }
}

const maybeAdjustScroll = () => {
  let pixelsToPointerTop = pixelsToPointerTopValue()
  let pixelsToPointerBottom = pixelsToPointerBottomValue()

  if (pixelsToPointerTop <= viewportValue().top) {
    return scrollTo(pixelsToPointerTop)
  } else if (pixelsToPointerBottom >= viewportValue().bottom) {
    return scrollTo(viewportValue().top + pointerHeightValue())
  }
}

const pixelsToPointerTopValue = () => {
  let pixelsToPointerTop = 0
  if (dropdownMenu.value) {
    for (let i = 0; i < typeAheadPointer.value; i++) {
      pixelsToPointerTop += dropdownMenu.value.children[i].offsetHeight
    }
  }
  return pixelsToPointerTop
}

const pixelsToPointerBottomValue = () => {
  return pixelsToPointerTopValue() + pointerHeightValue()
}

const pointerHeightValue = () => {
  let element = dropdownMenu.value ? dropdownMenu.value.children[typeAheadPointer.value] : false
  return element ? element.offsetHeight : 0
}

const viewportValue = () => {
  return {
    top: dropdownMenu.value ? dropdownMenu.value.scrollTop : 0,
    bottom: dropdownMenu.value ? dropdownMenu.value.offsetHeight + dropdownMenu.value.scrollTop : 0
  }
}

const scrollTo = (position) => {
  return dropdownMenu.value ? dropdownMenu.value.scrollTop = position : null
}

const toggleLoading = (toggle = null) => {
  if (toggle == null) {
    return mutableLoading.value = !mutableLoading.value
  }
  return mutableLoading.value = toggle
}
</script>

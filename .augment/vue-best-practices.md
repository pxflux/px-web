# Vue 3 Best Practices

## Use Composition API with `<script setup>`

### Prefer `<script setup>` syntax
- `<script setup>` is the recommended syntax for Vue 3
- Provides better TypeScript support and less boilerplate
- Automatically exposes variables to the template
```vue
<script setup>
import { ref, computed, onMounted } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)

onMounted(() => {
  console.log('Component mounted')
})
</script>

<template>
  <div>{{ count }} - {{ doubled }}</div>
</template>
```

## Component Naming Conventions

### Use PascalCase for component files
- Component files should use PascalCase naming
- Examples: `MyComponent.vue`, `UserProfile.vue`, `ProductCard.vue`
- Avoid: `mycomponent.vue`, `myComponent.vue`, `Mycomponent.vue`

### Prefix base components appropriately
- Base components (purely presentational) should have consistent prefixes
- Use "Base", "V", or "App" prefix
- Examples: `BaseButton.vue`, `BaseCard.vue`, `BaseInput.vue`
- These components should only contain HTML elements, other base components, or 3rd party UI components

### Single-instance components should use "The" prefix
- Components used once per page should be prefixed with "The"
- Examples: `TheHeader.vue`, `TheFooter.vue`, `TheSidebar.vue`, `ThePopup.vue`
- These components are specific to the app and don't accept props

## Props and Events

### Use TypeScript-based props with `defineProps`
- Use type-based declaration for better type safety
- Use `withDefaults` for default values
```vue
<script setup lang="ts">
interface Props {
  title: string
  count?: number
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  isLoading: false
})
</script>

<template>
  <div>{{ title }} - {{ count }}</div>
</template>
```

### For runtime props validation (without TypeScript)
```vue
<script setup>
const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => {
      return ['syncing', 'synced', 'version-conflict', 'error'].includes(value)
    }
  }
})
</script>
```

### Use kebab-case for custom events
- Emit events with kebab-case using `defineEmits`
- Listen to events with kebab-case
```vue
<script setup lang="ts">
const emit = defineEmits<{
  'close-window': []
  'update-value': [value: string]
}>()

function handleClose() {
  emit('close-window')
}
</script>

<template>
  <popup-window @close-window='handleEvent()' />
</template>
```

## Reactivity Best Practices

### Use `ref()` for primitive values
- `ref()` is best for primitive values (strings, numbers, booleans)
- Access the value with `.value` in script, but not in template
```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
const message = ref('Hello')

function increment() {
  count.value++ // Use .value in script
}
</script>

<template>
  <div>{{ count }}</div> <!-- No .value in template -->
</template>
```

### Use `reactive()` for objects
- `reactive()` is best for objects and arrays
- No need for `.value` access
```vue
<script setup>
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  user: {
    name: 'John',
    age: 30
  }
})

function updateUser() {
  state.user.name = 'Jane' // Direct property access
}
</script>
```

### Use `computed()` for derived state
- Computed properties are cached and only re-evaluate when dependencies change
- Always use computed for transformations and calculations
```vue
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed(() => `${firstName.value} ${lastName.value}`)
</script>

<template>
  <div>{{ fullName }}</div>
</template>
```

### Use `toRefs()` when destructuring reactive objects
- Preserves reactivity when destructuring
```vue
<script setup>
import { reactive, toRefs } from 'vue'

const state = reactive({
  count: 0,
  message: 'Hello'
})

// BAD - loses reactivity
const { count, message } = state

// GOOD - preserves reactivity
const { count, message } = toRefs(state)
</script>
```

## Template Best Practices

### Always use :key with v-for
- Keys help Vue track component state and provide predictable behavior
- Essential for animations and transitions
```vue
<!-- BAD -->
<div v-for="product in products">{{ product }}</div>

<!-- GOOD -->
<div v-for="product in products" :key="product.id">{{ product }}</div>
```

### Never use v-if with v-for on the same element
- Vue prioritizes v-for over v-if, causing performance issues
- Use computed properties to filter data instead
```vue
<!-- BAD -->
<div v-for="product in products" v-if="product.price < 500"></div>

<!-- GOOD -->
<script setup>
import { computed } from 'vue'

const cheapProducts = computed(() => {
  return products.value.filter(product => product.price < 100)
})
</script>

<template>
  <div v-for="product in cheapProducts" :key="product.id">{{ product }}</div>
</template>
```

### Keep template expressions simple
- Move complex logic to computed properties or methods
- Templates should be declarative and easy to read
```vue
<!-- BAD -->
<template>
  {{ fullName.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ') }}
</template>

<!-- GOOD -->
<script setup>
import { computed } from 'vue'

const normalizedFullName = computed(() => {
  return fullName.value
    .split(' ')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ')
})
</script>

<template>{{ normalizedFullName }}</template>
```

### Be consistent with directive shorthands
- Prefer using shorthands for cleaner code
- `@` for `v-on:`
- `:` for `v-bind:`
- `#` for `v-slot:`

## Watchers and Lifecycle

### Use `watch` with proper options
- Use `immediate: true` to run watcher on component creation
- Use `deep: true` for watching nested object properties
```vue
<script setup>
import { ref, watch } from 'vue'

const user = ref({ name: 'John', age: 30 })

// Watch with immediate execution
watch(user, (newValue, oldValue) => {
  console.log('User changed:', newValue)
}, { immediate: true, deep: true })
</script>
```

### Use `watchEffect` for automatic dependency tracking
- Automatically tracks reactive dependencies
- Runs immediately on component creation
```vue
<script setup>
import { ref, watchEffect } from 'vue'

const count = ref(0)
const doubled = ref(0)

watchEffect(() => {
  doubled.value = count.value * 2
})
</script>
```

### Use lifecycle hooks from Composition API
- Import lifecycle hooks from 'vue'
- No `created` hook - use `setup` or top-level code in `<script setup>`
```vue
<script setup>
import { onMounted, onUnmounted, onUpdated } from 'vue'

onMounted(() => {
  console.log('Component mounted')
})

onUpdated(() => {
  console.log('Component updated')
})

onUnmounted(() => {
  console.log('Component unmounted')
})
</script>
```

## Composables (Reusable Logic)

### Extract reusable logic into composables
- Composables are functions that use Composition API
- Name composables with `use` prefix
- Return reactive state and methods
- Use `readonly()` to prevent external mutation of internal state
```vue
<script setup>
// useCounter.js
import { ref, computed, readonly } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  function reset() {
    count.value = initialValue
  }

  const isEven = computed(() => count.value % 2 === 0)

  return {
    count: readonly(count), // Prevent external mutation
    increment,
    decrement,
    reset,
    isEven
  }
}

// Component using the composable
import { useCounter } from './useCounter'

const { count, increment, decrement } = useCounter(10)
</script>
```

### Use composables for side effects
- Fetch data, manage timers, handle events
```vue
<script setup>
// useFetch.js
import { ref } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  async function fetchData() {
    loading.value = true
    try {
      const response = await fetch(url)
      data.value = await response.json()
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  return { data, error, loading, fetchData }
}
</script>
```

## TypeScript Best Practices

### Use TypeScript with Vue 3
- Enable `lang="ts"` in script tag
- Define interfaces for props, emits, and state
```vue
<script setup lang="ts">
interface User {
  id: number
  name: string
  email: string
}

const users = ref<User[]>([])
</script>
```

### Type template refs properly
- Use `useTemplateRef` in Vue 3.5+ or typed `ref` in earlier versions
```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <input ref="inputRef" />
</template>
```

## State Management with Pinia

### Use Pinia for complex state management
- Pinia is the official state management library for Vue 3
- Use the setup store syntax for better TypeScript support
```vue
<script setup>
// stores/user.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref([])
  const currentUser = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const userCount = computed(() => users.value.length)
  const activeUsers = computed(() =>
    users.value.filter(user => user.isActive)
  )

  // Actions
  async function fetchUsers() {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch('/api/users')
      users.value = await response.json()
    } catch (err) {
      error.value = 'Failed to fetch users'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  async function addUser(userData) {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      const newUser = await response.json()
      users.value.push(newUser)
      return newUser
    } catch (err) {
      error.value = 'Failed to add user'
      throw err
    }
  }

  return {
    users,
    currentUser,
    isLoading,
    error,
    userCount,
    activeUsers,
    fetchUsers,
    addUser
  }
})
</script>
```

## Code Organization

### Organize imports logically
- Group imports by type: Vue core, composables, components, utilities
```vue
<script setup>
// Vue core
import { ref, computed, onMounted } from 'vue'

// Composables
import { useCounter } from '@/composables/useCounter'

// Components
import UserCard from '@/components/UserCard.vue'

// Utilities
import { formatDate } from '@/utils/date'
</script>
```

### Keep components focused and single-purpose
- Each component should have one clear responsibility
- Extract complex logic into composables
- Break down large components into smaller ones

### Use provide/inject for deep component trees
- Avoid prop drilling through multiple levels
- Provide type safety with default values
```vue
<script setup>
// Parent component
import { provide, ref } from 'vue'

const theme = ref('light')
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

provide('theme', {
  current: theme,
  toggle: toggleTheme
})

// Child component (any level deep)
import { inject } from 'vue'

// With default value and type safety
const theme = inject('theme', {
  current: ref('light'),
  toggle: () => {}
})
</script>
```

## Performance Best Practices

### Use `v-once` for static content
- Renders element/component only once
```vue
<template>
  <div v-once>{{ staticContent }}</div>
</template>
```

### Use `v-memo` for conditional re-rendering (Vue 3.2+)
- Memoizes template sub-tree
```vue
<template>
  <div v-memo="[user.id, user.name]">
    {{ user.name }} - {{ user.email }}
  </div>
</template>
```

### Use `shallowRef` and `shallowReactive` for large objects
- Only tracks top-level reactivity
```vue
<script setup>
import { shallowRef } from 'vue'

const largeObject = shallowRef({
  // Large nested structure
})
</script>
```

### Lazy load components with Suspense
- Use `defineAsyncComponent` for code splitting
- Combine with `Suspense` for loading states
```vue
<template>
  <Suspense>
    <template #default>
      <UserList />
    </template>
    <template #fallback>
      <div class="loading">
        <p>Loading users...</p>
        <div class="spinner"></div>
      </div>
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

const UserList = defineAsyncComponent(() =>
  import('./components/UserList.vue')
)
</script>
```

### Use `markRaw` for non-reactive data
- Prevents Vue from making large objects reactive
- Useful for third-party library instances (charts, maps, etc.)
```vue
<script setup>
import { ref, markRaw } from 'vue'

const chartInstance = ref(null)

function initChart() {
  const chart = new Chart(canvasRef.value, chartConfig)
  chartInstance.value = markRaw(chart) // Prevents reactivity overhead
}
</script>
```

## Error Handling

### Implement global error handler
- Catch all unhandled errors in one place
- Send errors to monitoring services
```vue
<script setup>
// main.js
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err)
  console.error('Component:', instance)
  console.error('Error info:', info)

  // Send to error reporting service
  // errorReportingService.report(err, { instance, info })
}

app.mount('#app')
</script>
```

### Use error boundaries with `onErrorCaptured`
- Catch errors in child components
- Provide fallback UI
```vue
<template>
  <div>
    <div v-if="error" class="error-boundary">
      <h2>Something went wrong</h2>
      <p>{{ error.message }}</p>
      <button @click="retry">Try Again</button>
    </div>
    <slot v-else />
  </div>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'

const error = ref(null)

function retry() {
  error.value = null
}

onErrorCaptured((err) => {
  error.value = err
  return false // Prevent error from propagating
})
</script>
```

## Testing Best Practices

### Test components with Composition API
- Use `@vue/test-utils` for component testing
- Test user interactions and emitted events
```vue
<script setup>
// UserList.test.js
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import UserList from '@/components/UserList.vue'

describe('UserList', () => {
  const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ]

  it('renders users correctly', () => {
    const wrapper = mount(UserList, {
      props: { users: mockUsers }
    })

    expect(wrapper.findAll('[data-testid="user-item"]')).toHaveLength(2)
    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('Jane Smith')
  })

  it('emits user-selected event when user is clicked', async () => {
    const wrapper = mount(UserList, {
      props: { users: mockUsers }
    })

    await wrapper.find('[data-testid="user-item"]').trigger('click')

    expect(wrapper.emitted('user-selected')).toBeTruthy()
    expect(wrapper.emitted('user-selected')[0]).toEqual([mockUsers[0]])
  })
})
</script>
```

### Test composables in isolation
- Test composables without mounting components
- Verify reactive behavior
```vue
<script setup>
// useCounter.test.js
import { describe, it, expect } from 'vitest'
import { useCounter } from '@/composables/useCounter'

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { count } = useCounter()
    expect(count.value).toBe(0)
  })

  it('initializes with custom value', () => {
    const { count } = useCounter(10)
    expect(count.value).toBe(10)
  })

  it('increments count', () => {
    const { count, increment } = useCounter()
    increment()
    expect(count.value).toBe(1)
  })

  it('computes even/odd correctly', () => {
    const { count, increment, isEven } = useCounter(0)
    expect(isEven.value).toBe(true)

    increment()
    expect(isEven.value).toBe(false)
  })
})
</script>
```


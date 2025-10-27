/**
 * Vue 3 Composition API submenu helper
 * Replaces the old SubmenuHelper mixin for use with <script setup>
 */
import { ref, getCurrentInstance } from 'vue'

export function useSubmenu() {
  const submenuTimeout = ref(null)
  const submenuClass = ref('')
  const delayBeforeClose = 1500

  const instance = getCurrentInstance()

  const toggleSubmenu = (event) => {
    const el = event.currentTarget
    if (!el || !el.parentNode) return

    const submenu = el.parentNode.getElementsByClassName('submenu')[0]
    if (!submenu) {
      return
    }

    if (submenu.classList.contains('open')) {
      submenu.classList.remove('open')
      cancelSubmenuTimeout()
    } else {
      closeSubmenus()
      submenu.classList.add('open')
      cancelSubmenuTimeout()
    }
  }

  const closeSubmenus = () => {
    if (!instance?.proxy?.$el || !submenuClass.value) return

    const openSubmenus = instance.proxy.$el.querySelectorAll(`.${submenuClass.value}.open`)
    if (!openSubmenus) return

    for (let i = 0; i < openSubmenus.length; i++) {
      openSubmenus[i].classList.remove('open')
    }
    cancelSubmenuTimeout()
  }

  const setupSubmenusWithClass = (submenuClassName, submenuTriggerClass) => {
    if (!instance?.proxy?.$el) {
      console.warn('Component DOM element not available for submenu setup')
      return
    }

    submenuClass.value = submenuClassName
    submenuTriggerClass = submenuTriggerClass || `${submenuClassName}-trigger`

    const triggers = instance.proxy.$el.querySelectorAll(`.${submenuTriggerClass}`)
    if (!triggers.length) {
      return
    }

    for (let i = 0; i < triggers.length; i++) {
      const trigger = triggers[i]
      trigger.addEventListener('click', toggleSubmenu)
      trigger.addEventListener('mouseleave', () => {
        setSubmenuCloseTimeout(delayBeforeClose)
      })
      trigger.addEventListener('mouseover', (event) => {
        if (currentMenuIsOpen(event)) {
          cancelSubmenuTimeout()
        }
      })
    }

    const submenus = instance.proxy.$el.querySelectorAll(`.${submenuClassName}`)
    for (let i = 0; i < submenus.length; i++) {
      const submenu = submenus[i]
      submenu.addEventListener('mouseleave', () => {
        setSubmenuCloseTimeout(delayBeforeClose)
      })
      submenu.addEventListener('mouseover', (event) => {
        if (submenu.classList.contains('open')) {
          cancelSubmenuTimeout()
        }
      })
    }
  }

  const currentMenuIsOpen = (event) => {
    const el = event.currentTarget
    if (!el || !el.parentNode) return false

    const submenu = el.parentNode.getElementsByClassName('submenu')[0]
    return submenu && submenu.classList.contains('open')
  }

  const setSubmenuCloseTimeout = (sec) => {
    cancelSubmenuTimeout()
    submenuTimeout.value = setTimeout(closeSubmenus, sec)
  }

  const cancelSubmenuTimeout = () => {
    if (typeof submenuTimeout.value === 'number') {
      clearTimeout(submenuTimeout.value)
      submenuTimeout.value = null
    }
  }

  return {
    closeSubmenus,
    setupSubmenusWithClass
  }
}
/**
 * maxim tyminko 02.11.17.
 * maximtyminko.com
 */
export default {
  data () {
    return {
      submenuTimeout: null,
      submenuClass: ''
    }
  },
  methods: {
    /**
     * @param {Event} event
     */
    toggleSubmenu: function (event) {
      const el = event.currentTarget
      const submenu = el.parentNode.getElementsByClassName('submenu')[ 0 ]
      if (!submenu) {
        return
      }

      if (submenu.classList.contains('open')) {
        submenu.classList.remove('open')
        this.cancelSubmenuTimeout()
      } else {
        submenu.classList.add('open')
        this.cancelSubmenuTimeout()
        // this.submenuTimeout = setTimeout(this.closeSubmenus, 2000)
      }
    },

    closeSubmenus: function () {
      const openSubmenus = this.$el.querySelectorAll(`.${this.submenuClass}.open`)
      for (let i = 0; i < openSubmenus.length; i++) {
        openSubmenus[ i ].classList.remove('open')
      }
      this.cancelSubmenuTimeout()
    },

    /**
     * @param {string} submenuClass
     * @param {string=} submenuTriggerClass
     */
    setupSubmenusWithClass: function (submenuClass, submenuTriggerClass) {
      this.submenuClass = submenuClass
      submenuTriggerClass = submenuTriggerClass || `${submenuClass}-trigger`
      const _this = this
      const trigger = this.$el.querySelector(`.${submenuTriggerClass}`)
      if (!trigger) {
        return
      }
      trigger.addEventListener('click', this.toggleSubmenu)
      trigger.addEventListener('mouseleave', function () {
        _this.setSubmenuCloseTimeout(2000)
      })
      trigger.addEventListener('mouseover', this.cancelSubmenuTimeout)

      const submenus = this.$el.querySelectorAll(`.${submenuClass}`)
      for (let i = 0; i < submenus.length; i++) {
        const submenu = submenus[ i ]
        submenu.addEventListener('mouseleave', function () {
          _this.setSubmenuCloseTimeout(1500)
        })
        submenu.addEventListener('mouseover', this.cancelSubmenuTimeout)
      }
    },
    /**
     * @param {number} sec
     */
    setSubmenuCloseTimeout: function (sec) {
      this.cancelSubmenuTimeout()
      this.submenuTimeout = setTimeout(this.closeSubmenus, sec)
    },
    cancelSubmenuTimeout: function () {
      if (typeof this.submenuTimeout === 'number') {
        clearTimeout(this.submenuTimeout)
        this.submenuTimeout = null
      }
    }
  }
}

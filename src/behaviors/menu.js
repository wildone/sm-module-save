const easings = simpla.constants.easings,
      ANIMATION = {
        frames: [
          { transform: 'translateY(-100%)' },
          { transform: 'translateY(0)' }
        ],
        opts: {
          easing: easings.easeOutCubic,
          fill: 'both',
          duration: 180
        }
      };

export default {

  properties: {

    // Array of menu item objects
    // { id: String, text: String, icon: String, onTap: function }
    menu: Array,

    // Keep track of whether menu is open or closed
    _menuActive: {
      type: Boolean,
      observer: '_menuActiveChanged'
    },

    // Icon on the menu toggle button
    // (computed based on state)
    _menuIcon: {
      type: String,
      computed: '_computeMenuIcon(_menuActive)',
      value: 'simpla:arrow-down'
    }

  },

  /**
   * Convinience method to toggle the _menuActive property
   * @return undefiend
   */
  toggleMenu() {
    this._menuActive = !this._menuActive;
  },

  /**
   * Open and close the menu on _menuActive change
   * @param  {Boolean} active state of the _menuActive property
   * @return undefined
   */
  _menuActiveChanged(active) {
    active ? this._openMenu() : this._closeMenu()
  },

  /**
   * Animate the menu in
   * @return undefined
   */
  _openMenu(){
    let menu = this.$.menu;

    this.toggleAttribute('visible', true, menu);
    menu.animate(ANIMATION.frames, ANIMATION.opts);
  },

  /**
   * Animate the menu out
   * @return undefined
   */
  _closeMenu() {
    let menu = this.$.menu,
        animation;

    animation = menu.animate(ANIMATION.frames.slice().reverse(), ANIMATION.opts);
    animation.onfinish = () => {
      this.toggleAttribute('visible', false, menu);
    }
  },

  /**
   * Compute menu icon based on menu state
   * @param  {Boolean} _menuActive whether menu acitve or not (property)
   * @return undefined
   */
  _computeMenuIcon(_menuActive) {
    let icon;

    _menuActive ? icon = 'simpla:arrow-up' : icon = 'simpla:arrow-down';
    return icon;
  },

  /*********************
   * Menu item actions *
   *********************/

  /**
   * Trigger logout
   * @return undefined
   */
  _logout() {
    this.$.auth.logout();
  },

  /**
   * Handle menu item taps
   * @param  {CustomEvent} event Takes model property from event to get name of
   *                             	tap handler
   * @return undefined
   */
  _menuItemTap(event) {
    let model = event.model;

    if (model && typeof this[model.item.onTap] === 'function') {
      this[model.item.onTap](event);
    }
  }
};

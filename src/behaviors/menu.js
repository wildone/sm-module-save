export default {

  properties: {

    /**
     * Menu items
     * @type {Array}
     * { id: String, text: String, icon: String, onTap: function }
     */
    menu: Array,

    /**
     * Whether menu active or not
     * @type {Boolean}
     */
    _menuActive: {
      type: Boolean,
      observer: '_menuActiveChanged'
    },

    /**
     *  Icon on the menu toggle button
     *  (computed based on state)
     *  @type {String}
     */
    _menuIcon: {
      type: String,
      computed: '_computeMenuIcon(_menuActive)',
      value: 'simpla:arrow-down'
    }

  },

  /**
   * Convinience method to toggle the menu
   * @return {undefined}
   */
  toggleMenu() {
    this._menuActive = !this._menuActive;
  },

  /**
   * Compute menu icon based on menu state
   * @param  {Boolean} _menuActive Current state of _menuActive
   * @return {undefined}
   */
  _computeMenuIcon(_menuActive) {
    let icon;

    _menuActive ? icon = 'simpla:arrow-up' : icon = 'simpla:arrow-down';
    return icon;
  },

  /**
   * Handle menu item taps
   * @param  {CustomEvent} event Takes model property from event to get name of tap handler
   * @return {undefined}
   */
  _menuItemTap(event) {
    let model = event.model;

    if (model && typeof this[model.item.onTap] === 'function') {
      this[model.item.onTap](event);
    }

    this._menuActive = false;
  },

  /*********************
   * Menu item actions *
   *********************/

  /**
   * Trigger logout
   * @return {undefined}
   */
  _logout() {
    this.$.auth.logout();
  }

};

export default {
  properties: {
    _authenticated: {
      type: Boolean,
      value: () => Simpla.getState().authenticated
    },

    _editing: {
      type: Boolean,
      value: () => Simpla.getState().editing
    }
  },

  observers: [
    '_updateHidden(_authenticated, _editing)'
  ],

  created() {
    Simpla.observe('authenticated', (authenticated) => {
      this._authenticated = authenticated;
    });

    Simpla.observe('editing', (editing) => {
      this._editing = editing;
    });
  },

  ready() {
    // In case they're undefined
    this._updateHidden(this._authenticated, this._editing);
  },

  _updateHidden(_authenticated, _editing) {
    if (_authenticated && _editing) {
      this.removeAttribute('hidden');
    } else {
      this.setAttribute('hidden', '');
    }
  }
}

let singleton = document.createElement('sm-module-save');

if (document.body) {
  document.body.appendChild(singleton);
} else {
  document.addEventListener('readystatechange', () => {
    if (document.body) {
      document.body.appendChild(singleton);
    }
  });
}

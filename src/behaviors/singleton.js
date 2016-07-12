export default {
  properties: {
    _authenticated: {
      type: Boolean,
      observer: '_authenticatedChanged',
      value: Simpla.getState().authenticated
    }
  },

  created() {
    Simpla.observe('authenticated', (authenticated) => {
      this._authenticated = authenticated;
    })
  },

  _authenticatedChanged(_authenticated) {
    if (_authenticated) {
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

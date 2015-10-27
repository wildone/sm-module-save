import menu from './behaviors/menu';

class SmModuleSave {
  beforeRegister() {
    this.is = 'sm-module-save';

    this.properties = {
      menuActive: Boolean,
      busy: Boolean
    };

    this.listeners = {
      'saving': '_beBusy',
      'saved': '_dontBeBusy'
    };
  }

  get behaviors() {
    return [
      menu
    ];
  }

  save() {
    let leftToSave = 0,
        haveTriedAll = false;

    this.fire('saving');

    simpla.elements.forEach(element => {
      let willSave,
          saved;

      saved = () => {
        leftToSave--;
        element.removeEventListener('saved', saved);

        if (leftToSave === 0 && haveTriedAll) {
          this.fire('saved');
        }
      };

      willSave = element.save();

      if (willSave) {
        leftToSave++;
        element.addEventListener('saved', saved);
      }
    });

    haveTriedAll = true;
  }

  logout() {
    this.$.auth.logout();
  }

  _menuOpenClose() {
    this.menuActive = !this.menuActive;
  }

  _beBusy() {
    this.busy = true;
  }

  _dontBeBusy() {
    this.busy = false;
  }
}

Polymer(SmModuleSave);

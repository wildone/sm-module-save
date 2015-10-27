import menu from './behaviors/menu';

class SmModuleSave {
  beforeRegister() {
    this.is = 'sm-module-save';

    this.properties = {
      menuActive: Boolean,

      busy: Boolean,

      menuIcon: {
        type: String,
        computed: '_computeMenuIcon(menuActive)',
        value: 'simpla:arrow-down'
      }
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
        successfulSaves = 0,
        failedSaves = 0,
        haveTriedAll = false,
        finished;

    this.fire('saving');

    finished = () => {
      if (failedSaves === 0) {
        this.fire('saved');
      } else {
        this.fire('save-failed', { all: successfulSaves === 0 });
      }
    };

    simpla.elements.forEach(element => {
      let addElement,
          removeElement,
          saved = () => removeElement(true),
          failed = () => removeElement(false);

      addElement = function() {
        leftToSave++;
        element.addEventListener('saved', saved);
        element.addEventListener('error', failed);
      };

      removeElement = function(success) {
        leftToSave--;
        element.removeEventListener('saved', saved);
        element.removeEventListener('error', failed);

        if (success) {
          successfulSaves++;
        } else {
          failedSaves++;
        }

        if (leftToSave === 0 && haveTriedAll) {
          finished();
        }
      };

      if (element.save()) {
        addElement();
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


  _computeMenuIcon(menuActive) {
    let icon;

    if (menuActive) {
      icon = 'simpla:arrow-up'
    } else {
      icon = 'simpla:arrow-down'
    }

    return icon;
  }

  _beBusy() {
    this.busy = true;
  }

  _dontBeBusy() {
    this.busy = false;
  }
}

Polymer(SmModuleSave);

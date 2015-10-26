import menu from './behaviors/menu';

class SmModuleSave {
  beforeRegister() {
    this.is = 'sm-module-save';

    this.properties = {
      menuActive: Boolean
    }
  }

  get behaviors() {
    return [
      menu
    ];
  }

  save() {
    let leftToSave = 0,
        haveTriedAll = false;

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
}

Polymer(SmModuleSave);

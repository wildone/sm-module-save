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

}

Polymer(SmModuleSave);

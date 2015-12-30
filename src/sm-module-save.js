import menu from './behaviors/menu';
import notify from './behaviors/notify';

class SmModuleSave {
  beforeRegister() {
    this.is = 'sm-module-save';

    this.properties = {

      // Show button as busy
      // while saving
      busy: Boolean,

    };

    // Listen for save events
    // to enter and exit busy
    this.listeners = {
      'saving': '_beBusy',
      'saved': '_stopBusy'
    };
  }

  get behaviors() {
    return [
      menu,
      notify
    ];
  }

  /**
   * Tell Simpla elements to save their data
   * @return {undefined}
   */
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

  /**
   * Trigger button busy state true
   * @return {undefined}
   */
  _beBusy() {
    this.busy = true;
  }

  /**
   * Trigger button busy state false
   * @return {undefined}
   */
  _stopBusy() {
    this.busy = false;
  }
}

Polymer(SmModuleSave);

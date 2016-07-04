import menu from './behaviors/menu';
import notify from './behaviors/notify';

class SmModuleSave {
  beforeRegister() {
    this.is = 'sm-module-save';

    this.properties = {

      /**
       * Whether saving
       * @type {[type]}
       */
      busy: Boolean,

      hidden: {
        type: Boolean,
        reflectToAttribute: true,
        value: true
      }

    };

    this.listeners = {
      'saving': '_beBusy',
      'saved': '_stopBusy',
      'auth.authenticated-changed': '_updateHidden'
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

    /**
     * Fires saved, if there were no fails, otherwise fires save-failed
     * @return {[type]} [description]
     */
    finished = () => {
      if (failedSaves === 0) {
        this.fire('saved');
      } else {
        this.fire('save-failed', { all: successfulSaves === 0 });
      }
    };

    // For each element, make a save request, then keep track of the successes
    //  of these requests, emited saved or save-failed once all requests have
    //  come back, and the success of them is known
    simpla.elements.forEach(element => {
      let addElement,
          removeElement,
          saved = () => removeElement(true),
          failed = () => removeElement(false);

      /**
       * Add the element, then listen for a saved or errored event
       * @return {undefined}
       */
      addElement = function() {
        // Add listeners and incremement leftToSave
        leftToSave++;
        element.addEventListener('saved', saved);
        element.addEventListener('error', failed);
      };

      /**
       * Removes the element i.e. the save request was completed, successful or not
       * @param  {Boolean} success If the save was successful or not
       * @return {undefined}
       */
      removeElement = function(success) {
        // Done with the element, remove listeners and decrement leftToSave
        leftToSave--;
        element.removeEventListener('saved', saved);
        element.removeEventListener('error', failed);

        if (success) {
          successfulSaves++;
        } else {
          failedSaves++;
        }

        // If it's not waiting on any more saves call finished.
        if (leftToSave === 0 && haveTriedAll) {
          finished();
        }
      };

      // Only add the element if the save request actually occurs
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

  logout() {
    this.$.auth.logout();
  }

  _updateHidden(event) {
    this.hidden = !event.detail.value;
  }

};

Polymer(SmModuleSave);

import menu from './behaviors/menu';
import notify from './behaviors/notify';
import singleton from './behaviors/singleton';

class SmModuleSave {
  beforeRegister() {
    this.is = 'sm-module-save';

    this.properties = {

      /**
       * Whether saving
       * @type {[type]}
       */
      busy: Boolean,

    };

    this.listeners = {
      'saving': '_beBusy',
      'saved': '_stopBusy',
      'save-failed': '_stopBusy'
    };
  }

  get behaviors() {
    return [
      menu,
      notify,
      singleton
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
        triedToSave,
        ensureV2Saved,
        finished,
        trySave;

    this.fire('saving');

    // Add support for Simpla v2 SDK
    if (Simpla.save) {
      ensureV2Saved = Simpla.save();
    } else {
      ensureV2Saved = Promise.resolve();
    }

    /**
     * Fires saved, if there were no fails, otherwise fires save-failed
     * @return {[type]} [description]
     */
    finished = () => {
      let failed = () => {
        this.fire('save-failed', { all: successfulSaves === 0 });
      };

      ensureV2Saved
        .then(() => {
          if (failedSaves !== 0) {
            return Promise.reject();
          }

          this.fire('saved');
        })
        .catch(failed);
    };

    trySave = (element) => {
      let addElement,
          removeElement,
          willSave,
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
      willSave = element.save();
      if (willSave) {
        addElement();
      }

      return !!willSave;
    }

    // For each element, make a save request, then keep track of the successes
    //  of these requests, emited saved or save-failed once all requests have
    //  come back, and the success of them is known
    triedToSave = simpla.elements.map(trySave).filter(didSave => !!didSave).length;

    haveTriedAll = true;

    if (triedToSave === 0) {
      // Dummy time taken to save
      setTimeout(finished, 2000);
    }
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
    Simpla._v1.toggleEditing(false);
    return Simpla._v1.logout();
  }

};

Polymer(SmModuleSave);

const SUCCESS = 'success',
      WARN = 'warning',
      ERROR = 'error',
      MESSAGES = {
        [ ERROR ]: 'Oh no! Something went wrong, check your internet connection and try again',
        [ WARN ]: 'Looks like some things didn\'t save properly. Check your content and try again',
        [ SUCCESS ]: 'Hooray! Your changes are published'
      },
      TITLES = {
        [ ERROR ]: 'Save Failed',
        [ WARN ]: 'Uhhhh',
        [ SUCCESS ]: 'Saved'
      };

function getNotifier() {
  if (simpla.notifications) {
    return simpla.notifications.notify;
  }

  return function(type, title, message) {
    console.log(`${title}: ${message}`);
  };
}

export default {

  listeners: {
    'saved': '_notifySuccess',
    'save-failed': '_notifyFailed'
  },

  _notifySuccess() {
    this._notify(SUCCESS);
  },

  _notifyFailed({ detail }) {
    this._notify(detail.all ? ERROR : WARN);
  },

  _notify(type) {
    const notify = getNotifier();
    notify(type, TITLES[type], MESSAGES[type]);
  }
}

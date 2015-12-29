const NOTIFICATIONS = {
  success: {
    type: 'success',
    title: 'Saved',
    message: 'Hooray! Your changes are published'
  },
  warn: {
    type: 'warn',
    title: 'Uhhhh',
    message: 'Looks like some things didn\'t save properly. Try again',
  },
  error: {
    type: 'error',
    title: 'Save Failed',
    message: 'Oh no! Something went wrong, check your internet connection and try again'
  }
};

/**
 * Fetch the notification center from Simpla
 * @return {Function} simpla notification center with console.log fallback
 */
function getNotifier() {
  if (simpla.notifications) {
    return simpla.notifications.notify.bind(simpla.notifications);
  }

  return function(type, message, title) {
    console.info(`${title}: ${message}`);
  };
}

export default {

  // Listen for save events and trigger the
  // appropriate notification function
  listeners: {
    'saved': '_notifySuccess',
    'save-failed': '_notifyFailed'
  },

  /**
   * Helper function to build notifications
   * @param  {Object} notification details of notification to fire
   * @return undefined
   */
  _notify(notification) {
    const notify = getNotifier();
    notify(notification.type, notification.message, notification.title);
  },

  /**
   * Notify successful save
   * @return undefined
   */
  _notifySuccess() {
    this._notify(NOTIFICATIONS.success);
  },

  /**
   * Notifiy failed or warning save
   * @param  {Object} event.detail detail of the failure event
   * @return undefined
   */
  _notifyFailed({ detail }) {
    this._notify(detail.all ? NOTIFICATIONS.error : NOTIFICATIONS.warn);
  },

}

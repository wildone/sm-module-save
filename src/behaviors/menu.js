const USERS_ENDPOINT = 'https://api.simpla.io/users';

/**
 * Make headers object with defaults
 * @param  {Object?} headers  Optional headers to add to the default
 * @return {Object}           Headers object
 */
function makeHeaders(headers = {}) {
  return Object.assign({}, {
    'Content-Type': 'application/json'
  }, headers);
}

/**
 * Get payload from token string. Returns null if the token is not valid
 * @param  {String} token JWT token to parse
 * @return {Object} Payload of token if valid, null otherwise
 */
function extractPayload(token) {
  const now = (new Date()).getTime() / 1000;
  let payload;

  if (!token) {
    return null;
  }

  try {
    let [, payloadString, ] = token.split('.');
    payload = JSON.parse(atob(payloadString));
  } catch (e) {
    console.warn('Invalid token', e.message);
    return null;
  }

  // Check if payload has expired
  if (payload.exp && now > payload.exp) {
    return null;
  }

  return payload;
}

export default {
  properties: {

    token: {
      type: Object,
      observer: '_tokenChanged'
    },

    user: Object

  },

  /**
   * Fetch user from API and set to this.user
   * @param  {String} token Auth token
   * @return {undefined}
   */
  _tokenChanged(token) {
    if (!token) {
      return;
    }

    fetch(`${USERS_ENDPOINT}/${extractPayload(token).sub}`, {
      headers: makeHeaders({
        'Authorization': `Bearer ${token}`
      })
    })
    .then(response => response.json())
    .then(user => {
      this.user = user;
    })
    .catch(err => {
      this.user = null;
      console.warn('Fetching user failed:', err);
    });
  }

}
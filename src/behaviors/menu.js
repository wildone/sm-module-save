const USERS_ENDPOINT = 'https://api.simpla.io/users';


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
    user: Object
  },

  /**
   * Fetch user from API and set to this.user
   * @param  {String} id User ID
   * @return {undefined}
   */
  setUser(id) {
    fetch(`${USERS_ENDPOINT}/${id}`, {
      headers: makeHeaders({
        'Authorization': `Bearer ${this.$.auth.token}`
      })
    })
    .then(response => response.body())
    .then(user => {
      this.user = user;
    })
    .catch(err => {
      this.user = null;
      console.warn('Fetching user failed:', err);
    });
  },

  ready() {
    let userId = extractPayload(this.$.auth.token).sub;
    this.setUser(userId);
  }

}
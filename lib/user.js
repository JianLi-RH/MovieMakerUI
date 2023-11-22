import store from "store";

export default {
  saveUser(username, sessionId) {
    store.set(sessionId, username);
  },

  getUser(sessionId) {
    return store.get(sessionId)[0] || {};
  },

  delete(sessionId) {
    store.remove(sessionId);
  },
};

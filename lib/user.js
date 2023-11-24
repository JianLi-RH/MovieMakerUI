import store from "store";

export default {
  saveUser(username, sessionId) {
    store.set(sessionId, username);
  },

  getUser(sessionId) {
    if (store.get(sessionId)) {
      return store.get(sessionId)[0];
    } else {
      return undefined;
    }
  },

  delete(sessionId) {
    store.remove(sessionId);
  },
};

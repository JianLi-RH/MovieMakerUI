import store from "store";

export default {
  saveUser(username, sessionId) {
    if (store.get(sessionId)) {
      return;
    }
    store.set(sessionId, username);
  },

  getUser(sessionId) {
    store.each((u) => {
      console.log(u);
    });
    return store.get(sessionId, [null])[0];
  },

  delete(sessionId) {
    store.remove(sessionId);
  },
};

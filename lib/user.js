import store from "store";

export default {
  saveUser(username, sessionId) {
    if (store.get(sessionId)) {
      return;
    }
    store.set(sessionId, username);
  },

  getUser(req) {
    const token = req.headers["authorization"];
    store.each((u) => {
      console.log('user:', u);
    });
    return store.get(token, null);
  },

  getWorkspace(token) {
    const name = store.get(token, null);
    return `${name}_${token.substr(0, 10)}`;
  },

  delete(sessionId) {
    store.remove(sessionId);
  },
};

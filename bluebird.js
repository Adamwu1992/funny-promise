const Promise = require('bluebird');

const adapter = {
  resolved(value) {
    return Promise.resolve(value);
  },

  rejected(reason) {
    return Promise.reject(reason);
  },

  deferred() {
    const dfd = {};
    dfd.promise = new Promise(function (resolve, reject) {
      dfd.resolve = resolve;
      dfd.reject = reject;
    });
    return dfd;
  }
}

module.exports = adapter;
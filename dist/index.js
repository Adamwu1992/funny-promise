(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.FunnyPromise = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function needResolver() {
    throw new Error('You must pass a resolver function as the first argument to the promise constructor.');
  }
  function needNew() {
    throw new Error('Failed to construct \'Promise\': Please use the \'new\' operator, this object constructor cannot be called as a function.');
  }
  function selfFulfilled() {
    throw new Error('You cannot resolve a promise with itself.');
  }
  function returnOwn() {
    throw new Error('A promises callback cannot return that same promise.');
  }
  function needArray() {
    throw new Error('You must pass an array as argument.');
  }
  function noop() {}
  function isFunction(x) {
    return typeof x === 'function';
  }
  function isArray(x) {
    return Array.isArray(x);
  }
  var id$1 = 0;
  function nextId() {
    return id$1++;
  }

  function asap (callback, args) {
    setTimeout(callback, 1, args);
  }

  var PENDING = void 0;
  var FULFILLED = 1;
  var REJECTED = 2;
  var TRY_CATCH_ERROR = {
    error: null
  };

  function tryCatch(callback, value) {
    try {
      return callback(value);
    } catch (e) {
      TRY_CATCH_ERROR.error = e;
      return TRY_CATCH_ERROR;
    }
  }

  function isThenable(x) {
    return x && _typeof(isFunction(x.then));
  }

  function resolve(promise, value) {
    if (promise === value) {
      reject(promise, selfFulfilled());
    } else if (isThenable(value)) {
      handleMaybeThenable(promise, value);
    } else {
      fulfill(promise, value);
    }
  }
  function handleMaybeThenable(promise, thenable) {
    var then = thenable.then;
    if (!isFunction(then)) return; // 判断是否promise

    if (thenable.constructor === promise.constructor) {
      handlePromise(promise, thenable);
    } else {
      fulfill(promise, thenable);
    }
  }
  function handlePromise(promise, thenable) {
    if (thenable._state === FULFILLED) {
      fulfill(promise, thenable._result);
    } else if (thenable._state === RE) {
      reject(promise, thenable._result);
    } else {
      subscribe(thenable, undefined, function (value) {
        return resolve(promise, value);
      }, function (reason) {
        return reject(promise, reason);
      });
    }
  }
  function fulfill(promise, value) {
    if (promise._state !== PENDING) return;
    promise._state = FULFILLED;
    promise._result = value;

    if (promise._subscribers.length !== 0) {
      asap(publish, promise);
    }
  }
  function reject(promise, reason) {
    if (promise._state !== PENDING) return;
    promise._state = REJECTED;
    promise._result = reason;

    if (promise._subscribers.length !== 0) {
      asap(publish, promise);
    }
  }
  function publish(promise) {
    var subscribers = promise._subscribers;
    if (promise._state === PENDING || subscribers.length === 0) return;

    for (var i = 0; i < subscribers.length; i += 3) {
      var child = subscribers[i];
      var callback = subscribers[i + promise._state];

      if (child) {
        invokeCallback(child, promise._state, callback, promise._result);
      } else {
        callback(promise._result);
      }
    }

    subscribers.length = 0;
  }
  /**
   * 
   * @param {*} promise: child promise
   * @param {*} state: parent promise's state
   * @param {*} callback: for child promise
   * @param {*} result: parent promse's result
   */

  function invokeCallback(promise, state, callback, result) {
    var hasCallback = isFunction(callback);
    var value;
    var error;
    var succeed;
    var failed;

    if (hasCallback) {
      value = tryCatch(callback, result);

      if (value === TRY_CATCH_ERROR) {
        failed = true;
        error = TRY_CATCH_ERROR.error;
        TRY_CATCH_ERROR.error = null;
      } else {
        succeed = true;
      }

      if (value === promise) {
        reject(promise, returnOwn());
        return;
      }
    } else {
      value = result;
      succeed = ture;
    }

    if (promise._state !== PENDING) return; // 将promise迁移到对应的状态

    if (hasCallback) {
      if (succeed) {
        resolve(promise, value);
      } else if (failed) {
        reject(promise, error);
      }
    } else {
      if (state === FULFILLED) {
        fulfill(promise, value);
      } else if (state === REJECTED) {
        reject(promise, value);
      }
    }
  }
  function subscribe(parent, child, onFulfillment, onRejection) {
    var subscribers = parent._subscribers;
    var length = subscribers.length;
    subscribers[length] = child;
    subscribers[length + 1] = onFulfillment;
    subscribers[length + 2] = onRejection;

    if (length === 0 && parent._state !== PENDING) {
      asap(publish, parent);
    }
  }

  function originalResolve (value) {
    var Constructor = this;

    if (value && value.constructor === Constructor) {
      return value;
    }

    var promise = new Constructor(noop);

    resolve(promise, value);

    return promise;
  }

  function originReject (reason) {
    var Constructor = this;
    var promise = new Constructor(noop);

    reject(promise, reason);

    return promise;
  }

  function race (entries) {
    var Constructor = this;

    if (isArray) {
      return new Constructor(function (resolve, reject) {
        for (var i = 0; i < entries.length; i++) {
          var e = entries[i];
          Constructor.resolve(e).then(resolve, reject);
        }
      });
    }

    return new Constructor(function (_, reject) {
      reject(needArray());
    });
  }

  function checkResolver(resolver) {
    return isFunction(resolver) || needResolver();
  }

  function checkNew(x) {
    return x instanceof Promise$1 || needNew();
  }

  var Promise$1 =
  /*#__PURE__*/
  function () {
    function Promise(resolver) {
      var _this = this;

      _classCallCheck(this, Promise);

      this._ID = nextId();
      this._result = undefined;
      this._state = undefined;
      this._subscribers = [];

      if (checkResolver(resolver) && checkNew(this)) {
        // 执行resolver
        try {
          resolver(function (value) {
            return resolve(_this, value);
          }, function (reason) {
            return reject(_this, reason);
          });
        } catch (e) {
          reject(this, e);
        }
      }
    }

    _createClass(Promise, [{
      key: "then",
      value: function then(onFulfillment, onRejection) {
        var parent = this;
        var child = new this.constructor(noop);

        if (parent._state !== PENDING) {
          var callback = parent._state === FULFILLED ? onFulfillment : onRejection;
          asap(function () {
            invokeCallback(child, parent._state, callback, parent._result);
          });
        } else {
          subscribe(parent, child, onFulfillment, onRejection);
        }

        return child;
      }
    }, {
      key: "catch",
      value: function _catch(onRejection) {
        return this.then(null, onRejection);
      }
    }, {
      key: "finally",
      value: function _finally(callback) {
        return this.then(callback, callback);
      }
    }]);

    return Promise;
  }();

  Promise$1.resolve = originalResolve;
  Promise$1.reject = originReject;
  Promise$1.race = race;

  return Promise$1;

})));


import {
  resolve,
  reject,
  PENDING,
  FULFILLED,
  invokeCallback,
  subscribe
} from './core';
import {
  needResolver,
  needNew,
  isFunction,
  noop,
  nextId
} from './utils';
import asap from './asap';
import originalResolve from './promise/resolve';
import originReject from './promise/reject';
import race from './promise/race';

function checkResolver(resolver) {
  return isFunction(resolver) || needResolver();
}

function checkNew(x) {
  return x instanceof Promise || needNew()
}

class Promise {
  constructor(resolver) {
    this._ID = nextId();
    this._result = undefined;
    this._state = undefined;
    this._subscribers = [];

    if (checkResolver(resolver) && checkNew(this)) {
      // 执行resolver
      try {
        resolver(
          value => resolve(this, value),
          reason => reject(this, reason)
        )
      } catch(e) {
        reject(this, e);
      }
    }
  }

  then(onFulfillment, onRejection) {
    const parent = this;
    const child = new this.constructor(noop);

    if (parent._state !== PENDING) {
      const callback = parent._state === FULFILLED ? onFulfillment : onRejection;
      asap(() => {
        invokeCallback(child, parent._state, callback, parent._result);
      })
    } else {
      subscribe(parent, child, onFulfillment, onRejection);
    }

    return child;
  }

  catch(onRejection) {
    return this.then(null, onRejection);
  }

  finally(callback) {
    return this.then(callback, callback)
  }
}

Promise.resolve = originalResolve;
Promise.reject = originReject;
Promise.race = race;

export default Promise;
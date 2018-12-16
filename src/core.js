import {
  selfFulfilled,
  isFunction,
  returnOwn
} from './utils';
import asap from './asap';

export const PENDING = void 0;
export const FULFILLED = 1;
export const REJECTED = 2;

const TRY_CATCH_ERROR = { error: null }
function tryCatch(callback, value) {
  try {
    return callback(value);
  } catch(e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function isThenable(x) {
  return x && typeof isFunction(x.then);
}

export function resolve(promise, value) {
  if (promise === value) {
    reject(promise, selfFulfilled());
  } else if (isThenable(value)) {
    handleMaybeThenable(promise, value);
  } else {
    fulfill(promise, value);
  }
}

export function handleMaybeThenable(promise, thenable) {
  const then = thenable.then;
  if (!isFunction(then)) return;
  // 判断是否promise
  if (thenable.constructor === promise.constructor) {
    handlePromise(promise, thenable);
  } else {
    fulfill(promise, thenable);
  }
}

export function handlePromise(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === RE) {
    reject(promise, thenable._result);
  } else {
    subscribe(
      thenable,
      undefined,
      value => resolve(promise, value),
      reason => reject(promise, reason)
    );
  }
}

export function fulfill(promise, value) {
  if (promise._state !== PENDING) return;
  promise._state = FULFILLED
  promise._result = value;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

export function reject(promise, reason) {
  if (promise._state !== PENDING) return;
  promise._state = REJECTED
  promise._result = reason;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

export function publish(promise) {
  const subscribers = promise._subscribers;

  if (promise._state === PENDING || subscribers.length === 0) return;

  for(let i = 0; i < subscribers.length; i += 3) {
    const child = subscribers[i];
    const callback = subscribers[i + promise._state];

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
export function invokeCallback(promise, state, callback, result) {
  const hasCallback = isFunction(callback);
  let value;
  let error;
  let succeed;
  let failed;

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
      reject(promise, returnOwn())
      return;
    }
  } else {
    value = result;
    succeed = ture;
  }

  if (promise._state !== PENDING) return;
  // 将promise迁移到对应的状态
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

export function subscribe(parent, child, onFulfillment, onRejection) {
  const subscribers = parent._subscribers;
  const length = subscribers.length;

  subscribers[length] = child;
  subscribers[length + 1] = onFulfillment;
  subscribers[length + 2] = onRejection;

  if (length === 0 && parent._state !== PENDING) {
    asap(publish, parent);
  }
}
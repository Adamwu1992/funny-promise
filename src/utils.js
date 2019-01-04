export function needResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor.');
}

export function needNew() {
  throw new TypeError('Failed to construct \'Promise\': Please use the \'new\' operator, this object constructor cannot be called as a function.');
}

export function selfFulfilled() {
  throw new TypeError('You cannot resolve a promise with itself.')
}

export function returnOwn() {
  return new TypeError('A promises callback cannot return that same promise.')
}

export function needArray() {
  throw new TypeError('You must pass an array as argument.')
}

export function noop() {}

export function isFunction(x) {
  return typeof x === 'function';
}

export function isArray(x) {
  return Array.isArray(x);
}

let id = 0;
export function nextId() {
  return id++;
}
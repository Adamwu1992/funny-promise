export function needResolver() {
  throw new Error('You must pass a resolver function as the first argument to the promise constructor.');
}

export function needNew() {
  throw new Error('Failed to construct \'Promise\': Please use the \'new\' operator, this object constructor cannot be called as a function.');
}

export function selfFulfilled() {
  throw new Error('You cannot resolve a promise with itself.')
}

export function returnOwn() {
  throw new Error('A promises callback cannot return that same promise.')
}

export function needArray() {
  throw new Error('You must pass an array as argument.')
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
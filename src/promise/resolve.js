import { resolve as _resolve } from '../core';
import { noop } from '../utils';

export default function(value) {
  const Constructor = this;
  if (value && value.constructor === Constructor) {
    return value;
  }
  
  const promise = new Constructor(noop);
  _resolve(promise, value);
  return promise;
}
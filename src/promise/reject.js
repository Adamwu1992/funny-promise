import { reject as _reject } from '../core';
import { noop } from '../utils';

export default function(reason) {
  const Constructor = this;
  const promise = new Constructor(noop);
  _reject(promise, reason);
  return promise;
}
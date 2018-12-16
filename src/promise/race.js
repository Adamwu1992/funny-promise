import { isArray, needArray } from '../utils';

export default function(entries) {
  const Constructor = this;
  if (isArray) {
    return new Constructor((resolve, reject) => {
      for(let i = 0; i < entries.length; i++) {
        const e = entries[i];
        Constructor.resolve(e).then(resolve, reject);
      }
    });
  }
  return new Constructor((_, reject) => {
    reject(needArray());
  });
}
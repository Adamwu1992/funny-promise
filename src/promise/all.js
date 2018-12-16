import { needArray, isArray } from '../utils';

export default function(entries) {
  const Constructor = this;
  if (!isArray(entries)) {
    return new Constructor((_, reject) => {
      reject(needArray());
    });
  }

  const length = entries.length;
  const result = new Array(length);
  let settled = 0;
  return new Constructor((resolve, reject) => {
    for(let i = 0; i < length; i++) {
      const e = entries[i];
      Constructor.resolve(e).then(
        value => {
          result[i] = value;
          settled += 1;
          if (settled === length) {
            resolve(result);
          }
        },
        reason => {
          reject(reason);
        }
      )
    }
  })
}
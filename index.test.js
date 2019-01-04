import dfd from './adapters';
import bb_dfd from './bluebird';
import { testFulfilled, testRejected } from './test/test-three-cases';

describe('2.1.2: When fulfilled, a promise: must not transition to any other state.', () => {
  testFulfilled(1, function(promise, done) {
    let called = false;
  
    promise.then(
      () => {
        called = true;
      },
      () => {
        expect(called).toBe(false);
        done();
      }
    );
  
    setTimeout(done, 100);
  });
  
  it('trying to fulfill then immediately reject', done => {
    const d = dfd.deferred();
    let called = false;
    d.promise.then(
      () => {
        called = true;
      },
      () => {
        expect(called).toBe(false);
        done();
      }
    )
    d.resolve(1);
    d.reject(1);
    setTimeout(done, 100);
  });
  
  it('trying to fulfill then delayed reject', done => {
    let called = false;
    const d = dfd.deferred();
    d.promise.then(
      () => {
        called = true;
      },
      () => {
        expect(called).toBe(false);
        done();
      }
    )
    setTimeout(() => {
      d.resolve(1);
      d.reject(1);
    }, 50);
    setTimeout(done, 100);
  });
  
  it('trying to fulfill immediately then reject delayed', done => {
    let called = false;
    const d = dfd.deferred();
    d.promise.then(
      () => {
        called = true;
      },
      () => {
        expect(called).toBe(false);
        done();
      }
    );
    d.resolve(1);
    setTimeout(() => {
      d.reject(1);
    }, 50);
    setTimeout(done, 100);
  });
});

describe('2.7.2: If `onFulfilled` is not a function and `promise1` is fulfilled, `promise2` must be fulfilled with the same value.', () => {
  const sentinel = { sentinel: 'sentinel' };
  function testNonFunction(nonFunction, desc) {
    describe(`\`onFulfilled\` is ${desc}`, () => {
      testRejected(sentinel, (promise1, done) => {
        const promise2 = promise1.then(null, nonFunction);
        promise2.then(null, reason => {
          expect(reason).toBe(sentinel);
          done();
        })
      })
    })
  }

  testNonFunction(undefined, "`undefined`");
});

describe('2.3.4: If `x` is not an object or function, fulfill `promise` with `x`', () => {
  function testValue(expectedValue, valueDesc, beforeEachHook, afterEachHook) {
    describe(`The value is ${valueDesc}`, () => {
      if (typeof beforeEachHook === 'function') {
        beforeEach(beforeEachHook);
      }
      if (typeof afterEachHook === 'function') {
        afterEach(afterEachHook);
      }
  
      testFulfilled(1, (promise1, done) => {
        const promise2 = promise1.then(() => expectedValue);
        promise2.then(actualValue => {
          expect(actualValue).toBe(expectedValue);
          done();
        });
      });

      testRejected(1, (promise1, done) => {
        const promise2 = promise1.then(null, () => expectedValue);
        promise2.then(actualValue => {
          expect(actualValue).toBe(expectedValue);
          done();
        });
      });
    });
  }

  testValue(undefined, "`undefined`");
  testValue(null, "`null`");
  testValue(false, "`false`");
  testValue(true, "`true`");
  testValue(0, "`0`");

  testValue(
    true,
    "`true` with `Boolean.prototype` modified to have a `then` method",
    function () {
      Boolean.prototype.then = function () {};
    },
    function () {
      delete Boolean.prototype.then;
    }
  );

  testValue(
    1,
    "`1` with `Number.prototype` modified to have a `then` method",
    function () {
        Number.prototype.then = function () {};
    },
    function () {
        delete Number.prototype.then;
    }
  );
});

describe('2.3.1: If `promise` and `x` refer to the same object, reject `promise` with a \`TypeError\' as the reason.', () => {
  it('via return from a fulfilled promise', done => {
    const promise = dfd.resolved(1).then(() => promise);

    promise.then(null, reason => {
      expect(reason instanceof TypeError).toBeTruthy();
      expect(reason.message).toBe('A promises callback cannot return that same promise.');
      done();
    });
  });

  it('via return from a rejected promise', done => {
    const promise = dfd.rejected(1).then(null, () => promise);

    promise.then(null, reason => {
      expect(reason instanceof TypeError).toBeTruthy();
      expect(reason.message).toBe('A promises callback cannot return that same promise.');
      done();
    });
  });
});

describe('Manual test', () => {
  it('then will return a new promise', done => {
    const p = dfd.resolved(1);
    const pp = p.then(() => 2);
    pp.then(value => {
      expect(value).toBe(2);
      done();
    });
  });

  it('bluebird: then will return a new promise', done => {
    const p = bb_dfd.resolved(1);
    const pp = p.then(() => 2);
    pp.then(value => {
      expect(value).toBe(2);
      done();
    });
  });

  it('Error', () => {
    const m = 'hello world';
    const e = () => {
      throw new Error(m);
    }
    expect(e).toThrow(m);
  })
});
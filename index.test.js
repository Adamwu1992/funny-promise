import dfd from './adapters';
import bb_dfd from './bluebird';
import { testFulfilled, testRejected } from './test/test-three-cases';

jest.setTimeout(1000)
global.Promise = null

// describe('2.1.2: When fulfilled, a promise: must not transition to any other state.', () => {
//   testFulfilled(1, function(promise, done) {
//     let called = false;
  
//     promise.then(
//       () => {
//         called = true;
//       },
//       () => {
//         expect(called).toBe(false);
//         done();
//       }
//     );
  
//     setTimeout(done, 100);
//   });
  
//   it('trying to fulfill then immediately reject', done => {
//     const d = dfd.deferred();
//     let called = false;
//     d.promise.then(
//       () => {
//         called = true;
//       },
//       () => {
//         expect(called).toBe(false);
//         done();
//       }
//     )
//     d.resolve(1);
//     d.reject(1);
//     setTimeout(done, 100);
//   });
  
//   it('trying to fulfill then delayed reject', done => {
//     let called = false;
//     const d = dfd.deferred();
//     d.promise.then(
//       () => {
//         called = true;
//       },
//       () => {
//         expect(called).toBe(false);
//         done();
//       }
//     )
//     setTimeout(() => {
//       d.resolve(1);
//       d.reject(1);
//     }, 50);
//     setTimeout(done, 100);
//   });
  
//   it('trying to fulfill immediately then reject delayed', done => {
//     let called = false;
//     const d = dfd.deferred();
//     d.promise.then(
//       () => {
//         called = true;
//       },
//       () => {
//         expect(called).toBe(false);
//         done();
//       }
//     );
//     d.resolve(1);
//     setTimeout(() => {
//       d.reject(1);
//     }, 50);
//     setTimeout(done, 100);
//   });
// });

// describe('2.7.2: If `onFulfilled` is not a function and `promise1` is fulfilled, `promise2` must be fulfilled with the same value.', () => {
//   const sentinel = { sentinel: 'sentinel' };
//   function testNonFunction(nonFunction, desc) {
//     describe(`\`onFulfilled\` is ${desc}`, () => {
//       testRejected(sentinel, (promise1, done) => {
//         const promise2 = promise1.then(null, nonFunction);
//         promise2.then(null, reason => {
//           expect(reason).toBe(sentinel);
//           done();
//         })
//       })
//     })
//   }

//   testNonFunction(undefined, "`undefined`");
// });

// describe('2.3.4: If `x` is not an object or function, fulfill `promise` with `x`', () => {
//   function testValue(expectedValue, valueDesc, beforeEachHook, afterEachHook) {
//     describe(`The value is ${valueDesc}`, () => {
//       if (typeof beforeEachHook === 'function') {
//         beforeEach(beforeEachHook);
//       }
//       if (typeof afterEachHook === 'function') {
//         afterEach(afterEachHook);
//       }
  
//       testFulfilled(1, (promise1, done) => {
//         const promise2 = promise1.then(() => expectedValue);
//         promise2.then(actualValue => {
//           expect(actualValue).toBe(expectedValue);
//           done();
//         });
//       });

//       testRejected(1, (promise1, done) => {
//         const promise2 = promise1.then(null, () => expectedValue);
//         promise2.then(actualValue => {
//           expect(actualValue).toBe(expectedValue);
//           done();
//         });
//       });
//     });
//   }

//   testValue(undefined, "`undefined`");
//   testValue(null, "`null`");
//   testValue(false, "`false`");
//   testValue(true, "`true`");
//   testValue(0, "`0`");

//   testValue(
//     true,
//     "`true` with `Boolean.prototype` modified to have a `then` method",
//     function () {
//       Boolean.prototype.then = function () {};
//     },
//     function () {
//       delete Boolean.prototype.then;
//     }
//   );

//   testValue(
//     1,
//     "`1` with `Number.prototype` modified to have a `then` method",
//     function () {
//         Number.prototype.then = function () {};
//     },
//     function () {
//         delete Number.prototype.then;
//     }
//   );
// });

// describe('2.3.1: If `promise` and `x` refer to the same object, reject `promise` with a \`TypeError\' as the reason.', () => {
//   it('via return from a fulfilled promise', done => {
//     const promise = dfd.resolved(1).then(() => promise);

//     promise.then(null, reason => {
//       expect(reason instanceof TypeError).toBeTruthy();
//       expect(reason.message).toBe('A promises callback cannot return that same promise.');
//       done();
//     });
//   });

//   it('via return from a rejected promise', done => {
//     const promise = dfd.rejected(1).then(null, () => promise);

//     promise.then(null, reason => {
//       expect(reason instanceof TypeError).toBeTruthy();
//       expect(reason.message).toBe('A promises callback cannot return that same promise.');
//       done();
//     });
//   });
// });

// describe('2.3.2: If `x` is a promise, adopt its state', () => {
//   const resolved = dfd.resolved;
//   const rejected = dfd.rejected;
//   const deferred = dfd.deferred;

//   function testPromiseResolution(xFactory, test) {
//     it('via return from a fulfilled promise', done => {
//       const promise = resolved(1).then(() => xFactory());
//       test(promise, done);
//     });

//     it('via return from a rejected promise', done => {
//       const promise = rejected(1).then(null, () => xFactory());
//       test(promise, done);
//     });
//   }

//   describe('2.3.2.1: If `x` is pending, `promise` must remain pending until `x` is fulfilled or rejected', () => {
//     function xFactory() {
//       return deferred().promise;
//     }

//     testPromiseResolution(xFactory, (promise, done) => {
//       let wasFulfilled = false;
//       let wasRejected = false;

//       promise.then(() => {
//         wasFulfilled = true;
//       }, () => {
//         wasRejected = true;
//       });

//       setTimeout(() => {
//         expect(wasFulfilled).toBeFalsy();
//         expect(wasRejected).toBeFalsy();
//         done();
//       }, 100);
//     })
//   })
// });

// describe('2.3.3:', () => {
//   const resolved = dfd.resolved;
//   const rejected = dfd.rejected;

//   function testPromiseResolution(xFactory, test) {
//     it('via return from a fulfilled promise', done => {
//       const promise = resolved(1).then(() => xFactory());
//       test(promise, done);
//     });

//     it('via return from a rejected promise', done => {
//       const promise = rejected(1).then(null, () => xFactory());
//       test(promise, done);
//     });
//   }

//   let numberOfTimesThenWasRetrieved = null;

//   beforeEach(function () {
//     numberOfTimesThenWasRetrieved = 0;
//   });

//   function xFactory() {
//     return Object.create(null, {
//       then: {
//         get() {
//           ++numberOfTimesThenWasRetrieved;
//           return onFulfilled => onFulfilled();
//         }
//       }
//     });
//   }

//   testPromiseResolution(xFactory, (promise, done) => {
//     promise.then(() => {
//       try {
//         expect(numberOfTimesThenWasRetrieved).toBe(1);
//       } catch(e) {
//         done.fail(e);
//       }
//       done();
//     });
//   })
// });

// describe('2.3.3.2:', () => {
//   const resolved = dfd.resolved;

//   function testRejection(e, desc) {
//     function xFactory() {
//       return Object.create(Object.prototype, {
//         then: {
//           get() {
//             throw e;
//           }
//         }
//       })
//     }

//     function testPromiseResolution(xFactory, test) {
//       it('via return from a fulfilled promise', done => {
//         const promise = resolved(1).then(() => xFactory());
//         test(promise, done);
//       });
//     }

//     describe(`\`e\` is ${desc}`, () => {
//       testPromiseResolution(xFactory, (promise, done) => {
//         promise.then(null, reason => {
//           try {
//             expect(reason).toBe(e);
//           } catch(e) {
//             done.fail(e);
//           }
//           done();
//         })
//       })
//     })
//   }
//   testRejection(1, '1');
// })

describe('2.3.3.3:', () => {
  const resolved = dfd.resolved;
  const rejected = dfd.rejected;


  function testPromiseResolution(xFactory, test) {
    it("via return from a fulfilled promise", function (done) {
        const promise = resolved(1).then(function() {
            return xFactory();
        });

        test(promise, done);
    });

    // it("via return from a rejected promise", function (done) {
    //     const promise = rejected(1).then(null, function() {
    //         return xFactory();
    //     });

    //     test(promise, done);
    // });
  }

  function testCallingResolvePromise(yFactory, stringRepresentation, test) {
    describe("`y` is " + stringRepresentation, function () {
        describe("`then` calls `resolvePromise` synchronously", function () {
            function xFactory() {
                return {
                    then: function (resolvePromise) {
                        resolvePromise(yFactory());
                    }
                };
            }

            testPromiseResolution(xFactory, test);
        });

        describe("`then` calls `resolvePromise` asynchronously", function () {
            function xFactory() {
                return {
                    then: function (resolvePromise) {
                        setTimeout(function () {
                            resolvePromise(yFactory());
                        }, 0);
                    }
                };
            }

            testPromiseResolution(xFactory, test);
        });
    });
  }

  function testCallingResolvePromiseRejectsWith(yFactory, stringRepresentation, rejectionReason) {
    testCallingResolvePromise(yFactory, stringRepresentation, function (promise, done) {
        promise.then(null, function onPromiseRejected(reason) {
            assert.strictEqual(reason, rejectionReason);
            done();
        });
    })
  }

  function testCallingResolvePromiseFulfillsWith(yFactory, stringRepresentation, fulfillmentValue) {
    testCallingResolvePromise(yFactory, stringRepresentation, (promise, done) => {
      promise.then((value) => {
        try {
          expect(value).toBe(fulfillmentValue);
          done();
        } catch(e) {
          done.fail(e);
        }
      });
    });
  }

  describe("`y` is not a thenable", function () {
    // testCallingResolvePromiseFulfillsWith(() => undefined, "`undefined`", undefined);
    testCallingResolvePromiseFulfillsWith(() => 1, "`1`", 1);
    // testCallingResolvePromiseFulfillsWith(function () { return null; }, "`null`", null);
    // testCallingResolvePromiseFulfillsWith(function () { return false; }, "`false`", false);
    // testCallingResolvePromiseFulfillsWith(function () { return 5; }, "`5`", 5);
    // testCallingResolvePromiseFulfillsWith(function () { return sentinel; }, "an object", sentinel);
    // testCallingResolvePromiseFulfillsWith(function () { return sentinelArray; }, "an array", sentinelArray);
  });
})


describe('Manual test', () => {
  const resolved = dfd.resolved;

  function xFactory() {
    return {
      then: function (resolvePromise) {
        resolvePromise(() => undefined);
      }
    };
  }

  const promise = resolved(1).then(function() {
    return xFactory();
  });

  promise.then(value => {
    try {
      expect(value).toBeUndefined();
      done();
    } catch(e) {
      done.fail(e);
    }
  })
});
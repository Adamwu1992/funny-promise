import dfd from './adapters';
import { testFulfilled } from './test/test-three-cases';

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
})

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
  setTimeout(done, 50);
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
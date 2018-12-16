import dfd from '../adapters';

export function testFulfilled(value, tester) {
  it('already-fulfilled', done => {
    tester(dfd.resolved(value), done);
  });

  it('immediately-fulfilled', done => {
    const d = dfd.deferred();
    tester(d.promise, done);
    d.resolve(value);
  });

  it('eventually-fulfilled', done => {
    const d = dfd.deferred();
    tester(d.promise, done);
    setTimeout(function () {
        d.resolve(value);
    }, 50);
  });
}

export function testRejected(value, tester) {
  it('already-rejected', done => {
    tester(dfd.rejected(value), done);
  });

  it('immediately-rejecred', done => {
    const d = dfd.deferred();
    test(d.promise, done);
    d.resolve(value);
  });

  it('eventually-rejected', done => {
    const d = dfd.deferred();
    test(d.promise, done);
    setTimeout(() => {
      d.resolve(value);
    }, 50);
  });
}
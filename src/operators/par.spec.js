import { of } from 'rxjs';
import { map, bufferCount } from 'rxjs/operators';
import { par } from './par';

describe('par operator', () => {
  it('should return operator (function)', () => {
    const operator = par();
    expect(operator).toBeInstanceOf(Function);
  });

  it('should com provided operators to apply transformations in parallel (merging resulting streams)', (done) => {
    const mul = x => y => x * y;
    const mul123 = par(map(mul(1)), map(mul(2)), map(mul(3)));
    of(2)
      .pipe(
        mul123,
        bufferCount(3),
      )
      .subscribe((values) => {
        expect(values).toEqual(expect.arrayContaining([2 * 1, 2 * 2, 2 * 3]));
        done();
      });
  });
});

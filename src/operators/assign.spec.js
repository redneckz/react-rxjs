import { of } from 'rxjs';
import { bufferCount } from 'rxjs/operators';
import { assign } from './assign';

describe('assign operator', () => {
    it('should return operator (function)', () => {
        const operator = assign();
        expect(operator).toBeInstanceOf(Function);
    });

    it('should merge/assign all objects in stream', (done) => {
        of({ foo: 123 }, { bar: 456 }, { baz: 789 })
            .pipe(
                assign(),
                bufferCount(3),
            )
            .subscribe((values) => {
                expect(values).toEqual([
                    { foo: 123 },
                    { foo: 123, bar: 456 },
                    { foo: 123, bar: 456, baz: 789 },
                ]);
                done();
            });
    });

    it('should merge ingnoring nil values', (done) => {
        of(null, undefined, { foo: 123 })
            .pipe(
                assign(),
                bufferCount(3),
            )
            .subscribe((values) => {
                expect(values).toEqual([{}, {}, { foo: 123 }]);
                done();
            });
    });
});

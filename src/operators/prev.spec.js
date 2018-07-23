import { of } from 'rxjs';
import { bufferCount } from 'rxjs/operators';
import { prev } from './prev';

describe('prev operator', () => {
    it('should return operator (function)', () => {
        const operator = prev();
        expect(operator).toBeInstanceOf(Function);
    });

    it('should shift stream one step back starting from undefined', (done) => {
        of(1, 2, 3)
            .pipe(
                prev(),
                bufferCount(3),
            )
            .subscribe((values) => {
                expect(values).toEqual([undefined, 1, 2]);
                done();
            });
    });

    it('should shift stream one step back starting from provided value', (done) => {
        of(1, 2, 3)
            .pipe(
                prev(0),
                bufferCount(3),
            )
            .subscribe((values) => {
                expect(values).toEqual([0, 1, 2]);
                done();
            });
    });
});

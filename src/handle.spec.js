import { of, interval } from 'rxjs';
import { first, skip, bufferCount, tap, pluck, mapTo } from 'rxjs/operators';
import { handle } from './handle';

describe('handle operator', () => {
    it('should return operator (function)', () => {
        const operator = handle('onClick');
        expect(operator).toBeInstanceOf(Function);
    });

    it('should inject event handler into stream', (done) => {
        const handler$ = handle('onClick')(of({}));
        handler$.pipe(first()).subscribe(({ onClick }) => {
            expect(onClick).toBeInstanceOf(Function);
            done();
        });
    });

    it('should delegate event handling to provided/external handler', (done) => {
        const externalHandler = jest.fn();
        const handler$ = handle('onClick')(of({ onClick: externalHandler }));
        handler$.pipe(first()).subscribe(({ onClick }) => {
            const event = {};
            onClick(event);
            expect(externalHandler.mock.calls.length).toBe(1);
            expect(externalHandler).toBeCalledWith(event);
            done();
        });
    });

    it('should inject piped/transformed events into stream', (done) => {
        const props$ = interval(1).pipe(mapTo({}));
        const handler$ = handle('onClick', pluck('foo'))(props$);
        handler$
            .pipe(
                tap(({ onClick }) =>
                    setTimeout(() => {
                        onClick({ foo: { bar: 123 } });
                        onClick({ foo: { bar: 456 } });
                    }, 1)),
                skip(1),
                bufferCount(2),
            )
            .subscribe((events) => {
                expect(events).toEqual([{ bar: 123 }, { bar: 456 }]);
                done();
            });
    });
});

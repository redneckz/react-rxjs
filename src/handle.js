import { Subject, of, concat } from 'rxjs';
import { filter, pluck, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { isFunction, isObject } from './is';

export function handle(propName, ...handlerOperators) {
    return props$ =>
        props$.pipe(
            pluck(propName),
            distinctUntilChanged(),
            switchMap((handler) => {
                const eventsSubject = new Subject();
                const wrappedHandler = (event) => {
                    eventsSubject.next(event);
                    if (isFunction(handler)) handler(event);
                };
                return concat(
                    of({
                        [propName]: wrappedHandler,
                    }),
                    eventsSubject.pipe(
                        ...handlerOperators,
                        filter(obj => !(obj instanceof Event)),
                        filter(isObject),
                    ),
                );
            }),
        );
}

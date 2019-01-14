// @flow
import { startWith, pairwise, map } from 'rxjs/operators';

export function prev<T>(startVal?: T): rxjs$OperatorFunction<T, T> {
    return props$ =>
        props$.pipe(
            startWith(startVal),
            pairwise(),
            map(([previous]) => previous),
        );
}

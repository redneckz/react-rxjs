import { startWith, pairwise, map } from 'rxjs/operators';

export function prev(startVal) {
    return props$ => props$.pipe(
        startWith(startVal),
        pairwise(),
        map(([previous]) => previous),
    );
}

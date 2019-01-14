// @flow
import { scan } from 'rxjs/operators';

type ReturnType<T> =
    $Call<typeof scan, <T>(acc: T | {}, delta: T, index: number) => T | {}, T | {}>;

export function assign<T>(): ReturnType<T> {
    return scan((acc, delta) => Object.assign({}, acc, delta), {});
}

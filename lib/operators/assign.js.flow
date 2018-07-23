import { scan } from 'rxjs/operators';

export function assign() {
    return scan((acc, delta) => Object.assign({}, acc, delta), {});
}

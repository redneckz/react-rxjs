import { merge } from 'rxjs';

export function par(...operators) {
  return props$ => merge(...operators.map(op => op(props$)));
}

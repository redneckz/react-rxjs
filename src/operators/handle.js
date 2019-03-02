// @flow
/* eslint-disable no-redeclare, no-unused-vars */
import {
  Subject, of, concat, Observable,
} from 'rxjs';
import {
  filter, pluck, distinctUntilChanged, switchMap,
} from 'rxjs/operators';
import { isFunction, isObject } from '../is';

type ResultOperator<Props> = (
    Observable<Props>,
) => Observable<Props | { [propName: string]: (event: any) => void }>;
declare function handle<Props, I>(
    propName: string,
    rxjs$OperatorFunction<I, Props>,
): ResultOperator<Props>;
declare function handle<Props, I, O1>(
    propName: string,
    rxjs$OperatorFunction<I, O1>,
    rxjs$OperatorFunction<O1, $Shape<Props>>,
): ResultOperator<Props>;
declare function handle<Props, I, O1, O2>(
    propName: string,
    rxjs$OperatorFunction<I, O1>,
    rxjs$OperatorFunction<O1, O2>,
    rxjs$OperatorFunction<O2, $Shape<Props>>,
): ResultOperator<Props>;
declare function handle<Props, I, O1, O2, O3>(
    propName: string,
    rxjs$OperatorFunction<I, O1>,
    rxjs$OperatorFunction<O1, O2>,
    rxjs$OperatorFunction<O2, O3>,
    rxjs$OperatorFunction<O3, $Shape<Props>>,
): ResultOperator<Props>;
declare function handle<Props, I, O1, O2, O3, O4>(
    propName: string,
    rxjs$OperatorFunction<I, O1>,
    rxjs$OperatorFunction<O1, O2>,
    rxjs$OperatorFunction<O2, O3>,
    rxjs$OperatorFunction<O3, O4>,
    rxjs$OperatorFunction<O4, $Shape<Props>>,
): ResultOperator<Props>;
declare function handle<Props, I, O1, O2, O3, O4, O5>(
    propName: string,
    rxjs$OperatorFunction<I, O1>,
    rxjs$OperatorFunction<O1, O2>,
    rxjs$OperatorFunction<O2, O3>,
    rxjs$OperatorFunction<O3, O4>,
    rxjs$OperatorFunction<O4, O5>,
    rxjs$OperatorFunction<O5, $Shape<Props>>,
): ResultOperator<Props>;
declare function handle<Props, I, O1, O2, O3, O4, O5, O6>(
    propName: string,
    rxjs$OperatorFunction<I, O1>,
    rxjs$OperatorFunction<O1, O2>,
    rxjs$OperatorFunction<O2, O3>,
    rxjs$OperatorFunction<O3, O4>,
    rxjs$OperatorFunction<O4, O5>,
    rxjs$OperatorFunction<O5, O6>,
    rxjs$OperatorFunction<O6, $Shape<Props>>,
): ResultOperator<Props>;
declare function handle<Props, I, O1, O2, O3, O4, O5, O6, O7>(
    propName: string,
    rxjs$OperatorFunction<I, O1>,
    rxjs$OperatorFunction<O1, O2>,
    rxjs$OperatorFunction<O2, O3>,
    rxjs$OperatorFunction<O3, O4>,
    rxjs$OperatorFunction<O4, O5>,
    rxjs$OperatorFunction<O5, O6>,
    rxjs$OperatorFunction<O6, O7>,
    rxjs$OperatorFunction<O7, $Shape<Props>>,
): ResultOperator<Props>;
declare function handle<Props, I, O1, O2, O3, O4, O5, O6, O7, O8>(
    propName: string,
    rxjs$OperatorFunction<I, O1>,
    rxjs$OperatorFunction<O1, O2>,
    rxjs$OperatorFunction<O2, O3>,
    rxjs$OperatorFunction<O3, O4>,
    rxjs$OperatorFunction<O4, O5>,
    rxjs$OperatorFunction<O5, O6>,
    rxjs$OperatorFunction<O6, O7>,
    rxjs$OperatorFunction<O7, O8>,
    rxjs$OperatorFunction<O8, $Shape<Props>>,
    ...operations: rxjs$OperatorFunction<any, any>[]
): ResultOperator<Props>;

export function handle(propName, ...handlerOperators) {
  return props$ => props$.pipe(
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

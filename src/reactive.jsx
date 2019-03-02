// @flow
import * as React from 'react';
import {
  BehaviorSubject, of, concat, combineLatest, Subscription,
} from 'rxjs';
import type { Observable } from 'rxjs';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { assign } from './operators';
import { isObject, isSame } from './is';

export function reactive<Config: {}>(
  propsMapper: (arg: Observable<Config>) => Observable<$Shape<Config>>,
): (React.AbstractComponent<Config>) => React.AbstractComponent<Config> {
  return (WrappedComponent): React.AbstractComponent<Config> => (
    class ReactiveWrapper extends React.Component<Config, Config> {
      static displayName = `Reactive(${WrappedComponent.displayName || WrappedComponent.name || ''})`;

      constructor(props: Config) {
        super(props);
        this.state = props;
      }

      componentDidMount() {
        this.propsSubject = new BehaviorSubject(this.props);
        const props$ = this.propsSubject.pipe(distinctUntilChanged(isSame));
        const deltaProps$ = propsMapper(props$).pipe(
          filter(isObject),
          assign(),
        );
        const newProps$ = combineLatest(
          props$,
          concat(of({}), deltaProps$),
          (props, delta) => Object.assign({}, props, delta),
        );
        this.subscription = newProps$.subscribe((newProps: Config) => {
          this.setState(newProps);
        });
      }

      componentDidUpdate() {
        this.propsSubject.next(this.props);
      }

      componentWillUnmount() {
        this.propsSubject.complete();
        this.subscription.unsubscribe();
      }

      subscription: Subscription;

      propsSubject: BehaviorSubject<Config>;

      render() {
        return <WrappedComponent {...this.state} />;
      }
    }
  );
}

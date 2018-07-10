import React, { Component } from 'react';
import { BehaviorSubject, of, concat, combineLatest } from 'rxjs';
import { filter, distinctUntilChanged, scan } from 'rxjs/operators';
import { isObject, isSame } from './is';

export function reactive(propsMapper) {
    return WrappedComponent =>
        class ReactiveWrapper extends Component {
            static displayName = `Reactive(${WrappedComponent.displayName ||
                WrappedComponent.name})`;

            constructor(props) {
                super(props);
                this.state = props;
            }

            componentDidMount() {
                this.propsSubject = new BehaviorSubject(this.props);
                const props$ = this.propsSubject.pipe(distinctUntilChanged(isSame));
                const deltaProps$ = propsMapper(props$).pipe(
                    filter(isObject),
                    scan((acc, delta) => Object.assign(acc, delta), {}),
                );
                const newProps$ = combineLatest(
                    props$,
                    concat(of({}), deltaProps$),
                    (props, delta) => Object.assign({}, props, delta),
                );
                this.subscription = newProps$.subscribe((newProps) => {
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

            render() {
                return <WrappedComponent {...this.state} />;
            }
        };
}

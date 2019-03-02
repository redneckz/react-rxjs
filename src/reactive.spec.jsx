import React from 'react';
import { of } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { mount } from 'enzyme';
import { reactive } from './reactive';

describe('reactive decorator', () => {
  const Foo = () => <div />;

  it('should pass props to underlying/wrapped component through [propsMapper]', () => {
    const FooWrapper = reactive(
      props$ => props$.pipe(
        map(({ bar, baz }) => ({ quux: bar, plugh: baz })),
      ),
    )(Foo);
    const fooWrapper = mount(<FooWrapper bar={123} baz={456} />);
    const foo = fooWrapper.find(Foo);
    expect(foo.props()).toEqual({
      bar: 123,
      baz: 456,
      quux: 123,
      plugh: 456,
    });
  });

  it('should accumulate and apply all deltas produced by [propsMapper]', () => {
    const FooWrapper = reactive(
      () => of({ quux: 123 }, { plugh: 456 }),
    )(Foo);
    const fooWrapper = mount(<FooWrapper bar={123} />);
    const foo = fooWrapper.find(Foo);
    expect(foo.props()).toEqual({ bar: 123, quux: 123, plugh: 456 });
  });

  it('should combine latest props with latest deltas', () => {
    const FooWrapper = reactive(
      props$ => props$.pipe(
        map(({ bar, baz }) => (bar !== 0 ? { quux: bar } : { plugh: baz })),
      ),
    )(Foo);
    const fooWrapper = mount(<FooWrapper bar={123} />);
    expect(fooWrapper.find(Foo).props()).toEqual({ bar: 123, quux: 123 });
    fooWrapper.setProps({ bar: 0, baz: 456 });
    fooWrapper.update();
    expect(fooWrapper.find(Foo).props()).toEqual({
      bar: 0,
      baz: 456,
      quux: 123,
      plugh: 456,
    });
  });

  it('should pass completion event on unmount', () => {
    const onComplete = jest.fn();
    const FooWrapper = reactive(
      props$ => props$.pipe(finalize(onComplete)),
    )(Foo);
    const fooWrapper = mount(<FooWrapper />);
    fooWrapper.unmount();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});

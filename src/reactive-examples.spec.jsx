import 'regenerator-runtime/runtime';
import React from 'react';
import { map, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { mount } from 'enzyme';
import { reactive } from './reactive';
import { par, handle } from './operators';

describe('reactive decorator examples', () => {
  const Foo = () => <div />;

  const dataTable = {
    plugh: 123,
    quux: 456,
  };

  const fetchData = jest.fn(id => Promise.resolve(dataTable[id]));

  beforeEach(() => {
    fetchData.mockClear();
  });

  test('fetching data on property change', async () => {
    const FooWrapper = reactive(props$ => props$.pipe(
      map(({ id }) => id),
      distinctUntilChanged(),
      switchMap(fetchData),
      map(data => ({ data })),
    ))(Foo);

    const fooWrapper = mount(<FooWrapper id="plugh" />);
    await assertDataLoadedCorrectly();

    fetchData.mockClear();
    fooWrapper.setProps({ id: 'quux' });
    await assertDataLoadedCorrectly();

    async function assertDataLoadedCorrectly() {
      expect(fetchData.mock.calls.length).toBe(1);
      const id = fooWrapper.prop('id');
      expect(fetchData.mock.calls[0][0]).toBe(id);
      await fetchData.mock.results[0].value;
      fooWrapper.update();
      const foo = fooWrapper.find(Foo);
      expect(foo.props()).toEqual({
        id,
        data: dataTable[id],
      });
    }
  });

  test('fetching data depending on user input', async () => {
    const FooWrapper = reactive(
      par(
        handle('onChange', map(id => ({ id }))),
        handle('onEnter', switchMap(fetchData), map(data => ({ data }))),
      ),
    )(Foo);

    const fooWrapper = mount(<FooWrapper />);
    const { onChange, onEnter } = fooWrapper.find(Foo).props();
    expect(onChange).toBeInstanceOf(Function);
    expect(onEnter).toBeInstanceOf(Function);

    const id = 'plugh';
    onChange(id);
    fooWrapper.update();
    expect(fooWrapper.find(Foo).props()).toEqual({
      id,
      onChange,
      onEnter,
    });

    const newId = 'quux';
    onChange(newId);
    onEnter(newId);
    expect(fetchData.mock.calls.length).toBe(1);
    expect(fetchData.mock.calls[0][0]).toBe(newId);
    await fetchData.mock.results[0].value;
    fooWrapper.update();
    expect(fooWrapper.find(Foo).props()).toEqual({
      id: newId,
      data: dataTable[newId],
      onChange,
      onEnter,
    });
  });
});

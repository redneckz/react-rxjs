// @flow
import { isFunction, isObject, isNil, isSame } from './is';

describe('is', () => {
    describe('isFunction', () => {
        it('should return true if function was passed', () => {
            expect(isFunction(() => {})).toBeTruthy();
        });

        it('should return false if nil value was passed', () => {
            expect(isFunction(null)).toBeFalsy();
            expect(isFunction(undefined)).toBeFalsy();
        });

        it('should return false if scalar, object or array were passed', () => {
            expect(isFunction(true)).toBeFalsy();
            expect(isFunction(123)).toBeFalsy();
            expect(isFunction('123')).toBeFalsy();
            expect(isFunction(/\d+/)).toBeFalsy();
            expect(isFunction({})).toBeFalsy();
            expect(isFunction([])).toBeFalsy();
        });
    });

    describe('isObject', () => {
        function Foo() {}

        it('should return true if object was passed', () => {
            expect(isObject({})).toBeTruthy();
            expect(isObject(new Foo())).toBeTruthy();
        });

        it('should return false if nil value was passed', () => {
            expect(isObject(null)).toBeFalsy();
            expect(isObject(undefined)).toBeFalsy();
        });

        it('should return false if scalar, function or array were passed', () => {
            expect(isObject(true)).toBeFalsy();
            expect(isObject(123)).toBeFalsy();
            expect(isObject('123')).toBeFalsy();
            expect(isObject(/\d+/)).toBeFalsy();
            expect(isObject(() => {})).toBeFalsy();
            expect(isObject([])).toBeFalsy();
        });
    });

    describe('isNil', () => {
        it('should return true if null or undeifned was passed', () => {
            expect(isNil(null)).toBeTruthy();
            expect(isNil(undefined)).toBeTruthy();
        });

        it('should return false if non empty value was passed', () => {
            expect(isNil(true)).toBeFalsy();
            expect(isNil(123)).toBeFalsy();
            expect(isNil('123')).toBeFalsy();
            expect(isNil(/\d+/)).toBeFalsy();
            expect(isNil({})).toBeFalsy();
            expect(isNil([])).toBeFalsy();
        });
    });

    describe('isSame', () => {
        function foo(bar, baz, quux) {
            return { bar, baz, quux };
        }

        it('should compare scalars', () => {
            expect(isSame(1, 1)).toBeTruthy();
            expect(isSame(1, 2)).toBeFalsy();
            expect(isSame('1', '1')).toBeTruthy();
            expect(isSame('1', '2')).toBeFalsy();
            expect(isSame(true, true)).toBeTruthy();
            expect(isSame(true, false)).toBeFalsy();
        });

        it('should compare nils', () => {
            expect(isSame(null, null)).toBeTruthy();
            expect(isSame(null, undefined)).toBeFalsy();
            expect(isSame(undefined, undefined)).toBeTruthy();
        });

        it('should strictly compare scalars', () => {
            expect(isSame(1, '1')).toBeFalsy();
            expect(isSame('1', '1')).toBeTruthy();
        });

        it('should compare only objects and scalars (returns false in other cases)', () => {
            expect(isSame([1, 2, 3], [1, 2, 3])).toBeFalsy();
            expect(isSame(/\d+/, /\d+/)).toBeFalsy();
        });

        it('should shallowly compare plain objects', () => {
            const objA = foo(1, 2, 3);
            const objB = foo(1, 2, 3);
            const objC = foo(4, 5, 6);
            expect(isSame(foo(objA, objB, objC), foo(objA, objB, objC))).toBeTruthy();
            expect(isSame(foo(objA, objB, objC), foo(foo(1, 2, 3), objB, objC))).toBeFalsy();
        });
    });
});

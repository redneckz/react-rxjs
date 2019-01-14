'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var rxjs = require('rxjs');
var operators = require('rxjs/operators');
var React = require('react');

function par() {
    for (var _len = arguments.length, operators$$1 = Array(_len), _key = 0; _key < _len; _key++) {
        operators$$1[_key] = arguments[_key];
    }

    return function (props$) {
        return rxjs.merge.apply(undefined, operators$$1.map(function (op) {
            return op(props$);
        }));
    };
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

function isFunction(o) {
    return typeof o === 'function';
}

function isObject(o) {
    return Boolean(o) && (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && Object.prototype.toString.call(o) === '[object Object]';
}

function isNil(o) {
    return o === null || o === undefined;
}

function isSame(objA, objB) {
    if (objA === objB) {
        return true;
    }
    if (!isObject(objA) || !isObject(objB)) {
        return false;
    }
    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);
    var sameSize = keysA.length === keysB.length;
    var sameValues = function sameValues() {
        return keysA.every(function (key) {
            return objA[key] === objB[key];
        });
    };
    return sameSize && sameValues();
}

function handle(propName) {
    for (var _len = arguments.length, handlerOperators = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        handlerOperators[_key - 1] = arguments[_key];
    }

    return function (props$) {
        return props$.pipe(operators.pluck(propName), operators.distinctUntilChanged(), operators.switchMap(function (handler) {
            var _of;

            var eventsSubject = new rxjs.Subject();
            var wrappedHandler = function wrappedHandler(event) {
                eventsSubject.next(event);
                if (isFunction(handler)) handler(event);
            };
            return rxjs.concat(rxjs.of((_of = {}, _of[propName] = wrappedHandler, _of)), eventsSubject.pipe.apply(eventsSubject, handlerOperators.concat([operators.filter(function (obj) {
                return !(obj instanceof Event);
            }), operators.filter(isObject)])));
        }));
    };
}

function assign() {
    return operators.scan(function (acc, delta) {
        return Object.assign({}, acc, delta);
    }, {});
}

function prev(startVal) {
    return function (props$) {
        return props$.pipe(operators.startWith(startVal), operators.pairwise(), operators.map(function (_ref) {
            var previous = _ref[0];
            return previous;
        }));
    };
}

function reactive(propsMapper) {
    return function (WrappedComponent) {
        var _class, _temp;

        return _temp = _class = function (_React$Component) {
            inherits(ReactiveWrapper, _React$Component);

            function ReactiveWrapper(props) {
                classCallCheck(this, ReactiveWrapper);

                var _this = possibleConstructorReturn(this, _React$Component.call(this, props));

                _this.state = props;
                return _this;
            }

            ReactiveWrapper.prototype.componentDidMount = function componentDidMount() {
                var _this2 = this;

                this.propsSubject = new rxjs.BehaviorSubject(this.props);
                var props$ = this.propsSubject.pipe(operators.distinctUntilChanged(isSame));
                var deltaProps$ = propsMapper(props$).pipe(operators.filter(isObject), assign());
                var newProps$ = rxjs.combineLatest(props$, rxjs.concat(rxjs.of({}), deltaProps$), function (props, delta) {
                    return Object.assign({}, props, delta);
                });
                this.subscription = newProps$.subscribe(function (newProps) {
                    _this2.setState(newProps);
                });
            };

            ReactiveWrapper.prototype.componentDidUpdate = function componentDidUpdate() {
                this.propsSubject.next(this.props);
            };

            ReactiveWrapper.prototype.componentWillUnmount = function componentWillUnmount() {
                this.propsSubject.complete();
                this.subscription.unsubscribe();
            };

            ReactiveWrapper.prototype.render = function render() {
                return React.createElement(WrappedComponent, this.state);
            };

            return ReactiveWrapper;
        }(React.Component), _class.displayName = 'Reactive(' + (WrappedComponent.displayName || WrappedComponent.name || '') + ')', _temp;
    };
}

exports.reactive = reactive;
exports.par = par;
exports.handle = handle;
exports.assign = assign;
exports.prev = prev;
exports.isFunction = isFunction;
exports.isObject = isObject;
exports.isNil = isNil;
exports.isSame = isSame;
//# sourceMappingURL=index.js.map

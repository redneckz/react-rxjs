'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var rxjs = require('rxjs');
var operators = require('rxjs/operators');

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function par() {
  for (var _len = arguments.length, operators$$1 = new Array(_len), _key = 0; _key < _len; _key++) {
    operators$$1[_key] = arguments[_key];
  }

  return function (props$) {
    return rxjs.merge.apply(void 0, operators$$1.map(function (op) {
      return op(props$);
    }));
  };
}

function isFunction(o) {
  return typeof o === 'function';
}
function isObject(o) {
  return Boolean(o) && typeof o === 'object' && Object.prototype.toString.call(o) === '[object Object]';
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

/* eslint-disable no-redeclare, no-unused-vars */
function handle(propName) {
  for (var _len = arguments.length, handlerOperators = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
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

    return _temp = _class =
    /*#__PURE__*/
    function (_React$Component) {
      _inheritsLoose(ReactiveWrapper, _React$Component);

      function ReactiveWrapper(props) {
        var _this;

        _this = _React$Component.call(this, props) || this;

        _defineProperty(_assertThisInitialized(_this), "subscription", void 0);

        _defineProperty(_assertThisInitialized(_this), "propsSubject", void 0);

        _this.state = props;
        return _this;
      }

      var _proto = ReactiveWrapper.prototype;

      _proto.componentDidMount = function componentDidMount() {
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

      _proto.componentDidUpdate = function componentDidUpdate() {
        this.propsSubject.next(this.props);
      };

      _proto.componentWillUnmount = function componentWillUnmount() {
        this.propsSubject.complete();
        this.subscription.unsubscribe();
      };

      _proto.render = function render() {
        return React.createElement(WrappedComponent, this.state);
      };

      return ReactiveWrapper;
    }(React.Component), _defineProperty(_class, "displayName", "Reactive(" + (WrappedComponent.displayName || WrappedComponent.name || '') + ")"), _temp;
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

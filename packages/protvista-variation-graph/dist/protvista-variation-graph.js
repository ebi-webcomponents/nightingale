var ProtvistaVariationGraph = (function (ProtvistaTrack,d3) {
  'use strict';

  ProtvistaTrack = ProtvistaTrack && ProtvistaTrack.hasOwnProperty('default') ? ProtvistaTrack['default'] : ProtvistaTrack;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

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

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function set(target, property, value, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.set) {
      set = Reflect.set;
    } else {
      set = function set(target, property, value, receiver) {
        var base = _superPropBase(target, property);

        var desc;

        if (base) {
          desc = Object.getOwnPropertyDescriptor(base, property);

          if (desc.set) {
            desc.set.call(receiver, value);
            return true;
          } else if (!desc.writable) {
            return false;
          }
        }

        desc = Object.getOwnPropertyDescriptor(receiver, property);

        if (desc) {
          if (!desc.writable) {
            return false;
          }

          desc.value = value;
          Object.defineProperty(receiver, property, desc);
        } else {
          _defineProperty(receiver, property, value);
        }

        return true;
      };
    }

    return set(target, property, value, receiver);
  }

  function _set(target, property, value, receiver, isStrict) {
    var s = set(target, property, value, receiver || target);

    if (!s && isStrict) {
      throw new Error('failed to set property');
    }

    return value;
  }

  var ProtvistaVariationGraph =
  /*#__PURE__*/
  function (_ProtvistaTrack) {
    _inherits(ProtvistaVariationGraph, _ProtvistaTrack);

    function ProtvistaVariationGraph() {
      _classCallCheck(this, ProtvistaVariationGraph);

      return _possibleConstructorReturn(this, _getPrototypeOf(ProtvistaVariationGraph).call(this));
    }

    _createClass(ProtvistaVariationGraph, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this = this;

        _get(_getPrototypeOf(ProtvistaVariationGraph.prototype), "connectedCallback", this).call(this);

        this._data = undefined;
        this._height = parseInt(this.getAttribute("height")) || 40;
        this._yScale = d3.scaleLinear();
        this._xExtent;
        this._yExtent;
        this._totals_line = d3.line().x(function (d) {
          return _this.xScale(d.x);
        }).y(function (d) {
          return _this._yScale(d.y);
        }).curve(d3.curveBasis);
        this._totals_dataset = {};
        this._totals_feature = undefined;
        this._disease_line = d3.line().x(function (d) {
          return _this.xScale(d.x);
        }).y(function (d) {
          return _this._yScale(d.y);
        }).curve(d3.curveBasis);
        this._disease_dataset = {};
        this._disease_feature = undefined;
      }
    }, {
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(attrName, oldVal, newVal) {
        _get(_getPrototypeOf(ProtvistaVariationGraph.prototype), "attributeChangedCallback", this).call(this, attrName, oldVal, newVal);

        if (!_get(_getPrototypeOf(ProtvistaVariationGraph.prototype), "svg", this)) {
          return;
        }
      }
    }, {
      key: "_emptyFillMissingRecords",
      value: function _emptyFillMissingRecords(dataset) {
        var sortedTotalsKeys = Object.keys(dataset).sort(function (a, b) {
          return parseInt(a) - parseInt(b);
        });
        var totalsMin = sortedTotalsKeys[0];
        var totalsMax = sortedTotalsKeys[sortedTotalsKeys.length - 1];

        for (var i = totalsMin; i < totalsMax; i++) {
          if ("undefined" === typeof dataset[i]) {
            dataset[i] = 0;
          }
        }

        return Object.keys(dataset).sort(function (a, b) {
          return parseInt(a) - parseInt(b);
        }).map(function (k) {
          return {
            x: k,
            y: dataset[k]
          };
        });
      }
    }, {
      key: "_createTrack",
      value: function _createTrack() {
        _set(_getPrototypeOf(ProtvistaVariationGraph.prototype), "svg", d3.select(this).append("svg").attr("width", this.width).attr("height", this._height), this, true); // Create the visualisation here


        this._createFeatures();

        this.refresh();
      }
    }, {
      key: "_createFeatures",
      value: function _createFeatures() {
        this._xExtent = d3.extent(this._totals_dataset, function (d) {
          return parseInt(d.x);
        });
        this._yExtent = d3.extent(this._totals_dataset, function (d) {
          return d.y;
        }); // just a bit of padding on the top

        this._yExtent[1] += 2;
        this.xScale.domain(this._xExtent).range([0, this._width]);

        this._yScale.domain(this._yExtent).range([this._height, 0]);
      }
    }, {
      key: "refresh",
      value: function refresh() {
        _get(_getPrototypeOf(ProtvistaVariationGraph.prototype), "svg", this).selectAll("path").remove();

        this._disease_feature = _get(_getPrototypeOf(ProtvistaVariationGraph.prototype), "svg", this).append("path").data([this._disease_dataset]).attr("fill", "none").attr("stroke", "red").attr("stroke-width", "1.5px").attr("stroke-dasharray", "0").attr("d", this._disease_line).attr("transform", "translate(0,0)");
        this._totals_feature = _get(_getPrototypeOf(ProtvistaVariationGraph.prototype), "svg", this).append("path").data([this._totals_dataset]).attr("fill", "none").attr("stroke", "darkgrey").attr("stroke-width", "1px").attr("stroke-dasharray", ".5").attr("d", this._totals_line).attr("transform", "translate(0,0)");
      }
    }, {
      key: "data",
      set: function set$$1(data) {
        var _this2 = this;

        this._data = data;

        this._data.forEach(function (m) {
          if (0 >= m.variants.length) {
            return;
          }

          m.variants.forEach(function (v) {
            if ("undefined" === typeof _this2._totals_dataset[v.begin]) {
              _this2._totals_dataset[v.begin] = 0;
            }

            if ("undefined" === typeof _this2._disease_dataset[v.begin]) {
              _this2._disease_dataset[v.begin] = 0;
            }

            _this2._totals_dataset[v.begin]++;

            if ("undefined" !== typeof v.association) {
              v.association.forEach(function (a) {
                if (true === a.disease) {
                  _this2._disease_dataset[v.begin]++;
                }
              });
            }
          });
        });

        this._totals_dataset = this._emptyFillMissingRecords(this._totals_dataset);
        this._disease_dataset = this._emptyFillMissingRecords(this._disease_dataset);

        this._createTrack();
      }
    }]);

    return ProtvistaVariationGraph;
  }(ProtvistaTrack);

  var loadComponent = function loadComponent() {
    customElements.define("protvista-variation-graph", ProtvistaVariationGraph);
  }; // Conditional loading of polyfill


  if (window.customElements) {
    loadComponent();
  } else {
    document.addEventListener("WebComponentsReady", function () {
      loadComponent();
    });
  }

  return ProtvistaVariationGraph;

}(ProtvistaTrack,d3));
//# sourceMappingURL=protvista-variation-graph.js.map

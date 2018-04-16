(function (ProtVistaTrack,d3) {
'use strict';

function __$styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

ProtVistaTrack = ProtVistaTrack && ProtVistaTrack.hasOwnProperty('default') ? ProtVistaTrack['default'] : ProtVistaTrack;

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
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



var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var loadComponent = function loadComponent() {
    var ProtvistaVariationGraph = function (_ProtVistaTrack) {
        inherits(ProtvistaVariationGraph, _ProtVistaTrack);

        function ProtvistaVariationGraph() {
            classCallCheck(this, ProtvistaVariationGraph);
            return possibleConstructorReturn(this, (ProtvistaVariationGraph.__proto__ || Object.getPrototypeOf(ProtvistaVariationGraph)).call(this));
        }

        createClass(ProtvistaVariationGraph, [{
            key: 'connectedCallback',
            value: function connectedCallback() {
                var _this2 = this;

                get(ProtvistaVariationGraph.prototype.__proto__ || Object.getPrototypeOf(ProtvistaVariationGraph.prototype), 'connectedCallback', this).call(this);

                this._data = undefined;

                this._margin = {
                    top: 20,
                    bottom: 10,
                    right: 10,
                    left: 10
                };

                this._height = parseInt(this.getAttribute('height')) || 60;
                this._width = parseInt(this.getAttribute('width')) || 800;
                // console.log("++ w/h:", this._width, this._height);
                // const bbox = select(this).node().getBoundingClientRect();
                // console.log("bbox:", bbox);
                // this._width = bbox.width;
                // this._height = bbox.height;

                this._xScale = d3.scaleLinear();
                this._yScale = d3.scaleLinear();
                this._xExtent;
                this._yExtent;

                this._totals_line = d3.line().x(function (d) {
                    return _this2._xScale(d.x);
                }).y(function (d) {
                    return _this2._yScale(d.y);
                }).curve(d3.curveBasis);

                this._totals_dataset = {};

                this._disease_line = d3.line().x(function (d) {
                    return _this2._xScale(d.x);
                }).y(function (d) {
                    return _this2._yScale(d.y);
                }).curve(d3.curveBasis);

                this._disease_dataset = {};

                this._non_disease_line = d3.line().x(function (d) {
                    return _this2._xScale(d.x);
                }).y(function (d) {
                    return _this2._yScale(d.y);
                }).curve(d3.curveBasis);

                this._non_disease_dataset = {};
            }
        }, {
            key: 'attributeChangedCallback',
            value: function attributeChangedCallback(attrName, oldVal, newVal) {
                // super.attributeChangedCallback(attrName, oldVal, newVal);
                console.log('attr changed:', attrName, oldVal, newVal);
            }
        }, {
            key: '_emptyFillMissingRecords',
            value: function _emptyFillMissingRecords(dataset) {
                var sortedTotalsKeys = Object.keys(dataset).sort(function (a, b) {
                    return parseInt(a) - parseInt(b);
                });

                var totalsMin = sortedTotalsKeys[0];
                var totalsMax = sortedTotalsKeys[sortedTotalsKeys.length - 1];

                for (var i = totalsMin; i < totalsMax; i++) {
                    if ('undefined' === typeof dataset[i]) {
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
            key: '_createTrack',
            value: function _createTrack() {
                set(ProtvistaVariationGraph.prototype.__proto__ || Object.getPrototypeOf(ProtvistaVariationGraph.prototype), 'svg', d3.select(this).append('svg')
                // .attr('width', this._width + this._margin.left + this._margin.right)
                .attr('height', this._height + this._margin.top + this._margin.bottom).attr('width', this._width)
                // .attr('height', this._height)
                // .append('g')
                //     .attr('transform', `translate(${this._margin.top},${this._margin.left})`);
                .append('g').attr('transform', 'translate(0, 20)'), this);

                get(ProtvistaVariationGraph.prototype.__proto__ || Object.getPrototypeOf(ProtvistaVariationGraph.prototype), 'svg', this).append('rect').attr('width', '100%').attr('height', '100%').attr('fill', 'white').attr('stroke-width', '1').attr('stroke', 'grey');
                // .attr('transform', `translate(0,0)`);

                // Create the visualisation here
                this._createFeatures();
            }
        }, {
            key: '_createFeatures',
            value: function _createFeatures() {

                this._xExtent = d3.extent(this._totals_dataset, function (d) {
                    return parseInt(d.x);
                });
                this._yExtent = d3.extent(this._totals_dataset, function (d) {
                    return d.y;
                });

                //             const bbox = select(this).node().getBoundingClientRect();
                // console.log("bbox:", bbox);
                console.log("width/height:", this._width, this._height);
                this._xScale.domain(this._xExtent).range([0, this._width]);
                this._yScale.domain(this._yExtent).range([this._height, 0]);

                get(ProtvistaVariationGraph.prototype.__proto__ || Object.getPrototypeOf(ProtvistaVariationGraph.prototype), 'svg', this).append('path').data([this._disease_dataset]).attr('fill', 'none').attr('stroke', 'red').attr('stroke-width', '1.5px').attr('stroke-dasharray', '0').attr('d', this._disease_line);

                // super.svg
                //     .append('path')
                //     .data([this._non_disease_dataset])
                //     .attr('fill', 'none')
                //     .attr('stroke', 'yellow')
                //     .attr('stroke-width', '1.5px')
                //     .attr('stroke-dasharray', '0')
                //     .attr('d', this._non_disease_line);

                get(ProtvistaVariationGraph.prototype.__proto__ || Object.getPrototypeOf(ProtvistaVariationGraph.prototype), 'svg', this).append('path').data([this._totals_dataset]).attr('fill', 'none').attr('stroke', 'darkgrey').attr('stroke-width', '1px').attr('stroke-dasharray', '.5').attr('d', this._totals_line);
            }
        }, {
            key: 'updateScale',
            value: function updateScale() {}
        }, {
            key: 'data',
            set: function set$$1(data) {
                var _this3 = this;

                console.log('data:', data);
                // this._data = this.normalizeLocations(data);
                this._data = data;

                this._data.features.forEach(function (r) {
                    if ('undefined' === typeof _this3._totals_dataset[r.begin]) {
                        _this3._totals_dataset[r.begin] = 0;
                    }

                    if ('undefined' === typeof _this3._disease_dataset[r.begin]) {
                        _this3._disease_dataset[r.begin] = 0;
                    }

                    if ('undefined' === typeof _this3._non_disease_dataset[r.begin]) {
                        _this3._non_disease_dataset[r.begin] = 0;
                    }

                    _this3._totals_dataset[r.begin]++;

                    if ('undefined' !== typeof r.association) {
                        r.association.forEach(function (a) {
                            // console.log("disease:", a);
                            if (true === a.disease) {
                                _this3._disease_dataset[r.begin]++;
                            } else if (false === a.disease) {
                                _this3._non_disease_dataset[r.begin]++;
                            }
                        });
                    }
                });

                this._totals_dataset = this._emptyFillMissingRecords(this._totals_dataset);
                this._disease_dataset = this._emptyFillMissingRecords(this._disease_dataset);
                this._non_disease_dataset = this._emptyFillMissingRecords(this._non_disease_dataset);

                // const sortedDiseases = Object.keys(this._disease_dataset)
                //     .map(k => parseInt(k))
                //     .sort((a, b) => a - b)
                //     .map(k => ({
                //         x: k,
                //         y: this._disease_dataset[k]
                //     }));

                // this._disease_dataset = sortedDiseases;

                // console.log('TOTALS:', this._totals_dataset);
                // console.log('DISEASES:', this._disease_dataset);
                // console.log("NON-DISEASE:", this._non_disease_dataset);

                this._createTrack();
            }
        }]);
        return ProtvistaVariationGraph;
    }(ProtVistaTrack);

    customElements.define('protvista-variation-graph', ProtvistaVariationGraph);
};

// Conditional loading of polyfill
if (window.customElements) {
    loadComponent();
} else {
    document.addEventListener('WebComponentsReady', function () {
        loadComponent();
    });
}

}(ProtVistaTrack,d3));
//# sourceMappingURL=protvista-variation-graph.js.map

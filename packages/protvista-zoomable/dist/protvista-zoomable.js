var ProtvistaZoomable = (function (d3) {
'use strict';

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

var ProtvistaZoomable$1 = function (_HTMLElement) {
    inherits(ProtvistaZoomable, _HTMLElement);

    function ProtvistaZoomable() {
        classCallCheck(this, ProtvistaZoomable);

        var _this = possibleConstructorReturn(this, (ProtvistaZoomable.__proto__ || Object.getPrototypeOf(ProtvistaZoomable)).call(this));

        _this._margin = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        };
        _this.width = _this.getAttribute('width') ? _this.getAttribute('width') : _this.offsetWidth;
        _this.length = _this.getAttribute('length') ? parseInt(_this.getAttribute('length')) : 0;

        _this.displayStart = _this.getAttribute('displaystart') ? parseInt(_this.getAttribute('displaystart')) : 0;
        _this.displayEnd = _this.getAttribute('displayEnd') ? parseInt(_this.getAttribute('displayEnd')) : _this.width;

        _this.initZoom = _this.initZoom.bind(_this);
        _this.updateScaleDomain = _this.updateScaleDomain.bind(_this);
        _this.zoomed = _this.zoomed.bind(_this);
        _this.applyZoomTranslation = _this.applyZoomTranslation.bind(_this);
        return _this;
    }

    createClass(ProtvistaZoomable, [{
        key: 'updateScaleDomain',
        value: function updateScaleDomain() {
            this.xScale = d3.scaleLinear().domain([1, this._length + 1]).range([this._margin.left, this._width - this._margin.right]);
        }
    }, {
        key: 'initZoom',
        value: function initZoom() {
            this._zoom = d3.zoom().scaleExtent([1, 40]).translateExtent([[0, 0], [this.width, 100]]).on("zoom", this.zoomed.bind(this));
        }
    }, {
        key: 'zoomed',
        value: function zoomed() {
            this.xScale = d3.event.transform.rescaleX(this._orignXScale);
            this.refresh();
        }
    }, {
        key: 'applyZoomTranslation',
        value: function applyZoomTranslation() {
            // TODO pass the SVG here or SVG should be on zoomable?
            this._zoomScale = (this._length - this.displayEnd) / this.displayStart;
            this._svg.transition().duration(300).call(this._zoom.transform, d3.zoomIdentity.translate(-(this._xScale(this.displayStart) * this._zoomScale) + this._margin.left, 0).scale(this._zoomScale));
            this.refresh();
        }
    }, {
        key: 'displayStart',
        get: function get$$1() {
            return this.getAttribute('displaystart');
        },
        set: function set$$1(displaystart) {
            if (displaystart !== this.getAttribute('displaystart')) {
                this.setAttribute('displaystart', displaystart);
            }
        }
    }, {
        key: 'displayEnd',
        get: function get$$1() {
            return this.getAttribute('displayend');
        },
        set: function set$$1(displayend) {
            if (displayend !== this.getAttribute('displayend')) {
                this.setAttribute('displayend', displayend);
            }
        }
    }, {
        key: 'width',
        get: function get$$1() {
            return this._width;
        },
        set: function set$$1(width) {
            this._width = width;
            this.initZoom();
        }
    }, {
        key: 'length',
        set: function set$$1(length) {
            this._length = length;
            this.updateScaleDomain();
        },
        get: function get$$1() {
            return this._length;
        }
    }, {
        key: 'xScale',
        get: function get$$1() {
            return this._xScale;
        },
        set: function set$$1(xScale) {
            this._xScale = xScale;
            this._orignXScale = xScale;
        }
    }, {
        key: 'zoom',
        get: function get$$1() {
            return this._zoom;
        }
    }, {
        key: 'svg',
        set: function set$$1(svg) {
            this._svg = svg;
            svg.call(this._zoom);
        },
        get: function get$$1() {
            return this._svg;
        }
    }]);
    return ProtvistaZoomable;
}(HTMLElement);

var loadComponent = function loadComponent() {
    customElements.define('protvista-zoomable', ProtvistaZoomable$1);
};

// Conditional loading of polyfill
if (window.customElements) {
    loadComponent();
} else {
    document.addEventListener('WebComponentsReady', function () {
        loadComponent();
    });
}

return ProtvistaZoomable$1;

}(d3));
//# sourceMappingURL=protvista-zoomable.js.map

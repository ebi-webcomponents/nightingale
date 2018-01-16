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

        _this.updateScaleDomain = _this.updateScaleDomain.bind(_this);
        _this.initZoom = _this.initZoom.bind(_this);
        _this.zoomed = _this.zoomed.bind(_this);
        _this._applyZoomTranslation = _this.applyZoomTranslation.bind(_this);
        var aboutToApply = false;
        _this.applyZoomTranslation = function () {
            if (aboutToApply) return;
            aboutToApply = true;
            requestAnimationFrame(function () {
                aboutToApply = false;
                _this._applyZoomTranslation();
            });
        };
        _this.listenForResize = _this.listenForResize.bind(_this);

        return _this;
    }

    createClass(ProtvistaZoomable, [{
        key: 'connectedCallback',
        value: function connectedCallback() {
            this.style.display = 'block';
            this.style.width = '100%';
            this.width = this.offsetWidth;

            this._length = this.getAttribute('length') ? parseFloat(this.getAttribute('length')) : 0;

            this._displaystart = this.getAttribute('displaystart') ? parseFloat(this.getAttribute('displaystart')) : 0;
            this._displayend = this.getAttribute('displayend') ? parseFloat(this.getAttribute('displayend')) : this.width;
            this.updateScaleDomain();
            this._originXScale = this.xScale.copy();
            this.initZoom();
            this.listenForResize();
        }
    }, {
        key: 'updateScaleDomain',
        value: function updateScaleDomain() {
            this.xScale = d3.scaleLinear().domain([1, this._length]).range([0, this._width]);
        }
    }, {
        key: 'initZoom',
        value: function initZoom() {
            this._zoom = d3.zoom().scaleExtent([1, 4]).translateExtent([[this.xScale(1), 0], [this.width, 0]]).on("zoom", this.zoomed);
        }
    }, {
        key: 'attributeChangedCallback',
        value: function attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue !== newValue) {
                var value = parseFloat(newValue);
                this['_' + name] = isNaN(value) ? newValue : value;
                this.applyZoomTranslation();
            }
        }
    }, {
        key: 'zoomed',
        value: function zoomed() {
            this.xScale = d3.event.transform.rescaleX(this._originXScale);
            // this.refresh();
            // Only refresh in the applyZoomTranslation

            // If the source event is null the zoom wasn't initiated by this component, don't send event
            if (this.dontDispatch) return;
            this.dispatchEvent(new CustomEvent("change", {
                detail: {
                    displaystart: this.xScale.domain()[0],
                    displayend: this.xScale.domain()[1]
                }, bubbles: true, cancelable: true
            }));
        }
    }, {
        key: 'applyZoomTranslation',
        value: function applyZoomTranslation() {
            if (!this.svg || !this._originXScale) return;
            var k = Math.max(1, this.length / (this._displayend - this._displaystart));
            var dx = -this._originXScale(this._displaystart);
            this.dontDispatch = true;
            this.svg
            // .transition()
            // .duration(300)
            .call(this.zoom.transform, d3.zoomIdentity.scale(k).translate(dx, 0));
            this.dontDispatch = false;
            this.refresh();
        }
    }, {
        key: 'listenForResize',
        value: function listenForResize() {
            var _this2 = this;

            // TODO add sleep to make transition appear smoother. Could experiment with CSS3
            // transitions too
            window.onresize = function () {
                _this2.width = _this2.offsetWidth;
                //TODO trigger repaint here
            };
        }
    }, {
        key: 'width',
        get: function get$$1() {
            return this._width;
        },
        set: function set$$1(width) {
            this._width = width;
        }
    }, {
        key: 'length',
        set: function set$$1(length) {
            this._length = length;
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
            this.applyZoomTranslation();
        },
        get: function get$$1() {
            return this._svg;
        }
    }], [{
        key: 'observedAttributes',
        get: function get$$1() {
            return ['displaystart', 'displayend'];
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

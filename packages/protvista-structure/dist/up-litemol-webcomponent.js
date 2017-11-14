(function () {
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

var loadComponent = function loadComponent() {
    var UpLitemolWebcomponent = function (_HTMLElement) {
        inherits(UpLitemolWebcomponent, _HTMLElement);

        function UpLitemolWebcomponent() {
            classCallCheck(this, UpLitemolWebcomponent);

            // We can't use the shadow DOM as the LiteMol component interacts with the
            // document DOM.
            var _this = possibleConstructorReturn(this, (UpLitemolWebcomponent.__proto__ || Object.getPrototypeOf(UpLitemolWebcomponent)).call(this));

            _this.loadMolecule = _this.loadMolecule.bind(_this);
            return _this;
        }

        createClass(UpLitemolWebcomponent, [{
            key: 'getId',
            value: function getId() {
                return this.getAttribute('id');
            }
        }, {
            key: 'setId',
            value: function setId(id) {
                return this.setAttribute('id', id);
            }
        }, {
            key: 'connectedCallback',
            value: function connectedCallback() {
                var jsmolDiv = document.createElement('div');
                jsmolDiv.id = 'app';
                this.appendChild(jsmolDiv);

                var Plugin = LiteMol.Plugin;
                this._liteMol = Plugin.create({
                    target: '#app',
                    viewportBackground: '#fff',
                    layoutState: {
                        hideControls: true,
                        isExpanded: true
                    },
                    allowAnalytics: false
                });
                this.loadMolecule(this.id);
            }
        }, {
            key: 'attributeChangedCallback',
            value: function attributeChangedCallback(attrName, oldVal, newVal) {}
        }, {
            key: 'loadMolecule',
            value: function loadMolecule(_id) {
                this._liteMol.loadMolecule({
                    _id: _id, format: 'cif', // or pdb, sdf, binarycif/bcif
                    url: 'https://www.ebi.ac.uk/pdbe/static/entry/' + _id.toLowerCase() + '_updated.cif',
                    // instead of url, it is possible to use data: "string" or ArrayBuffer (for
                    // BinaryCIF) loaded molecule and model can be accessed after load using
                    // plugin.context.select(modelRef/moleculeRef)[0], for example
                    // plugin.context.select('1tqn-molecule')[0]
                    moleculeRef: _id + '-molecule',
                    modelRef: _id + '-model'
                    // Use this if you want to create your own visual. doNotCreateVisual: true
                }).then(function () {
                    // Use this (or a modification of this) for custom visualization: const style =
                    // LiteMol.Bootstrap.Visualization.Molecule.Default.ForType.get('BallsAndSticks'
                    // ); const t = plugin.createTransform(); t.add(id + '-model',
                    // LiteMol.Bootstrap.Entity.Transformer.Molecule.CreateVisual, { style: style })
                    // plugin.applyTransform(t);
                    console.log('Molecule loaded');
                }).catch(function (e) {
                    console.error(e);
                });
            }
        }]);
        return UpLitemolWebcomponent;
    }(HTMLElement);

    customElements.define('up-litemol-webcomponent', UpLitemolWebcomponent);
};

// Conditional loading of polyfill
if (window.customElements) {
    loadComponent();
} else {
    document.addEventListener('WebComponentsReady', function () {
        loadComponent();
    });
}

}());
//# sourceMappingURL=up-litemol-webcomponent.js.map

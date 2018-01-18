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



var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

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
    var UuwLitemolComponent = function (_HTMLElement) {
        inherits(UuwLitemolComponent, _HTMLElement);

        function UuwLitemolComponent() {
            classCallCheck(this, UuwLitemolComponent);

            // We can't use the shadow DOM as the LiteMol component interacts with the
            // document DOM.
            var _this = possibleConstructorReturn(this, (UuwLitemolComponent.__proto__ || Object.getPrototypeOf(UuwLitemolComponent)).call(this));

            _this.loadMolecule = _this.loadMolecule.bind(_this);
            _this.loadStructureTable = _this.loadStructureTable.bind(_this);
            var styleTag = document.createElement('style');
            _this.appendChild(styleTag);
            styleTag.innerHTML = '\n                :root {\n                    --blue: 0,112,155;\n                    --width: 100%;\n                }\n                uuw-litemol-component {\n                    display:flex;\n                }\n                .jsmol-container, .table-container {\n                    width: var(--width);\n                    height: 480px;\n                    position: relative;\n                }\n                .table-container table {\n                    width:100%;\n                    height: 480px;\n                    border-collapse: collapse;\n                }\n                .table-container thead {\n                    min-height: 3em;\n                  }\n                  \n                .table-container th, .table-container td {\n                    box-sizing: border-box;\n                    flex: 1 0 5em;\n                    overflow: hidden;\n                    text-overflow: ellipsis;\n                }\n                .table-container table, .table-container thead, .table-container tbody, .table-container tfoot {\n                    display: flex;\n                    flex-direction: column;\n                }\n                .table-container tr {\n                    display: flex;\n                    flex: 1 0;\n                }\n                .table-container tbody {\n                    overflow-y: auto;\n                }\n                .table-container tbody tr {\n                    cursor: pointer;\n                }\n                .table-container tbody tr:hover {\n                    background-color: rgba(var(--blue), 0.15);;\n                }\n                .table-container tr.active {\n                    background-color: rgba(var(--blue), 0.3);;\n                }\n            ';
            return _this;
        }

        createClass(UuwLitemolComponent, [{
            key: 'getAccession',
            value: function getAccession() {
                return this.getAttribute('accession');
            }
        }, {
            key: 'setAccession',
            value: function setAccession(accession) {
                return this.setAttribute('accession', accession);
            }
        }, {
            key: 'connectedCallback',
            value: function connectedCallback() {
                var _this2 = this;

                this.tableDiv = document.createElement('div');
                this.tableDiv.className = 'table-container';
                var jsmolDiv = document.createElement('div');
                jsmolDiv.className = 'jsmol-container';
                jsmolDiv.id = 'app';
                this.appendChild(jsmolDiv);
                this.appendChild(this.tableDiv);
                this.loadLiteMol();
                this.loadEntry().then(function (entry) {
                    var pdbEntries = entry.dbReferences.filter(function (dbref) {
                        return dbref.type === 'PDB';
                    });
                    _this2.loadStructureTable(pdbEntries);
                    _this2.selectMolecule(pdbEntries[0].id);
                });
            }
        }, {
            key: 'attributeChangedCallback',
            value: function attributeChangedCallback(attrName, oldVal, newVal) {
                console.log('changed', attrName);
            }
        }, {
            key: 'loadEntry',
            value: function () {
                var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    _context.prev = 0;
                                    _context.next = 3;
                                    return fetch('https://www.ebi.ac.uk/proteins/api/proteins/' + this.getAccession());

                                case 3:
                                    _context.next = 5;
                                    return _context.sent.json();

                                case 5:
                                    return _context.abrupt('return', _context.sent);

                                case 8:
                                    _context.prev = 8;
                                    _context.t0 = _context['catch'](0);

                                    console.log('Couldn\'t load UniProt entry', _context.t0);

                                case 11:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, this, [[0, 8]]);
                }));

                function loadEntry() {
                    return _ref.apply(this, arguments);
                }

                return loadEntry;
            }()
        }, {
            key: 'loadStructureTable',
            value: function loadStructureTable(pdbEntries) {
                var _this3 = this;

                var html = '\n                <table>\n                    <colgroup>\n                        <col syle="width: 100px">\n                        <col syle="width: 100px">\n                        <col syle="width: 100px">\n                        <col syle="width: 100px">\n                        <col syle="width: auto">\n                    </colgroup>\n                    <thead><th>PDB Entry</th><th>Method</th><th>Resolution</th><th>Chain</th><th>Positions</th></thead>\n                    <tbody>\n                        ' + pdbEntries.map(function (d) {
                    return '\n                            <tr id="' + d.id + '" class="pdb-row">\n                                <td>\n                                <strong>' + d.id + '</strong><br/>\n                                <a target="_blank" href="//www.ebi.ac.uk/pdbe/entry/pdb/' + d.id + '">PDB</a> \n                                <a target="_blank" href="//www.rcsb.org/pdb/explore/explore.do?pdbId=' + d.id + '">RCSB-PDBi</a>\n                                <a target="_blank" href="//pdbj.org/mine/summary/' + d.id + '">PDBj</a>\n                                <a target="_blank" href="//www.ebi.ac.uk/thornton-srv/databases/cgi-bin/pdbsum/GetPage.pl?pdbcode=' + d.id + '">PDBSUM</a>\n                                </td>\n                                <td>' + d.properties.method + '</td>\n                                <td>' + d.properties.resolution + '</td>\n                                <td title="' + _this3.getChain(d.properties.chains) + '">' + _this3.getChain(d.properties.chains) + '</td>\n                                <td>' + _this3.getPositions(d.properties.chains) + '</td>\n                            </tr>\n                        ';
                }).join('') + '\n                    </tbody>\n                </table>\n            ';
                this.tableDiv.innerHTML = html;
                this.querySelectorAll('.pdb-row').forEach(function (row) {
                    return row.addEventListener('click', function (e) {
                        return _this3.selectMolecule(row.id);
                    });
                });
            }
        }, {
            key: 'getChain',
            value: function getChain(chains) {
                return chains.split('=')[0];
            }
        }, {
            key: 'getPositions',
            value: function getPositions(chains) {
                return chains.split('=')[1];
            }
        }, {
            key: 'selectMolecule',
            value: function selectMolecule(id) {
                this.querySelectorAll('.active').forEach(function (row) {
                    return row.classList.remove('active');
                });
                document.getElementById(id).classList.add('active');
                this.loadMolecule(id);
            }
        }, {
            key: 'loadLiteMol',
            value: function loadLiteMol() {
                var Plugin = LiteMol.Plugin;
                this._liteMol = Plugin.create({
                    target: '#app',
                    viewportBackground: '#fff',
                    layoutState: {
                        hideControls: true
                    },
                    allowAnalytics: false
                });
            }
        }, {
            key: 'loadMolecule',
            value: function loadMolecule(_id) {
                this._liteMol.clear();
                // TODO: we beed to swap to use the coordinates service
                // https://wwwdev.ebi.ac.uk/pdbe/coordinates/demo.html passing chain information
                // we can retrieve only what is needed also get as bcif format will be faster
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
        return UuwLitemolComponent;
    }(HTMLElement);

    customElements.define('uuw-litemol-component', UuwLitemolComponent);
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
//# sourceMappingURL=uuw-litemol-component.js.map

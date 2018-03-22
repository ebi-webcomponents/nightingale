(function () {
'use strict';

function styleInject(css, ref) {
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

var css = ":root {\n    --blue: 0,112,155;\n    --width: 100%;\n}\nuuw-litemol-component {\n    display:flex;\n}\n.litemol-container, .table-container {\n    width: var(--width);\n    height: 480px;\n    position: relative;\n}\n.table-container table {\n    display:flex;\n    flex-flow:column;\n    width:100%;\n    height: 480px;\n    border-collapse: collapse;\n}\n.table-container thead {\n    min-height: 3em;\n    flex: 0 0 auto;\n    width: 100%;\n}\n\n.table-container tbody {\n    flex: 1 1 auto;\n    display:block;\n    overflow-y: scroll;\n    border:none;\n}\n\n.table-container tbody tr {\n    width:100%;\n    cursor: pointer;\n}\n\n.table-container thead, .table-container tbody tr {\n    display: table;\n    table-layout: fixed;\n}\n\n.table-container tbody tr:hover {\n    background-color: rgba(var(--blue), 0.15);;\n}\n.table-container tr.active {\n    background-color: rgba(var(--blue), 0.3);;\n}";
styleInject(css);

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

var UuwLitemolComponent = function (_HTMLElement) {
    inherits(UuwLitemolComponent, _HTMLElement);

    function UuwLitemolComponent() {
        classCallCheck(this, UuwLitemolComponent);

        var _this = possibleConstructorReturn(this, (UuwLitemolComponent.__proto__ || Object.getPrototypeOf(UuwLitemolComponent)).call(this));

        _this._loaded = false;
        _this._mappings = [];
        _this._highlightstart = parseInt(_this.getAttribute('highlightstart'));
        _this._highlightend = parseInt(_this.getAttribute('highlightend'));
        _this.loadMolecule = _this.loadMolecule.bind(_this);
        _this.loadStructureTable = _this.loadStructureTable.bind(_this);
        return _this;
    }

    createClass(UuwLitemolComponent, [{
        key: 'connectedCallback',
        value: function connectedCallback() {
            var _this2 = this;

            this.titleContainer = document.createElement('h4');
            this.titleContainer.id = 'litemol-title';
            this.tableDiv = document.createElement('div');
            this.tableDiv.className = 'table-container';
            var litemolDiv = document.createElement('div');
            litemolDiv.className = 'litemol-container';
            litemolDiv.id = 'app';
            this.appendChild(this.titleContainer);
            this.appendChild(litemolDiv);
            this.appendChild(this.tableDiv);
            this.loadLiteMol();
            this.loadUniProtEntry().then(function (entry) {
                _this2._pdbEntries = entry.dbReferences.filter(function (dbref) {
                    return dbref.type === 'PDB';
                }).map(function (d) {
                    return {
                        id: d.id,
                        properties: {
                            method: d.properties.method,
                            chains: _this2.getChain(d.properties.chains),
                            start: _this2.getStart(d.properties.chains),
                            end: _this2.getEnd(d.properties.chains)
                        }
                    };
                });
                if (_this2._pdbEntries.length <= 0) {
                    _this2.style.display = 'none';
                    return;
                }
                _this2.loadStructureTable();
                _this2.selectMolecule(_this2._pdbEntries[0].id);
            });
        }
    }, {
        key: 'attributeChangedCallback',
        value: function attributeChangedCallback(attrName, oldVal, newVal) {
            if (oldVal !== newVal) {
                var value = parseInt(newVal);
                this['_' + attrName] = isNaN(value) ? newVal : value;
                this._selectMoleculeWithinRange(this._highlightstart, this._highlightend);
                this.highlightChain();
            }
        }
    }, {
        key: 'loadUniProtEntry',
        value: function () {
            var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                _context.next = 3;
                                return fetch('https://www.ebi.ac.uk/proteins/api/proteins/' + this.accession);

                            case 3:
                                _context.next = 5;
                                return _context.sent.json();

                            case 5:
                                return _context.abrupt('return', _context.sent);

                            case 8:
                                _context.prev = 8;
                                _context.t0 = _context['catch'](0);
                                throw new Error('Couldn\'t load UniProt entry', _context.t0);

                            case 11:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 8]]);
            }));

            function loadUniProtEntry() {
                return _ref.apply(this, arguments);
            }

            return loadUniProtEntry;
        }()
    }, {
        key: 'loadPDBEntry',
        value: function () {
            var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(pdbId) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.prev = 0;
                                _context2.next = 3;
                                return fetch('https://www.ebi.ac.uk/pdbe/api/mappings/uniprot/' + pdbId);

                            case 3:
                                _context2.next = 5;
                                return _context2.sent.json();

                            case 5:
                                return _context2.abrupt('return', _context2.sent);

                            case 8:
                                _context2.prev = 8;
                                _context2.t0 = _context2['catch'](0);
                                throw new Error('Couldn\'t load PDB entry', _context2.t0);

                            case 11:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[0, 8]]);
            }));

            function loadPDBEntry(_x) {
                return _ref2.apply(this, arguments);
            }

            return loadPDBEntry;
        }()
    }, {
        key: 'loadStructureTable',
        value: function loadStructureTable() {
            var _this3 = this;

            var html = '\n            <table>\n                <thead>\n                    <th>PDB Entry</th>\n                    <th>Method</th>\n                    <th>Resolution</th>\n                    <th>Chain</th>\n                    <th>Positions</th>\n                    <th>Links</th>\n                </thead>\n                <tbody>\n                    ' + this._pdbEntries.map(function (d) {
                return '\n                        <tr id="entry_' + d.id + '" class="pdb-row">\n                            <td>\n                            <strong>' + d.id + '</strong><br/>\n                            </td>\n                            <td>' + d.properties.method + '</td>\n                            <td>' + _this3.formatAngstrom(d.properties.resolution) + '</td>\n                            <td title="' + d.properties.chains + '">' + d.properties.chains + '</td>\n                            <td>' + d.properties.start + '-' + d.properties.end + '</td>\n                            <td>\n                                <a target="_blank" href="//www.ebi.ac.uk/pdbe/entry/pdb/' + d.id + '">PDB</a><br> \n                                <a target="_blank" href="//www.rcsb.org/pdb/explore/explore.do?pdbId=' + d.id + '">RCSB-PDBi</a><br>\n                                <a target="_blank" href="//pdbj.org/mine/summary/' + d.id + '">PDBj</a><br>\n                                <a target="_blank" href="//www.ebi.ac.uk/thornton-srv/databases/cgi-bin/pdbsum/GetPage.pl?pdbcode=' + d.id + '">PDBSUM</a>\n                            </td>\n                        </tr>\n                    ';
            }).join('') + '\n                </tbody>\n            </table>\n        ';
            this.tableDiv.innerHTML = html;
            this.querySelectorAll('.pdb-row').forEach(function (row) {
                return row.addEventListener('click', function (e) {
                    return _this3.selectMolecule(row.id.replace('entry_', ''));
                });
            });
        }
    }, {
        key: 'getChain',
        value: function getChain(chains) {
            return chains.split('=')[0];
        }
    }, {
        key: 'getStart',
        value: function getStart(chains) {
            return chains.split('=')[1].split('-')[0];
        }
    }, {
        key: 'getEnd',
        value: function getEnd(chains) {
            return chains.split('=')[1].split('-')[1];
        }
    }, {
        key: 'selectMolecule',
        value: function () {
            var _ref3 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(id) {
                var _this4 = this;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                this.loadPDBEntry(id).then(function (d) {
                                    var mappings = _this4.processMapping(d);
                                    _this4._selectedMolecule = {
                                        'id': id,
                                        'mappings': mappings
                                    };
                                    _this4.querySelectorAll('.active').forEach(function (row) {
                                        return row.classList.remove('active');
                                    });
                                    _this4.querySelector('#entry_' + id).classList.add('active');
                                    _this4.querySelector('#litemol-title').textContent = id;
                                    _this4.loadMolecule(id);
                                });

                            case 1:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function selectMolecule(_x2) {
                return _ref3.apply(this, arguments);
            }

            return selectMolecule;
        }()
    }, {
        key: 'loadLiteMol',
        value: function loadLiteMol() {
            var Plugin = LiteMol.Plugin;
            this.Command = LiteMol.Bootstrap.Command;
            this.Query = LiteMol.Core.Structure.Query;
            this.Bootstrap = LiteMol.Bootstrap;
            this.Core = LiteMol.Core;
            this.Tree = this.Bootstrap.Tree;
            this.CoreVis = LiteMol.Visualization;
            this.Transformer = this.Bootstrap.Entity.Transformer;
            this.Visualization = this.Bootstrap.Visualization;
            this.Event = this.Bootstrap.Event;
            // Plugin.Components.Context.Log(this.Bootstrap.Components.LayoutRegion.Bottom, true);
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
            var _this5 = this;

            this._loaded = false;

            this._liteMol.clear();

            var transform = this._liteMol.createTransform();

            transform.add(this._liteMol.root, this.Transformer.Data.Download, {
                url: 'https://www.ebi.ac.uk/pdbe/coordinates/' + _id.toLowerCase() + '/full?encoding=BCIF',
                type: 'Binary',
                _id: _id
            }).then(this.Transformer.Data.ParseBinaryCif, {
                id: _id
            }, {
                isBinding: true,
                ref: 'cifDict'
            }).then(this.Transformer.Molecule.CreateFromMmCif, {
                blockIndex: 0
            }, {
                isBinding: true
            }).then(this.Transformer.Molecule.CreateModel, {
                modelIndex: 0
            }, {
                isBinding: false,
                ref: 'model'
            }).then(this.Transformer.Molecule.CreateMacromoleculeVisual, {
                polymer: true,
                polymerRef: 'polymer-visual',
                het: true,
                water: true
            });

            this._liteMol.applyTransform(transform).then(function () {
                _this5._loaded = true;
                _this5.highlightChain();
            });
        }
    }, {
        key: 'getTheme',
        value: function getTheme() {
            var colors = new Map();
            colors.set('Uniform', this.CoreVis.Color.fromRgb(207, 178, 178));
            colors.set('Selection', this.CoreVis.Color.fromRgb(255, 255, 0));
            colors.set('Highlight', this.CoreVis.Theme.Default.HighlightColor);
            return this.Visualization.Molecule.uniformThemeProvider(void 0, {
                colors: colors
            });
        }
    }, {
        key: 'processMapping',
        value: function processMapping(mappingData) {
            if (!Object.values(mappingData)[0].UniProt[this.accession]) return;
            return Object.values(mappingData)[0].UniProt[this.accession].mappings;
        }
    }, {
        key: 'translatePositions',
        value: function translatePositions(start, end) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this._selectedMolecule.mappings[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var mapping = _step.value;

                    if (mapping.unp_end - mapping.unp_start === mapping.end.residue_number - mapping.start.residue_number) {
                        if (start >= mapping.unp_start && end <= mapping.unp_end) {
                            var offset = mapping.unp_start - mapping.start.residue_number;
                            //TODO this is wrong because there are gaps in the PDB sequence
                            return {
                                entity: mapping.entity_id,
                                chain: mapping.chain_id,
                                start: start - offset,
                                end: end - offset
                            };
                        } else {
                            console.log('Positions not found in this structure');
                            return;
                        }
                    } else {
                        console.log('Non-exact mapping');
                        return;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: 'highlightChain',
        value: function highlightChain() {
            var _this6 = this;

            if (!this._loaded || !this._highlightstart || !this._highlightend) return;

            this.Command.Visual.ResetTheme.dispatch(this._liteMol.context, void 0);
            this.Command.Tree.RemoveNode.dispatch(this._liteMol.context, 'sequence-selection');

            var visual = this._liteMol.context.select('polymer-visual')[0];
            if (!visual) return;

            var translatedPos = this.translatePositions(this._highlightstart, this._highlightend);
            if (!translatedPos) return;

            var query = this.Query.sequence(translatedPos.entity.toString(), translatedPos.chain, {
                seqNumber: translatedPos.start
            }, {
                seqNumber: translatedPos.end
            });

            var theme = this.getTheme();

            var action = this._liteMol.createTransform().add(visual, this.Transformer.Molecule.CreateSelectionFromQuery, {
                query: query,
                name: 'My name'
            }, {
                ref: 'sequence-selection'
            });

            this._liteMol.applyTransform(action).then(function () {
                _this6.Command.Visual.UpdateBasicTheme.dispatch(_this6._liteMol.context, {
                    visual: visual,
                    theme: theme
                });
                _this6.Command.Entity.Focus.dispatch(_this6._liteMol.context, _this6._liteMol.context.select('sequence-selection'));
            });
        }
    }, {
        key: '_selectMoleculeWithinRange',
        value: function _selectMoleculeWithinRange(start, end) {
            if (!this._selectedMolecule) return;
            if (this._selectedMolecule.mappings.filter(function (d) {
                return d.unp_start <= start && d.unp_end >= end;
            }).length > 0) {
                return;
            }
            var matches = this._pdbEntries.filter(function (d) {
                return d.properties.start <= start && d.properties.end >= end;
            });
            if (matches && matches.length > 0) {
                this.selectMolecule(matches[0].id);
            }
        }
    }, {
        key: 'formatAngstrom',
        value: function formatAngstrom(val) {
            if (!val) return;
            return val.replace('A', '&#8491;');
        }
    }, {
        key: 'accession',
        get: function get$$1() {
            return this.getAttribute('accession');
        },
        set: function set$$1(accession) {
            return this.setAttribute('accession', accession);
        }
    }, {
        key: 'isManaged',
        get: function get$$1() {
            return true;
        }
    }], [{
        key: 'observedAttributes',
        get: function get$$1() {
            return ['highlightstart', 'highlightend'];
        }
    }]);
    return UuwLitemolComponent;
}(HTMLElement);

var loadComponent = function loadComponent() {
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

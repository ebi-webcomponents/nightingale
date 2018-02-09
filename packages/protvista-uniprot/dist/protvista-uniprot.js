(function () {
'use strict';

function __$$styleInject(css, ref) {
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

var categories = [{
    "name": "DOMAINS_AND_SITES",
    "label": "Domains & sites",
    "component": "protvista-track",
    "tracks": [{
        "name": "domain",
        "label": "Domain",
        "tooltip": "Specific combination of secondary structures organized into a characteristic three-dimensional structure or fold"
    }, {
        "name": "region",
        "label": "Region",
        "tooltip": "Regions in multifunctional enzymes or fusion proteins, or characteristics of a region, e.g., protein-protein interactions mediation"
    }, {
        "name": "motif",
        "label": "Motif",
        "tooltip": "Short conserved sequence motif of biological significance"
    }, {
        "name": "metal",
        "label": "Metal binding",
        "tooltip": "Binding site for a metal ion"
    }, {
        "name": "site",
        "label": "Site",
        "tooltip": "Any interesting single amino acid site on the sequence"
    }]
}, {
    "name": "MOLECULE_PROCESSING",
    "label": "Molecule processing",
    "component": "protvista-track",
    "tracks": [{
        "name": "signal",
        "label": "Signal peptide",
        "tooltip": "N-terminal signal peptide"
    }, {
        "name": "chain",
        "label": "Chain",
        "tooltip": "(aka mature region). This describes the extent of a polypeptide chain in the mature protein following processing"
    }, {
        "name": "peptide",
        "label": "Peptide",
        "tooltip": "The position and length of an active peptide in the mature protein"
    }]
}, {
    "name": "PTM",
    "label": "PTM",
    "component": "protvista-track",
    "tracks": [{
        "name": "mod_res",
        "label": "Modified residue",
        "tooltip": "Modified residues such as phosphorylation, acetylation, acylation, methylation"
    }, {
        "name": "carbohyd",
        "label": "Glycosylation",
        "tooltip": "Covalently attached glycan group(s)"
    }, {
        "name": "disulfid",
        "label": "Disulfide bond",
        "tooltip": "The positions of cysteine residues participating in disulphide bonds"
    }, {
        "name": "crosslnk",
        "label": "Cross-link",
        "tooltip": "Covalent linkages of various types formed between two proteins or between two parts of the same protein"
    }]
}, {
    "name": "SEQUENCE_INFORMATION",
    "label": "Sequence information",
    "component": "protvista-track",
    "tracks": [{
        "name": "compbias",
        "label": "Compositional bias",
        "tooltip": "Position of regions of compositional bias within the protein and the particular amino acids that are over-represented within those regions"
    }, {
        "name": "conflict",
        "label": "Sequence conflict",
        "tooltip": "Sequence discrepancies of unknown origin"
    }]
}, {
    "name": "STRUCTURAL",
    "label": "Structural features",
    "component": "protvista-track",
    "tracks": [{
        "name": "helix",
        "label": "Helix",
        "tooltip": "The positions of experimentally determined helical regions"
    }, {
        "name": "strand",
        "label": "Beta strand",
        "tooltip": "The positions of experimentally determined beta strands"
    }, {
        "name": "turn",
        "label": "Turn",
        "tooltip": "The positions of experimentally determined hydrogen-bonded turns"
    }, {
        "name": "coiled",
        "label": "Coiled coil",
        "tooltip": "Coiled coils are built by two or more alpha-helices that wind around each other to form a supercoil"
    }]
}, {
    "name": "TOPOLOGY",
    "label": "Topology",
    "component": "protvista-track",
    "tracks": [{
        "name": "topo_dom",
        "label": "Topological domain",
        "tooltip": "Location of non-membrane regions of membrane-spanning proteins"
    }, {
        "name": "transmem",
        "label": "Transmembrane",
        "tooltip": "Extent of a membrane-spanning region"
    }, {
        "name": "intramem",
        "label": "Intramembrane",
        "tooltip": "Extent of a region located in a membrane without crossing it"
    }]
}, {
    "name": "MUTAGENESIS",
    "label": "Mutagenesis",
    "component": "protvista-track",
    "tracks": [{
        "name": "mutagen",
        "label": "Mutagenesis",
        "tooltip": "Site which has been experimentally altered by mutagenesis"
    }]
}, {
    "name": "PROTEOMICS",
    "label": "Proteomics",
    "component": "protvista-track",
    "tracks": [{
        "name": "unique",
        "label": "Unique peptide",
        "tooltip": ""
    }, {
        "name": "non_unique",
        "label": "Non-unique peptide",
        "tooltip": ""
    }]
}, {
    "name": "ANTIGEN",
    "label": "Antigenic sequences",
    "component": "protvista-track",
    "tracks": [{
        "name": "antigen",
        "label": "Antibody binding sequences",
        "tooltip": ""
    }]
}, {
    "name": "VARIATION",
    "label": "Variants",
    "component": "protvista-variant",
    "tracks": []
}];
// "trackNames": {
//     "transit": {
//         "label": "Transit peptide",
//         "tooltip": "This describes the extent of a transit peptide"
//     },
//     "init_met": {
//         "label": "Initiator methionine",
//         "tooltip": "This indicates that the initiator methionine is cleaved from the mature protein"
//     },
//     "propep": {
//         "label": "Propeptide",
//         "tooltip": "Part of a protein that is cleaved during maturation or activation"
//     },
//     "repeat": {
//         "label": "Repeat",
//         "tooltip": "Repeated sequence motifs or repeated domains within the protein"
//     },
//     "ca_bind": {
//         "label": "Calcium binding",
//         "tooltip": "Calcium-binding regions, such as the EF-hand motif"
//     },
//     "dna_bind": {
//         "label": "DNA binding",
//         "tooltip": "DNA-binding domains such as AP2/ERF domain, the ETS domain, the Fork-Head domain, the HMG box and the Myb domain"
//     },
//     "zn_fing": {
//         "label": "Zinc finger",
//         "tooltip": "Small, functional, independently folded domain that coordinates one or more zinc ions"
//     },
//     "np_bind": {
//         "label": "Nucleotide binding",
//         "tooltip": "(aka flavin-binding). Region in the protein which binds nucleotide phosphates"
//     },
//     "binding": {
//         "label": "Binding site",
//         "tooltip": "Binding site for any chemical group (co-enzyme, prosthetic group, etc.)"
//     },
//     "act_site": {
//         "label": "Active site",
//         "tooltip": "Amino acid(s) directly involved in the activity of an enzyme"
//     },
//     "lipid": {
//         "label": "Lipidation",
//         "tooltip": "Covalently attached lipid group(s)"
//     },
//     "non_cons": {
//         "label": "Non-adjacent residues",
//         "tooltip": "Indicates that two residues in a sequence are not consecutive and that there is an undetermined number of unsequenced residues between them"
//     },
//     "non_ter": {
//         "label": "Non-terminal residue",
//         "tooltip": "The sequence is incomplete. The residue is not the terminal residue of the complete protein"
//     },
//     "unsure": {
//         "label": "Sequence uncertainty",
//         "tooltip": "Regions of a sequence for which the authors are unsure about the sequence assignment"
//     },
//     "non_std": {
//         "label": "Non-standard residue",
//         "tooltip": "Non-standard amino acids (selenocysteine and pyrrolysine)"
//     },
//     "variant": {
//         "label": "Natural variant",
//         "tooltip": "Natural variant of the protein, including polymorphisms, variations between strains, isolates or cultivars, disease-associated mutations and RNA editing events"
//     },

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
    var ProtvistaUniprot = function (_HTMLElement) {
        inherits(ProtvistaUniprot, _HTMLElement);

        function ProtvistaUniprot() {
            classCallCheck(this, ProtvistaUniprot);

            var _this = possibleConstructorReturn(this, (ProtvistaUniprot.__proto__ || Object.getPrototypeOf(ProtvistaUniprot)).call(this));

            _this._accession = _this.getAttribute('accession');
            // get properties here
            return _this;
        }

        createClass(ProtvistaUniprot, [{
            key: 'connectedCallback',
            value: function connectedCallback() {
                var _this2 = this;

                this.loadEntry(this._accession).then(function (entryData) {
                    _this2._sequenceLength = entryData.sequence.sequence.length;
                    // We need to get the length of the protein before rendering it
                    _this2.render();
                });
            }
        }, {
            key: 'loadEntry',
            value: function () {
                var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(accession) {
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    _context.prev = 0;
                                    _context.next = 3;
                                    return fetch('https://www.ebi.ac.uk/proteins/api/proteins/' + accession);

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

                function loadEntry(_x) {
                    return _ref.apply(this, arguments);
                }

                return loadEntry;
            }()
        }, {
            key: 'render',
            value: function render() {
                var _this3 = this;

                var html = '\n            <protvista-manager attributes="length displaystart displayend highlightstart highlightend variantfilters">\n                <protvista-navigation length="' + this._sequenceLength + '"></protvista-navigation>\n                <protvista-sequence length="' + this._sequenceLength + '"></protvista-sequence>\n                ' + categories.map(function (category) {
                    return '\n                        <div class="">' + category.label + '</div>\n                        ' + category.tracks.map(function (track) {
                        return '<div class="">' + track.label + '</div><div>' + _this3.getTrack() + '</div>';
                    }).join('') + '\n                    ';
                }).join('') + '\n                <protvista-sequence id="seq1" length="' + this._sequenceLength + '"></protvista-sequence>\n            </protvista-manager>\n            ';
                this.innerHTML = html;
            }
        }, {
            key: 'getTrack',
            value: function getTrack() {
                return '      \n            <protvista-track id="track1" length="' + this._sequenceLength + '">\n                <protvista-feature-adapter>\n                <uniprot-entry-data-loader accession="' + this._accession + '">\n                    <source src="https://www.ebi.ac.uk/proteins/api/features/{0}?categories=PTM" />\n                </uniprot-entry-data-loader>\n                </protvista-feature-adapter>\n                <data-loader data-key="config">\n                    <source src="https://cdn.jsdelivr.net/npm/protvista-track/dist/config.json">\n                </data-loader>\n            </protvista-track>\n            ';
            }
        }]);
        return ProtvistaUniprot;
    }(HTMLElement);

    customElements.define('protvista-uniprot', ProtvistaUniprot);
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
//# sourceMappingURL=protvista-uniprot.js.map

var ProtvistaManager = (function(t) {
  var e = {};
  function n(r) {
    if (e[r]) return e[r].exports;
    var o = (e[r] = { i: r, l: !1, exports: {} });
    return t[r].call(o.exports, o, o.exports, n), (o.l = !0), o.exports;
  }
  return (
    (n.m = t),
    (n.c = e),
    (n.d = function(t, e, r) {
      n.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: r });
    }),
    (n.r = function(t) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(t, "__esModule", { value: !0 });
    }),
    (n.t = function(t, e) {
      if ((1 & e && (t = n(t)), 8 & e)) return t;
      if (4 & e && "object" == typeof t && t && t.__esModule) return t;
      var r = Object.create(null);
      if (
        (n.r(r),
        Object.defineProperty(r, "default", { enumerable: !0, value: t }),
        2 & e && "string" != typeof t)
      )
        for (var o in t)
          n.d(
            r,
            o,
            function(e) {
              return t[e];
            }.bind(null, o)
          );
      return r;
    }),
    (n.n = function(t) {
      var e =
        t && t.__esModule
          ? function() {
              return t.default;
            }
          : function() {
              return t;
            };
      return n.d(e, "a", e), e;
    }),
    (n.o = function(t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    }),
    (n.p = ""),
    n((n.s = 7))
  );
})([
  function(t, e) {
    function n(e, r) {
      return (
        (t.exports = n =
          Object.setPrototypeOf ||
          function(t, e) {
            return (t.__proto__ = e), t;
          }),
        n(e, r)
      );
    }
    t.exports = n;
  },
  function(t, e) {
    function n(e) {
      return (
        (t.exports = n = Object.setPrototypeOf
          ? Object.getPrototypeOf
          : function(t) {
              return t.__proto__ || Object.getPrototypeOf(t);
            }),
        n(e)
      );
    }
    t.exports = n;
  },
  function(t, e) {
    t.exports = function(t, e) {
      if (!(t instanceof e))
        throw new TypeError("Cannot call a class as a function");
    };
  },
  function(t, e) {
    function n(t, e) {
      for (var n = 0; n < e.length; n++) {
        var r = e[n];
        (r.enumerable = r.enumerable || !1),
          (r.configurable = !0),
          "value" in r && (r.writable = !0),
          Object.defineProperty(t, r.key, r);
      }
    }
    t.exports = function(t, e, r) {
      return e && n(t.prototype, e), r && n(t, r), t;
    };
  },
  function(t, e, n) {
    var r = n(8),
      o = n(9);
    t.exports = function(t, e) {
      return !e || ("object" !== r(e) && "function" != typeof e) ? o(t) : e;
    };
  },
  function(t, e, n) {
    var r = n(0);
    t.exports = function(t, e) {
      if ("function" != typeof e && null !== e)
        throw new TypeError(
          "Super expression must either be null or a function"
        );
      (t.prototype = Object.create(e && e.prototype, {
        constructor: { value: t, writable: !0, configurable: !0 }
      })),
        e && r(t, e);
    };
  },
  function(t, e, n) {
    var r = n(1),
      o = n(0),
      i = n(10),
      u = n(11);
    function a(e) {
      var n = "function" == typeof Map ? new Map() : void 0;
      return (
        (t.exports = a = function(t) {
          if (null === t || !i(t)) return t;
          if ("function" != typeof t)
            throw new TypeError(
              "Super expression must either be null or a function"
            );
          if (void 0 !== n) {
            if (n.has(t)) return n.get(t);
            n.set(t, e);
          }
          function e() {
            return u(t, arguments, r(this).constructor);
          }
          return (
            (e.prototype = Object.create(t.prototype, {
              constructor: {
                value: e,
                enumerable: !1,
                writable: !0,
                configurable: !0
              }
            })),
            o(e, t)
          );
        }),
        a(e)
      );
    }
    t.exports = a;
  },
  function(t, e, n) {
    t.exports = n(12);
  },
  function(t, e) {
    function n(t) {
      return (n =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function(t) {
              return typeof t;
            }
          : function(t) {
              return t &&
                "function" == typeof Symbol &&
                t.constructor === Symbol &&
                t !== Symbol.prototype
                ? "symbol"
                : typeof t;
            })(t);
    }
    function r(e) {
      return (
        "function" == typeof Symbol && "symbol" === n(Symbol.iterator)
          ? (t.exports = r = function(t) {
              return n(t);
            })
          : (t.exports = r = function(t) {
              return t &&
                "function" == typeof Symbol &&
                t.constructor === Symbol &&
                t !== Symbol.prototype
                ? "symbol"
                : n(t);
            }),
        r(e)
      );
    }
    t.exports = r;
  },
  function(t, e) {
    t.exports = function(t) {
      if (void 0 === t)
        throw new ReferenceError(
          "this hasn't been initialised - super() hasn't been called"
        );
      return t;
    };
  },
  function(t, e) {
    t.exports = function(t) {
      return -1 !== Function.toString.call(t).indexOf("[native code]");
    };
  },
  function(t, e, n) {
    var r = n(0);
    function o(e, n, i) {
      return (
        !(function() {
          if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
          if (Reflect.construct.sham) return !1;
          if ("function" == typeof Proxy) return !0;
          try {
            return (
              Date.prototype.toString.call(
                Reflect.construct(Date, [], function() {})
              ),
              !0
            );
          } catch (t) {
            return !1;
          }
        })()
          ? (t.exports = o = function(t, e, n) {
              var o = [null];
              o.push.apply(o, e);
              var i = new (Function.bind.apply(t, o))();
              return n && r(i, n.prototype), i;
            })
          : (t.exports = o = Reflect.construct),
        o.apply(null, arguments)
      );
    }
    t.exports = o;
  },
  function(t, e, n) {
    "use strict";
    n.r(e);
    var r = n(2),
      o = n.n(r),
      i = n(3),
      u = n.n(i),
      a = n(4),
      s = n.n(a),
      c = n(1),
      f = n.n(c),
      l = n(5),
      p = n.n(l),
      y = n(6),
      b = (function(t) {
        function e() {
          var t;
          return (
            o()(this, e),
            ((t = s()(this, f()(e).call(this))).protvistaElements = new Set()),
            t
          );
        }
        return (
          p()(e, t),
          u()(
            e,
            [
              {
                key: "attributeChangedCallback",
                value: function(t, e, n) {
                  if (e !== n && "attributes" === t) {
                    if (
                      ((this._attributes = n.split(" ")),
                      -1 !== this._attributes.indexOf("type"))
                    )
                      throw new Error(
                        "'type' can't be used as a protvista attribute"
                      );
                    if (-1 !== this._attributes.indexOf("value"))
                      throw new Error(
                        "'value' can't be used as a protvista attribute"
                      );
                  }
                }
              },
              {
                key: "_setAttributes",
                value: function(t, e, n) {
                  var r = !0,
                    o = !1,
                    i = void 0;
                  try {
                    for (
                      var u, a = t[Symbol.iterator]();
                      !(r = (u = a.next()).done);
                      r = !0
                    ) {
                      var s = u.value;
                      !1 === n
                        ? s.removeAttribute(e)
                        : s.setAttribute(e, "boolean" == typeof n ? "" : n);
                    }
                  } catch (t) {
                    (o = !0), (i = t);
                  } finally {
                    try {
                      r || null == a.return || a.return();
                    } finally {
                      if (o) throw i;
                    }
                  }
                }
              },
              {
                key: "_registerProtvistaDescendents",
                value: function(t) {
                  var e = !0,
                    n = !1,
                    r = void 0;
                  try {
                    for (
                      var o, i = t.children[Symbol.iterator]();
                      !(e = (o = i.next()).done);
                      e = !0
                    ) {
                      var u = o.value;
                      u.isManaged && this.protvistaElements.add(u),
                        this._registerProtvistaDescendents(u);
                    }
                  } catch (t) {
                    (n = !0), (r = t);
                  } finally {
                    try {
                      e || null == i.return || i.return();
                    } finally {
                      if (n) throw r;
                    }
                  }
                }
              },
              {
                key: "addListeners",
                value: function() {
                  var t = this,
                    e = !0,
                    n = !1,
                    r = void 0;
                  try {
                    for (
                      var o, i = this.protvistaElements[Symbol.iterator]();
                      !(e = (o = i.next()).done);
                      e = !0
                    ) {
                      o.value.addEventListener("change", function(e) {
                        for (var n in (-1 !==
                          t._attributes.indexOf(e.detail.type) &&
                          t._setAttributes(
                            t.protvistaElements,
                            e.detail.type,
                            e.detail.value
                          ),
                        e.detail))
                          -1 !== t._attributes.indexOf(n) &&
                            t._setAttributes(
                              t.protvistaElements,
                              n,
                              e.detail[n]
                            );
                      });
                    }
                  } catch (t) {
                    (n = !0), (r = t);
                  } finally {
                    try {
                      e || null == i.return || i.return();
                    } finally {
                      if (n) throw r;
                    }
                  }
                }
              },
              {
                key: "connectedCallback",
                value: function() {
                  this._registerProtvistaDescendents(this), this.addListeners();
                  var t = this;
                  "MutationObserver" in window &&
                    ((this.mutationObserver = new MutationObserver(function(e) {
                      t._registerProtvistaDescendents(t), t.addListeners();
                    })),
                    this.mutationObserver.observe(this, { childList: !0 }));
                }
              },
              {
                key: "disconnectedCallback",
                value: function() {
                  this.mutationObserver && this.mutationObserver.disconnect();
                }
              }
            ],
            [
              {
                key: "observedAttributes",
                get: function() {
                  return ["attributes"];
                }
              }
            ]
          ),
          e
        );
      })(n.n(y)()(HTMLElement)),
      v = function() {
        customElements.define("protvista-manager", b);
      };
    window.customElements
      ? v()
      : document.addEventListener("WebComponentsReady", function() {
          v();
        });
    e.default = b;
  }
]);
//# sourceMappingURL=protvista-manager.js.map

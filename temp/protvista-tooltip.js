var ProtvistaTooltip = (function(t) {
  var e = {};
  function n(r) {
    if (e[r]) return e[r].exports;
    var i = (e[r] = { i: r, l: !1, exports: {} });
    return t[r].call(i.exports, i, i.exports, n), (i.l = !0), i.exports;
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
        for (var i in t)
          n.d(
            r,
            i,
            function(e) {
              return t[e];
            }.bind(null, i)
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
    n((n.s = 13))
  );
})([
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
  function(t, e, n) {
    var r = n(6),
      i = n(14);
    t.exports = function(t, e) {
      return !e || ("object" !== r(e) && "function" != typeof e) ? i(t) : e;
    };
  },
  function(t, e, n) {
    var r = n(9);
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
    n(2);
    var r = n(15);
    function i(e, n, o) {
      return (
        "undefined" != typeof Reflect && Reflect.get
          ? (t.exports = i = Reflect.get)
          : (t.exports = i = function(t, e, n) {
              var i = r(t, e);
              if (i) {
                var o = Object.getOwnPropertyDescriptor(i, e);
                return o.get ? o.get.call(n) : o.value;
              }
            }),
        i(e, n, o || e)
      );
    }
    t.exports = i;
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
  function(t, e, n) {
    var r = n(16),
      i = n(17),
      o = n(18);
    t.exports = function(t) {
      return r(t) || i(t) || o();
    };
  },
  function(t, e) {
    t.exports = function(t, e) {
      return (
        e || (e = t.slice(0)),
        Object.freeze(
          Object.defineProperties(t, { raw: { value: Object.freeze(e) } })
        )
      );
    };
  },
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
  function(t, e, n) {
    t.exports = n(19);
  },
  function(t, e) {
    function n(t, e, n, r, i, o, a) {
      try {
        var s = t[o](a),
          u = s.value;
      } catch (t) {
        return void n(t);
      }
      s.done ? e(u) : Promise.resolve(u).then(r, i);
    }
    t.exports = function(t) {
      return function() {
        var e = this,
          r = arguments;
        return new Promise(function(i, o) {
          var a = t.apply(e, r);
          function s(t) {
            n(a, i, o, s, u, "next", t);
          }
          function u(t) {
            n(a, i, o, s, u, "throw", t);
          }
          s(void 0);
        });
      };
    };
  },
  function(t, e, n) {
    var r = n(2),
      i = n(9),
      o = n(20),
      a = n(21);
    function s(e) {
      var n = "function" == typeof Map ? new Map() : void 0;
      return (
        (t.exports = s = function(t) {
          if (null === t || !o(t)) return t;
          if ("function" != typeof t)
            throw new TypeError(
              "Super expression must either be null or a function"
            );
          if (void 0 !== n) {
            if (n.has(t)) return n.get(t);
            n.set(t, e);
          }
          function e() {
            return a(t, arguments, r(this).constructor);
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
            i(e, t)
          );
        }),
        s(e)
      );
    }
    t.exports = s;
  },
  function(t, e, n) {
    t.exports = n(22);
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
  function(t, e, n) {
    var r = n(2);
    t.exports = function(t, e) {
      for (
        ;
        !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = r(t));

      );
      return t;
    };
  },
  function(t, e) {
    t.exports = function(t) {
      if (Array.isArray(t)) {
        for (var e = 0, n = new Array(t.length); e < t.length; e++) n[e] = t[e];
        return n;
      }
    };
  },
  function(t, e) {
    t.exports = function(t) {
      if (
        Symbol.iterator in Object(t) ||
        "[object Arguments]" === Object.prototype.toString.call(t)
      )
        return Array.from(t);
    };
  },
  function(t, e) {
    t.exports = function() {
      throw new TypeError("Invalid attempt to spread non-iterable instance");
    };
  },
  function(t, e, n) {
    var r = (function(t) {
      "use strict";
      var e,
        n = Object.prototype,
        r = n.hasOwnProperty,
        i = "function" == typeof Symbol ? Symbol : {},
        o = i.iterator || "@@iterator",
        a = i.asyncIterator || "@@asyncIterator",
        s = i.toStringTag || "@@toStringTag";
      function u(t, e, n, r) {
        var i = e && e.prototype instanceof v ? e : v,
          o = Object.create(i.prototype),
          a = new E(r || []);
        return (
          (o._invoke = (function(t, e, n) {
            var r = c;
            return function(i, o) {
              if (r === p) throw new Error("Generator is already running");
              if (r === f) {
                if ("throw" === i) throw o;
                return O();
              }
              for (n.method = i, n.arg = o; ; ) {
                var a = n.delegate;
                if (a) {
                  var s = k(a, n);
                  if (s) {
                    if (s === d) continue;
                    return s;
                  }
                }
                if ("next" === n.method) n.sent = n._sent = n.arg;
                else if ("throw" === n.method) {
                  if (r === c) throw ((r = f), n.arg);
                  n.dispatchException(n.arg);
                } else "return" === n.method && n.abrupt("return", n.arg);
                r = p;
                var u = l(t, e, n);
                if ("normal" === u.type) {
                  if (((r = n.done ? f : h), u.arg === d)) continue;
                  return { value: u.arg, done: n.done };
                }
                "throw" === u.type &&
                  ((r = f), (n.method = "throw"), (n.arg = u.arg));
              }
            };
          })(t, n, a)),
          o
        );
      }
      function l(t, e, n) {
        try {
          return { type: "normal", arg: t.call(e, n) };
        } catch (t) {
          return { type: "throw", arg: t };
        }
      }
      t.wrap = u;
      var c = "suspendedStart",
        h = "suspendedYield",
        p = "executing",
        f = "completed",
        d = {};
      function v() {}
      function y() {}
      function m() {}
      var g = {};
      g[o] = function() {
        return this;
      };
      var _ = Object.getPrototypeOf,
        b = _ && _(_(C([])));
      b && b !== n && r.call(b, o) && (g = b);
      var w = (m.prototype = v.prototype = Object.create(g));
      function S(t) {
        ["next", "throw", "return"].forEach(function(e) {
          t[e] = function(t) {
            return this._invoke(e, t);
          };
        });
      }
      function x(t) {
        var e;
        this._invoke = function(n, i) {
          function o() {
            return new Promise(function(e, o) {
              !(function e(n, i, o, a) {
                var s = l(t[n], t, i);
                if ("throw" !== s.type) {
                  var u = s.arg,
                    c = u.value;
                  return c && "object" == typeof c && r.call(c, "__await")
                    ? Promise.resolve(c.__await).then(
                        function(t) {
                          e("next", t, o, a);
                        },
                        function(t) {
                          e("throw", t, o, a);
                        }
                      )
                    : Promise.resolve(c).then(
                        function(t) {
                          (u.value = t), o(u);
                        },
                        function(t) {
                          return e("throw", t, o, a);
                        }
                      );
                }
                a(s.arg);
              })(n, i, e, o);
            });
          }
          return (e = e ? e.then(o, o) : o());
        };
      }
      function k(t, n) {
        var r = t.iterator[n.method];
        if (r === e) {
          if (((n.delegate = null), "throw" === n.method)) {
            if (
              t.iterator.return &&
              ((n.method = "return"),
              (n.arg = e),
              k(t, n),
              "throw" === n.method)
            )
              return d;
            (n.method = "throw"),
              (n.arg = new TypeError(
                "The iterator does not provide a 'throw' method"
              ));
          }
          return d;
        }
        var i = l(r, t.iterator, n.arg);
        if ("throw" === i.type)
          return (n.method = "throw"), (n.arg = i.arg), (n.delegate = null), d;
        var o = i.arg;
        return o
          ? o.done
            ? ((n[t.resultName] = o.value),
              (n.next = t.nextLoc),
              "return" !== n.method && ((n.method = "next"), (n.arg = e)),
              (n.delegate = null),
              d)
            : o
          : ((n.method = "throw"),
            (n.arg = new TypeError("iterator result is not an object")),
            (n.delegate = null),
            d);
      }
      function P(t) {
        var e = { tryLoc: t[0] };
        1 in t && (e.catchLoc = t[1]),
          2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
          this.tryEntries.push(e);
      }
      function N(t) {
        var e = t.completion || {};
        (e.type = "normal"), delete e.arg, (t.completion = e);
      }
      function E(t) {
        (this.tryEntries = [{ tryLoc: "root" }]),
          t.forEach(P, this),
          this.reset(!0);
      }
      function C(t) {
        if (t) {
          var n = t[o];
          if (n) return n.call(t);
          if ("function" == typeof t.next) return t;
          if (!isNaN(t.length)) {
            var i = -1,
              a = function n() {
                for (; ++i < t.length; )
                  if (r.call(t, i)) return (n.value = t[i]), (n.done = !1), n;
                return (n.value = e), (n.done = !0), n;
              };
            return (a.next = a);
          }
        }
        return { next: O };
      }
      function O() {
        return { value: e, done: !0 };
      }
      return (
        (y.prototype = w.constructor = m),
        (m.constructor = y),
        (m[s] = y.displayName = "GeneratorFunction"),
        (t.isGeneratorFunction = function(t) {
          var e = "function" == typeof t && t.constructor;
          return (
            !!e &&
            (e === y || "GeneratorFunction" === (e.displayName || e.name))
          );
        }),
        (t.mark = function(t) {
          return (
            Object.setPrototypeOf
              ? Object.setPrototypeOf(t, m)
              : ((t.__proto__ = m), s in t || (t[s] = "GeneratorFunction")),
            (t.prototype = Object.create(w)),
            t
          );
        }),
        (t.awrap = function(t) {
          return { __await: t };
        }),
        S(x.prototype),
        (x.prototype[a] = function() {
          return this;
        }),
        (t.AsyncIterator = x),
        (t.async = function(e, n, r, i) {
          var o = new x(u(e, n, r, i));
          return t.isGeneratorFunction(n)
            ? o
            : o.next().then(function(t) {
                return t.done ? t.value : o.next();
              });
        }),
        S(w),
        (w[s] = "Generator"),
        (w[o] = function() {
          return this;
        }),
        (w.toString = function() {
          return "[object Generator]";
        }),
        (t.keys = function(t) {
          var e = [];
          for (var n in t) e.push(n);
          return (
            e.reverse(),
            function n() {
              for (; e.length; ) {
                var r = e.pop();
                if (r in t) return (n.value = r), (n.done = !1), n;
              }
              return (n.done = !0), n;
            }
          );
        }),
        (t.values = C),
        (E.prototype = {
          constructor: E,
          reset: function(t) {
            if (
              ((this.prev = 0),
              (this.next = 0),
              (this.sent = this._sent = e),
              (this.done = !1),
              (this.delegate = null),
              (this.method = "next"),
              (this.arg = e),
              this.tryEntries.forEach(N),
              !t)
            )
              for (var n in this)
                "t" === n.charAt(0) &&
                  r.call(this, n) &&
                  !isNaN(+n.slice(1)) &&
                  (this[n] = e);
          },
          stop: function() {
            this.done = !0;
            var t = this.tryEntries[0].completion;
            if ("throw" === t.type) throw t.arg;
            return this.rval;
          },
          dispatchException: function(t) {
            if (this.done) throw t;
            var n = this;
            function i(r, i) {
              return (
                (s.type = "throw"),
                (s.arg = t),
                (n.next = r),
                i && ((n.method = "next"), (n.arg = e)),
                !!i
              );
            }
            for (var o = this.tryEntries.length - 1; o >= 0; --o) {
              var a = this.tryEntries[o],
                s = a.completion;
              if ("root" === a.tryLoc) return i("end");
              if (a.tryLoc <= this.prev) {
                var u = r.call(a, "catchLoc"),
                  l = r.call(a, "finallyLoc");
                if (u && l) {
                  if (this.prev < a.catchLoc) return i(a.catchLoc, !0);
                  if (this.prev < a.finallyLoc) return i(a.finallyLoc);
                } else if (u) {
                  if (this.prev < a.catchLoc) return i(a.catchLoc, !0);
                } else {
                  if (!l)
                    throw new Error("try statement without catch or finally");
                  if (this.prev < a.finallyLoc) return i(a.finallyLoc);
                }
              }
            }
          },
          abrupt: function(t, e) {
            for (var n = this.tryEntries.length - 1; n >= 0; --n) {
              var i = this.tryEntries[n];
              if (
                i.tryLoc <= this.prev &&
                r.call(i, "finallyLoc") &&
                this.prev < i.finallyLoc
              ) {
                var o = i;
                break;
              }
            }
            o &&
              ("break" === t || "continue" === t) &&
              o.tryLoc <= e &&
              e <= o.finallyLoc &&
              (o = null);
            var a = o ? o.completion : {};
            return (
              (a.type = t),
              (a.arg = e),
              o
                ? ((this.method = "next"), (this.next = o.finallyLoc), d)
                : this.complete(a)
            );
          },
          complete: function(t, e) {
            if ("throw" === t.type) throw t.arg;
            return (
              "break" === t.type || "continue" === t.type
                ? (this.next = t.arg)
                : "return" === t.type
                ? ((this.rval = this.arg = t.arg),
                  (this.method = "return"),
                  (this.next = "end"))
                : "normal" === t.type && e && (this.next = e),
              d
            );
          },
          finish: function(t) {
            for (var e = this.tryEntries.length - 1; e >= 0; --e) {
              var n = this.tryEntries[e];
              if (n.finallyLoc === t)
                return this.complete(n.completion, n.afterLoc), N(n), d;
            }
          },
          catch: function(t) {
            for (var e = this.tryEntries.length - 1; e >= 0; --e) {
              var n = this.tryEntries[e];
              if (n.tryLoc === t) {
                var r = n.completion;
                if ("throw" === r.type) {
                  var i = r.arg;
                  N(n);
                }
                return i;
              }
            }
            throw new Error("illegal catch attempt");
          },
          delegateYield: function(t, n, r) {
            return (
              (this.delegate = { iterator: C(t), resultName: n, nextLoc: r }),
              "next" === this.method && (this.arg = e),
              d
            );
          }
        }),
        t
      );
    })(t.exports);
    try {
      regeneratorRuntime = r;
    } catch (t) {
      Function("r", "regeneratorRuntime = r")(r);
    }
  },
  function(t, e) {
    t.exports = function(t) {
      return -1 !== Function.toString.call(t).indexOf("[native code]");
    };
  },
  function(t, e, n) {
    var r = n(9);
    function i(e, n, o) {
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
          ? (t.exports = i = function(t, e, n) {
              var i = [null];
              i.push.apply(i, e);
              var o = new (Function.bind.apply(t, i))();
              return n && r(o, n.prototype), o;
            })
          : (t.exports = i = Reflect.construct),
        i.apply(null, arguments)
      );
    }
    t.exports = i;
  },
  function(t, e, n) {
    "use strict";
    n.r(e);
    var r = n(8),
      i = n.n(r),
      o = n(0),
      a = n.n(o),
      s = n(1),
      u = n.n(s),
      l = n(3),
      c = n.n(l),
      h = n(2),
      p = n.n(h),
      f = n(4),
      d = n.n(f),
      v = n(5),
      y = n.n(v),
      m = n(6),
      g = n.n(m),
      _ = new WeakMap(),
      b = function(t) {
        return "function" == typeof t && _.has(t);
      },
      w =
        void 0 !== window.customElements &&
        void 0 !== window.customElements.polyfillWrapFlushCallback,
      S = function(t, e) {
        for (
          var n =
            arguments.length > 2 && void 0 !== arguments[2]
              ? arguments[2]
              : null;
          e !== n;

        ) {
          var r = e.nextSibling;
          t.removeChild(e), (e = r);
        }
      },
      x = {},
      k = {},
      P = n(7),
      N = n.n(P),
      E = "{{lit-".concat(String(Math.random()).slice(2), "}}"),
      C = "\x3c!--".concat(E, "--\x3e"),
      O = new RegExp("".concat(E, "|").concat(C)),
      T = function t(e, n) {
        a()(this, t), (this.parts = []), (this.element = n);
        for (
          var r = [],
            i = [],
            o = document.createTreeWalker(n.content, 133, null, !1),
            s = 0,
            u = -1,
            l = 0,
            c = e.strings,
            h = e.values.length;
          l < h;

        ) {
          var p = o.nextNode();
          if (null !== p) {
            if ((u++, 1 === p.nodeType)) {
              if (p.hasAttributes()) {
                for (
                  var f = p.attributes, d = f.length, v = 0, y = 0;
                  y < d;
                  y++
                )
                  A(f[y].name, "$lit$") && v++;
                for (; v-- > 0; ) {
                  var m = c[l],
                    g = L.exec(m)[2],
                    _ = g.toLowerCase() + "$lit$",
                    b = p.getAttribute(_);
                  p.removeAttribute(_);
                  var w = b.split(O);
                  this.parts.push({
                    type: "attribute",
                    index: u,
                    name: g,
                    strings: w
                  }),
                    (l += w.length - 1);
                }
              }
              "TEMPLATE" === p.tagName &&
                (i.push(p), (o.currentNode = p.content));
            } else if (3 === p.nodeType) {
              var S = p.data;
              if (S.indexOf(E) >= 0) {
                for (
                  var x = p.parentNode, k = S.split(O), P = k.length - 1, N = 0;
                  N < P;
                  N++
                ) {
                  var C = void 0,
                    T = k[N];
                  if ("" === T) C = V();
                  else {
                    var j = L.exec(T);
                    null !== j &&
                      A(j[2], "$lit$") &&
                      (T =
                        T.slice(0, j.index) +
                        j[1] +
                        j[2].slice(0, -"$lit$".length) +
                        j[3]),
                      (C = document.createTextNode(T));
                  }
                  x.insertBefore(C, p),
                    this.parts.push({ type: "node", index: ++u });
                }
                "" === k[P]
                  ? (x.insertBefore(V(), p), r.push(p))
                  : (p.data = k[P]),
                  (l += P);
              }
            } else if (8 === p.nodeType)
              if (p.data === E) {
                var R = p.parentNode;
                (null !== p.previousSibling && u !== s) ||
                  (u++, R.insertBefore(V(), p)),
                  (s = u),
                  this.parts.push({ type: "node", index: u }),
                  null === p.nextSibling ? (p.data = "") : (r.push(p), u--),
                  l++;
              } else
                for (var M = -1; -1 !== (M = p.data.indexOf(E, M + 1)); )
                  this.parts.push({ type: "node", index: -1 }), l++;
          } else o.currentNode = i.pop();
        }
        for (var U = 0, F = r; U < F.length; U++) {
          var z = F[U];
          z.parentNode.removeChild(z);
        }
      },
      A = function(t, e) {
        var n = t.length - e.length;
        return n >= 0 && t.slice(n) === e;
      },
      j = function(t) {
        return -1 !== t.index;
      },
      V = function() {
        return document.createComment("");
      },
      L = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=\/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/,
      R = (function() {
        function t(e, n, r) {
          a()(this, t),
            (this.__parts = []),
            (this.template = e),
            (this.processor = n),
            (this.options = r);
        }
        return (
          u()(t, [
            {
              key: "update",
              value: function(t) {
                var e = 0,
                  n = !0,
                  r = !1,
                  i = void 0;
                try {
                  for (
                    var o, a = this.__parts[Symbol.iterator]();
                    !(n = (o = a.next()).done);
                    n = !0
                  ) {
                    var s = o.value;
                    void 0 !== s && s.setValue(t[e]), e++;
                  }
                } catch (t) {
                  (r = !0), (i = t);
                } finally {
                  try {
                    n || null == a.return || a.return();
                  } finally {
                    if (r) throw i;
                  }
                }
                var u = !0,
                  l = !1,
                  c = void 0;
                try {
                  for (
                    var h, p = this.__parts[Symbol.iterator]();
                    !(u = (h = p.next()).done);
                    u = !0
                  ) {
                    var f = h.value;
                    void 0 !== f && f.commit();
                  }
                } catch (t) {
                  (l = !0), (c = t);
                } finally {
                  try {
                    u || null == p.return || p.return();
                  } finally {
                    if (l) throw c;
                  }
                }
              }
            },
            {
              key: "_clone",
              value: function() {
                for (
                  var t,
                    e = w
                      ? this.template.element.content.cloneNode(!0)
                      : document.importNode(this.template.element.content, !0),
                    n = [],
                    r = this.template.parts,
                    i = document.createTreeWalker(e, 133, null, !1),
                    o = 0,
                    a = 0,
                    s = i.nextNode();
                  o < r.length;

                )
                  if (((t = r[o]), j(t))) {
                    for (; a < t.index; )
                      a++,
                        "TEMPLATE" === s.nodeName &&
                          (n.push(s), (i.currentNode = s.content)),
                        null === (s = i.nextNode()) &&
                          ((i.currentNode = n.pop()), (s = i.nextNode()));
                    if ("node" === t.type) {
                      var u = this.processor.handleTextExpression(this.options);
                      u.insertAfterNode(s.previousSibling),
                        this.__parts.push(u);
                    } else {
                      var l;
                      (l = this.__parts).push.apply(
                        l,
                        N()(
                          this.processor.handleAttributeExpressions(
                            s,
                            t.name,
                            t.strings,
                            this.options
                          )
                        )
                      );
                    }
                    o++;
                  } else this.__parts.push(void 0), o++;
                return (
                  w && (document.adoptNode(e), customElements.upgrade(e)), e
                );
              }
            }
          ]),
          t
        );
      })(),
      M = (function() {
        function t(e, n, r, i) {
          a()(this, t),
            (this.strings = e),
            (this.values = n),
            (this.type = r),
            (this.processor = i);
        }
        return (
          u()(t, [
            {
              key: "getHTML",
              value: function() {
                for (
                  var t = this.strings.length - 1, e = "", n = !1, r = 0;
                  r < t;
                  r++
                ) {
                  var i = this.strings[r],
                    o = i.lastIndexOf("\x3c!--");
                  n = (o > -1 || n) && -1 === i.indexOf("--\x3e", o + 1);
                  var a = L.exec(i);
                  e +=
                    null === a
                      ? i + (n ? E : C)
                      : i.substr(0, a.index) + a[1] + a[2] + "$lit$" + a[3] + E;
                }
                return (e += this.strings[t]);
              }
            },
            {
              key: "getTemplateElement",
              value: function() {
                var t = document.createElement("template");
                return (t.innerHTML = this.getHTML()), t;
              }
            }
          ]),
          t
        );
      })(),
      U = function(t) {
        return null === t || !("object" === g()(t) || "function" == typeof t);
      },
      F = function(t) {
        return Array.isArray(t) || !(!t || !t[Symbol.iterator]);
      },
      z = (function() {
        function t(e, n, r) {
          a()(this, t),
            (this.dirty = !0),
            (this.element = e),
            (this.name = n),
            (this.strings = r),
            (this.parts = []);
          for (var i = 0; i < r.length - 1; i++)
            this.parts[i] = this._createPart();
        }
        return (
          u()(t, [
            {
              key: "_createPart",
              value: function() {
                return new I(this);
              }
            },
            {
              key: "_getValue",
              value: function() {
                for (
                  var t = this.strings, e = t.length - 1, n = "", r = 0;
                  r < e;
                  r++
                ) {
                  n += t[r];
                  var i = this.parts[r];
                  if (void 0 !== i) {
                    var o = i.value;
                    if (U(o) || !F(o))
                      n += "string" == typeof o ? o : String(o);
                    else {
                      var a = !0,
                        s = !1,
                        u = void 0;
                      try {
                        for (
                          var l, c = o[Symbol.iterator]();
                          !(a = (l = c.next()).done);
                          a = !0
                        ) {
                          var h = l.value;
                          n += "string" == typeof h ? h : String(h);
                        }
                      } catch (t) {
                        (s = !0), (u = t);
                      } finally {
                        try {
                          a || null == c.return || c.return();
                        } finally {
                          if (s) throw u;
                        }
                      }
                    }
                  }
                }
                return (n += t[e]);
              }
            },
            {
              key: "commit",
              value: function() {
                this.dirty &&
                  ((this.dirty = !1),
                  this.element.setAttribute(this.name, this._getValue()));
              }
            }
          ]),
          t
        );
      })(),
      I = (function() {
        function t(e) {
          a()(this, t), (this.value = void 0), (this.committer = e);
        }
        return (
          u()(t, [
            {
              key: "setValue",
              value: function(t) {
                t === x ||
                  (U(t) && t === this.value) ||
                  ((this.value = t), b(t) || (this.committer.dirty = !0));
              }
            },
            {
              key: "commit",
              value: function() {
                for (; b(this.value); ) {
                  var t = this.value;
                  (this.value = x), t(this);
                }
                this.value !== x && this.committer.commit();
              }
            }
          ]),
          t
        );
      })(),
      q = (function() {
        function t(e) {
          a()(this, t),
            (this.value = void 0),
            (this.__pendingValue = void 0),
            (this.options = e);
        }
        return (
          u()(t, [
            {
              key: "appendInto",
              value: function(t) {
                (this.startNode = t.appendChild(V())),
                  (this.endNode = t.appendChild(V()));
              }
            },
            {
              key: "insertAfterNode",
              value: function(t) {
                (this.startNode = t), (this.endNode = t.nextSibling);
              }
            },
            {
              key: "appendIntoPart",
              value: function(t) {
                t.__insert((this.startNode = V())),
                  t.__insert((this.endNode = V()));
              }
            },
            {
              key: "insertAfterPart",
              value: function(t) {
                t.__insert((this.startNode = V())),
                  (this.endNode = t.endNode),
                  (t.endNode = this.startNode);
              }
            },
            {
              key: "setValue",
              value: function(t) {
                this.__pendingValue = t;
              }
            },
            {
              key: "commit",
              value: function() {
                for (; b(this.__pendingValue); ) {
                  var t = this.__pendingValue;
                  (this.__pendingValue = x), t(this);
                }
                var e = this.__pendingValue;
                e !== x &&
                  (U(e)
                    ? e !== this.value && this.__commitText(e)
                    : e instanceof M
                    ? this.__commitTemplateResult(e)
                    : e instanceof Node
                    ? this.__commitNode(e)
                    : F(e)
                    ? this.__commitIterable(e)
                    : e === k
                    ? ((this.value = k), this.clear())
                    : this.__commitText(e));
              }
            },
            {
              key: "__insert",
              value: function(t) {
                this.endNode.parentNode.insertBefore(t, this.endNode);
              }
            },
            {
              key: "__commitNode",
              value: function(t) {
                this.value !== t &&
                  (this.clear(), this.__insert(t), (this.value = t));
              }
            },
            {
              key: "__commitText",
              value: function(t) {
                var e = this.startNode.nextSibling;
                (t = null == t ? "" : t),
                  e === this.endNode.previousSibling && 3 === e.nodeType
                    ? (e.data = t)
                    : this.__commitNode(
                        document.createTextNode(
                          "string" == typeof t ? t : String(t)
                        )
                      ),
                  (this.value = t);
              }
            },
            {
              key: "__commitTemplateResult",
              value: function(t) {
                var e = this.options.templateFactory(t);
                if (this.value instanceof R && this.value.template === e)
                  this.value.update(t.values);
                else {
                  var n = new R(e, t.processor, this.options),
                    r = n._clone();
                  n.update(t.values), this.__commitNode(r), (this.value = n);
                }
              }
            },
            {
              key: "__commitIterable",
              value: function(e) {
                Array.isArray(this.value) || ((this.value = []), this.clear());
                var n,
                  r = this.value,
                  i = 0,
                  o = !0,
                  a = !1,
                  s = void 0;
                try {
                  for (
                    var u, l = e[Symbol.iterator]();
                    !(o = (u = l.next()).done);
                    o = !0
                  ) {
                    var c = u.value;
                    void 0 === (n = r[i]) &&
                      ((n = new t(this.options)),
                      r.push(n),
                      0 === i
                        ? n.appendIntoPart(this)
                        : n.insertAfterPart(r[i - 1])),
                      n.setValue(c),
                      n.commit(),
                      i++;
                  }
                } catch (t) {
                  (a = !0), (s = t);
                } finally {
                  try {
                    o || null == l.return || l.return();
                  } finally {
                    if (a) throw s;
                  }
                }
                i < r.length && ((r.length = i), this.clear(n && n.endNode));
              }
            },
            {
              key: "clear",
              value: function() {
                var t =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : this.startNode;
                S(this.startNode.parentNode, t.nextSibling, this.endNode);
              }
            }
          ]),
          t
        );
      })(),
      B = (function() {
        function t(e, n, r) {
          if (
            (a()(this, t),
            (this.value = void 0),
            (this.__pendingValue = void 0),
            2 !== r.length || "" !== r[0] || "" !== r[1])
          )
            throw new Error(
              "Boolean attributes can only contain a single expression"
            );
          (this.element = e), (this.name = n), (this.strings = r);
        }
        return (
          u()(t, [
            {
              key: "setValue",
              value: function(t) {
                this.__pendingValue = t;
              }
            },
            {
              key: "commit",
              value: function() {
                for (; b(this.__pendingValue); ) {
                  var t = this.__pendingValue;
                  (this.__pendingValue = x), t(this);
                }
                if (this.__pendingValue !== x) {
                  var e = !!this.__pendingValue;
                  this.value !== e &&
                    (e
                      ? this.element.setAttribute(this.name, "")
                      : this.element.removeAttribute(this.name),
                    (this.value = e)),
                    (this.__pendingValue = x);
                }
              }
            }
          ]),
          t
        );
      })(),
      H = (function(t) {
        function e(t, n, r) {
          var i;
          return (
            a()(this, e),
            ((i = c()(this, p()(e).call(this, t, n, r))).single =
              2 === r.length && "" === r[0] && "" === r[1]),
            i
          );
        }
        return (
          d()(e, t),
          u()(e, [
            {
              key: "_createPart",
              value: function() {
                return new W(this);
              }
            },
            {
              key: "_getValue",
              value: function() {
                return this.single
                  ? this.parts[0].value
                  : y()(p()(e.prototype), "_getValue", this).call(this);
              }
            },
            {
              key: "commit",
              value: function() {
                this.dirty &&
                  ((this.dirty = !1),
                  (this.element[this.name] = this._getValue()));
              }
            }
          ]),
          e
        );
      })(z),
      W = (function(t) {
        function e() {
          return a()(this, e), c()(this, p()(e).apply(this, arguments));
        }
        return d()(e, t), e;
      })(I),
      $ = !1;
    try {
      var G = {
        get capture() {
          return ($ = !0), !1;
        }
      };
      window.addEventListener("test", G, G),
        window.removeEventListener("test", G, G);
    } catch (t) {}
    var D = (function() {
        function t(e, n, r) {
          var i = this;
          a()(this, t),
            (this.value = void 0),
            (this.__pendingValue = void 0),
            (this.element = e),
            (this.eventName = n),
            (this.eventContext = r),
            (this.__boundHandleEvent = function(t) {
              return i.handleEvent(t);
            });
        }
        return (
          u()(t, [
            {
              key: "setValue",
              value: function(t) {
                this.__pendingValue = t;
              }
            },
            {
              key: "commit",
              value: function() {
                for (; b(this.__pendingValue); ) {
                  var t = this.__pendingValue;
                  (this.__pendingValue = x), t(this);
                }
                if (this.__pendingValue !== x) {
                  var e = this.__pendingValue,
                    n = this.value,
                    r =
                      null == e ||
                      (null != n &&
                        (e.capture !== n.capture ||
                          e.once !== n.once ||
                          e.passive !== n.passive)),
                    i = null != e && (null == n || r);
                  r &&
                    this.element.removeEventListener(
                      this.eventName,
                      this.__boundHandleEvent,
                      this.__options
                    ),
                    i &&
                      ((this.__options = J(e)),
                      this.element.addEventListener(
                        this.eventName,
                        this.__boundHandleEvent,
                        this.__options
                      )),
                    (this.value = e),
                    (this.__pendingValue = x);
                }
              }
            },
            {
              key: "handleEvent",
              value: function(t) {
                "function" == typeof this.value
                  ? this.value.call(this.eventContext || this.element, t)
                  : this.value.handleEvent(t);
              }
            }
          ]),
          t
        );
      })(),
      J = function(t) {
        return (
          t &&
          ($
            ? { capture: t.capture, passive: t.passive, once: t.once }
            : t.capture)
        );
      },
      Y = new ((function() {
        function t() {
          a()(this, t);
        }
        return (
          u()(t, [
            {
              key: "handleAttributeExpressions",
              value: function(t, e, n, r) {
                var i = e[0];
                return "." === i
                  ? new H(t, e.slice(1), n).parts
                  : "@" === i
                  ? [new D(t, e.slice(1), r.eventContext)]
                  : "?" === i
                  ? [new B(t, e.slice(1), n)]
                  : new z(t, e, n).parts;
              }
            },
            {
              key: "handleTextExpression",
              value: function(t) {
                return new q(t);
              }
            }
          ]),
          t
        );
      })())();
    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    function K(t) {
      var e = Q.get(t.type);
      void 0 === e &&
        ((e = { stringsArray: new WeakMap(), keyString: new Map() }),
        Q.set(t.type, e));
      var n = e.stringsArray.get(t.strings);
      if (void 0 !== n) return n;
      var r = t.strings.join(E);
      return (
        void 0 === (n = e.keyString.get(r)) &&
          ((n = new T(t, t.getTemplateElement())), e.keyString.set(r, n)),
        e.stringsArray.set(t.strings, n),
        n
      );
    }
    var Q = new Map(),
      X = new WeakMap();
    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    (window.litHtmlVersions || (window.litHtmlVersions = [])).push("1.0.0");
    var Z = function(t) {
        for (
          var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1;
          r < e;
          r++
        )
          n[r - 1] = arguments[r];
        return new M(t, n, "html", Y);
      },
      tt = 133;
    function et(t, e) {
      for (
        var n = t.element.content,
          r = t.parts,
          i = document.createTreeWalker(n, tt, null, !1),
          o = rt(r),
          a = r[o],
          s = -1,
          u = 0,
          l = [],
          c = null;
        i.nextNode();

      ) {
        s++;
        var h = i.currentNode;
        for (
          h.previousSibling === c && (c = null),
            e.has(h) && (l.push(h), null === c && (c = h)),
            null !== c && u++;
          void 0 !== a && a.index === s;

        )
          (a.index = null !== c ? -1 : a.index - u), (a = r[(o = rt(r, o))]);
      }
      l.forEach(function(t) {
        return t.parentNode.removeChild(t);
      });
    }
    var nt = function(t) {
        for (
          var e = 11 === t.nodeType ? 0 : 1,
            n = document.createTreeWalker(t, tt, null, !1);
          n.nextNode();

        )
          e++;
        return e;
      },
      rt = function(t) {
        for (
          var e =
            (arguments.length > 1 && void 0 !== arguments[1]
              ? arguments[1]
              : -1) + 1;
          e < t.length;
          e++
        ) {
          var n = t[e];
          if (j(n)) return e;
        }
        return -1;
      };
    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    var it = function(t, e) {
        return "".concat(t, "--").concat(e);
      },
      ot = !0;
    void 0 === window.ShadyCSS
      ? (ot = !1)
      : void 0 === window.ShadyCSS.prepareTemplateDom &&
        (console.warn(
          "Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."
        ),
        (ot = !1));
    var at = function(t) {
        return function(e) {
          var n = it(e.type, t),
            r = Q.get(n);
          void 0 === r &&
            ((r = { stringsArray: new WeakMap(), keyString: new Map() }),
            Q.set(n, r));
          var i = r.stringsArray.get(e.strings);
          if (void 0 !== i) return i;
          var o = e.strings.join(E);
          if (void 0 === (i = r.keyString.get(o))) {
            var a = e.getTemplateElement();
            ot && window.ShadyCSS.prepareTemplateDom(a, t),
              (i = new T(e, a)),
              r.keyString.set(o, i);
          }
          return r.stringsArray.set(e.strings, i), i;
        };
      },
      st = ["html", "svg"],
      ut = new Set(),
      lt = function(t, e, n) {
        ut.add(n);
        var r = t.querySelectorAll("style"),
          i = r.length;
        if (0 !== i) {
          for (var o = document.createElement("style"), a = 0; a < i; a++) {
            var s = r[a];
            s.parentNode.removeChild(s), (o.textContent += s.textContent);
          }
          !(function(t) {
            st.forEach(function(e) {
              var n = Q.get(it(e, t));
              void 0 !== n &&
                n.keyString.forEach(function(t) {
                  var e = t.element.content,
                    n = new Set();
                  Array.from(e.querySelectorAll("style")).forEach(function(t) {
                    n.add(t);
                  }),
                    et(t, n);
                });
            });
          })(n);
          var u = e.element.content;
          !(function(t, e) {
            var n =
                arguments.length > 2 && void 0 !== arguments[2]
                  ? arguments[2]
                  : null,
              r = t.element.content,
              i = t.parts;
            if (null != n)
              for (
                var o = document.createTreeWalker(r, tt, null, !1),
                  a = rt(i),
                  s = 0,
                  u = -1;
                o.nextNode();

              )
                for (
                  u++,
                    o.currentNode === n &&
                      ((s = nt(e)), n.parentNode.insertBefore(e, n));
                  -1 !== a && i[a].index === u;

                ) {
                  if (s > 0) {
                    for (; -1 !== a; ) (i[a].index += s), (a = rt(i, a));
                    return;
                  }
                  a = rt(i, a);
                }
            else r.appendChild(e);
          })(e, o, u.firstChild),
            window.ShadyCSS.prepareTemplateStyles(e.element, n);
          var l = u.querySelector("style");
          if (window.ShadyCSS.nativeShadow && null !== l)
            t.insertBefore(l.cloneNode(!0), t.firstChild);
          else {
            u.insertBefore(o, u.firstChild);
            var c = new Set();
            c.add(o), et(e, c);
          }
        } else window.ShadyCSS.prepareTemplateStyles(e.element, n);
      },
      ct = n(10),
      ht = n.n(ct),
      pt = n(11),
      ft = n.n(pt),
      dt = n(12),
      vt = n.n(dt);
    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    window.JSCompiler_renameProperty = function(t, e) {
      return t;
    };
    var yt = {
        toAttribute: function(t, e) {
          switch (e) {
            case Boolean:
              return t ? "" : null;
            case Object:
            case Array:
              return null == t ? t : JSON.stringify(t);
          }
          return t;
        },
        fromAttribute: function(t, e) {
          switch (e) {
            case Boolean:
              return null !== t;
            case Number:
              return null === t ? null : Number(t);
            case Object:
            case Array:
              return JSON.parse(t);
          }
          return t;
        }
      },
      mt = function(t, e) {
        return e !== t && (e == e || t == t);
      },
      gt = {
        attribute: !0,
        type: String,
        converter: yt,
        reflect: !1,
        hasChanged: mt
      },
      _t = Promise.resolve(!0),
      bt = (function(t) {
        function e() {
          var t;
          return (
            a()(this, e),
            ((t = c()(this, p()(e).call(this)))._updateState = 0),
            (t._instanceProperties = void 0),
            (t._updatePromise = _t),
            (t._hasConnectedResolver = void 0),
            (t._changedProperties = new Map()),
            (t._reflectingProperties = void 0),
            t.initialize(),
            t
          );
        }
        return (
          d()(e, t),
          u()(
            e,
            [
              {
                key: "initialize",
                value: function() {
                  this._saveInstanceProperties(), this._requestUpdate();
                }
              },
              {
                key: "_saveInstanceProperties",
                value: function() {
                  var t = this;
                  this.constructor._classProperties.forEach(function(e, n) {
                    if (t.hasOwnProperty(n)) {
                      var r = t[n];
                      delete t[n],
                        t._instanceProperties ||
                          (t._instanceProperties = new Map()),
                        t._instanceProperties.set(n, r);
                    }
                  });
                }
              },
              {
                key: "_applyInstanceProperties",
                value: function() {
                  var t = this;
                  this._instanceProperties.forEach(function(e, n) {
                    return (t[n] = e);
                  }),
                    (this._instanceProperties = void 0);
                }
              },
              {
                key: "connectedCallback",
                value: function() {
                  (this._updateState = 32 | this._updateState),
                    this._hasConnectedResolver &&
                      (this._hasConnectedResolver(),
                      (this._hasConnectedResolver = void 0));
                }
              },
              { key: "disconnectedCallback", value: function() {} },
              {
                key: "attributeChangedCallback",
                value: function(t, e, n) {
                  e !== n && this._attributeToProperty(t, n);
                }
              },
              {
                key: "_propertyToAttribute",
                value: function(t, e) {
                  var n =
                      arguments.length > 2 && void 0 !== arguments[2]
                        ? arguments[2]
                        : gt,
                    r = this.constructor,
                    i = r._attributeNameForProperty(t, n);
                  if (void 0 !== i) {
                    var o = r._propertyValueToAttribute(e, n);
                    if (void 0 === o) return;
                    (this._updateState = 8 | this._updateState),
                      null == o
                        ? this.removeAttribute(i)
                        : this.setAttribute(i, o),
                      (this._updateState = -9 & this._updateState);
                  }
                }
              },
              {
                key: "_attributeToProperty",
                value: function(t, e) {
                  if (!(8 & this._updateState)) {
                    var n = this.constructor,
                      r = n._attributeToPropertyMap.get(t);
                    if (void 0 !== r) {
                      var i = n._classProperties.get(r) || gt;
                      (this._updateState = 16 | this._updateState),
                        (this[r] = n._propertyValueFromAttribute(e, i)),
                        (this._updateState = -17 & this._updateState);
                    }
                  }
                }
              },
              {
                key: "_requestUpdate",
                value: function(t, e) {
                  var n = !0;
                  if (void 0 !== t) {
                    var r = this.constructor,
                      i = r._classProperties.get(t) || gt;
                    r._valueHasChanged(this[t], e, i.hasChanged)
                      ? (this._changedProperties.has(t) ||
                          this._changedProperties.set(t, e),
                        !0 !== i.reflect ||
                          16 & this._updateState ||
                          (void 0 === this._reflectingProperties &&
                            (this._reflectingProperties = new Map()),
                          this._reflectingProperties.set(t, i)))
                      : (n = !1);
                  }
                  !this._hasRequestedUpdate && n && this._enqueueUpdate();
                }
              },
              {
                key: "requestUpdate",
                value: function(t, e) {
                  return this._requestUpdate(t, e), this.updateComplete;
                }
              },
              {
                key: "_enqueueUpdate",
                value: (function() {
                  var t = ft()(
                    ht.a.mark(function t() {
                      var e,
                        n,
                        r,
                        i,
                        o = this;
                      return ht.a.wrap(
                        function(t) {
                          for (;;)
                            switch ((t.prev = t.next)) {
                              case 0:
                                return (
                                  (this._updateState = 4 | this._updateState),
                                  (r = this._updatePromise),
                                  (this._updatePromise = new Promise(function(
                                    t,
                                    r
                                  ) {
                                    (e = t), (n = r);
                                  })),
                                  (t.prev = 3),
                                  (t.next = 6),
                                  r
                                );
                              case 6:
                                t.next = 10;
                                break;
                              case 8:
                                (t.prev = 8), (t.t0 = t.catch(3));
                              case 10:
                                if (this._hasConnected) {
                                  t.next = 13;
                                  break;
                                }
                                return (
                                  (t.next = 13),
                                  new Promise(function(t) {
                                    return (o._hasConnectedResolver = t);
                                  })
                                );
                              case 13:
                                if (
                                  ((t.prev = 13),
                                  null == (i = this.performUpdate()))
                                ) {
                                  t.next = 18;
                                  break;
                                }
                                return (t.next = 18), i;
                              case 18:
                                t.next = 23;
                                break;
                              case 20:
                                (t.prev = 20), (t.t1 = t.catch(13)), n(t.t1);
                              case 23:
                                e(!this._hasRequestedUpdate);
                              case 24:
                              case "end":
                                return t.stop();
                            }
                        },
                        t,
                        this,
                        [[3, 8], [13, 20]]
                      );
                    })
                  );
                  return function() {
                    return t.apply(this, arguments);
                  };
                })()
              },
              {
                key: "performUpdate",
                value: function() {
                  this._instanceProperties && this._applyInstanceProperties();
                  var t = !1,
                    e = this._changedProperties;
                  try {
                    (t = this.shouldUpdate(e)) && this.update(e);
                  } catch (e) {
                    throw ((t = !1), e);
                  } finally {
                    this._markUpdated();
                  }
                  t &&
                    (1 & this._updateState ||
                      ((this._updateState = 1 | this._updateState),
                      this.firstUpdated(e)),
                    this.updated(e));
                }
              },
              {
                key: "_markUpdated",
                value: function() {
                  (this._changedProperties = new Map()),
                    (this._updateState = -5 & this._updateState);
                }
              },
              {
                key: "shouldUpdate",
                value: function(t) {
                  return !0;
                }
              },
              {
                key: "update",
                value: function(t) {
                  var e = this;
                  void 0 !== this._reflectingProperties &&
                    this._reflectingProperties.size > 0 &&
                    (this._reflectingProperties.forEach(function(t, n) {
                      return e._propertyToAttribute(n, e[n], t);
                    }),
                    (this._reflectingProperties = void 0));
                }
              },
              { key: "updated", value: function(t) {} },
              { key: "firstUpdated", value: function(t) {} },
              {
                key: "_hasConnected",
                get: function() {
                  return 32 & this._updateState;
                }
              },
              {
                key: "_hasRequestedUpdate",
                get: function() {
                  return 4 & this._updateState;
                }
              },
              {
                key: "hasUpdated",
                get: function() {
                  return 1 & this._updateState;
                }
              },
              {
                key: "updateComplete",
                get: function() {
                  return this._updatePromise;
                }
              }
            ],
            [
              {
                key: "_ensureClassProperties",
                value: function() {
                  var t = this;
                  if (
                    !this.hasOwnProperty(
                      JSCompiler_renameProperty("_classProperties", this)
                    )
                  ) {
                    this._classProperties = new Map();
                    var e = Object.getPrototypeOf(this)._classProperties;
                    void 0 !== e &&
                      e.forEach(function(e, n) {
                        return t._classProperties.set(n, e);
                      });
                  }
                }
              },
              {
                key: "createProperty",
                value: function(t) {
                  var e =
                    arguments.length > 1 && void 0 !== arguments[1]
                      ? arguments[1]
                      : gt;
                  if (
                    (this._ensureClassProperties(),
                    this._classProperties.set(t, e),
                    !e.noAccessor && !this.prototype.hasOwnProperty(t))
                  ) {
                    var n = "symbol" === g()(t) ? Symbol() : "__".concat(t);
                    Object.defineProperty(this.prototype, t, {
                      get: function() {
                        return this[n];
                      },
                      set: function(e) {
                        var r = this[t];
                        (this[n] = e), this._requestUpdate(t, r);
                      },
                      configurable: !0,
                      enumerable: !0
                    });
                  }
                }
              },
              {
                key: "finalize",
                value: function() {
                  if (
                    !this.hasOwnProperty(
                      JSCompiler_renameProperty("finalized", this)
                    ) ||
                    !this.finalized
                  ) {
                    var t = Object.getPrototypeOf(this);
                    if (
                      ("function" == typeof t.finalize && t.finalize(),
                      (this.finalized = !0),
                      this._ensureClassProperties(),
                      (this._attributeToPropertyMap = new Map()),
                      this.hasOwnProperty(
                        JSCompiler_renameProperty("properties", this)
                      ))
                    ) {
                      var e = this.properties,
                        n = [].concat(
                          N()(Object.getOwnPropertyNames(e)),
                          N()(
                            "function" == typeof Object.getOwnPropertySymbols
                              ? Object.getOwnPropertySymbols(e)
                              : []
                          )
                        ),
                        r = !0,
                        i = !1,
                        o = void 0;
                      try {
                        for (
                          var a, s = n[Symbol.iterator]();
                          !(r = (a = s.next()).done);
                          r = !0
                        ) {
                          var u = a.value;
                          this.createProperty(u, e[u]);
                        }
                      } catch (t) {
                        (i = !0), (o = t);
                      } finally {
                        try {
                          r || null == s.return || s.return();
                        } finally {
                          if (i) throw o;
                        }
                      }
                    }
                  }
                }
              },
              {
                key: "_attributeNameForProperty",
                value: function(t, e) {
                  var n = e.attribute;
                  return !1 === n
                    ? void 0
                    : "string" == typeof n
                    ? n
                    : "string" == typeof t
                    ? t.toLowerCase()
                    : void 0;
                }
              },
              {
                key: "_valueHasChanged",
                value: function(t, e) {
                  return (arguments.length > 2 && void 0 !== arguments[2]
                    ? arguments[2]
                    : mt)(t, e);
                }
              },
              {
                key: "_propertyValueFromAttribute",
                value: function(t, e) {
                  var n = e.type,
                    r = e.converter || yt,
                    i = "function" == typeof r ? r : r.fromAttribute;
                  return i ? i(t, n) : t;
                }
              },
              {
                key: "_propertyValueToAttribute",
                value: function(t, e) {
                  if (void 0 !== e.reflect) {
                    var n = e.type,
                      r = e.converter;
                    return ((r && r.toAttribute) || yt.toAttribute)(t, n);
                  }
                }
              },
              {
                key: "observedAttributes",
                get: function() {
                  var t = this;
                  this.finalize();
                  var e = [];
                  return (
                    this._classProperties.forEach(function(n, r) {
                      var i = t._attributeNameForProperty(r, n);
                      void 0 !== i &&
                        (t._attributeToPropertyMap.set(i, r), e.push(i));
                    }),
                    e
                  );
                }
              }
            ]
          ),
          e
        );
      })(vt()(HTMLElement));
    bt.finalized = !0;
    var wt =
        "adoptedStyleSheets" in Document.prototype &&
        "replace" in CSSStyleSheet.prototype,
      St = Symbol(),
      xt = (function() {
        function t(e, n) {
          if ((a()(this, t), n !== St))
            throw new Error(
              "CSSResult is not constructable. Use `unsafeCSS` or `css` instead."
            );
          this.cssText = e;
        }
        return (
          u()(t, [
            {
              key: "toString",
              value: function() {
                return this.cssText;
              }
            },
            {
              key: "styleSheet",
              get: function() {
                return (
                  void 0 === this._styleSheet &&
                    (wt
                      ? ((this._styleSheet = new CSSStyleSheet()),
                        this._styleSheet.replaceSync(this.cssText))
                      : (this._styleSheet = null)),
                  this._styleSheet
                );
              }
            }
          ]),
          t
        );
      })(),
      kt = function(t) {
        for (
          var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1;
          r < e;
          r++
        )
          n[r - 1] = arguments[r];
        var i = n.reduce(function(e, n, r) {
          return (
            e +
            (function(t) {
              if (t instanceof xt) return t.cssText;
              if ("number" == typeof t) return t;
              throw new Error(
                "Value passed to 'css' function must be a 'css' function result: ".concat(
                  t,
                  ". Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security."
                )
              );
            })(n) +
            t[r + 1]
          );
        }, t[0]);
        return new xt(i, St);
      };
    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    (window.litElementVersions || (window.litElementVersions = [])).push(
      "2.2.0"
    );
    var Pt = function(t) {
        return t.flat
          ? t.flat(1 / 0)
          : (function t(e) {
              for (
                var n =
                    arguments.length > 1 && void 0 !== arguments[1]
                      ? arguments[1]
                      : [],
                  r = 0,
                  i = e.length;
                r < i;
                r++
              ) {
                var o = e[r];
                Array.isArray(o) ? t(o, n) : n.push(o);
              }
              return n;
            })(t);
      },
      Nt = (function(t) {
        function e() {
          return a()(this, e), c()(this, p()(e).apply(this, arguments));
        }
        return (
          d()(e, t),
          u()(
            e,
            [
              {
                key: "initialize",
                value: function() {
                  y()(p()(e.prototype), "initialize", this).call(this),
                    (this.renderRoot = this.createRenderRoot()),
                    window.ShadowRoot &&
                      this.renderRoot instanceof window.ShadowRoot &&
                      this.adoptStyles();
                }
              },
              {
                key: "createRenderRoot",
                value: function() {
                  return this.attachShadow({ mode: "open" });
                }
              },
              {
                key: "adoptStyles",
                value: function() {
                  var t = this.constructor._styles;
                  0 !== t.length &&
                    (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow
                      ? wt
                        ? (this.renderRoot.adoptedStyleSheets = t.map(function(
                            t
                          ) {
                            return t.styleSheet;
                          }))
                        : (this._needsShimAdoptedStyleSheets = !0)
                      : window.ShadyCSS.ScopingShim.prepareAdoptedCssText(
                          t.map(function(t) {
                            return t.cssText;
                          }),
                          this.localName
                        ));
                }
              },
              {
                key: "connectedCallback",
                value: function() {
                  y()(p()(e.prototype), "connectedCallback", this).call(this),
                    this.hasUpdated &&
                      void 0 !== window.ShadyCSS &&
                      window.ShadyCSS.styleElement(this);
                }
              },
              {
                key: "update",
                value: function(t) {
                  var n = this;
                  y()(p()(e.prototype), "update", this).call(this, t);
                  var r = this.render();
                  r instanceof M &&
                    this.constructor.render(r, this.renderRoot, {
                      scopeName: this.localName,
                      eventContext: this
                    }),
                    this._needsShimAdoptedStyleSheets &&
                      ((this._needsShimAdoptedStyleSheets = !1),
                      this.constructor._styles.forEach(function(t) {
                        var e = document.createElement("style");
                        (e.textContent = t.cssText),
                          n.renderRoot.appendChild(e);
                      }));
                }
              },
              { key: "render", value: function() {} }
            ],
            [
              {
                key: "finalize",
                value: function() {
                  y()(p()(e), "finalize", this).call(this),
                    (this._styles = this.hasOwnProperty(
                      JSCompiler_renameProperty("styles", this)
                    )
                      ? this._getUniqueStyles()
                      : this._styles || []);
                }
              },
              {
                key: "_getUniqueStyles",
                value: function() {
                  var t = this.styles,
                    e = [];
                  Array.isArray(t)
                    ? Pt(t)
                        .reduceRight(function(t, e) {
                          return t.add(e), t;
                        }, new Set())
                        .forEach(function(t) {
                          return e.unshift(t);
                        })
                    : t && e.push(t);
                  return e;
                }
              }
            ]
          ),
          e
        );
      })(bt);
    function Et() {
      var t = i()([
        '\n      :host {\n        font-family: Roboto, Arial, sans-serif;\n        z-index: 50000;\n        position: absolute;\n        min-width: 220px;\n        margin-top: 20px;\n        margin-left: -20px;\n        -webkit-box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);\n        -moz-box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);\n        box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);\n        opacity: 0.9;\n      }\n\n      .tooltip-header .tooltip-header-title,\n      .tooltip-body,\n      a,\n      a:link,\n      a:hover,\n      a:active,\n      a:visited {\n        color: #ffffff;\n      }\n\n      .tooltip-header {\n        background-color: #000000;\n        line-height: 3em;\n      }\n\n      .tooltip-header::before {\n        content: " ";\n        position: absolute;\n        bottom: 100%;\n        left: 20px;\n        margin-left: -10px;\n        border-width: 10px;\n        border-style: solid;\n        border-color: transparent transparent black transparent;\n      }\n\n      .tooltip-header::before {\n        left: 20px;\n      }\n\n      .tooltip-header .tooltip-header-title {\n        background-color: #000000;\n        font-weight: 700;\n        line-height: 1em;\n        display: inline-block;\n        vertical-align: middle;\n        padding-left: 0.4em;\n      }\n\n      .tooltip-body {\n        padding: 1em;\n        background: #616161;\n        font-weight: normal;\n      }\n\n      table td {\n        padding: 0.5em 0.5em;\n        vertical-align: top;\n      }\n\n      table td:first-child {\n        font-weight: 600;\n        text-align: right;\n      }\n\n      table td p {\n        margin-top: 0;\n      }\n    '
      ]);
      return (
        (Et = function() {
          return t;
        }),
        t
      );
    }
    function Ct() {
      var t = i()([""]);
      return (
        (Ct = function() {
          return t;
        }),
        t
      );
    }
    function Ot() {
      var t = i()([
        "\n      ",
        '\n      <div class="tooltip-header">\n        <span class="tooltip-header-title">',
        '</span>\n      </div>\n      <div class="tooltip-body"><slot></slot></div>\n    '
      ]);
      return (
        (Ot = function() {
          return t;
        }),
        t
      );
    }
    (Nt.finalized = !0),
      (Nt.render = function(t, e, n) {
        var r = n.scopeName,
          i = X.has(e),
          o = ot && 11 === e.nodeType && !!e.host && t instanceof M,
          a = o && !ut.has(r),
          s = a ? document.createDocumentFragment() : e;
        if (
          ((function(t, e, n) {
            var r = X.get(e);
            void 0 === r &&
              (S(e, e.firstChild),
              X.set(e, (r = new q(Object.assign({ templateFactory: K }, n)))),
              r.appendInto(e)),
              r.setValue(t),
              r.commit();
          })(t, s, Object.assign({ templateFactory: at(r) }, n)),
          a)
        ) {
          var u = X.get(s);
          X.delete(s),
            u.value instanceof R && lt(s, u.value.template, r),
            S(e, e.firstChild),
            e.appendChild(s),
            X.set(e, u);
        }
        !i && o && window.ShadyCSS.styleElement(e.host);
      });
    var Tt = (function(t) {
        function e() {
          return a()(this, e), c()(this, p()(e).apply(this, arguments));
        }
        return (
          d()(e, t),
          u()(
            e,
            [
              {
                key: "_updatePosition",
                value: function() {
                  (this.style.top = "".concat(this.top, "px")),
                    (this.style.left = "".concat(this.left, "px"));
                }
              },
              {
                key: "render",
                value: function() {
                  return (
                    this._updatePosition(),
                    (this.style.display = this.visible ? "block" : "none"),
                    Z(Ot(), this.title && Z(Ct()), this.title)
                  );
                }
              }
            ],
            [
              {
                key: "styles",
                get: function() {
                  return kt(Et());
                }
              },
              {
                key: "properties",
                get: function() {
                  return {
                    top: { type: Number },
                    left: { type: Number },
                    title: { type: String },
                    visible: { type: Boolean }
                  };
                }
              }
            ]
          ),
          e
        );
      })(Nt),
      At = function() {
        customElements.define("protvista-tooltip", Tt);
      };
    window.customElements
      ? At()
      : document.addEventListener("WebComponentsReady", function() {
          At();
        });
    e.default = Tt;
  }
]);
//# sourceMappingURL=protvista-tooltip.js.map

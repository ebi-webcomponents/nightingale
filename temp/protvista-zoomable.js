var ProtvistaZoomable = (function(t) {
  var e = {};
  function n(i) {
    if (e[i]) return e[i].exports;
    var r = (e[i] = { i: i, l: !1, exports: {} });
    return t[i].call(r.exports, r, r.exports, n), (r.l = !0), r.exports;
  }
  return (
    (n.m = t),
    (n.c = e),
    (n.d = function(t, e, i) {
      n.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: i });
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
      var i = Object.create(null);
      if (
        (n.r(i),
        Object.defineProperty(i, "default", { enumerable: !0, value: t }),
        2 & e && "string" != typeof t)
      )
        for (var r in t)
          n.d(
            i,
            r,
            function(e) {
              return t[e];
            }.bind(null, r)
          );
      return i;
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
    n((n.s = 11))
  );
})([
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
    t.exports = d3;
  },
  function(t, e) {
    function n(e, i) {
      return (
        (t.exports = n =
          Object.setPrototypeOf ||
          function(t, e) {
            return (t.__proto__ = e), t;
          }),
        n(e, i)
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
  function(t, e, n) {
    var i = n(12),
      r = n(13),
      o = n(14);
    t.exports = function(t, e) {
      return i(t) || r(t, e) || o();
    };
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
        var i = e[n];
        (i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          "value" in i && (i.writable = !0),
          Object.defineProperty(t, i.key, i);
      }
    }
    t.exports = function(t, e, i) {
      return e && n(t.prototype, e), i && n(t, i), t;
    };
  },
  function(t, e, n) {
    var i = n(15),
      r = n(0);
    t.exports = function(t, e) {
      return !e || ("object" !== i(e) && "function" != typeof e) ? r(t) : e;
    };
  },
  function(t, e, n) {
    var i = n(2);
    t.exports = function(t, e) {
      if ("function" != typeof e && null !== e)
        throw new TypeError(
          "Super expression must either be null or a function"
        );
      (t.prototype = Object.create(e && e.prototype, {
        constructor: { value: t, writable: !0, configurable: !0 }
      })),
        e && i(t, e);
    };
  },
  function(t, e, n) {
    var i = n(3),
      r = n(2),
      o = n(16),
      s = n(17);
    function h(e) {
      var n = "function" == typeof Map ? new Map() : void 0;
      return (
        (t.exports = h = function(t) {
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
            return s(t, arguments, i(this).constructor);
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
            r(e, t)
          );
        }),
        h(e)
      );
    }
    t.exports = h;
  },
  function(t, e, n) {
    "use strict";
    (function(t) {
      var n = (function() {
          if ("undefined" != typeof Map) return Map;
          function t(t, e) {
            var n = -1;
            return (
              t.some(function(t, i) {
                return t[0] === e && ((n = i), !0);
              }),
              n
            );
          }
          return (function() {
            function e() {
              this.__entries__ = [];
            }
            return (
              Object.defineProperty(e.prototype, "size", {
                get: function() {
                  return this.__entries__.length;
                },
                enumerable: !0,
                configurable: !0
              }),
              (e.prototype.get = function(e) {
                var n = t(this.__entries__, e),
                  i = this.__entries__[n];
                return i && i[1];
              }),
              (e.prototype.set = function(e, n) {
                var i = t(this.__entries__, e);
                ~i
                  ? (this.__entries__[i][1] = n)
                  : this.__entries__.push([e, n]);
              }),
              (e.prototype.delete = function(e) {
                var n = this.__entries__,
                  i = t(n, e);
                ~i && n.splice(i, 1);
              }),
              (e.prototype.has = function(e) {
                return !!~t(this.__entries__, e);
              }),
              (e.prototype.clear = function() {
                this.__entries__.splice(0);
              }),
              (e.prototype.forEach = function(t, e) {
                void 0 === e && (e = null);
                for (var n = 0, i = this.__entries__; n < i.length; n++) {
                  var r = i[n];
                  t.call(e, r[1], r[0]);
                }
              }),
              e
            );
          })();
        })(),
        i =
          "undefined" != typeof window &&
          "undefined" != typeof document &&
          window.document === document,
        r =
          void 0 !== t && t.Math === Math
            ? t
            : "undefined" != typeof self && self.Math === Math
            ? self
            : "undefined" != typeof window && window.Math === Math
            ? window
            : Function("return this")(),
        o =
          "function" == typeof requestAnimationFrame
            ? requestAnimationFrame.bind(r)
            : function(t) {
                return setTimeout(function() {
                  return t(Date.now());
                }, 1e3 / 60);
              },
        s = 2;
      var h = 20,
        a = [
          "top",
          "right",
          "bottom",
          "left",
          "width",
          "height",
          "size",
          "weight"
        ],
        c = "undefined" != typeof MutationObserver,
        u = (function() {
          function t() {
            (this.connected_ = !1),
              (this.mutationEventsAdded_ = !1),
              (this.mutationsObserver_ = null),
              (this.observers_ = []),
              (this.onTransitionEnd_ = this.onTransitionEnd_.bind(this)),
              (this.refresh = (function(t, e) {
                var n = !1,
                  i = !1,
                  r = 0;
                function h() {
                  n && ((n = !1), t()), i && c();
                }
                function a() {
                  o(h);
                }
                function c() {
                  var t = Date.now();
                  if (n) {
                    if (t - r < s) return;
                    i = !0;
                  } else (n = !0), (i = !1), setTimeout(a, e);
                  r = t;
                }
                return c;
              })(this.refresh.bind(this), h));
          }
          return (
            (t.prototype.addObserver = function(t) {
              ~this.observers_.indexOf(t) || this.observers_.push(t),
                this.connected_ || this.connect_();
            }),
            (t.prototype.removeObserver = function(t) {
              var e = this.observers_,
                n = e.indexOf(t);
              ~n && e.splice(n, 1),
                !e.length && this.connected_ && this.disconnect_();
            }),
            (t.prototype.refresh = function() {
              this.updateObservers_() && this.refresh();
            }),
            (t.prototype.updateObservers_ = function() {
              var t = this.observers_.filter(function(t) {
                return t.gatherActive(), t.hasActive();
              });
              return (
                t.forEach(function(t) {
                  return t.broadcastActive();
                }),
                t.length > 0
              );
            }),
            (t.prototype.connect_ = function() {
              i &&
                !this.connected_ &&
                (document.addEventListener(
                  "transitionend",
                  this.onTransitionEnd_
                ),
                window.addEventListener("resize", this.refresh),
                c
                  ? ((this.mutationsObserver_ = new MutationObserver(
                      this.refresh
                    )),
                    this.mutationsObserver_.observe(document, {
                      attributes: !0,
                      childList: !0,
                      characterData: !0,
                      subtree: !0
                    }))
                  : (document.addEventListener(
                      "DOMSubtreeModified",
                      this.refresh
                    ),
                    (this.mutationEventsAdded_ = !0)),
                (this.connected_ = !0));
            }),
            (t.prototype.disconnect_ = function() {
              i &&
                this.connected_ &&
                (document.removeEventListener(
                  "transitionend",
                  this.onTransitionEnd_
                ),
                window.removeEventListener("resize", this.refresh),
                this.mutationsObserver_ && this.mutationsObserver_.disconnect(),
                this.mutationEventsAdded_ &&
                  document.removeEventListener(
                    "DOMSubtreeModified",
                    this.refresh
                  ),
                (this.mutationsObserver_ = null),
                (this.mutationEventsAdded_ = !1),
                (this.connected_ = !1));
            }),
            (t.prototype.onTransitionEnd_ = function(t) {
              var e = t.propertyName,
                n = void 0 === e ? "" : e;
              a.some(function(t) {
                return !!~n.indexOf(t);
              }) && this.refresh();
            }),
            (t.getInstance = function() {
              return (
                this.instance_ || (this.instance_ = new t()), this.instance_
              );
            }),
            (t.instance_ = null),
            t
          );
        })(),
        l = function(t, e) {
          for (var n = 0, i = Object.keys(e); n < i.length; n++) {
            var r = i[n];
            Object.defineProperty(t, r, {
              value: e[r],
              enumerable: !1,
              writable: !1,
              configurable: !0
            });
          }
          return t;
        },
        f = function(t) {
          return (t && t.ownerDocument && t.ownerDocument.defaultView) || r;
        },
        d = y(0, 0, 0, 0);
      function g(t) {
        return parseFloat(t) || 0;
      }
      function p(t) {
        for (var e = [], n = 1; n < arguments.length; n++)
          e[n - 1] = arguments[n];
        return e.reduce(function(e, n) {
          return e + g(t["border-" + n + "-width"]);
        }, 0);
      }
      function v(t) {
        var e = t.clientWidth,
          n = t.clientHeight;
        if (!e && !n) return d;
        var i = f(t).getComputedStyle(t),
          r = (function(t) {
            for (
              var e = {}, n = 0, i = ["top", "right", "bottom", "left"];
              n < i.length;
              n++
            ) {
              var r = i[n],
                o = t["padding-" + r];
              e[r] = g(o);
            }
            return e;
          })(i),
          o = r.left + r.right,
          s = r.top + r.bottom,
          h = g(i.width),
          a = g(i.height);
        if (
          ("border-box" === i.boxSizing &&
            (Math.round(h + o) !== e && (h -= p(i, "left", "right") + o),
            Math.round(a + s) !== n && (a -= p(i, "top", "bottom") + s)),
          !(function(t) {
            return t === f(t).document.documentElement;
          })(t))
        ) {
          var c = Math.round(h + o) - e,
            u = Math.round(a + s) - n;
          1 !== Math.abs(c) && (h -= c), 1 !== Math.abs(u) && (a -= u);
        }
        return y(r.left, r.top, h, a);
      }
      var m =
        "undefined" != typeof SVGGraphicsElement
          ? function(t) {
              return t instanceof f(t).SVGGraphicsElement;
            }
          : function(t) {
              return (
                t instanceof f(t).SVGElement && "function" == typeof t.getBBox
              );
            };
      function _(t) {
        return i
          ? m(t)
            ? (function(t) {
                var e = t.getBBox();
                return y(0, 0, e.width, e.height);
              })(t)
            : v(t)
          : d;
      }
      function y(t, e, n, i) {
        return { x: t, y: e, width: n, height: i };
      }
      var b = (function() {
          function t(t) {
            (this.broadcastWidth = 0),
              (this.broadcastHeight = 0),
              (this.contentRect_ = y(0, 0, 0, 0)),
              (this.target = t);
          }
          return (
            (t.prototype.isActive = function() {
              var t = _(this.target);
              return (
                (this.contentRect_ = t),
                t.width !== this.broadcastWidth ||
                  t.height !== this.broadcastHeight
              );
            }),
            (t.prototype.broadcastRect = function() {
              var t = this.contentRect_;
              return (
                (this.broadcastWidth = t.width),
                (this.broadcastHeight = t.height),
                t
              );
            }),
            t
          );
        })(),
        w = (function() {
          return function(t, e) {
            var n,
              i,
              r,
              o,
              s,
              h,
              a,
              c = ((i = (n = e).x),
              (r = n.y),
              (o = n.width),
              (s = n.height),
              (h =
                "undefined" != typeof DOMRectReadOnly
                  ? DOMRectReadOnly
                  : Object),
              (a = Object.create(h.prototype)),
              l(a, {
                x: i,
                y: r,
                width: o,
                height: s,
                top: r,
                right: i + o,
                bottom: s + r,
                left: i
              }),
              a);
            l(this, { target: t, contentRect: c });
          };
        })(),
        x = (function() {
          function t(t, e, i) {
            if (
              ((this.activeObservations_ = []),
              (this.observations_ = new n()),
              "function" != typeof t)
            )
              throw new TypeError(
                "The callback provided as parameter 1 is not a function."
              );
            (this.callback_ = t),
              (this.controller_ = e),
              (this.callbackCtx_ = i);
          }
          return (
            (t.prototype.observe = function(t) {
              if (!arguments.length)
                throw new TypeError("1 argument required, but only 0 present.");
              if ("undefined" != typeof Element && Element instanceof Object) {
                if (!(t instanceof f(t).Element))
                  throw new TypeError('parameter 1 is not of type "Element".');
                var e = this.observations_;
                e.has(t) ||
                  (e.set(t, new b(t)),
                  this.controller_.addObserver(this),
                  this.controller_.refresh());
              }
            }),
            (t.prototype.unobserve = function(t) {
              if (!arguments.length)
                throw new TypeError("1 argument required, but only 0 present.");
              if ("undefined" != typeof Element && Element instanceof Object) {
                if (!(t instanceof f(t).Element))
                  throw new TypeError('parameter 1 is not of type "Element".');
                var e = this.observations_;
                e.has(t) &&
                  (e.delete(t),
                  e.size || this.controller_.removeObserver(this));
              }
            }),
            (t.prototype.disconnect = function() {
              this.clearActive(),
                this.observations_.clear(),
                this.controller_.removeObserver(this);
            }),
            (t.prototype.gatherActive = function() {
              var t = this;
              this.clearActive(),
                this.observations_.forEach(function(e) {
                  e.isActive() && t.activeObservations_.push(e);
                });
            }),
            (t.prototype.broadcastActive = function() {
              if (this.hasActive()) {
                var t = this.callbackCtx_,
                  e = this.activeObservations_.map(function(t) {
                    return new w(t.target, t.broadcastRect());
                  });
                this.callback_.call(t, e, t), this.clearActive();
              }
            }),
            (t.prototype.clearActive = function() {
              this.activeObservations_.splice(0);
            }),
            (t.prototype.hasActive = function() {
              return this.activeObservations_.length > 0;
            }),
            t
          );
        })(),
        E = "undefined" != typeof WeakMap ? new WeakMap() : new n(),
        O = (function() {
          return function t(e) {
            if (!(this instanceof t))
              throw new TypeError("Cannot call a class as a function.");
            if (!arguments.length)
              throw new TypeError("1 argument required, but only 0 present.");
            var n = u.getInstance(),
              i = new x(e, n, this);
            E.set(this, i);
          };
        })();
      ["observe", "unobserve", "disconnect"].forEach(function(t) {
        O.prototype[t] = function() {
          var e;
          return (e = E.get(this))[t].apply(e, arguments);
        };
      });
      var S = void 0 !== r.ResizeObserver ? r.ResizeObserver : O;
      e.a = S;
    }.call(this, n(18)));
  },
  function(t, e, n) {
    t.exports = n(19);
  },
  function(t, e) {
    t.exports = function(t) {
      if (Array.isArray(t)) return t;
    };
  },
  function(t, e) {
    t.exports = function(t, e) {
      var n = [],
        i = !0,
        r = !1,
        o = void 0;
      try {
        for (
          var s, h = t[Symbol.iterator]();
          !(i = (s = h.next()).done) && (n.push(s.value), !e || n.length !== e);
          i = !0
        );
      } catch (t) {
        (r = !0), (o = t);
      } finally {
        try {
          i || null == h.return || h.return();
        } finally {
          if (r) throw o;
        }
      }
      return n;
    };
  },
  function(t, e) {
    t.exports = function() {
      throw new TypeError(
        "Invalid attempt to destructure non-iterable instance"
      );
    };
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
    function i(e) {
      return (
        "function" == typeof Symbol && "symbol" === n(Symbol.iterator)
          ? (t.exports = i = function(t) {
              return n(t);
            })
          : (t.exports = i = function(t) {
              return t &&
                "function" == typeof Symbol &&
                t.constructor === Symbol &&
                t !== Symbol.prototype
                ? "symbol"
                : n(t);
            }),
        i(e)
      );
    }
    t.exports = i;
  },
  function(t, e) {
    t.exports = function(t) {
      return -1 !== Function.toString.call(t).indexOf("[native code]");
    };
  },
  function(t, e, n) {
    var i = n(2);
    function r(e, n, o) {
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
          ? (t.exports = r = function(t, e, n) {
              var r = [null];
              r.push.apply(r, e);
              var o = new (Function.bind.apply(t, r))();
              return n && i(o, n.prototype), o;
            })
          : (t.exports = r = Reflect.construct),
        r.apply(null, arguments)
      );
    }
    t.exports = r;
  },
  function(t, e) {
    var n;
    n = (function() {
      return this;
    })();
    try {
      n = n || new Function("return this")();
    } catch (t) {
      "object" == typeof window && (n = window);
    }
    t.exports = n;
  },
  function(t, e, n) {
    "use strict";
    n.r(e);
    var i = n(4),
      r = n.n(i),
      o = n(5),
      s = n.n(o),
      h = n(6),
      a = n.n(h),
      c = n(7),
      u = n.n(c),
      l = n(3),
      f = n.n(l),
      d = n(0),
      g = n.n(d),
      p = n(8),
      v = n.n(p),
      m = n(9),
      _ = n.n(m),
      y = n(1);
    class b {
      constructor({ min: t = -1 / 0, max: e = 1 / 0 } = {}) {
        (this.segments = []),
          (this.max = e),
          (this.min = t),
          (this.regionString = null);
      }
      encode(t = !1) {
        return this.segments
          .map(({ start: e, end: n }) => {
            if (t) return `${e}:${n}`;
            return `${e === this.min ? "" : e}:${n === this.max ? "" : n}`;
          })
          .join(",");
      }
      decode(t) {
        void 0 !== t && (this.regionString = t),
          this.regionString
            ? (this.segments = this.regionString.split(",").map(t => {
                const [e, n, i] = t.split(":");
                if (void 0 !== i)
                  throw new Error(
                    `there should be at most 1 ':' per region. Region: ${t}`
                  );
                let r = e ? parseInt(e) : this.min,
                  o = n ? parseInt(n) : this.max;
                if (
                  (r > o && ([r, o] = [o, r]),
                  r < this.min && (r = this.min),
                  o > this.max && (o = this.max),
                  isNaN(r))
                )
                  throw new Error(
                    `The parsed value of ${e} is NaN. Region: ${t}`
                  );
                if (isNaN(o))
                  throw new Error(
                    `The parsed value of ${n} is NaN. Region: ${t}`
                  );
                return { start: r, end: o };
              }))
            : (this.segments = []);
      }
    }
    const w = (t, e) => (t ? (e ? `${t},${e}` : t) : e);
    const x = class {
      constructor({ element: t, min: e, max: n }) {
        (this.element = t),
          (this.region = new b({ min: e, max: n })),
          (this.fixedHighlight = null);
      }
      set max(t) {
        this.region.max = t;
      }
      setAttributesInElement() {
        this.region.decode(this.element.getAttribute("highlight")),
          0 === this.region.segments.length &&
            ((this.element._highlightstart = parseInt(
              this.element.getAttribute("highlightstart")
            )),
            (this.element._highlightend = parseInt(
              this.element.getAttribute("highlightend")
            )),
            null === this.element._highlightstart ||
              null === this.element._highlightend ||
              isNaN(this.element._highlightstart) ||
              isNaN(this.element._highlightend) ||
              ((this.element._highlight = `${this.element._highlightstart}:${
                this.element._highlightend
              }`),
              this.region.decode(
                w(this.fixedHighlight, this.element._highlight)
              )));
      }
      setFloatAttribute(t, e) {
        const n = parseFloat(e);
        this.element[`_${t}`] = isNaN(n) ? e : n;
      }
      changedCallBack(t, e) {
        switch (t) {
          case "highlightstart":
          case "highlightend":
            this.setFloatAttribute(t, e),
              (this.element._highlight =
                isNaN(this.element._highlightstart) ||
                isNaN(this.element._highlightend) ||
                null === this.element._highlightstart ||
                null === this.element._highlightend
                  ? ""
                  : `${Math.max(
                      this.region.min,
                      this.element._highlightstart
                    )}:${Math.min(
                      this.region.max,
                      this.element._highlightend
                    )}`);
            break;
          default:
            this.element._highlight = e;
        }
        this.region.decode(w(this.fixedHighlight, this.element._highlight)),
          this.element.refresh();
      }
      setFixedHighlight(t) {
        (this.fixedHighlight = t),
          this.region.decode(w(t, this.element._highlight)),
          this.element.refresh();
      }
      appendHighlightTo(t) {
        this.highlighted = t.append("g").attr("class", "highlighted");
      }
      updateHighlight() {
        const t = this.highlighted.selectAll("rect").data(this.region.segments);
        t
          .enter()
          .append("rect")
          .style("opacity", 0.5)
          .attr("fill", "rgba(255, 235, 59, 0.8)")
          .style("pointer-events", "none")
          .merge(t)
          .attr("height", this.element._height)
          .attr("x", t => this.element.getXFromSeqPosition(t.start))
          .attr(
            "width",
            t => this.element.getSingleBaseWidth() * (t.end - t.start + 1)
          ),
          t.exit().remove();
      }
    };
    var E = n(10),
      O = (function(t) {
        function e() {
          var t;
          s()(this, e),
            ((t = u()(
              this,
              f()(e).call(this)
            ))._updateScaleDomain = t._updateScaleDomain.bind(g()(t))),
            (t._initZoom = t._initZoom.bind(g()(t))),
            (t.zoomed = t.zoomed.bind(g()(t))),
            (t._applyZoomTranslation = t.applyZoomTranslation.bind(g()(t))),
            (t._resetEventHandler = t._resetEventHandler.bind(g()(t)));
          var n = !1;
          return (
            (t.applyZoomTranslation = function() {
              n ||
                ((n = !0),
                requestAnimationFrame(function() {
                  (n = !1), t._applyZoomTranslation();
                }));
            }),
            (t._onResize = t._onResize.bind(g()(t))),
            (t._listenForResize = t._listenForResize.bind(g()(t))),
            (t.trackHighlighter = new x({ element: g()(t), min: 1 })),
            t
          );
        }
        return (
          v()(e, t),
          a()(
            e,
            [
              {
                key: "connectedCallback",
                value: function() {
                  (this.style.display = "block"),
                    (this.style.width = "100%"),
                    (this.width = this.offsetWidth),
                    (this._length = this.getAttribute("length")
                      ? parseFloat(this.getAttribute("length"))
                      : 0),
                    (this._displaystart = this.getAttribute("displaystart")
                      ? parseFloat(this.getAttribute("displaystart"))
                      : 1),
                    (this._displayend = this.getAttribute("displayend")
                      ? parseFloat(this.getAttribute("displayend"))
                      : this.width),
                    (this._height = this.getAttribute("height")
                      ? parseInt(this.getAttribute("height"))
                      : 44),
                    (this._highlightEvent = this.getAttribute("highlight-event")
                      ? this.getAttribute("highlight-event")
                      : "onclick"),
                    this.trackHighlighter.setAttributesInElement(this),
                    this._updateScaleDomain(),
                    (this._originXScale = this.xScale.copy()),
                    this._initZoom(),
                    this._listenForResize(),
                    this.addEventListener("error", function(t) {
                      throw t;
                    }),
                    window.hasProtvistaReset ||
                      (window.addEventListener(
                        "click",
                        this._resetEventHandler
                      ),
                      (window.hasProtvistaReset = !0));
                }
              },
              {
                key: "disconnectedCallback",
                value: function() {
                  this._ro
                    ? this._ro.unobserve(this)
                    : window.removeEventListener("resize", this._onResize),
                    window.removeEventListener(
                      "click",
                      this._resetEventHandler
                    );
                }
              },
              {
                key: "getWidthWithMargins",
                value: function() {
                  return this.width
                    ? this.width - this.margin.left - this.margin.right
                    : 0;
                }
              },
              {
                key: "_updateScaleDomain",
                value: function() {
                  this.xScale = Object(y.scaleLinear)()
                    .domain([1, this._length + 1])
                    .range([0, this.getWidthWithMargins()]);
                }
              },
              {
                key: "_initZoom",
                value: function() {
                  this._zoom = Object(y.zoom)()
                    .scaleExtent([1, 1 / 0])
                    .translateExtent([[0, 0], [this.getWidthWithMargins(), 0]])
                    .on("zoom", this.zoomed);
                }
              },
              {
                key: "setFloatAttribute",
                value: function(t, e) {
                  var n = parseFloat(e);
                  this["_".concat(t)] = isNaN(n) ? e : n;
                }
              },
              {
                key: "attributeChangedCallback",
                value: function(t, e, n) {
                  if (("null" === n && (n = null), e !== n)) {
                    if (t.startsWith("highlight"))
                      return void this.trackHighlighter.changedCallBack(t, n);
                    this.setFloatAttribute(t, n),
                      "length" === t &&
                        (this._updateScaleDomain(),
                        (this._originXScale = this.xScale.copy())),
                      this.applyZoomTranslation();
                  }
                }
              },
              {
                key: "zoomed",
                value: function() {
                  if (
                    ((this.xScale = y.event.transform.rescaleX(
                      this._originXScale
                    )),
                    !this.dontDispatch)
                  ) {
                    var t = this.xScale.domain(),
                      e = r()(t, 2),
                      n = e[0],
                      i = e[1];
                    i--,
                      this.dispatchEvent(
                        new CustomEvent("change", {
                          detail: {
                            displaystart: Math.max(1, n),
                            displayend: Math.min(
                              this.length,
                              Math.max(i, n + 1)
                            )
                          },
                          bubbles: !0,
                          cancelable: !0
                        })
                      );
                  }
                }
              },
              {
                key: "applyZoomTranslation",
                value: function() {
                  if (this.svg && this._originXScale) {
                    var t = Math.max(
                        1,
                        this.length /
                          (1 + this._displayend - this._displaystart)
                      ),
                      e = -this._originXScale(this._displaystart);
                    (this.dontDispatch = !0),
                      this.svg.call(
                        this.zoom.transform,
                        y.zoomIdentity.scale(t).translate(e, 0)
                      ),
                      (this.dontDispatch = !1),
                      this.refresh();
                  }
                }
              },
              {
                key: "_onResize",
                value: function() {
                  (this.width = this.offsetWidth),
                    this._updateScaleDomain(),
                    (this._originXScale = this.xScale.copy()),
                    this.svg && this.svg.attr("width", this.width),
                    this._zoom
                      .scaleExtent([1, 1 / 0])
                      .translateExtent([
                        [0, 0],
                        [this.getWidthWithMargins(), 0]
                      ]),
                    this.applyZoomTranslation();
                }
              },
              {
                key: "_listenForResize",
                value: function() {
                  (this._ro = new E.a(this._onResize)), this._ro.observe(this);
                }
              },
              {
                key: "_resetEventHandler",
                value: function(t) {
                  t.target.closest(".feature") ||
                    this.dispatchEvent(this.createEvent("reset", null, !0));
                }
              },
              {
                key: "getXFromSeqPosition",
                value: function(t) {
                  return this.margin.left + this.xScale(t);
                }
              },
              {
                key: "getSingleBaseWidth",
                value: function() {
                  return this.xScale(2) - this.xScale(1);
                }
              },
              {
                key: "_getClickCoords",
                value: function() {
                  return y.event ? [y.event.pageX, y.event.pageY] : null;
                }
              },
              {
                key: "createEvent",
                value: function(t) {
                  var e =
                      arguments.length > 1 && void 0 !== arguments[1]
                        ? arguments[1]
                        : null,
                    n =
                      arguments.length > 2 &&
                      void 0 !== arguments[2] &&
                      arguments[2],
                    i = arguments.length > 3 ? arguments[3] : void 0,
                    r = arguments.length > 4 ? arguments[4] : void 0,
                    o = arguments.length > 5 ? arguments[5] : void 0,
                    s = {
                      eventtype: t,
                      coords: this._getClickCoords(),
                      feature: e,
                      target: o
                    };
                  return (
                    n &&
                      (e && e.fragments
                        ? (s.highlight = e.fragments
                            .map(function(t) {
                              return "".concat(t.start, ":").concat(t.end);
                            })
                            .join(","))
                        : (s.highlight =
                            i && r ? "".concat(i, ":").concat(r) : null)),
                    new CustomEvent("change", {
                      detail: s,
                      bubbles: !0,
                      cancelable: !0
                    })
                  );
                }
              },
              {
                key: "bindEvents",
                value: function(t, e) {
                  t.on("mouseover", function(t, n, i) {
                    e.dispatchEvent(
                      e.createEvent(
                        "mouseover",
                        t,
                        "onmouseover" === e._highlightEvent,
                        t.start,
                        t.end,
                        i[n]
                      )
                    );
                  })
                    .on("mouseout", function(t) {
                      e.dispatchEvent(
                        e.createEvent(
                          "mouseout",
                          null,
                          "onmouseover" === e._highlightEvent
                        )
                      );
                    })
                    .on("click", function(t, n, i) {
                      e.dispatchEvent(
                        e.createEvent(
                          "click",
                          t,
                          "onclick" === e._highlightEvent,
                          t.start,
                          t.end,
                          i[n]
                        )
                      );
                    });
                }
              },
              {
                key: "width",
                get: function() {
                  return this._width;
                },
                set: function(t) {
                  this._width = t;
                }
              },
              {
                key: "height",
                set: function(t) {
                  this._height = t;
                },
                get: function() {
                  return this._height;
                }
              },
              {
                key: "length",
                set: function(t) {
                  (this._length = t), (this.trackHighlighter.max = t);
                },
                get: function() {
                  return this._length;
                }
              },
              {
                key: "xScale",
                get: function() {
                  return this._xScale;
                },
                set: function(t) {
                  this._xScale = t;
                }
              },
              {
                key: "zoom",
                get: function() {
                  return this._zoom;
                }
              },
              {
                key: "svg",
                set: function(t) {
                  (this._svg = t),
                    t.call(this._zoom),
                    this.applyZoomTranslation();
                },
                get: function() {
                  return this._svg;
                }
              },
              {
                key: "isManaged",
                get: function() {
                  return !0;
                }
              },
              {
                key: "margin",
                get: function() {
                  return { top: 10, right: 10, bottom: 10, left: 10 };
                }
              },
              {
                key: "fixedHighlight",
                set: function(t) {
                  this.trackHighlighter.setFixedHighlight(t);
                }
              }
            ],
            [
              {
                key: "observedAttributes",
                get: function() {
                  return ["displaystart", "displayend", "length", "highlight"];
                }
              }
            ]
          ),
          e
        );
      })(_()(HTMLElement)),
      S = function() {
        customElements.define("protvista-zoomable", O);
      };
    window.customElements
      ? S()
      : document.addEventListener("WebComponentsReady", function() {
          S();
        });
    e.default = O;
  }
]);
//# sourceMappingURL=protvista-zoomable.js.map

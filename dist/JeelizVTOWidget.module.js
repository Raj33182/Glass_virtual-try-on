let JEELIZVTO = null;
let JEELIZVTOWIDGET = null;
var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.owns = function (na, pa) {
  return Object.prototype.hasOwnProperty.call(na, pa);
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.ISOLATE_POLYFILLS = !1;
$jscomp.defineProperty =
  $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties
    ? Object.defineProperty
    : function (na, pa, ya) {
        if (na == Array.prototype || na == Object.prototype) return na;
        na[pa] = ya.value;
        return na;
      };
$jscomp.getGlobal = function (na) {
  na = [
    "object" == typeof globalThis && globalThis,
    na,
    "object" == typeof window && window,
    "object" == typeof self && self,
    "object" == typeof global && global,
  ];
  for (var pa = 0; pa < na.length; ++pa) {
    var ya = na[pa];
    if (ya && ya.Math == Math) return ya;
  }
  throw Error("Cannot find global object");
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.IS_SYMBOL_NATIVE =
  "function" === typeof Symbol && "symbol" === typeof Symbol("x");
$jscomp.TRUST_ES6_POLYFILLS =
  !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
$jscomp.polyfills = {};
$jscomp.propertyToPolyfillSymbol = {};
$jscomp.POLYFILL_PREFIX = "$jscp$";
var $jscomp$lookupPolyfilledValue = function (na, pa) {
  var ya = $jscomp.propertyToPolyfillSymbol[pa];
  if (null == ya) return na[pa];
  ya = na[ya];
  return void 0 !== ya ? ya : na[pa];
};
$jscomp.polyfill = function (na, pa, ya, Ja) {
  pa &&
    ($jscomp.ISOLATE_POLYFILLS
      ? $jscomp.polyfillIsolated(na, pa, ya, Ja)
      : $jscomp.polyfillUnisolated(na, pa, ya, Ja));
};
$jscomp.polyfillUnisolated = function (na, pa, ya, Ja) {
  ya = $jscomp.global;
  na = na.split(".");
  for (Ja = 0; Ja < na.length - 1; Ja++) {
    var ua = na[Ja];
    if (!(ua in ya)) return;
    ya = ya[ua];
  }
  na = na[na.length - 1];
  Ja = ya[na];
  pa = pa(Ja);
  pa != Ja &&
    null != pa &&
    $jscomp.defineProperty(ya, na, {
      configurable: !0,
      writable: !0,
      value: pa,
    });
};
$jscomp.polyfillIsolated = function (na, pa, ya, Ja) {
  var ua = na.split(".");
  na = 1 === ua.length;
  Ja = ua[0];
  Ja = !na && Ja in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
  for (var zb = 0; zb < ua.length - 1; zb++) {
    var ma = ua[zb];
    if (!(ma in Ja)) return;
    Ja = Ja[ma];
  }
  ua = ua[ua.length - 1];
  ya = $jscomp.IS_SYMBOL_NATIVE && "es6" === ya ? Ja[ua] : null;
  pa = pa(ya);
  null != pa &&
    (na
      ? $jscomp.defineProperty($jscomp.polyfills, ua, {
          configurable: !0,
          writable: !0,
          value: pa,
        })
      : pa !== ya &&
        (($jscomp.propertyToPolyfillSymbol[ua] = $jscomp.IS_SYMBOL_NATIVE
          ? $jscomp.global.Symbol(ua)
          : $jscomp.POLYFILL_PREFIX + ua),
        (ua = $jscomp.propertyToPolyfillSymbol[ua]),
        $jscomp.defineProperty(Ja, ua, {
          configurable: !0,
          writable: !0,
          value: pa,
        })));
};
$jscomp.assign =
  $jscomp.TRUST_ES6_POLYFILLS && "function" == typeof Object.assign
    ? Object.assign
    : function (na, pa) {
        for (var ya = 1; ya < arguments.length; ya++) {
          var Ja = arguments[ya];
          if (Ja) for (var ua in Ja) $jscomp.owns(Ja, ua) && (na[ua] = Ja[ua]);
        }
        return na;
      };
$jscomp.polyfill(
  "Object.assign",
  function (na) {
    return na || $jscomp.assign;
  },
  "es6",
  "es3"
);
$jscomp.arrayIteratorImpl = function (na) {
  var pa = 0;
  return function () {
    return pa < na.length ? { done: !1, value: na[pa++] } : { done: !0 };
  };
};
$jscomp.arrayIterator = function (na) {
  return { next: $jscomp.arrayIteratorImpl(na) };
};
$jscomp.makeIterator = function (na) {
  var pa =
    "undefined" != typeof Symbol && Symbol.iterator && na[Symbol.iterator];
  return pa ? pa.call(na) : $jscomp.arrayIterator(na);
};
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.polyfill(
  "Promise",
  function (na) {
    function pa() {
      this.batch_ = null;
    }
    function ya(ma) {
      return ma instanceof ua
        ? ma
        : new ua(function (za, Ka) {
            za(ma);
          });
    }
    if (na && !$jscomp.FORCE_POLYFILL_PROMISE) return na;
    pa.prototype.asyncExecute = function (ma) {
      if (null == this.batch_) {
        this.batch_ = [];
        var za = this;
        this.asyncExecuteFunction(function () {
          za.executeBatch_();
        });
      }
      this.batch_.push(ma);
    };
    var Ja = $jscomp.global.setTimeout;
    pa.prototype.asyncExecuteFunction = function (ma) {
      Ja(ma, 0);
    };
    pa.prototype.executeBatch_ = function () {
      for (; this.batch_ && this.batch_.length; ) {
        var ma = this.batch_;
        this.batch_ = [];
        for (var za = 0; za < ma.length; ++za) {
          var Ka = ma[za];
          ma[za] = null;
          try {
            Ka();
          } catch (Ua) {
            this.asyncThrow_(Ua);
          }
        }
      }
      this.batch_ = null;
    };
    pa.prototype.asyncThrow_ = function (ma) {
      this.asyncExecuteFunction(function () {
        throw ma;
      });
    };
    var ua = function (ma) {
      this.state_ = 0;
      this.result_ = void 0;
      this.onSettledCallbacks_ = [];
      var za = this.createResolveAndReject_();
      try {
        ma(za.resolve, za.reject);
      } catch (Ka) {
        za.reject(Ka);
      }
    };
    ua.prototype.createResolveAndReject_ = function () {
      function ma(Ua) {
        return function (db) {
          Ka || ((Ka = !0), Ua.call(za, db));
        };
      }
      var za = this,
        Ka = !1;
      return { resolve: ma(this.resolveTo_), reject: ma(this.reject_) };
    };
    ua.prototype.resolveTo_ = function (ma) {
      if (ma === this)
        this.reject_(new TypeError("A Promise cannot resolve to itself"));
      else if (ma instanceof ua) this.settleSameAsPromise_(ma);
      else {
        a: switch (typeof ma) {
          case "object":
            var za = null != ma;
            break a;
          case "function":
            za = !0;
            break a;
          default:
            za = !1;
        }
        za ? this.resolveToNonPromiseObj_(ma) : this.fulfill_(ma);
      }
    };
    ua.prototype.resolveToNonPromiseObj_ = function (ma) {
      var za = void 0;
      try {
        za = ma.then;
      } catch (Ka) {
        this.reject_(Ka);
        return;
      }
      "function" == typeof za
        ? this.settleSameAsThenable_(za, ma)
        : this.fulfill_(ma);
    };
    ua.prototype.reject_ = function (ma) {
      this.settle_(2, ma);
    };
    ua.prototype.fulfill_ = function (ma) {
      this.settle_(1, ma);
    };
    ua.prototype.settle_ = function (ma, za) {
      if (0 != this.state_)
        throw Error(
          "Cannot settle(" +
            ma +
            ", " +
            za +
            "): Promise already settled in state" +
            this.state_
        );
      this.state_ = ma;
      this.result_ = za;
      this.executeOnSettledCallbacks_();
    };
    ua.prototype.executeOnSettledCallbacks_ = function () {
      if (null != this.onSettledCallbacks_) {
        for (var ma = 0; ma < this.onSettledCallbacks_.length; ++ma)
          zb.asyncExecute(this.onSettledCallbacks_[ma]);
        this.onSettledCallbacks_ = null;
      }
    };
    var zb = new pa();
    ua.prototype.settleSameAsPromise_ = function (ma) {
      var za = this.createResolveAndReject_();
      ma.callWhenSettled_(za.resolve, za.reject);
    };
    ua.prototype.settleSameAsThenable_ = function (ma, za) {
      var Ka = this.createResolveAndReject_();
      try {
        ma.call(za, Ka.resolve, Ka.reject);
      } catch (Ua) {
        Ka.reject(Ua);
      }
    };
    ua.prototype.then = function (ma, za) {
      function Ka(lb, ub) {
        return "function" == typeof lb
          ? function (Tb) {
              try {
                Ua(lb(Tb));
              } catch (Jb) {
                db(Jb);
              }
            }
          : ub;
      }
      var Ua,
        db,
        Gb = new ua(function (lb, ub) {
          Ua = lb;
          db = ub;
        });
      this.callWhenSettled_(Ka(ma, Ua), Ka(za, db));
      return Gb;
    };
    ua.prototype.catch = function (ma) {
      return this.then(void 0, ma);
    };
    ua.prototype.callWhenSettled_ = function (ma, za) {
      function Ka() {
        switch (Ua.state_) {
          case 1:
            ma(Ua.result_);
            break;
          case 2:
            za(Ua.result_);
            break;
          default:
            throw Error("Unexpected state: " + Ua.state_);
        }
      }
      var Ua = this;
      null == this.onSettledCallbacks_
        ? zb.asyncExecute(Ka)
        : this.onSettledCallbacks_.push(Ka);
    };
    ua.resolve = ya;
    ua.reject = function (ma) {
      return new ua(function (za, Ka) {
        Ka(ma);
      });
    };
    ua.race = function (ma) {
      return new ua(function (za, Ka) {
        for (
          var Ua = $jscomp.makeIterator(ma), db = Ua.next();
          !db.done;
          db = Ua.next()
        )
          ya(db.value).callWhenSettled_(za, Ka);
      });
    };
    ua.all = function (ma) {
      var za = $jscomp.makeIterator(ma),
        Ka = za.next();
      return Ka.done
        ? ya([])
        : new ua(function (Ua, db) {
            function Gb(Tb) {
              return function (Jb) {
                lb[Tb] = Jb;
                ub--;
                0 == ub && Ua(lb);
              };
            }
            var lb = [],
              ub = 0;
            do
              lb.push(void 0),
                ub++,
                ya(Ka.value).callWhenSettled_(Gb(lb.length - 1), db),
                (Ka = za.next());
            while (!Ka.done);
          });
    };
    return ua;
  },
  "es6",
  "es3"
);
$jscomp.polyfill(
  "Math.log2",
  function (na) {
    return na
      ? na
      : function (pa) {
          return Math.log(pa) / Math.LN2;
        };
  },
  "es6",
  "es3"
);
$jscomp.polyfill(
  "Promise.prototype.finally",
  function (na) {
    return na
      ? na
      : function (pa) {
          return this.then(
            function (ya) {
              return Promise.resolve(pa()).then(function () {
                return ya;
              });
            },
            function (ya) {
              return Promise.resolve(pa()).then(function () {
                throw ya;
              });
            }
          );
        };
  },
  "es9",
  "es3"
);
$jscomp.polyfill(
  "Math.sign",
  function (na) {
    return na
      ? na
      : function (pa) {
          pa = Number(pa);
          return 0 === pa || isNaN(pa) ? pa : 0 < pa ? 1 : -1;
        };
  },
  "es6",
  "es3"
);
var JeelizVTOWidget = (function () {
  function na() {
    Pa.mode = eb.realtime;
    Pa.isRT = !0;
    qa.adjust = document.getElementById("JeelizVTOWidgetAdjust");
    if (qa.adjust) {
      qa.adjustNotice = document.getElementById("JeelizVTOWidgetAdjustNotice");
      qa.adjustExit = document.getElementById("JeelizVTOWidgetAdjustExit");
      qa.changeModelContainer = document.getElementById(
        "JeelizVTOWidgetChangeModelContainer"
      );
      qa.buttonResizeCanvas = document.getElementById("buttonResizeCanvas");
      var W = qa.adjust;
      W && W.addEventListener("click", lb, !1);
      (W = qa.adjustExit) && W.addEventListener("click", ub, !1);
      [qa.adjust, qa.changeModelContainer, qa.buttonResizeCanvas].forEach(ya);
    }
    Kb.enabled && Ra.do_instantDetection(Kb.interval, Kb.callback);
    Ub && (Ub(!0), (Ub = null));
  }
  function pa() {
    var W = document.createElement("style");
    W.setAttribute("type", "text/css");
    W.innerHTML =
      "._jeelizVTOForceHide { display: none!important }._jeelizVTOForceShow { display: revert!important }";
    var wa = document.getElementsByTagName("head");
    1 <= wa.length ? wa[0].appendChild(W) : document.body.appendChild(W);
  }
  function ya(W) {
    W &&
      (W.classList.remove("_jeelizVTOForceHide"),
      "none" === window.getComputedStyle(W).display &&
        W.classList.add("_jeelizVTOForceShow"));
  }
  function Ja(W) {
    W &&
      (W.classList.add("_jeelizVTOForceHide"),
      W.classList.remove("_jeelizVTOForceShow"));
  }
  function ua(W, wa) {
    if (W) for (var La in wa) W.style[La] = wa[La];
  }
  function zb(W) {
    if (W) return W.clientWidth;
  }
  function ma(W) {
    if (W) return W.clientHeight;
  }
  function za(W) {
    return new Promise(function (wa, La) {
      var Fa = new XMLHttpRequest();
      Fa.open("GET", W, !0);
      Fa.onreadystatechange = function () {
        if (4 === Fa.readyState)
          if (200 === Fa.status || 0 === Fa.status)
            try {
              var gb = JSON.parse(Fa.responseText);
              wa(gb);
            } catch (Sa) {
              La("INVALID JSON");
            }
          else La("HTTP ERROR " + Fa.status);
      };
      Fa.send();
    });
  }
  function Ka(W) {
    Pa.isRT = !1;
    db(W || "NO_ERROR_LABEL");
  }
  function Ua() {
    db("INVALID_SKU");
  }
  function db(W) {
    rc.error ? rc.error(W) : console.log("ERROR:", W);
  }
  function Gb() {
    dc = zb(qa.container);
    ec = ma(qa.container);
    console.log(
      "INFO in JeelizVTOWidget.resize: _width =" +
        dc.toString() +
        " _height =" +
        ec.toString() +
        " oFactor = " +
        (1).toString()
    );
    fc = Math.round(1 * dc);
    gc = Math.round(1 * ec);
    ua(qa.cv, { width: dc.toString() + "px", height: ec.toString() + "px" });
    qa.cv.width = fc;
    qa.cv.height = gc;
    Ra &&
      (Pa.mode === eb.notLoaded
        ? Ra.set_size(fc, gc, !1)
        : Ra.resize(fc, gc, !1));
  }
  function lb() {
    [qa.adjust, qa.changeModelContainer, qa.buttonResizeCanvas].forEach(Ja);
    Pa.mode = eb.adjust;
    [qa.adjustNotice, qa.adjustExit].forEach(ya);
    qa.cv.style.cursor = "move";
    Ra.switch_modeInteractor("movePinch");
    hc("ADJUST_START");
  }
  function ub() {
    [qa.adjustNotice, qa.adjustExit].forEach(Ja);
    [qa.adjust, qa.changeModelContainer, qa.buttonResizeCanvas].forEach(ya);
    qa.cv.style.cursor = "auto";
    Pa.mode = Pa.realtime;
    Ra.switch_modeInteractor("idle");
    hc("ADJUST_END");
  }
  function Tb() {
    if (!qa.trackIframe) {
      var W = ic.appstaticURL + "jeewidget/";
      qa.trackIframe = document.createElement("iframe");
      qa.trackIframe.width = "10";
      qa.trackIframe.height = "10";
      qa.trackIframe.src = W + "trackIframe.html";
      ua(qa.trackIframe, {
        position: "absolute",
        zIndex: -1,
        bottom: "0px",
        right: "0px",
      });
      qa.container.appendChild(qa.trackIframe);
    }
  }
  function Jb(W, wa, La) {
    Ra.load_model(
      wa.mod + ".json",
      wa.mats,
      function () {
        Pa.mode = eb.realtime;
        La && La();
        pb.toggle_loading(!1);
        if (qa.trackIframe) {
          var Fa = location.href.split("?").shift().split("://").pop();
          Fa = Fa.split("/").shift();
          Fa = Fa.split("www.").pop();
          try {
            qa.trackIframe.contentWindow.postMessage(
              { action: "COUNTTRYONSESSION", domain: Fa, sku: W },
              "*"
            );
          } catch (gb) {}
        }
      },
      W
    );
  }
  function hc(W) {
    (W = Bc[W]) && W();
  }
  var Ra = (function () {
    function W(a, c) {
      return a[0] * (1 - c) + a[1] * c;
    }
    function wa(a, c) {
      var e = new XMLHttpRequest();
      e.open("GET", a, !0);
      e.withCredentials = !1;
      e.onreadystatechange = function () {
        4 !== e.readyState ||
          (200 !== e.status && 0 !== e.status) ||
          c(e.responseText);
      };
      e.send();
    }
    function La(a, c) {
      if (0 === c || "object" !== typeof a) return a;
      a = Object.assign({}, a);
      c = void 0 === c || -1 === c ? -1 : c - 1;
      for (var e in a) a[e] = La(a[e], c);
      return a;
    }
    function Fa(a) {
      return 0.5 > a ? 4 * a * a * a : (a - 1) * (2 * a - 2) * (2 * a - 2) + 1;
    }
    function gb(a) {
      switch (a) {
        case "relu":
          return "gl_FragColor=max(vec4(0.,0.,0.,0.),gl_FragColor);";
        case "elu":
          return "gl_FragColor=mix(exp(-abs(gl_FragColor))-vec4(1.,1.,1.,1.),gl_FragColor,step(0.,gl_FragColor));";
        case "elu01":
          return "gl_FragColor=mix(0.1*exp(-abs(gl_FragColor))-vec4(0.1,0.1,0.1,0.1),gl_FragColor,step(0.,gl_FragColor));";
        case "arctan":
          return "gl_FragColor=atan(3.14159265359*texture2D(u0,vUV))/3.14159265359;";
        case "copy":
          return "";
        default:
          return !1;
      }
    }
    function Sa(a, c) {
      var e = c % 8;
      return (a[(c - e) / 8] >> (7 - e)) & 1;
    }
    function Db(a, c, e) {
      var d = 1,
        n = 0;
      for (e = c + e - 1; e >= c; --e) (n += d * Sa(a, e)), (d *= 2);
      return n;
    }
    function Ca(a) {
      a =
        "undefined" === typeof btoa
          ? Buffer.from(a.data, "base64").toString("latin1")
          : atob(a.data);
      for (var c = a.length, e = new Uint8Array(c), d = 0; d < c; ++d)
        e[d] = a.charCodeAt(d);
      return e;
    }
    function $a(a) {
      var c = JSON.parse(a);
      a = c.nb;
      var e = c.n;
      c = Ca(c);
      for (var d = new Uint32Array(e), n = 0; n < e; ++n)
        d[n] = Db(c, n * a, a);
      return d;
    }
    function hb(a) {
      var c = JSON.parse(a);
      a = c.ne;
      var e = c.nf,
        d = c.n;
      c = Ca(c);
      for (
        var n = new Float32Array(d),
          k = new Float32Array(e),
          B = a + e + 1,
          l = 0;
        l < d;
        ++l
      ) {
        var u = B * l,
          p = 0 === Sa(c, u) ? 1 : -1,
          G = Db(c, u + 1, a);
        u = u + 1 + a;
        for (var H = k.length, E = 0, r = u; r < u + H; ++r)
          (k[E] = Sa(c, r)), ++E;
        for (H = u = 0; H < e; ++H) u += k[H] * Math.pow(2, -H - 1);
        n[l] =
          0 === u && 0 === G
            ? 0
            : p * (1 + u) * Math.pow(2, 1 + G - Math.pow(2, a - 1));
      }
      return n;
    }
    function Eb(a) {
      var c = null,
        e = null,
        d = null,
        n = 0;
      this.m = function (k) {
        this.Gn(k.wd);
        d.Jk({ Sf: k.Sf, Pf: k.Pf });
      };
      this.Cl = function (k) {
        return c[k];
      };
      this.Gn = function (k) {
        var B = null;
        n = k.length;
        c = k.map(function (l, u) {
          l = Object.assign({}, l, {
            index: u,
            parent: this,
            Id: B,
            jm: u === n - 1,
          });
          return (B = 0 === u ? Qc.instance(l) : Rc.instance(l));
        });
        e = c[0];
        d = c[n - 1];
        c.forEach(function (l, u) {
          0 !== u && l.Um();
        });
      };
      this.xa = function (k) {
        k.g(0);
        var B = k;
        c.forEach(function (l) {
          B = l.xa(B, !1);
        });
        return B;
      };
      this.Bl = function () {
        return e.L();
      };
      this.Ye = function () {
        return d.Fl();
      };
      this.wh = function () {
        return d.wh();
      };
      this.v = function () {
        c &&
          (c.forEach(function (k) {
            k.v();
          }),
          (d = e = c = null),
          (n = 0));
      };
      "undefined" !== typeof a && this.m(a);
    }
    function mb(a, c) {
      a[c] = !0;
      a.setAttribute(c, "true");
    }
    function Vb() {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }
    function Wb() {
      var a = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
      return a && a.length && 2 < a.length
        ? [parseInt(a[1], 10), parseInt(a[2], 10), parseInt(a[3] || 0, 10)]
        : [0, 0, 0];
    }
    function Lb() {
      var a = navigator.userAgent.toLowerCase();
      return -1 !== a.indexOf("safari") && -1 === a.indexOf("chrome") ? !0 : !1;
    }
    function Mb(a) {
      if (!a) return a;
      var c = null;
      if (a.video) {
        var e = function (d) {
          return d && "object" === typeof d ? Object.assign({}, d) : d;
        };
        c = {};
        "undefined" !== typeof a.video.width && (c.width = e(a.video.width));
        "undefined" !== typeof a.video.height && (c.height = e(a.video.height));
        "undefined" !== typeof a.video.facingMode &&
          (c.facingMode = e(a.video.facingMode));
      }
      c = { audio: a.audio, video: c };
      "undefined" !== typeof a.deviceId && Xb(c, a.deviceId);
      return c;
    }
    function Xb(a, c) {
      c &&
        ((a.video = a.video || {}),
        (a.video.deviceId = { exact: c }),
        a.video.facingMode && delete a.video.facingMode);
    }
    function Yb(a) {
      var c = a.video.width;
      a.video.width = a.video.height;
      a.video.height = c;
      return a;
    }
    function jc(a) {
      function c(E) {
        return [
          480, 576, 640, 648, 720, 768, 800, 960, 1080, 1152, 1280, 1366, 1920,
        ].sort(function (r, C) {
          return Math.abs(r - E) - Math.abs(C - E);
        });
      }
      function e(E) {
        var r = Mb(a);
        E = E(r);
        n.push(E);
        d(E);
      }
      function d(E) {
        if (E.video && E.video.facingMode && E.video.facingMode.exact) {
          var r = E.video.facingMode.exact;
          E = Mb(E);
          delete E.video.facingMode.exact;
          E.video.facingMode.ideal = r;
          n.push(E);
        }
      }
      var n = [];
      if (!a || !a.video) return n;
      d(a);
      if (a.video.width && a.video.height) {
        if (a.video.width.ideal && a.video.height.ideal) {
          var k = c(a.video.width.ideal).slice(0, 3),
            B = c(a.video.height.ideal).slice(0, 3),
            l = {},
            u = 0;
          for (l.eb = void 0; u < k.length; l = { eb: l.eb }, ++u) {
            l.eb = k[u];
            var p = {},
              G = 0;
            for (p.cb = void 0; G < B.length; p = { cb: p.cb }, ++G)
              if (
                ((p.cb = B[G]),
                l.eb !== a.video.width.ideal || p.cb !== a.video.height.ideal)
              ) {
                var H = Math.max(l.eb, p.cb) / Math.min(l.eb, p.cb);
                H < 4 / 3 - 0.1 ||
                  H > 16 / 9 + 0.1 ||
                  e(
                    (function (E, r) {
                      return function (C) {
                        C.video.width.ideal = E.eb;
                        C.video.height.ideal = r.cb;
                        return C;
                      };
                    })(l, p)
                  );
              }
          }
        }
        e(function (E) {
          return Yb(E);
        });
      }
      a.video.width &&
        a.video.height &&
        (a.video.width.ideal &&
          a.video.height.ideal &&
          e(function (E) {
            delete E.video.width.ideal;
            delete E.video.height.ideal;
            return E;
          }),
        e(function (E) {
          delete E.video.width;
          delete E.video.height;
          return E;
        }));
      a.video.facingMode &&
        (e(function (E) {
          delete E.video.facingMode;
          return E;
        }),
        a.video.width &&
          a.video.height &&
          e(function (E) {
            Yb(E);
            delete E.video.facingMode;
            return E;
          }));
      n.push({ audio: a.audio, video: !0 });
      return n;
    }
    function sc(a) {
      try {
        var c = window.matchMedia("(orientation: portrait)").matches ? !0 : !1;
      } catch (d) {
        c = window.innerHeight > window.innerWidth;
      }
      if (c && a && a.video) {
        c = a.video.width;
        var e = a.video.height;
        c &&
          e &&
          c.ideal &&
          e.ideal &&
          c.ideal > e.ideal &&
          ((a.video.height = c), (a.video.width = e));
      }
    }
    function Hb(a) {
      a.volume = 0;
      mb(a, "muted");
      if (Lb()) {
        if (1 === a.volume) {
          var c = function () {
            a.volume = 0;
            window.removeEventListener("mousemove", c, !1);
            window.removeEventListener("touchstart", c, !1);
          };
          window.addEventListener("mousemove", c, !1);
          window.addEventListener("touchstart", c, !1);
        }
        setTimeout(function () {
          a.volume = 0;
          mb(a, "muted");
        }, 5);
      }
    }
    function Zb(a) {
      var c = Aa.element,
        e = Aa.$g;
      return null === c
        ? Promise.resolve()
        : new Promise(function (d, n) {
            if (c.srcObject && c.srcObject.getVideoTracks) {
              var k = c.srcObject.getVideoTracks();
              1 !== k.length
                ? n("INVALID_TRACKNUMBER")
                : ((k = k[0]), a ? $b(c, d, n, e) : (k.stop(), d()));
            } else n("BAD_IMPLEMENTATION");
          });
    }
    function ac(a, c, e, d) {
      function n(B) {
        k || ((k = !0), e(B));
      }
      var k = !1;
      navigator.mediaDevices
        .getUserMedia(d)
        .then(function (B) {
          function l() {
            setTimeout(function () {
              if (a.currentTime) {
                var p = a.videoWidth,
                  G = a.videoHeight;
                if (0 === p || 0 === G) n("VIDEO_NULLSIZE");
                else {
                  p && (a.style.width = p.toString() + "px");
                  G && (a.style.height = G.toString() + "px");
                  var H = { Fk: null, kg: null, Fm: null };
                  try {
                    var E = B.getVideoTracks()[0];
                    E &&
                      ((H.Fm = E),
                      (H.Fk = E.getCapabilities()),
                      (H.kg = E.getSettings()));
                  } catch (r) {}
                  Lb() || Vb()
                    ? a.parentNode && null !== a.parentNode
                      ? (k || c(a, B, H),
                        setTimeout(function () {
                          a.play();
                        }, 100))
                      : (document.body.appendChild(a),
                        Hb(a),
                        setTimeout(function () {
                          a.style.transform = "scale(0.0001,0.0001)";
                          a.style.position = "fixed";
                          a.style.bottom = "0px";
                          a.style.right = "0px";
                          Hb(a);
                          setTimeout(function () {
                            a.play();
                            k || c(a, B, H);
                          }, 100);
                        }, 80))
                    : k || c(a, B, H);
                }
              } else n("VIDEO_NOTSTARTED");
            }, 700);
          }
          function u() {
            a.removeEventListener("loadeddata", u, !1);
            var p = a.play();
            Hb(a);
            "undefined" === typeof p
              ? l()
              : p
                  .then(function () {
                    l();
                  })
                  .catch(function () {
                    n("VIDEO_PLAYPROMISEREJECTED");
                  });
          }
          "undefined" !== typeof a.srcObject
            ? (a.srcObject = B)
            : ((a.src = window.URL.createObjectURL(B)), (a.videoStream = B));
          Hb(a);
          a.addEventListener("loadeddata", u, !1);
        })
        .catch(function (B) {
          n(B);
        });
    }
    function $b(a, c, e, d) {
      if (a)
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          if (d && d.video) {
            if (Vb()) {
              var n = Wb();
              0 !== n[0] && (12 > n[0] || (12 === n[0] && 2 > n[1])) && sc(d);
            }
            d.video.width &&
              d.video.width.ideal &&
              (a.style.width = d.video.width.ideal + "px");
            d.video.height &&
              d.video.height.ideal &&
              (a.style.height = d.video.height.ideal + "px");
          }
          mb(a, "autoplay");
          mb(a, "playsinline");
          d && d.audio ? (a.volume = 0) : mb(a, "muted");
          ac(
            a,
            c,
            function () {
              function k(l) {
                if (0 === l.length) e("INVALID_FALLBACKCONSTRAINTS");
                else {
                  var u = l.shift();
                  ac(
                    a,
                    c,
                    function () {
                      k(l);
                    },
                    u
                  );
                }
              }
              var B = jc(d);
              k(B);
            },
            d
          );
        } else e && e("MEDIASTREAMAPI_NOTFOUND");
      else e && e("VIDEO_NOTPROVIDED");
    }
    function Sc(a) {
      navigator.mediaDevices && navigator.mediaDevices.enumerateDevices
        ? navigator.mediaDevices
            .enumerateDevices()
            .then(function (c) {
              (c = c.filter(function (e) {
                return (
                  e.kind &&
                  -1 !== e.kind.toLowerCase().indexOf("video") &&
                  e.label &&
                  e.deviceId
                );
              })) &&
              c.length &&
              0 < c.length
                ? a(c, !1)
                : a(!1, "NODEVICESFOUND");
            })
            .catch(function () {
              a(!1, "PROMISEREJECTED");
            })
        : a(!1, "NOTSUPPORTED");
    }
    function Tc() {
      function a() {
        var A = kc.Qe;
        Nb = A * N.width;
        Ob = A * N.height;
      }
      function c() {
        ++w;
        2 === w &&
          (p(),
          r(),
          C(),
          Ea.ij(),
          e(),
          R.Pc.forEach(function (A) {
            A();
          }),
          R.Pc.splice(0),
          T.model && !R.isBusy && Ea.ei(T.model));
      }
      function e() {
        R.load_model = function (A, Q, fa) {
          if (R.isBusy) return !1;
          R.isBusy = !0;
          if (T.model)
            R.set_model(
              A,
              function () {
                R.set_materials(Q, function () {
                  R.isBusy = !1;
                  fa && fa();
                });
              },
              function () {
                R.isBusy = !1;
              }
            );
          else {
            var ia = N.aa + N.va + N.Hf + "/",
              Ha = Q.map(function (fb) {
                return ia + fb;
              });
            T.model = {
              url: N.aa + N.va + N.Lf + "/" + A,
              Cc: Ha,
              zb: !1,
              yb: !1,
            };
            Ea.ei(T.model, function () {
              R.isBusy = !1;
              fa && fa();
            });
          }
          return !0;
        };
        R.set_offset = function (A) {
          t = A;
          Ea.Zd();
        };
        R.set_scale = function (A) {
          M = A;
          Ea.$d();
        };
        R.set_rx = function (A) {
          I = A;
          Ea.uj();
        };
        R.switch_shadow = sa.pg;
        R.switch_bgBlur = sa.og;
        R.set_zoom = sa.cg;
        R.is_viewer3D = function () {
          return aa === X.Da;
        };
        R.switch_viewer3D = function (A, Q) {
          if (
            aa === X.ec ||
            aa === X.fc ||
            (aa === X.W && !A) ||
            (aa === X.Da && A) ||
            ka
          )
            return !1;
          if (aa === X.za)
            return Ma !== X.Da || A
              ? Ma === X.W && A
                ? ((Ma = X.Da), sa.ta(U.ub), sa.Wa(1), Q && Q(), !0)
                : !1
              : ((Ma = X.W), sa.ta(U.ab), sa.Wa(0), Q && Q(), !0);
          var fa = 0,
            ia = -1,
            Ha = 0;
          aa === X.W
            ? ((aa = X.ec), (ia = N.Co))
            : aa === X.Da && ((aa = X.fc), (ia = N.Fo));
          var fb = tc.Ve();
          oa = setInterval(function () {
            var vb = tc.Ve();
            fa += (vb - fb) / ia;
            1 <= fa &&
              ((fa = 1),
              aa === X.ec
                ? ((aa = X.Da), sa.ta(U.ub))
                : ((aa = X.W), sa.ta(U.ab)),
              Q && Q(),
              clearInterval(oa),
              (oa = null));
            var wb = aa === X.fc || aa === X.W ? 1 - N.Ao(fa) : N.zo(fa);
            sa.Wa(wb);
            (aa !== X.fc && aa !== X.ec) ||
              0 !== Ha++ % 2 ||
              (sa.ta(U.Kf), U.Kf.Nn(wb));
            fb = vb;
          }, 0.016);
          return !0;
        };
        R.capture_image = function (A, Q, fa, ia) {
          la = A;
          ka = !0;
          "undefined" === typeof isAllocate && (fa = !1);
          (ia = "undefined" === typeof ia ? !1 : ia) && sa.Sd(!1);
          u();
          Ba = function () {
            sa.Ei(0);
            b.flush();
            var Ha = ab.yh(fa);
            Q(Ha);
            ia && sa.Sd(!0);
          };
        };
        R.capture_detection = function (A, Q) {
          la = A;
          ka = !0;
          var fa = null === K.vb ? K.tb : K.Mc;
          Ba = function () {
            var ia = Cc.instance({
              Ee: P.Kc.clone(),
              ki: bb.Dh(),
              ji: bb.Bh(),
              background: fa.clone(),
              Ta: ta.fb.Ql().clone(),
              Gf: Xa,
            });
            Q(ia);
          };
        };
        R.process_offlineRendering = function (A, Q, fa, ia, Ha) {
          function fb() {
            if (2 === ++vb) {
              V.Ta || (V.Ta = bc.instance({}));
              A.Ah() && (V.Ta.Xi(A.Ah()), sa.ta(V.Ta));
              V.Ie.set();
              d();
              V.Ie = !1;
              Ea.ln(
                ia
                  ? function () {
                      ab.kb().parentNode.removeChild(R.wb);
                    }
                  : !1
              );
              var wb = ab.yh(!1);
              setTimeout(function () {
                Ha(wb);
              }, 1);
            }
          }
          Ea.on();
          ia &&
            (R.Kj.drawImage(ab.kb(), 0, 0),
            ab.kb().parentNode.insertBefore(R.wb, ab.kb()),
            R.wb.setAttribute("class", "jeefitMask"));
          V.Ie = A;
          var vb = 0;
          R.set_model(Q, function () {
            fb();
            R.set_materials(fa, function () {
              setTimeout(fb, 1);
            });
          });
        };
        R.serialize_detection = function (A) {
          return A.Fc();
        };
        R.unserialize_detection = function (A, Q, fa) {
          return Cc.Lc(A, Q, fa);
        };
        R.do_instantDetection = function (A, Q) {
          Dc.m(P.Kc);
          Dc.start(A, Q);
        };
        R.relieve_DOM = function (A, Q) {
          if (q.Pb) return !1;
          k(Q || 160);
          D = !1;
          v && clearTimeout(v);
          v = setTimeout(function () {
            k(N.ma);
            v = !1;
            l();
          }, A);
          return !0;
        };
        R.switch_slow = function (A, Q) {
          if (q.Pb) return !1;
          "undefined" === typeof Q && (Q = N.Rj);
          v && (k(N.ma), l(), clearTimeout(v), (v = !1));
          A ? (D = !1) : l();
          k(A ? Q : N.ma);
          return !0;
        };
        R.switch_deepSleep = function (A) {
          if (Da === A) return !1;
          Da = !1;
          R.switch_sleep(A);
          Da = A;
          return !0;
        };
        R.switch_sleep = function (A, Q) {
          function fa() {
            R.isBusy = !1;
            A ? ((Ma = aa), (aa = X.za)) : ((aa = Ma), d());
          }
          if (q.Pb || Da || R.isBusy) return Q ? Promise.reject() : null;
          if ((A && aa === X.za) || (!A && aa !== X.za))
            return Q ? Promise.resolve(!1) : !1;
          oa && (clearInterval(oa), (oa = null));
          aa === X.fc
            ? ((aa = X.W), sa.ta(U.ab), sa.Wa(0))
            : aa === X.ec && ((aa = X.Da), sa.ta(U.ub), sa.Wa(1));
          xb.stop();
          var ia = null;
          R.isBusy = !0;
          Q ? (ia = Zb(!A).then(fa)) : fa();
          return Q ? ia : !0;
        };
        R.set_modelStandalone = function (A, Q) {
          sa.Td(!1);
          uc.instance({
            url: A.model,
            Cc: A.materials,
            zb: !1,
            yb: !1,
            R: function (fa) {
              ib = [0, 0, 0];
              nb = 1;
              qb = f = g = 0;
              rb = N.Ac;
              R.ready && Ea.ae();
              Q && Q();
              n(fa);
              Ea.mg();
              sa.Td(!0);
            },
          });
        };
        R.start_rendering = Ea.mg;
        R.update_material = function (A, Q) {
          bb && bb.no(A, Q);
        };
        R.set_model = function (A, Q, fa) {
          bb &&
            bb.replace(
              "http" === A.substring(0, 4).toLowerCase()
                ? A
                : N.aa + N.va + N.Lf + "/" + A,
              function () {
                Q && Q(bb.Ik());
              },
              fa
            );
        };
        R.set_tweaker = function (A, Q) {
          function fa(ia) {
            R.Og(ia);
            Q && Q();
          }
          "string" === typeof A ? wa(N.aa + N.va + N.fo + "/" + A, fa) : fa(A);
        };
        R.Og = function (A) {
          A &&
            (A.preOffset && (ib = A.preOffset),
            A.preScale && (nb = A.preScale),
            A.rx && (g = A.rx),
            A.beginBendZ && (f = A.beginBendZ),
            A.bendStrength && (qb = A.bendStrength),
            A.maskBranchStartEnd && (rb = A.maskBranchStartEnd),
            R.ready && Ea.ae());
        };
        R.set_materials = function (A, Q) {
          if (bb) {
            var fa = N.aa + N.va + N.Hf + "/";
            A = A.map(function (ia) {
              var Ha = ia;
              "string" === typeof ia &&
                ((Ha = fa + ia), (Ha = Ha.replace(/([^:])\/\//, "$1/")));
              return Ha;
            });
            bb.dg(A, Q);
          }
        };
      }
      function d() {
        Ab.reset();
        xb.stop();
        B(0);
      }
      function n(A) {
        bb && (sa.gn(bb), bb.remove());
        sa.Nj(A);
        bb = A;
      }
      function k(A) {
        O = A;
        xb.update({ ma: O });
      }
      function B(A) {
        ea = -1;
        ka
          ? (ea = la)
          : V.isEnabled
          ? (ea = V.ni)
          : D
          ? (u(), (ea = aa === X.W ? Ab.T() : 1))
          : ((ea = N.Nc[0]), u());
        va.fa();
        for (var Q = 0; Q < ea; ++Q)
          ca.set("s55"),
            K.qf.M(),
            K.tb.g(0),
            P.Dc.g(1),
            Y.l(!1, !1),
            m.xa(K.qf);
        ka
          ? (Ba(), (ka = !1), b.flush(), xb.Yf(B))
          : (sa.animate(A),
            K.Vf &&
              ba - U.bi > U.jj &&
              N.Tb &&
              aa === X.W &&
              (va.fa(),
              (U.bi = ba),
              U.Fd.M(),
              ca.set("s63"),
              K.Vf.g(0),
              Y.l(!1, !1),
              ta.fb.wj(Aa.ka, U.Fd, U.Rd),
              va.$()),
            V.isEnabled ||
              (D &&
                (Ab.nj(),
                (Q = Ab.xh(1)),
                (S = W(N.Pj, Q)),
                N.Tb &&
                  aa === X.W &&
                  ((U.jj = W(N.di, Q)),
                  (U.Rd = W(N.xm, Q)),
                  (U.Rd = Math.min(U.Rd, 0.5)))),
              (ba = A),
              aa !== X.za && xb.Yf(B)));
      }
      function l() {
        ba = tc.Ve();
        D = !0;
      }
      function u() {
        var A = Aa.element.currentTime - Na;
        0 > A && (Na = Aa.element.currentTime);
        1e3 * A < N.uo ||
          (Aa.ka.refresh(),
          (Na += A),
          (Aa.ed = A),
          (ja = !0),
          va.fa(),
          ca.set("s0"),
          P.Bi.M(),
          P.Dc.tk(0),
          Y.l(!1, !0),
          ca.set("s53"),
          K.tb.M(),
          Aa.ka.g(0),
          Y.l(!1, !1),
          null !== K.vb &&
            (ca.set("s54"), K.Mc.o(), K.tb.g(0), K.vb.g(1), Y.l(!1, !1)));
      }
      function p() {
        K.yj = Z.instance({
          isPot: !0,
          isLinear: !0,
          isFloat: !1,
          url: N.aa + N.va + N.vo,
        });
        var A = { isPot: !1, isLinear: !0, isFloat: !1, width: Nb, height: Ob };
        K.tb = Z.instance(A);
        K.Mc = Z.instance(A);
        q.kj.push(K.tb, K.Mc);
        K.qf = Z.instance({ isPot: !0, isFloat: !1, width: m.Bl() });
        N.yd &&
          (ha = Z.instance({
            isPot: !1,
            isFloat: !1,
            isLinear: !0,
            url: (N.Ff || -1 !== N.Ef.indexOf("//") ? "" : N.aa + N.va) + N.Ef,
          }));
      }
      function G() {
        function A() {
          return {
            width: 3,
            height: 1,
            isFloat: !0,
            isPot: !1,
            array: new Float32Array([0, 0.5, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
          };
        }
        var Q = {
          width: 3,
          height: 1,
          isFloat: !0,
          isPot: !1,
          array: new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
        };
        P.Dc = Ec.instance(A());
        P.Bi = Z.instance(A());
        P.Kc = Z.instance(A());
        P.Ed = Ec.instance(A());
        P.Ke = Z.instance(Q);
        Q = {
          width: 2,
          height: 1,
          isFloat: !0,
          isPot: !1,
          array: new Float32Array([0, 0, 0, 0, 0, 0, 0, 0]),
        };
        P.Dg = Z.instance(Q);
        P.ce = Z.instance(Q);
        U.Fd = Z.instance({
          width: 1,
          height: 1,
          isFloat: !0,
          isPot: !1,
          array: new Float32Array([0, 0, 0, 0]),
        });
      }
      function H(A) {
        K.Vf = A;
        if (ja) {
          ja = !1;
          ca.set("s61");
          P.Dg.M();
          P.ce.g(2);
          var Q = W(N.vk, Ab.xh(0.5));
          ca.G("u61", Q);
          P.Bi.g(1);
          ca.G("u62", 1e3 * Aa.ed);
          Y.l(!1, !1);
          ca.set("s62");
          P.ce.o();
          P.Dg.g(0);
          Y.l(!1, !1);
        }
        A.g(0);
        P.Dc.Ti(1);
        b.viewport(0, 0, 1, 1);
        ca.set("s56");
        ca.ig("u43", Fc.get(0));
        Y.l(!1, !1);
        ca.set("s57");
        b.viewport(1, 0, 2, 1);
        Y.l(!1, !1);
        P.Ke.M();
        ca.set("s58");
        ca.N("u54", N.qe[0] * S, N.qe[1]);
        P.Dc.g(0);
        P.Ed.g(1);
        Y.l(!1, !1);
        ca.set("s59");
        P.Ed.Ti(1);
        P.Ke.g(0);
        P.ce.g(2);
        P.Dc.g(3);
        Y.l(!1, !1);
        ca.set("s60");
        P.Ed.g(0);
        P.Kc.o();
        Y.l(!1, !1);
      }
      function E() {
        var A = N.aa,
          Q = N.je.split("://").shift();
        if ("http" === Q || "https" === Q) A = "";
        A += N.je;
        "json" !== A.split(".").pop() && (A += N.neuralNetworkPath);
        wa(A, function (fa) {
          fa = JSON.parse(fa);
          if (fa.exportData) {
            var ia = fa.exportData;
            L.Ua = L.Ua || ia.rotationEulerAnglesFactors;
            L.sc = L.sc || ia.deformScaleXFactor;
            L.ra = L.ra || ia.translationScalingFactors;
          }
          m = new Eb({ wd: fa.layers, Sf: "gpuRawAvg", Pf: H });
          c();
        });
      }
      function r() {
        a();
        y.Eb[0] = 1;
        y.Eb[1] = Nb / Ob;
        Fc.m({
          Dd: N.scanOverlapFactors,
          mi: N.scanNScaleLevels,
          ua: Nb,
          jf: Ob,
          Ki: N.scanScale0Factor,
          ra: L.ra,
          Li: !0,
        });
        ra =
          N.width > N.height
            ? [N.width / N.height, 1]
            : [1, N.height / N.width];
        q.Ha = !0;
      }
      function C() {
        ca.j("s55", [
          { type: "1i", name: "u1", value: 0 },
          { type: "1i", name: "u39", value: 1 },
          { type: "2f", name: "u40", value: y.Eb },
          { type: "1f", name: "u41", value: L.sc },
        ]);
        ca.j("s56", [
          { type: "1i", name: "u42", value: 0 },
          { type: "1i", name: "u39", value: 1 },
          { type: "1f", name: "u47", value: N.co },
          { type: "1f", name: "u48", value: N.Rk },
          {
            type: "3f",
            name: "u44",
            value: [L.ra[0] * y.Eb[0], L.ra[1] * y.Eb[1], L.ra[2]],
          },
          {
            type: "3f",
            name: "u45",
            value: [N.hc[0][0], N.hc[1][0], N.hc[2][0]],
          },
          {
            type: "3f",
            name: "u46",
            value: [N.hc[0][1], N.hc[1][1], N.hc[2][1]],
          },
        ]);
        ca.j("s57", [
          { type: "1i", name: "u42", value: 0 },
          { type: "1i", name: "u39", value: 1 },
          { type: "2f", name: "u51", value: N.Xm },
          { type: "3f", name: "u49", value: L.Ua },
          { type: "3f", name: "u50", value: N.mj },
          { type: "1f", name: "u52", value: N.ol },
        ]);
        ca.j("s58", [
          { type: "1i", name: "u39", value: 0 },
          { type: "1i", name: "u53", value: 1 },
          { type: "2f", name: "u54", value: N.qe },
          { type: "1f", name: "u55", value: N.mn },
          { type: "1f", name: "u56", value: N.Wm },
        ]);
        ca.j("s59", [
          { type: "1i", name: "u53", value: 1 },
          { type: "1i", name: "u57", value: 0 },
          { type: "1i", name: "u58", value: 2 },
          { type: "1i", name: "u59", value: 3 },
        ]);
        ca.j("s60", [
          { type: "1i", name: "u39", value: 0 },
          { type: "1f", name: "u60", value: N.pn },
        ]);
        ca.j("s61", [
          { type: "1i", name: "u42", value: 0 },
          { type: "1i", name: "u39", value: 1 },
          { type: "1i", name: "u58", value: 2 },
          { type: "3f", name: "u49", value: L.Ua },
          { type: "3f", name: "u50", value: N.mj },
        ]);
        ca.j("s62", [
          { type: "1i", name: "u58", value: 0 },
          { type: "2f", name: "u64", value: N.eo },
          { type: "2f", name: "u65", value: N.nn },
        ]);
        ca.j("s63", [{ type: "1i", name: "u42", value: 0 }]);
        ca.j("s54", [
          { type: "1i", name: "u1", value: 0 },
          { type: "1i", name: "u66", value: 1 },
        ]);
      }
      var g,
        f,
        y = { Eb: [-1, -1] },
        J = null,
        x = [0.5, 0, 0, 0.5],
        q = { $a: null, Pb: !1, Ha: !1, kj: [] },
        h = [0, N.Hd[1], N.Hd[2]],
        L = { Ua: [-N.Ua[0], -N.Ua[1], N.Ua[2]], sc: N.sc, ra: N.ra },
        O = N.ma,
        v = null,
        m = null;
      a();
      var t = [0, 0, 0],
        M = 1,
        I = 0,
        K = { tb: null, Mc: null, qf: null, yj: null, Vf: null, vb: null },
        P = {
          raw: null,
          Lp: null,
          Kc: null,
          Ed: null,
          Ke: null,
          Dg: null,
          ce: null,
        },
        ba = 0,
        ja = !1,
        U = {
          ab: null,
          ub: null,
          Kf: null,
          bi: 0,
          jj: N.di[1],
          Rd: 0.1,
          Fd: null,
        },
        w = 0,
        z = !1,
        D = !0,
        S = 1,
        ea = -1,
        X = { za: -1, W: 0, Da: 1, ec: 2, fc: 3 },
        aa = X.W,
        oa = null,
        Ma = X.W,
        Da = !1,
        ka = !1,
        la = 1,
        Ba = !1,
        V = { isEnabled: !1, Ie: null, Ta: null, ni: 0 },
        ha = null,
        ra = -1,
        Ga = !1,
        Ia = !1,
        sb = !1,
        Wa = [0, 0, 0],
        Ta = 1,
        Va,
        jb,
        lc,
        ib = [0, 0, 0],
        nb = 1,
        qb = (f = g = 0),
        rb = N.Ac,
        Fb = [0, 0, 0],
        Xa = { scale: 1, offsetX: 0, offsetY: 0 },
        Na = 0,
        Ea = {
          m: function () {
            ca.pe([
              {
                id: "s53",
                name: "_",
                s: "attribute vec2 a0;uniform mat2 u38;varying vec2 vv0;void main(){gl_Position=vec4(a0,0.,1.),vv0=vec2(.5,.5)+u38*a0;}",
                I: ["a0"],
                P: [2],
                h: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
                i: ["u1", "u38"],
                precision: "lowp",
              },
              {
                id: "s55",
                name: "_",
                h: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
                s: "attribute vec2 a0;uniform sampler2D u39;uniform vec2 u40;uniform float u41;const vec2 f=vec2(.16,.5),g=vec2(.5,.5),h=vec2(.84,.5),p=vec2(.5,.5);varying vec2 vv0;void main(){vec4 a=texture2D(u39,f);vec2 j=a.gb,b=a.a*u40;vec4 k=texture2D(u39,g);float l=k.y;vec2 m=vec2(mix(1.,1./cos(l),u41),1.);b*=m;vec2 n=a0*.5;float c=texture2D(u39,h).r,d=cos(c),e=sin(c);vec2 o=mat2(d,e,-e,d)*n;vv0=j+o*b,gl_Position=vec4(a0,0.,1.);}",
                I: ["a0"],
                P: [2],
                i: ["u1", "u39", "u40", "u41"],
                precision: "lowp",
              },
              {
                id: "s56",
                name: "_",
                s: "attribute vec2 a0;void main(){gl_Position=vec4(a0,0.,1.);}",
                h: "uniform sampler2D u42,u39;uniform vec3 u43,u44,u45,u46;uniform float u47,u48;const vec4 e=vec4(.25,.25,.25,.25);const vec2 f=vec2(.16,.5),g=vec2(.5,.5),h=vec2(.83,.5);const vec3 i=vec3(1.,1.,1.);void main(){vec4 j=texture2D(u42,vec2(.625,.625)),k=texture2D(u42,vec2(.875,.625));float l=dot(j-k,e);bool m=l>u48;vec4 a=texture2D(u39,f);m?a.r=2.:a.r>u47?a.r=0.:a.r>1.9?a.r+=1.:0.;if(a.r<.9)a=vec4(1.,u43);else{float n=dot(e,texture2D(u42,vec2(.875,.875))),o=dot(e,texture2D(u42,vec2(.125,.625))),p=dot(e,texture2D(u42,vec2(.375,.625))),b=texture2D(u39,h).r,c=cos(b),d=sin(b);vec2 q=mat2(c,d,-d,c)*vec2(n,o);float r=texture2D(u39,g).a;vec3 s=mix(u45,u46,r*i);a.r*=step(1.9,a.r),a.gba+=vec3(q,p)*u44*s*a.a;}gl_FragColor=a;}",
                i: "u42 u39 u43 u47 u44 u48 u45 u46".split(" "),
              },
              {
                id: "s57",
                name: "_",
                h: "uniform sampler2D u42,u39;uniform vec3 u49,u50;uniform vec2 u51;uniform float u52;const vec4 v=vec4(1.,1.,1.,1.),f=vec4(0.,0.,0.,0.),e=vec4(.25,.25,.25,.25);const vec2 g=vec2(.16,.5),h=vec2(.5,.5),i=vec2(.84,.5);varying vec2 vv0;void main(){float k=step(vv0.x,.5);vec4 l=texture2D(u39,g);if(l.r<1.9){gl_FragColor=f;return;}float m=dot(texture2D(u42,vec2(.125,.125)),e),a=smoothstep(u51.x,u51.y,m);vec4 n=texture2D(u39,h);float o=n.a;a=mix(a,o,.3);float p=dot(e,texture2D(u42,vec2(.125,.875))),q=dot(e,texture2D(u42,vec2(.375,.875))),r=dot(e,texture2D(u42,vec2(.625,.875)));vec3 s=vec3(p,q,r),b=u50+s*u49;float c=texture2D(u39,i).r,d=b.z*u52;c+=d,b.z-=d;vec4 t=vec4(b,a),u=vec4(c,0.,0.,0.);gl_FragColor=mix(u,t,k);}",
                i: "u42 u39 u51 u49 u50 u52".split(" "),
              },
              {
                id: "s58",
                name: "_",
                h: "uniform sampler2D u39,u53;uniform vec2 u54;uniform float u55,u56;const vec4 f=vec4(1.,1.,1.,1.),h=vec4(1.,0.,0.,0.),i=vec4(0.,0.,0.,1.);const vec2 g=vec2(.5,.5);varying vec2 vv0;void main(){vec4 c=texture2D(u39,vv0),d=texture2D(u53,vv0),o=texture2D(u39,g),j=texture2D(u53,g);float k=pow(j.a,u56),l=mix(u54.x,u54.y,1.-k),a=step(.34,vv0.x)*step(vv0.x,.66);vec4 m=mix(h,i,a),b=max(l*f,m);b*=mix(f,u55*vec4(1.,1.,1.,0.)+vec4(0.,0.,0.,1.),a);vec4 n=c-d;gl_FragColor=n*b;}",
                i: ["u39", "u53", "u54", "u55", "u56"],
                precision: "highp",
              },
              {
                id: "s59",
                name: "_",
                h: "uniform sampler2D u53,u57,u58,u59;const vec4 k=vec4(1.,1.,1.,1.);const vec2 f=vec2(.25,.5),g=vec2(.75,.5),h=vec2(.5,.5);varying vec2 vv0;void main(){float c=step(.33,vv0.x)*step(vv0.x,.66),l=step(.66,vv0.x);vec4 d=texture2D(u59,h);float a=d.a;a*=texture2D(u58,f).a,a*=texture2D(u58,g).a;vec4 i=texture2D(u53,vv0),j=texture2D(u57,vv0),b=i+j;b.a=mix(b.a,a,c),gl_FragColor=b;}",
                i: ["u53", "u57", "u58", "u59"],
                precision: "highp",
              },
              {
                id: "s60",
                name: "_",
                h: "uniform sampler2D u39;uniform float u60;const vec4 g=vec4(1.,1.,1.,1.);const vec2 f=vec2(.5,.5);varying vec2 vv0;void main(){vec4 a=texture2D(u39,vv0);float b=step(vv0.x,.33),c=texture2D(u39,f).g;a.a+=b*a.a*u60*abs(sin(c)),gl_FragColor=a;}",
                i: ["u39", "u60"],
                precision: "highp",
              },
              {
                id: "s61",
                name: "_",
                h: "uniform sampler2D u39,u58,u42;uniform vec3 u49,u50;uniform float u61,u62;const vec4 e=vec4(.25,.25,.25,.25);const vec3 g=vec3(1.,1.,1.);const vec2 h=vec2(.5,.5);const vec3 i=vec3(1.,1.,4.);varying vec2 vv0;void main(){vec4 c=texture2D(u39,h);float d=step(vv0.x,.5),a=1.-d;vec4 j=texture2D(u58,vv0);float t=c.a;vec2 k=mix(vec2(.875,.875),vec2(.125,.875),a),l=mix(vec2(.125,.625),vec2(.375,.875),a),m=mix(vec2(.375,.625),vec2(.625,.875),a);float n=dot(e,texture2D(u42,k)),o=dot(e,texture2D(u42,l)),p=dot(e,texture2D(u42,m));vec3 q=mix(i,u49,a),b=q*vec3(n,o,p),r=c.rgb;b=mix(b,u50+b-r,a)/u62;vec4 s=mix(vec4(b,0.),j,vec4(u61*g,0.));gl_FragColor=s;}",
                i: "u39 u58 u42 u61 u62 u49 u50".split(" "),
                precision: "highp",
              },
              {
                id: "s62",
                name: "_",
                h: "uniform sampler2D u58;uniform vec2 u64,u65;const vec4 h=vec4(.25,.25,.25,.25);varying vec2 vv0;void main(){float a=step(.5,vv0.x),c=mix(u64.x,u65.x,a),d=mix(u64.y,u65.y,a);vec3 b=texture2D(u58,vv0).rgb;float f=length(b),g=1.-smoothstep(c,d,f);gl_FragColor=vec4(b,g);}",
                i: ["u58", "u64", "u65"],
                precision: "highp",
              },
              {
                id: "s63",
                name: "_",
                s: "attribute vec2 a0;void main(){gl_Position=vec4(a0,0.,1.);}",
                h: "uniform sampler2D u42;const vec4 g=vec4(1.,1.,1.,1.),h=vec4(0.,0.,0.,0.),e=vec4(.25,.25,.25,.25);const float f=3.1415;void main(){float a=dot(texture2D(u42,vec2(.25,.25)),e),b=dot(texture2D(u42,vec2(.5,.25)),e),c=f/2.*dot(texture2D(u42,vec2(.75,.25)),e),d=4.18*dot(texture2D(u42,vec2(0.,.25)),e);gl_FragColor=vec4(d,a,b,c);}",
                i: ["u42"],
              },
              {
                id: "s54",
                name: "_",
                h: "uniform sampler2D u1,u66;varying vec2 vv0;vec4 i(vec4 a,sampler2D g){mediump float b=a.b*63.;mediump vec2 c;c.y=floor(floor(b)/8.),c.x=floor(b)-c.y*8.;mediump vec2 d;d.y=floor(ceil(b)/8.),d.x=ceil(b)-d.y*8.;highp vec2 e;e.x=c.x*.125+9.765625e-4+.123047*a.r,e.y=c.y*.125+9.765625e-4+.123047*a.g;highp vec2 f;f.x=d.x*.125+9.765625e-4+.123047*a.r,f.y=d.y*.125+9.765625e-4+.123047*a.g;lowp vec4 j=texture2D(g,e),k=texture2D(g,f),l=mix(j,k,fract(b));return l;}void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=i(a,u66);}",
                i: ["u1", "u66"],
              },
            ]);
            G();
            E();
            xb.m({ Th: !1, ma: O });
            Ab.m({ Nf: 0, n: N.Nc[1] - N.Nc[0] + 1, ci: N.Nc[0] });
            R.set_videoRotation = function (A) {
              Ya.rotate = A;
              R.ready &&
                (cb.jg(Aa.element.videoWidth, Aa.element.videoHeight), cb.qg());
            };
            R.set_viewRotation = function () {};
            R.set_LUT = function (A) {
              A
                ? Z.instance({
                    url: A,
                    isFloat: !1,
                    isFlipY: !1,
                    R: function (Q) {
                      K.vb = Q;
                      Ea.Jc();
                    },
                  })
                : ((K.vb = null), Ea.Jc());
            };
            R.resize = function (A, Q, fa) {
              function ia() {
                xb.stop();
                q.$a && (clearTimeout(q.$a), (q.$a = null));
                if (!q.Pb)
                  if (N.width === Ha && N.height === fb) d();
                  else if (aa !== X.W && aa !== X.Da)
                    q.$a = setTimeout(ia, N.Ii);
                  else {
                    var vb = "undefined" === typeof tb ? !1 : tb.get_mode(),
                      wb = aa;
                    aa = X.za;
                    ka = q.Pb = !0;
                    Ba = function () {
                      ka = !1;
                      q.Pb = !1;
                      l();
                      k(N.ma);
                      v && clearTimeout(v);
                      v = !1;
                      aa = wb;
                    };
                    N.width = Ha;
                    N.height = fb;
                    r();
                    C();
                    q.kj.forEach(function (Uc) {
                      Uc.resize(Ha, fb);
                    });
                    da.resize(Nb, Ob);
                    Ea.Jc();
                    cb.jg(
                      Aa.element.videoWidth
                        ? Aa.element.videoWidth
                        : Aa.element.width,
                      Aa.element.videoHeight
                        ? Aa.element.videoHeight
                        : Aa.element.height
                    );
                    cb.qg();
                    cb.ij();
                    d();
                    aa === X.Da && ((aa = X.W), R.switch_viewer3D(!0, !1));
                    vb && tb.switch_mode(vb);
                  }
              }
              if (R.ready) {
                q.$a && (clearTimeout(q.$a), (q.$a = null));
                xb.stop();
                fa = fa ? kc.Qe : 1;
                var Ha = A * fa,
                  fb = Q * fa;
                q.$a = setTimeout(ia, N.Ii);
              }
            };
          },
          v: function () {
            xb.v();
            return new Promise(function (A) {
              R.switch_sleep(!0, !0)
                .finally(function () {
                  m && m.v();
                  da.v();
                  ab.v();
                  b && (b = null);
                  m = null;
                  N.Ff = !1;
                  bb = null;
                  D = !0;
                  S = 1;
                  ea = -1;
                  aa = X.W;
                  oa = null;
                  Ma = X.W;
                  Object.assign(Aa, Gc);
                  Object.assign(N, Hc);
                  A();
                })
                .catch(function () {});
            });
          },
          Jc: function () {
            sa.Ri(P.Kc, null === K.vb ? K.tb : K.Mc, U.Fd, K.yj);
          },
          El: function () {
            return Xa;
          },
          Yi: function (A) {
            Xa = A;
          },
          Zd: function () {
            Fb[0] = t[0] - Xa.offsetX;
            Fb[1] = t[1] + Xa.offsetY;
            Fb[2] = t[2];
            sa.vn(h, ib, Fb);
          },
          $d: function () {
            sa.wn(M * N.Sm, nb, Xa.scale);
          },
          uj: function () {
            sa.xn(I + g);
          },
          ko: function () {
            sa.tn(N.Uc + f, N.Bb + qb);
          },
          mo: function () {
            sa.un(rb);
          },
          ae: function () {
            Ea.Zd();
            Ea.$d();
            Ea.uj();
            Ea.ko();
            Ea.mo();
          },
          on: function () {
            xb.stop();
            oa && (clearInterval(oa), (oa = null));
            V.isEnabled = !0;
            V.ni = 0;
            Ga = sa.Dl();
            Ia = bb.Dh();
            sb = bb.Bh();
            Ta = nb;
            Wa = ib;
            Va = rb;
            jb = f;
            lc = qb;
            ka = !1;
            sa.Sd(!1);
          },
          ln: function (A) {
            function Q() {
              2 === ++fa &&
                ((V.isEnabled = !1),
                (nb = Ta),
                (ib = Wa),
                (rb = Va),
                (f = jb),
                (qb = lc),
                Ea.ae(),
                sa.ta(Ga),
                d(),
                A && A());
            }
            var fa = 0;
            aa === X.ec ? (aa = X.Da) : aa === X.fc && (aa = X.W);
            sa.Wa(aa === X.W ? 0 : 1);
            bb.replace(Ia, Q);
            bb.dg(sb, Q);
            Ea.Jc();
            sa.Sd(!0);
          },
          ij: function () {
            var A = Math.tan(Aa.Jb / 2);
            sa.Qi({
              Se: N.Se / A,
              qn: A,
              Vm: Aa.yi,
              Ba: N.Ba,
              Mf: N.Mf,
              Bj: y.Eb,
              Jj: N.yo,
              vc: N.vc,
              hf: N.hf,
              ff: N.ff,
              gf: N.gf,
              Ac: rb,
              re: N.re,
              De: N.De,
              Xf: N.Xf,
              bc: N.bc,
              Tn: N.dj,
              Un: N.ej,
              Qd: N.Qd,
              cc: N.cc,
              Zc: N.Zc,
              He: N.He,
              Ge: N.Ge,
              Fe: N.Fe,
              ue: N.ue,
              te: N.aa + N.va + N.te,
              Uc: N.Uc + f,
              Bb: N.Bb + qb,
              df: N.df,
              Ig: N.Ig,
              Hg: N.Hg,
              fe: N.fe,
              Eo: N.Do,
              ee: Aa.ee,
              yd: N.yd,
              zm: ha,
              xd: N.xd,
              zd: N.zd,
              Df: N.Df,
              ym: ra,
              rg: N.rg,
            });
          },
          Gk: function () {
            var A = Ya.ie,
              Q = Ya.he,
              fa = 1 / Math.tan(Aa.Jb / 2),
              ia = ab.Y() / ab.L();
            Aa.yi = [
              fa,
              0,
              0,
              0,
              0,
              fa / ia,
              0,
              0,
              0,
              0,
              -(Q + A) / (Q - A),
              -1,
              0,
              0,
              (-2 * A * Q) / (Q - A),
              0,
            ];
            Aa.ee = 1 / Math.tan((N.Bo * Math.PI) / 360) / fa;
          },
          jg: function (A, Q) {
            J = [0.5, 0.5];
            A = Q / A;
            Q = ab.Y() / ab.L();
            90 === Math.abs(Ya.rotate) && (A = 1 / A);
            A > Q ? (J[1] *= Q / A) : (J[0] *= A / Q);
            x[0] = 0;
            x[1] = 0;
            x[2] = 0;
            x[3] = 0;
            switch (Ya.rotate) {
              case 0:
                x[0] = J[0];
                x[3] = J[1];
                break;
              case 180:
                x[0] = -J[0];
                x[3] = -J[1];
                break;
              case 90:
                x[1] = J[0];
                x[2] = -J[1];
                break;
              case -90:
                (x[1] = -J[0]), (x[2] = J[1]);
            }
            Aa.Jb =
              2 *
              Math.atan(
                2 *
                  J[0] *
                  Math.tan(
                    ((1 < A ? Ya.Dj : Ya.FOVdesktop) * Math.PI) / 180 / 2
                  )
              );
            Ea.Gk();
          },
          qg: function () {
            ca.j("s53", [
              { type: "1i", name: "u1", value: 0 },
              { type: "mat2", name: "u38", value: x },
            ]);
          },
          mf: function (A, Q) {
            Ea.$l(A, Q);
            Ea.m();
            if (!Ea.Xl())
              return (
                R.hb && R.hb("GL_INCOMPATIBLE", "Cannot init JEELIZVTO"), !1
              );
            Ea.Lh();
            return !0;
          },
          $l: function (A, Q) {
            R.xb = document.createElement("canvas");
            R.wb = document.createElement("canvas");
            R.wb.width = N.width;
            R.wb.height = N.height;
            R.Kj = R.wb.getContext("2d");
            R.replace_video = function (fa) {
              Aa.element = fa;
              Aa.xg.ia = Aa.element;
              return !0;
            };
            R.mc = R.xb.getContext("2d");
            R.capture_background = function (fa, ia) {
              fa = "undefined" === typeof fa ? A : fa;
              ia = "undefined" === typeof ia ? Q : ia;
              R.xb.width = fa;
              R.xb.height = ia;
              var Ha = fa / ia,
                fb = 0,
                vb = 0;
              if (A / Q > Ha) {
                var wb = Q * Ha;
                Ha = Q;
                fb = Math.round((A - wb) / 2);
              } else (wb = A), (Ha = A / Ha), (vb = Math.round((Q - Ha) / 2));
              R.mc.save();
              R.mc.translate(fa, 0);
              R.mc.scale(-1, 1);
              R.mc.drawImage(Aa.element, fb, vb, wb, Ha, 0, 0, fa, ia);
              R.mc.restore();
              fa = document.createElement("canvas");
              fa.width = R.xb.width;
              fa.height = R.xb.height;
              fa.getContext("2d").drawImage(R.xb, 0, 0);
              return fa;
            };
          },
          Lh: function () {
            window.CanvasListeners &&
              (tb.init({ qa: ab.kb() }),
              (R.init_listeners = Ea.Lh),
              (R.add_listener = tb.add_listener),
              (R.remove_listener = tb.remove_listener),
              (R.animate_swipe = tb.animate_swipe),
              (R.switch_modeInteractor = tb.switch_mode),
              (R.get_modeInteractor = tb.get_mode),
              tb
                .add_listener(
                  "move",
                  function (A, Q) {
                    aa === X.W &&
                      (N.Am &&
                        ((Xa.offsetX -= Q[0] * N.gi),
                        (Xa.offsetX = Math.min(
                          Math.max(Xa.offsetX, -N.Ad),
                          N.Ad
                        ))),
                      (Xa.offsetY -= Q[1] * N.gi),
                      (Xa.offsetY = Math.min(
                        Math.max(Xa.offsetY, -N.Ad),
                        N.Ad
                      )),
                      Ea.Zd());
                  },
                  !0
                )
                .add_listener(
                  "pinch",
                  function (A, Q) {
                    aa === X.W &&
                      ((Xa.scale += Q * N.Bm),
                      (Xa.scale = Math.min(
                        Math.max(Xa.scale, N.hi[0]),
                        N.hi[1]
                      )),
                      Ea.$d());
                  },
                  !0
                ));
          },
          Xl: function () {
            return da.m({
              td: !1,
              Ek: !1,
              expand: !1,
              qa: ab.kb(),
              Lb: ab,
              onload: function () {
                U.ub = bc.instance({
                  Ab: N.aa + N.va + Za.wo,
                  oc: N.aa + N.va + Za.xo,
                  nc: Za.zj,
                  pc: Za.Aj,
                });
                N.Tb
                  ? ((U.ab = bc.instance({})), ta.fb.ta(U.ab))
                  : (U.ab = U.ub);
                sa.ta(U.ab);
                U.Kf = N.Tb ? Vc.instance({ wm: U.ab, um: U.ub }) : U.ub;
                c();
              },
            });
          },
          mg: function () {
            z ||
              (Ea.Jc(),
              N.Tb && (va.reset(), ta.fb.xk(Aa.ka), ta.fb.wk()),
              (R.ready = !0),
              (ba = 0),
              d(),
              (w = 0),
              (z = !0),
              da.Cg(kc.nl),
              Ea.ae(),
              sa.Zn(),
              R.Qc.forEach(function (A) {
                A();
              }),
              R.Qc.splice(0));
          },
          ei: function (A, Q) {
            A = uc.instance({
              R: function () {
                Ea.mg();
                Q && Q();
              },
              url: A.url,
              Cc: A.Cc,
              zb: A.zb,
              yb: A.yb,
            });
            n(A);
          },
          bo: function () {
            if (N.Tb) {
              var A = Object.assign({}, Za, { Wb: N.aa + N.va + Za.Wb });
              ta.fb.eg(A);
            }
          },
        };
      return Ea;
    }
    function Pb(a) {
      return 3 === arguments.length ? this.ib(arguments) : this.set(a);
    }
    function Ic(a, c) {
      c = Math.floor(c);
      a.r = ((c >> 16) & 255) / 255;
      a.X = ((c >> 8) & 255) / 255;
      a.b = (c & 255) / 255;
    }
    function Wc(a, c) {
      function e(l) {
        void 0 !== l &&
          1 > parseFloat(l) &&
          console.warn(
            "JETHREE.Color: Alpha component of " + c + " will be ignored."
          );
      }
      var d;
      if ((d = /^((?:rgb|hsl)a?)\(\s*([^\)]*)\)/.exec(c))) {
        var n = d[2];
        switch (d[1]) {
          case "rgb":
          case "rgba":
            if (
              (d =
                /^(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec(
                  n
                ))
            ) {
              a.r = Math.min(255, parseInt(d[1], 10)) / 255;
              a.X = Math.min(255, parseInt(d[2], 10)) / 255;
              a.b = Math.min(255, parseInt(d[3], 10)) / 255;
              e(d[5]);
              return;
            }
            if (
              (d =
                /^(\d+)%\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec(
                  n
                ))
            ) {
              a.r = Math.min(100, parseInt(d[1], 10)) / 100;
              a.X = Math.min(100, parseInt(d[2], 10)) / 100;
              a.b = Math.min(100, parseInt(d[3], 10)) / 100;
              e(d[5]);
              return;
            }
            break;
          case "hsl":
          case "hsla":
            if (
              (d =
                /^([0-9]*\.?[0-9]+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec(
                  n
                ))
            ) {
              n = parseFloat(d[1]) / 360;
              var k = parseInt(d[2], 10) / 100,
                B = parseInt(d[3], 10) / 100;
              e(d[5]);
              a.sn(n, k, B);
              return;
            }
        }
      } else if ((d = /^#([A-Fa-f0-9]+)$/.exec(c))) {
        d = d[1];
        n = d.length;
        if (3 === n) {
          a.r = parseInt(d.charAt(0) + d.charAt(0), 16) / 255;
          a.X = parseInt(d.charAt(1) + d.charAt(1), 16) / 255;
          a.b = parseInt(d.charAt(2) + d.charAt(2), 16) / 255;
          return;
        }
        if (6 === n) {
          a.r = parseInt(d.charAt(0) + d.charAt(1), 16) / 255;
          a.X = parseInt(d.charAt(2) + d.charAt(3), 16) / 255;
          a.b = parseInt(d.charAt(4) + d.charAt(5), 16) / 255;
          return;
        }
      }
      c &&
        0 < c.length &&
        ((d = Xc[c]),
        void 0 !== d
          ? Ic(a, d)
          : console.warn("JETHREE.Color: Unknown color " + c));
    }
    function mc(a, c, e, d) {
      this.B = a || 0;
      this.C = c || 0;
      this.D = e || 0;
      this.O = void 0 !== d ? d : 1;
    }
    function Jc(a, c, e) {
      var d = c.B,
        n = c.C,
        k = c.D;
      c = c.O;
      var B = e.B,
        l = e.C,
        u = e.D;
      e = e.O;
      a.B = d * e + c * B + n * u - k * l;
      a.C = n * e + c * l + k * B - d * u;
      a.D = k * e + c * u + d * l - n * B;
      a.O = c * e - d * B - n * l - k * u;
      return a;
    }
    function Qb(a, c) {
      this.x = a || 0;
      this.y = c || 0;
    }
    function Oa(a, c, e) {
      this.x = a || 0;
      this.y = c || 0;
      this.z = e || 0;
    }
    function Kc(a, c) {
      var e = a.x,
        d = a.y,
        n = a.z;
      a.x = d * c.z - n * c.y;
      a.y = n * c.x - e * c.z;
      a.z = e * c.y - d * c.x;
    }
    function Rb(a, c, e, d) {
      this.B = a || 0;
      this.C = c || 0;
      this.D = e || 0;
      this.Na = d || Rb.Cj;
    }
    function vc(a, c) {
      this.min = void 0 !== a ? a : new Oa(Infinity, Infinity, Infinity);
      this.max = void 0 !== c ? c : new Oa(-Infinity, -Infinity, -Infinity);
    }
    function nc(a) {
      return new Oa().Rc(a.min, a.max).Aa(0.5);
    }
    function Yc(a, c) {
      a.min.min(c);
      a.max.max(c);
    }
    function Sb() {
      this.elements = new Float32Array([
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
      ]);
      0 < arguments.length &&
        console.error(
          "JETHREE.Matrix4: the constructor no longer reads arguments. use .set() instead."
        );
    }
    function Lc(a, c, e) {
      var d = c.elements,
        n = e.elements;
      e = a.elements;
      c = d[0];
      var k = d[4],
        B = d[8],
        l = d[12],
        u = d[1],
        p = d[5],
        G = d[9],
        H = d[13],
        E = d[2],
        r = d[6],
        C = d[10],
        g = d[14],
        f = d[3],
        y = d[7],
        J = d[11];
      d = d[15];
      var x = n[0],
        q = n[4],
        h = n[8],
        L = n[12],
        O = n[1],
        v = n[5],
        m = n[9],
        t = n[13],
        M = n[2],
        I = n[6],
        K = n[10],
        P = n[14],
        ba = n[3],
        ja = n[7],
        U = n[11];
      n = n[15];
      e[0] = c * x + k * O + B * M + l * ba;
      e[4] = c * q + k * v + B * I + l * ja;
      e[8] = c * h + k * m + B * K + l * U;
      e[12] = c * L + k * t + B * P + l * n;
      e[1] = u * x + p * O + G * M + H * ba;
      e[5] = u * q + p * v + G * I + H * ja;
      e[9] = u * h + p * m + G * K + H * U;
      e[13] = u * L + p * t + G * P + H * n;
      e[2] = E * x + r * O + C * M + g * ba;
      e[6] = E * q + r * v + C * I + g * ja;
      e[10] = E * h + r * m + C * K + g * U;
      e[14] = E * L + r * t + C * P + g * n;
      e[3] = f * x + y * O + J * M + d * ba;
      e[7] = f * q + y * v + J * I + d * ja;
      e[11] = f * h + y * m + J * K + d * U;
      e[15] = f * L + y * t + J * P + d * n;
      return a;
    }
    function wc(a, c, e, d, n, k) {
      this.a = a;
      this.b = c;
      this.c = e;
      this.Ka = d instanceof Oa ? d : new Oa();
      this.de = Array.isArray(d) ? d : [];
      this.color = n instanceof Pb ? n : new Pb();
      this.Fg = Array.isArray(n) ? n : [];
      this.Ub = void 0 !== k ? k : 0;
    }
    function Zc(a, c, e) {
      var d = new XMLHttpRequest();
      d.open("GET", a, !0);
      var n = (d.withCredentials = !1);
      d.onreadystatechange = function () {
        404 !== d.status || n || ((n = !0), e && e(404));
        if (4 === d.readyState && 200 === d.status) {
          var k = null;
          try {
            k = JSON.parse(d.responseText);
          } catch (B) {
            e && e(-1);
          }
          c && k && c(k);
        }
      };
      d.onerror = function () {
        e && e(0);
      };
      d.send();
    }
    function xc(a, c, e) {
      "object" === typeof a ? c(a) : Zc(a, c, e);
    }
    function $c(a, c) {
      for (var e = new Oa(), d = new Oa(), n = 0, k = c.length; n < k; n++) {
        var B = c[n],
          l = a[B.a],
          u = a[B.b];
        e.Za(a[B.c], u);
        d.Za(l, u);
        Kc(e, d);
        0 !== e.wf() && (e.normalize(), B.Ka.J(e));
      }
    }
    function ad(a, c) {
      for (var e = Array(a.length), d = 0, n = a.length; d < n; ++d)
        e[d] = new Oa();
      d = new Oa();
      n = new Oa();
      for (var k = 0, B = c.length; k < B; ++k) {
        var l = c[k],
          u = a[l.a],
          p = a[l.b];
        d.Za(a[l.c], p);
        n.Za(u, p);
        Kc(d, n);
        e[l.a].add(d);
        e[l.b].add(d);
        e[l.c].add(d);
      }
      d = 0;
      for (a = a.length; d < a; ++d) e[d].normalize();
      a = 0;
      for (d = c.length; a < d; ++a)
        (n = c[a]),
          (k = n.de),
          3 === k.length
            ? (k[0].J(e[n.a]), k[1].J(e[n.b]), k[2].J(e[n.c]))
            : ((k[0] = e[n.a].clone()),
              (k[1] = e[n.b].clone()),
              (k[2] = e[n.c].clone()));
      return e;
    }
    function bd(a, c, e, d) {
      function n(L) {
        q.J(c[L]);
        h.J(q);
        var O = l[L];
        J.J(O);
        J.sub(q.Aa(q.ad(O))).normalize();
        var v = h.x,
          m = h.y,
          t = h.z,
          M = O.x,
          I = O.y;
        O = O.z;
        x.x = m * O - t * I;
        x.y = t * M - v * O;
        x.z = v * I - m * M;
        v = 0 > x.ad(u[L]) ? -1 : 1;
        B[4 * L] = J.x;
        B[4 * L + 1] = J.y;
        B[4 * L + 2] = J.z;
        B[4 * L + 3] = v;
      }
      for (
        var k = a.length,
          B = new Float32Array(4 * k),
          l = Array(k),
          u = Array(k),
          p = 0;
        p < k;
        p++
      )
        (l[p] = new Oa()), (u[p] = new Oa());
      var G = new Oa(),
        H = new Oa(),
        E = new Oa(),
        r = new Qb(),
        C = new Qb(),
        g = new Qb(),
        f = new Oa(),
        y = new Oa();
      d.forEach(function (L) {
        var O = L.a,
          v = L.b;
        L = L.c;
        G.J(a[O]);
        H.J(a[v]);
        E.J(a[L]);
        r.J(e[O]);
        C.J(e[v]);
        g.J(e[L]);
        var m = H.x - G.x,
          t = E.x - G.x,
          M = H.y - G.y,
          I = E.y - G.y,
          K = H.z - G.z,
          P = E.z - G.z,
          ba = C.x - r.x,
          ja = g.x - r.x,
          U = C.y - r.y,
          w = g.y - r.y,
          z = 1 / (ba * w - ja * U);
        f.set((w * m - U * t) * z, (w * M - U * I) * z, (w * K - U * P) * z);
        y.set(
          (ba * t - ja * m) * z,
          (ba * I - ja * M) * z,
          (ba * P - ja * K) * z
        );
        l[O].add(f);
        l[v].add(f);
        l[L].add(f);
        u[O].add(y);
        u[v].add(y);
        u[L].add(y);
      });
      var J = new Oa(),
        x = new Oa(),
        q = new Oa(),
        h = new Oa();
      d.forEach(function (L) {
        n(L.a);
        n(L.b);
        n(L.c);
      });
      return B;
    }
    function Mc(a, c, e, d) {
      return Math.sqrt((a - e) * (a - e) + (c - d) * (c - d));
    }
    var T = {
        dh: !0,
        cp: !1,
        ep: !1,
        Qk: !1,
        bh: !1,
        bp: !1,
        Ja: !1,
        Ym: !1,
        td: !1,
        Kp: !1,
        aa: "",
        Em: "",
        kk: 700,
        jk: 200,
        eh: !1,
        qo: !1,
        ro: !1,
        po: !1,
        Sj: 3,
        Gb: !1,
        Pg: !0,
        Ab: "images/backgrounds/interior2.jpg",
        oc: "images/backgrounds/interior_light.jpg",
        mk: [256, 256, 512, 512],
        nc: 2.1,
        pc: 8,
        lk: [64, 128, 256, 256],
        cm: [60, 96, 160, 250],
        bm: [8, 12, 18, 40],
        Vb: 2.2,
        Gd: 1,
        ve: 300,
        Tg: 500,
        we: 50,
        yk: 0,
        zk: 0,
        So: 45,
        Uo: 1,
        To: 1e3,
        Ug: 20,
        Go: 10,
        Ho: 10,
        Io: 5,
        Rm: 0.1,
        si: 20,
        vi: 100,
        wi: 100,
        Qm: -Math.PI / 3,
        Pm: Math.PI / 3,
        ui: 0,
        lj: 0,
        ed: [40, 32, 16, 16],
        Qj: [0, 0.87, 0.92, 0.9],
        Mm: 2,
        Im: 100,
        da: !1,
        Tj: 16,
        Uj: 0.4,
        Wj: [0.72, 0.73, 0.72, 0.74],
        fk: 1.2,
        ck: [0.5, 0.5, 0.5, 1],
        hk: 140,
        gk: 280,
        ik: 1.2,
        Xj: 20,
        Yj: 40,
        ek: [6, 9, 9, 12],
        bk: [0.03, 0.02, 0.02, 0.018],
        ak: [0.35, 0.35, 0.4, 0.5],
        Zj: [0.2, 0.2, 0.2, 0.2],
        Vj: [0.1, 0.15, 0.15, 0.15],
        dk: [200, 200, 150, 120],
        $j: [1, 2, 3, 5],
        Vn: 1.1,
        aq: [0.25, 0.5, 1, 2],
        bq: 256,
        $p: 256,
        Zp: 200,
        Wn: [40, 80, 200, 500],
        Xn: [35, 45, 80, 120],
        Kk: !0,
        Lk: "CCW",
      },
      Nc = {},
      ca = (function () {
        function a(v, m, t) {
          m = v.createShader(m);
          v.shaderSource(m, t);
          v.compileShader(m);
          return v.getShaderParameter(m, v.COMPILE_STATUS) ? m : !1;
        }
        function c(v, m, t) {
          m = a(v, v.VERTEX_SHADER, m);
          t = a(v, v.FRAGMENT_SHADER, t);
          v === b && l.push(m, t);
          var M = v.createProgram();
          v.attachShader(M, m);
          v.attachShader(M, t);
          v.linkProgram(M);
          return M;
        }
        function e(v) {
          return ["float", "sampler2D", "int"]
            .map(function (m) {
              return "precision " + v + " " + m + ";\n";
            })
            .join("");
        }
        function d(v, m) {
          m.ba = m.ba ? !0 : !1;
          if (!m.ba) {
            m.s =
              m.s ||
              "precision lowp float;attribute vec2 a0;varying vec2 vv0;void main(){gl_Position=vec4(a0,0.,1.),vv0=a0*.5+vec2(.5,.5);}";
            m.I = m.I || ["a0"];
            m.P = m.P || [2];
            m.precision = m.precision || E;
            m.id = G++;
            void 0 !== m.Mi &&
              (m.Mi.forEach(function (I, K) {
                m.h = m.h.replace(I, m.Ca[K]);
              }),
              m.Mi.splice(0));
            m.Gg = 0;
            m.P.forEach(function (I) {
              m.Gg += 4 * I;
            });
            var t = e(m.precision);
            m.oa = c(v, t + m.s, t + m.h);
            m.A = {};
            m.i.forEach(function (I) {
              m.A[I] = v.getUniformLocation(m.oa, I);
            });
            m.attributes = {};
            m.wa = [];
            m.I.forEach(function (I) {
              var K = v.getAttribLocation(m.oa, I);
              m.attributes[I] = K;
              m.wa.push(K);
            });
            if (m.u) {
              v.useProgram(m.oa);
              p = m;
              u = m.id;
              for (var M in m.u) v.uniform1i(m.A[M], m.u[M]);
            }
            m.Ha = !0;
          }
        }
        function n(v) {
          ob.aj(O);
          u !== v.id &&
            (O.H(),
            (u = v.id),
            (p = v),
            b.useProgram(v.oa),
            v.wa.forEach(function (m) {
              0 !== m && b.enableVertexAttribArray(m);
            }));
        }
        function k(v, m, t) {
          d(v, m, t);
          v.useProgram(m.oa);
          v.enableVertexAttribArray(m.attributes.a0);
          u = -1;
          return (p = m);
        }
        function B() {
          return {
            h: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
            i: ["u1"],
            u: { u1: 0 },
          };
        }
        var l = [],
          u = -1,
          p = null,
          G = 0,
          H = !1,
          E = "highp",
          r = ["u1"],
          C = ["u0"],
          g = { u1: 0 },
          f = { u0: 0 },
          y = { u1: 0, u2: 1 },
          J = { u3: 0 },
          x = {
            s0: B(),
            s1: {
              h: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
              i: r,
              u: g,
              precision: "lowp",
            },
            s2: {
              h: "uniform sampler2D u1,u2;varying vec2 vv0;void main(){vec4 a=texture2D(u2,vv0),b=texture2D(u1,vv0);gl_FragColor=a*b;}",
              i: ["u1", "u2"],
              u: y,
            },
            s3: {
              h: "uniform sampler2D u1;uniform vec2 u4,u5;varying vec2 vv0;void main(){vec2 a=vv0*u4+u5;gl_FragColor=texture2D(u1,a);}",
              i: ["u1", "u4", "u5"],
              u: g,
              ba: !0,
            },
            s4: {
              h: "uniform sampler2D u1;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=a.r*f;}",
              i: r,
              u: g,
            },
            s5: {
              h: "uniform sampler2D u1,u2;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u2,vv0),b=texture2D(u1,vv0);gl_FragColor=a.a*b.r*f;}",
              i: ["u1", "u2"],
              u: y,
            },
            s6: {
              h: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vec2(1.-vv0.x,vv0.y));}",
              i: r,
              u: g,
            },
            s7: {
              h: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vec2(vv0.x,1.-vv0.y));}",
              i: r,
              u: g,
            },
            s8: {
              h: "uniform sampler2D u0;uniform float u4;varying vec2 vv0;void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=a*u4;}",
              i: ["u0", "u4"],
              u: f,
            },
            s9: {
              h: "uniform sampler2D u0;uniform float u4;varying vec2 vv0;const vec4 f=vec4(.25,.25,.25,.25),g=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0);float b=dot(a*u4,f);gl_FragColor=b*g;}",
              i: ["u0", "u4"],
              u: f,
            },
            s10: {
              h: "uniform sampler2D u1;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.);void main(){float a=.25*dot(e,texture2D(u1,vv0));gl_FragColor=a*e;}",
              i: r,
              u: g,
            },
            s11: {
              h: "uniform sampler2D u1,u6;uniform float u7;const vec4 f=vec4(1.,1.,1.,1.);varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0),b=texture2D(u6,vv0);gl_FragColor=mix(b,a,u7*f);}",
              i: ["u1", "u6", "u7"],
              u: { u1: 0, u6: 1 },
            },
            s12: {
              h: "uniform sampler2D u1;uniform vec2 u8;varying vec2 vv0;void main(){gl_FragColor=.25*(texture2D(u1,vv0+u8)+texture2D(u1,vv0+u8*vec2(1.,-1.))+texture2D(u1,vv0+u8*vec2(-1.,-1.))+texture2D(u1,vv0+u8*vec2(-1.,1.)));}",
              i: ["u1", "u8"],
              u: g,
            },
            s13: {
              h: "uniform sampler2D u1;uniform vec4 u9;varying vec2 vv0;float g(float a,float b){a=floor(a)+.5;return floor(a/exp2(b));}float h(float a,float b){return floor(a*exp2(b)+.5);}float i(float a,float b){return mod(a,h(1.,b));}float e(float c,float a,float b){a=floor(a+.5),b=floor(b+.5);return i(g(c,a),b-a);}vec4 j(float a){if(a==0.)return vec4(0.,0.,0.,0.);float k=128.*step(a,0.);a=abs(a);float c=floor(log2(a)),l=c+127.,b=(a/exp2(c)-1.)*8388608.,d=l/2.,m=fract(d)*2.,n=floor(d),o=e(b,0.,8.),p=e(b,8.,16.),q=m*128.+e(b,16.,23.),r=k+n;return vec4(o,p,q,r)/255.;}void main(){float a=dot(texture2D(u1,vv0),u9);gl_FragColor=j(a);}",
              i: ["u1", "u9"],
              u: g,
            },
            s14: {
              h: "uniform sampler2D u0;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0),b=e/(e+exp(-a));gl_FragColor=b;}",
              i: C,
              u: f,
              ba: !0,
            },
            s15: {
              h: "uniform sampler2D u0;varying vec2 vv0;const vec4 f=vec4(0.,0.,0.,0.);void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=max(f,a);}",
              i: C,
              u: f,
            },
            s16: {
              h: "uniform sampler2D u0;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=mix(exp(-abs(a))-f,a,step(0.,a));}",
              i: C,
              u: f,
            },
            s17: {
              h: "uniform sampler2D u0;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0),b=exp(-abs(a))-f;gl_FragColor=mix(.1*b,a,step(0.,a));}",
              i: C,
              u: f,
            },
            s18: {
              h: "uniform sampler2D u0,u7,u10;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0),c=texture2D(u7,vv0),d=texture2D(u10,vv0),b=a/d;gl_FragColor=c*mix(exp(-abs(b))-f,b,step(0.,a));}",
              i: ["u0", "u7", "u10"],
              u: { u0: 0, u7: 1, u10: 2 },
              ba: !0,
            },
            s19: {
              h: "uniform sampler2D u0;const float e=3.141593;varying vec2 vv0;void main(){gl_FragColor=atan(e*texture2D(u0,vv0))/e;}",
              i: C,
              u: f,
            },
            s20: {
              h: "uniform sampler2D u0;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0),b=log(f+a);gl_FragColor=b;}",
              i: C,
              u: f,
              ba: !0,
            },
            s21: {
              h: "uniform sampler2D u0,u11;uniform float u12;const vec2 e=vec2(.5,.5);const float f=1e-5;const vec4 g=vec4(1.,1.,1.,1.),i=vec4(0.,0.,0.,0.);varying vec2 vv0;void main(){vec4 a=texture2D(u11,e);float b=u12*u12;vec4 c=max(b*a,f*g);gl_FragColor=texture2D(u0,vv0)/c;}",
              i: ["u0", "u11", "u12"],
              u: { u0: 0, u11: 1 },
              ba: !0,
            },
            s22: {
              h: "uniform sampler2D u1;uniform vec2 u13;varying vec2 vv0;void main(){float a=u13.x*u13.y;vec2 b=floor(vv0*a)/a,c=fract(vv0*a),d=floor(b*u13.y),f=floor(u13.x*fract(b*u13.y)),g=(f*u13.y+d)/a;gl_FragColor=texture2D(u1,g+c/a);}",
              i: ["u1", "u13"],
              u: g,
            },
            s23: {
              h: "uniform sampler2D u14,u15,u16;varying vec2 vv0;void main(){vec4 a=texture2D(u16,vv0);vec2 b=a.rg,c=a.ba;vec4 d=texture2D(u14,b),f=texture2D(u15,c);gl_FragColor=d*f;}",
              i: ["u14", "u15", "u16"],
              u: { u15: 0, u14: 1, u16: 2 },
              ba: !0,
            },
            s24: {
              h: "uniform float u17;uniform sampler2D u14,u15;varying vec2 vv0;void main(){vec2 a=fract(vv0*u17);vec4 b=texture2D(u14,vv0),c=texture2D(u15,a);gl_FragColor=b*c;}",
              i: ["u15", "u14", "u17"],
              u: { u15: 0, u14: 1 },
            },
            s25: {
              h: "uniform float u17;uniform sampler2D u14,u15,u18,u19,u20,u21;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.),g=vec4(1e-3,1e-3,1e-3,1e-3);void main(){vec2 h=vv0*u17,l=floor(h),c=h-l;vec4 m=texture2D(u14,vv0),d=texture2D(u15,c),a=texture2D(u21,vv0);a=a*255.;vec4 n=texture2D(u18,c),o=texture2D(u19,c),p=texture2D(u20,c),i=step(-g,-a),b=e-i,j=b*step(-e-g,-a);b*=e-j;vec4 k=b*step(-2.*e-g,-a);b*=e-k;vec4 q=b;d=i*d+j*n+k*o+q*p,gl_FragColor=m*d;}",
              i: "u14 u15 u17 u21 u18 u19 u20".split(" "),
              u: { u15: 0, u14: 1, u21: 3, u18: 4, u19: 5, u20: 6 },
              ba: !0,
            },
            s26: {
              h: "uniform sampler2D u14,u15,u22;uniform float u17,u23,u24,u25;varying vec2 vv0;const vec2 j=vec2(1.,1.),k=vec2(0.,0.);void main(){vec2 b=floor(u23*vv0),c=u23*vv0-b;float d=u17/u23;vec2 f=floor(c*d),g=c*d-f,h=(b+g)/u23;float l=u23*u25/u17;vec2 m=l*f,a=(m+g*u24)/u25;a+=.25/u25;vec2 i=step(a,j)*step(k,a);vec4 n=texture2D(u14,h),o=texture2D(u15,a),p=n*o,q=texture2D(u22,h);gl_FragColor=(p*u24*u24+q)*i.x*i.y;}",
              i: "u14 u15 u17 u23 u24 u25 u22".split(" "),
              u: { u15: 0, u14: 1, u22: 2 },
            },
            s27: {
              h: "uniform sampler2D u14,u15;varying vec2 vv0;void main(){vec4 a=texture2D(u14,vv0),b=texture2D(u15,vv0);gl_FragColor=a*b;}",
              i: ["u14", "u15"],
              u: { u15: 0, u14: 1 },
              ba: !0,
            },
            s28: {
              h: "uniform sampler2D u1,u22;uniform float u26;varying vec2 vv0;void main(){gl_FragColor=texture2D(u22,vv0)+u26*texture2D(u1,vv0);}",
              i: ["u1", "u22", "u26"],
              u: { u1: 0, u22: 1 },
            },
            s29: {
              h: "varying vec2 vv0;uniform sampler2D u1;const vec4 f=vec4(1.,1.,1.,1.),g=vec4(.299,.587,.114,0.);void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=dot(a,g)*f;}",
              i: r,
              u: g,
              precision: "lowp",
            },
            s30: {
              h: "varying vec2 vv0;uniform sampler2D u1;uniform float u27;const vec3 f=vec3(.299,.587,.114);void main(){vec3 a=texture2D(u1,vv0).rgb,b=texture2D(u1,vv0+vec2(0.,u27)).rgb,c=texture2D(u1,vv0+vec2(u27,u27)).rgb,d=texture2D(u1,vv0+vec2(u27,0.)).rgb;gl_FragColor=vec4(dot(a,f),dot(b,f),dot(c,f),dot(d,f));}",
              i: ["u1", "u27"],
              u: g,
              precision: "lowp",
            },
            s31: {
              h: "varying vec2 vv0;uniform sampler2D u1;uniform float u27;const vec3 f=vec3(.299,.587,.114);void main(){vec3 a=texture2D(u1,vv0).rgb,b=texture2D(u1,vv0+vec2(0.,u27)).rgb,c=texture2D(u1,vv0+vec2(u27,u27)).rgb,d=texture2D(u1,vv0+vec2(u27,0.)).rgb;gl_FragColor=vec4(a.r,b.g,c.b,dot(d,f));}",
              i: ["u1", "u27"],
              u: g,
              precision: "lowp",
            },
            s32: {
              h: "varying vec2 vv0;uniform sampler2D u1,u2;uniform float u28;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=vec4(0.);a-=texture2D(u1,vec2(vv0.x-u28,vv0.y-u28))*1.,a-=texture2D(u1,vec2(vv0.x-u28,vv0.y))*2.,a-=texture2D(u1,vec2(vv0.x-u28,vv0.y+u28))*1.,a+=texture2D(u1,vec2(vv0.x+u28,vv0.y-u28))*1.,a+=texture2D(u1,vec2(vv0.x+u28,vv0.y))*2.,a+=texture2D(u1,vec2(vv0.x+u28,vv0.y+u28))*1.;vec4 b=vec4(0.);b-=texture2D(u1,vec2(vv0.x-u28,vv0.y-u28))*1.,b-=texture2D(u1,vec2(vv0.x,vv0.y-u28))*2.,b-=texture2D(u1,vec2(vv0.x+u28,vv0.y-u28))*1.,b+=texture2D(u1,vec2(vv0.x-u28,vv0.y+u28))*1.,b+=texture2D(u1,vec2(vv0.x,vv0.y+u28))*2.,b+=texture2D(u1,vec2(vv0.x+u28,vv0.y+u28))*1.;vec3 c=sqrt(a.rgb*a.rgb+b.rgb*b.rgb);vec4 e=vec4(c,texture2D(u1,vv0).a),g=texture2D(u2,vv0);gl_FragColor=g.a*e.r*f;}",
              i: ["u1", "u2", "u28"],
              u: y,
              ba: !0,
            },
            s33: {
              h: "varying vec2 vv0;uniform sampler2D u1,u2;uniform float u28;const vec4 j=vec4(1.,1.,1.,1.);const vec2 k=vec2(1.,1.);void main(){float h=0.;vec2 l=k*u28,a,b;float c,d,i=0.;for(float e=-4.;e<=4.;e+=1.)for(float f=-4.;f<=4.;f+=1.)a=vec2(e,f),c=length(a)/2.,d=exp(-c*c),b=vv0+l*a,h+=d*texture2D(u1,b).r,i+=d;vec4 m=texture2D(u2,vv0);gl_FragColor=m.a*(texture2D(u1,b).r-h/i)*j;}",
              i: ["u1", "u2", "u28"],
              u: y,
              ba: !0,
            },
            s34: {
              h: "uniform sampler2D u3;uniform vec2 u8;varying vec2 vv0;vec4 e(vec4 a,vec4 b){vec4 c=step(a,b);return mix(a,b,c);}const vec2 g=vec2(.5,.5),h=vec2(1.,0.),i=vec2(0.,1.);void main(){vec2 a=vv0-u8*g;vec4 b=texture2D(u3,a),c=texture2D(u3,a+u8*h),d=texture2D(u3,a+u8*i),j=texture2D(u3,a+u8),k=e(b,c),l=e(d,j);gl_FragColor=e(k,l);}",
              i: ["u3", "u8"],
              u: J,
            },
            s35: {
              h: "uniform sampler2D u3;uniform vec2 u8;varying vec2 vv0;const vec2 k=vec2(1.,0.),l=vec2(0.,1.),m=vec2(2.,0.),n=vec2(0.,2.);vec4 e(vec4 a,vec4 b){vec4 c=step(a,b);return mix(a,b,c);}vec4 f(vec2 a){vec4 b=texture2D(u3,a),c=texture2D(u3,a+u8*k),d=texture2D(u3,a+u8*l),g=texture2D(u3,a+u8),h=e(b,c),i=e(d,g);return e(h,i);}void main(){vec2 a=vv0+u8*vec2(-.55,-1.05);vec4 b=f(a),c=f(a+u8*m),d=f(a+u8*2.),g=f(a+u8*n),h=e(b,c),i=e(d,g);gl_FragColor=e(h,i);}",
              i: ["u3", "u8"],
              u: J,
              ba: !0,
            },
            s36: {
              h: "uniform sampler2D u1;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=a*a;}",
              i: ["u1"],
              u: g,
              precision: "lowp",
              ba: !0,
            },
            s37: {
              h: "uniform sampler2D u1;uniform vec2 u8;varying vec2 vv0;const float e=15444.;void main(){vec4 a=1001./e*texture2D(u1,vv0-3.*u8)+2002./e*texture2D(u1,vv0-2.*u8)+3003./e*texture2D(u1,vv0-u8)+3432./e*texture2D(u1,vv0)+3003./e*texture2D(u1,vv0+u8)+2002./e*texture2D(u1,vv0+2.*u8)+1001./e*texture2D(u1,vv0+3.*u8);gl_FragColor=a;}",
              i: ["u8", "u1"],
              u: g,
              precision: "lowp",
              ba: !0,
            },
            s38: {
              h: "uniform sampler2D u1,u11,u29;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);const float g=.1;void main(){vec4 a=texture2D(u11,vv0),b=texture2D(u29,vv0),c=texture2D(u1,vv0),d=max(f*g,b-a*a),h=sqrt(d);gl_FragColor=(c-a)/h;}",
              i: ["u1", "u11", "u29"],
              u: { u1: 0, u11: 1, u29: 2 },
              ba: !0,
            },
          },
          q = {
            s39: {
              h: "uniform float u17,u30;uniform sampler2D u14,u15,u22;varying vec2 vv0;const vec2 ZERO2=vec2(0.,0.),ONE2=vec2(1.,1.),HALF2=vec2(.5,.5),EPS2=vec2(1e-5,1e-5);void main(){vec4 sum=texture2D(u22,vv0);float toSparsity=1.1111;vec2 uvFrom,uvWeight,xyPatch=ZERO2,eps2=EPS2/u17,xyTo=floor(vv0*u17+eps2);float weightSize=toSparsity*u17;vec2 halfFromSparsity=ONE2*(toSparsity-1.)/2.;for(float patch_x=0.;patch_x<1.1111;patch_x+=1.){xyPatch.x=patch_x;for(float patch_y=0.;patch_y<1.1111;patch_y+=1.)xyPatch.y=patch_y,uvFrom=(xyTo+HALF2+u30*(xyPatch-halfFromSparsity))/u17,uvFrom+=step(uvFrom,-eps2),uvFrom-=step(ONE2-eps2,uvFrom),uvWeight=(xyTo*toSparsity+xyPatch+HALF2)/weightSize,sum+=texture2D(u14,uvWeight)*texture2D(u15,uvFrom);}gl_FragColor=sum,gl_FragColor*=2.2222;}",
              i: ["u17", "u14", "u15", "u22", "u30"],
              Ca: ["1.1111", "gl_FragColor\\*=2.2222;"],
            },
            s40: {
              h: "uniform float u17,u30,u25;uniform sampler2D u14,u15,u22;varying vec2 vv0;const vec2 ZERO2=vec2(0.,0.),ONE2=vec2(1.,1.),HALF2=vec2(.5,.5),EPS2=vec2(1e-4,1e-4);void main(){vec4 sum=texture2D(u22,vv0);float fromSparsity=1.1111,shrinkFactor=3.3333;vec2 uvFrom,uvWeight,xyFrom,xyPatchTo,xyPatch=ZERO2,xyShrink=ZERO2,eps2=EPS2/u25,xyTo=floor(vv0*u17+eps2);float weightSize=fromSparsity*u25;vec2 halfFromSparsity=ONE2*(fromSparsity-1.)/2.;float toSparsity=weightSize/u17;vec2 xyFrom0=xyTo*shrinkFactor;for(float patch_x=0.;patch_x<1.1111;patch_x+=1.){xyPatch.x=patch_x;for(float patch_y=0.;patch_y<1.1111;patch_y+=1.){xyPatch.y=patch_y;for(float shrink_x=0.;shrink_x<3.3333;shrink_x+=1.){xyShrink.x=shrink_x;for(float shrink_y=0.;shrink_y<3.3333;shrink_y+=1.)xyShrink.y=shrink_y,xyFrom=xyFrom0+xyShrink+shrinkFactor*u30*(xyPatch-halfFromSparsity),uvFrom=(xyFrom+HALF2)/u25,uvFrom+=step(uvFrom,-eps2),uvFrom-=step(ONE2-eps2,uvFrom),xyPatchTo=xyPatch*shrinkFactor+xyShrink,uvWeight=(xyTo*toSparsity+xyPatchTo+HALF2)/weightSize,sum+=texture2D(u14,uvWeight)*texture2D(u15,uvFrom);}}}gl_FragColor=sum,gl_FragColor*=2.2222;}",
              i: "u17 u25 u14 u15 u22 u30".split(" "),
              Ca: ["1.1111", "gl_FragColor\\*=2.2222;", "3.3333"],
            },
          },
          h = null,
          L = null,
          O = {
            Sb: function () {
              return H;
            },
            m: function () {
              if (!H) {
                h = La(x, 2);
                L = La(q, 2);
                E = "highp";
                b.getShaderPrecisionFormat &&
                  (b.getShaderPrecisionFormat(
                    b.FRAGMENT_SHADER,
                    b.MEDIUM_FLOAT
                  ),
                  b.getShaderPrecisionFormat(b.FRAGMENT_SHADER, b.LOW_FLOAT));
                for (var v in h) d(b, h[v], v);
                ca.set("s0");
                b.enableVertexAttribArray(0);
                H = !0;
              }
            },
            pe: function (v) {
              v.forEach(function (m) {
                O.pa(m);
              });
            },
            pa: function (v) {
              h[v.id] = v;
              d(b, v, v.id);
            },
            Mh: function (v, m, t) {
              m || (m = v);
              h[m] = Object.create(L[v]);
              h[m].im = !0;
              L[v].Ca &&
                L[v].Ca.forEach(function (M, I) {
                  h[m].h = h[m].h.replace(new RegExp(M, "g"), t[I]);
                });
              d(b, h[m], m);
            },
            set: function (v) {
              var m = h[v];
              m.ba && ((m.ba = !1), d(b, m, v));
              n(m);
            },
            qb: function (v) {
              return k(v, B(), "s41");
            },
            Md: function (v) {
              return k(
                v,
                {
                  h: "void main(){gl_FragColor=vec4(.5,.5,.5,.5);}",
                  i: [],
                  precision: E,
                },
                "s42"
              );
            },
            ml: function (v) {
              return "undefined" === typeof h[v] ? !1 : h[v].Ha;
            },
            H: function () {
              -1 !== u &&
                ((u = -1),
                p.wa.forEach(function (v) {
                  0 !== v && b.disableVertexAttribArray(v);
                }));
            },
            Od: function () {
              var v = 0;
              p.wa.forEach(function (m, t) {
                t = p.P[t];
                b.vertexAttribPointer(m, t, b.FLOAT, !1, p.Gg, v);
                v += 4 * t;
              });
            },
            ll: function () {
              b.enableVertexAttribArray(0);
            },
            Zb: function () {
              O.$b(b);
            },
            $b: function (v) {
              v.vertexAttribPointer(p.wa[0], 2, v.FLOAT, !1, 8, 0);
            },
            Nd: function (v, m) {
              b.uniform1i(p.A[v], m);
            },
            G: function (v, m) {
              b.uniform1f(p.A[v], m);
            },
            N: function (v, m, t) {
              b.uniform2f(p.A[v], m, t);
            },
            bj: function (v, m) {
              b.uniform2fv(p.A[v], m);
            },
            ig: function (v, m) {
              b.uniform3fv(p.A[v], m);
            },
            hg: function (v, m, t, M) {
              b.uniform3f(p.A[v], m, t, M);
            },
            Pn: function (v, m, t, M, I) {
              b.uniform4f(p.A[v], m, t, M, I);
            },
            ya: function (v, m) {
              b.uniform4fv(p.A[v], m);
            },
            Qn: function (v, m) {
              b.uniformMatrix2fv(p.A[v], !1, m);
            },
            Rn: function (v, m) {
              b.uniformMatrix3fv(p.A[v], !1, m);
            },
            Hc: function (v, m) {
              b.uniformMatrix4fv(p.A[v], !1, m);
            },
            j: function (v, m) {
              O.set(v);
              m.forEach(function (t) {
                switch (t.type) {
                  case "4f":
                    b.uniform4fv(p.A[t.name], t.value);
                    break;
                  case "3f":
                    b.uniform3fv(p.A[t.name], t.value);
                    break;
                  case "2f":
                    b.uniform2fv(p.A[t.name], t.value);
                    break;
                  case "1f":
                    b.uniform1f(p.A[t.name], t.value);
                    break;
                  case "1i":
                    b.uniform1i(p.A[t.name], t.value);
                    break;
                  case "mat2":
                    b.uniformMatrix2fv(p.A[t.name], !1, t.value);
                    break;
                  case "mat3":
                    b.uniformMatrix3fv(p.A[t.name], !1, t.value);
                    break;
                  case "mat4":
                    b.uniformMatrix4fv(p.A[t.name], !1, t.value);
                }
              });
            },
            sp: function () {
              return "lowp";
            },
            v: function () {
              O.H();
              b.disableVertexAttribArray(0);
              for (var v in h) {
                var m = h[v];
                m.Ha && ((m.Ha = !1), b.deleteProgram(m.oa));
                m.im && delete h[v];
              }
              l.forEach(function (t) {
                b.deleteShader(t);
              });
              l.splice(0);
              G = 0;
              H = !1;
              p = null;
              u = -1;
            },
          };
        return O;
      })(),
      b = null,
      ab = (function () {
        function a(r) {
          console.log("ERROR in ContextFF: ", r);
          return !1;
        }
        function c() {
          return (
            navigator.userAgent &&
            -1 !== navigator.userAgent.indexOf("forceWebGL1")
          );
        }
        function e(r) {
          function C() {
            Bb.v();
            xa.reset();
            f.getExtension("WEBGL_lose_context").loseContext();
          }
          if (c()) return !1;
          var g = document.createElement("canvas");
          g.setAttribute("width", 5);
          g.setAttribute("height", 5);
          var f = null;
          try {
            f = g.getContext("webgl2", r);
          } catch (y) {
            return !1;
          }
          if (!f) return !1;
          d(f);
          xa.mh(f);
          r = xa.Je(f);
          if (!r.Pa && !r.Ra) return C(), !1;
          r = Bb.Vg(f, r);
          C();
          return r ? !0 : !1;
        }
        function d(r) {
          r.clearColor(0, 0, 0, 0);
          r.disable(r.DEPTH_TEST);
          r.disable(r.BLEND);
          r.disable(r.DITHER);
          r.disable(r.STENCIL_TEST);
          r.disable(r.CULL_FACE);
          r.GENERATE_MIPMAP_HINT && r.hint(r.GENERATE_MIPMAP_HINT, r.FASTEST);
          r.disable(r.SAMPLE_ALPHA_TO_COVERAGE);
          r.disable(r.SAMPLE_COVERAGE);
          r.depthFunc(r.LEQUAL);
          r.clearDepth(1);
        }
        var n = null,
          k = null,
          B = null,
          l = null,
          u = !0,
          p = null,
          G = null,
          H = [],
          E = {
            L: function () {
              return n.width;
            },
            Y: function () {
              return n.height;
            },
            kb: function () {
              return n;
            },
            ql: function () {
              return b;
            },
            ja: function () {
              return u;
            },
            flush: function () {
              b.flush();
            },
            Ap: function () {
              va.fa();
              Z.reset();
              Y.reset();
              ca.H();
              ca.ll();
              b.disable(b.DEPTH_TEST);
              b.disable(b.BLEND);
              Y.Xc();
              ca.Zb();
            },
            vl: function () {
              p || (p = new Uint8Array(n.width * n.height * 4));
              b.readPixels(0, 0, n.width, n.height, b.RGBA, b.UNSIGNED_BYTE, p);
              return p;
            },
            np: function () {
              return n.toDataURL("image/jpeg");
            },
            op: function () {
              va.$();
              k ||
                ((k = document.createElement("canvas")),
                (B = k.getContext("2d")));
              k.width = n.width;
              k.height = n.height;
              for (
                var r = E.vl(),
                  C = B.createImageData(k.width, k.height),
                  g = k.width,
                  f = k.height,
                  y = C.data,
                  J = 0;
                J < f;
                ++J
              )
                for (var x = f - J - 1, q = 0; q < g; ++q) {
                  var h = 4 * (J * g + q),
                    L = 4 * (x * g + q);
                  y[h] = r[L];
                  y[h + 1] = r[L + 1];
                  y[h + 2] = r[L + 2];
                  y[h + 3] = r[L + 3];
                }
              B.putImageData(C, 0, 0);
              return k.toDataURL("image/png");
            },
            yh: function (r) {
              !k &&
                r &&
                ((k = document.createElement("canvas")),
                (B = k.getContext("2d")));
              var C = r ? k : document.createElement("canvas");
              C.width = n.width;
              C.height = n.height;
              (r ? B : C.getContext("2d")).drawImage(n, 0, 0);
              return C;
            },
            m: function (r) {
              r = Object.assign(
                {
                  Qa: null,
                  Of: null,
                  qa: null,
                  Ce: null,
                  width: 512,
                  height: 512,
                  premultipliedAlpha: !1,
                  fm: !0,
                  antialias: !1,
                  debug: !1,
                  ap: !1,
                },
                r
              );
              r.Qa
                ? ((b = r.Qa), (n = r.Qa.canvas))
                : r.Ce && !r.qa
                ? (n = document.getElementById(r.Ce))
                : r.qa && (n = r.qa);
              n || (n = document.createElement("canvas"));
              n.width = r.width;
              n.height = r.height;
              if (b) u = b instanceof WebGL2RenderingContext;
              else {
                u = !0;
                var C = {
                  antialias: r.antialias,
                  alpha: !0,
                  preserveDrawingBuffer: !0,
                  premultipliedAlpha: r.premultipliedAlpha,
                  stencil: !1,
                  depth: r.fm,
                };
                navigator &&
                  navigator.userAgent &&
                  -1 !== navigator.userAgent.indexOf("noAntialiasing") &&
                  (C.antialias = !1);
                var g = e(C);
                g || !C.antialias || c() || ((C.antialias = !1), (g = e(C)));
                g && (b = n.getContext("webgl2", C));
                b
                  ? (u = !0)
                  : ((b = n.getContext("webgl", C)) ||
                      (b = n.getContext("experimental-webgl", C)),
                    (u = !1));
              }
              if (!b) return a("WebGL1 and 2 are not enabled");
              r.Of &&
                n.addEventListener &&
                (l = b.getExtension("WEBGL_lose_context")) &&
                ((G = r.Of), n.addEventListener("webglcontextlost", G, !1));
              if (!xa.m()) return a("Not enough GL capabilities");
              d(b);
              ca.m();
              Y.m();
              Bb.Vg(b, xa.sl());
              H.forEach(function (f) {
                f(b);
              });
              H.splice(0);
              return !0;
            },
            Ro: function () {
              return new Promise(function (r) {
                b ? r(b) : H.push(r);
              });
            },
            v: function () {
              b && (xa.v(), ca.v(), Bb.v());
              l &&
                G &&
                (n.removeEventListener("webglcontextlost", G, !1),
                (l = G = null));
              b = p = B = k = n = null;
              H.splice(0);
            },
          };
        return E;
      })(),
      ob = (function () {
        function a() {
          null === c &&
            ("undefined" !== typeof ca
              ? (c = ca)
              : "undefined" !== typeof F && (c = F));
        }
        var c = null;
        return {
          reset: function () {
            c = null;
          },
          aj: function (e) {
            c !== e && (c && c.H(), (c = e));
          },
          Sb: function () {
            return c.Sb();
          },
          Zb: function () {
            return c.Zb();
          },
          $b: function (e) {
            return c.$b(e);
          },
          Od: function () {
            return c.Od();
          },
          H: function () {
            return c.H();
          },
          set: function (e) {
            a();
            return c.set(e);
          },
          qb: function (e) {
            a();
            return c.qb(e);
          },
          Md: function (e) {
            a();
            return c.Md(e);
          },
        };
      })(),
      Z = (function () {
        function a(t) {
          b.bindTexture(b.TEXTURE_2D, t);
        }
        function c(t) {
          var M = new Uint16Array(t.length);
          t.forEach(function (I, K) {
            L[0] = I;
            var P = O[0];
            var ba = (P >> 16) & 32768;
            I = (P >> 12) & 2047;
            var ja = (P >> 23) & 255;
            P =
              103 > ja
                ? ba
                : 142 < ja
                ? ba | 31744 | ((255 == ja ? 0 : 1) && P & 8388607)
                : 113 > ja
                ? ((I |= 2048),
                  ba | ((I >> (114 - ja)) + ((I >> (113 - ja)) & 1)))
                : (ba | ((ja - 112) << 10) | (I >> 1)) + (I & 1);
            M[K] = P;
          });
          return M;
        }
        function e() {
          if (null !== v.kf) return v.kf;
          var t = d(c([0.5, 0.5, 0.5, 0.5]), !0);
          return null === t ? !0 : (v.kf = t);
        }
        function d(t, M) {
          if (!ob.Sb() || !r) return null;
          var I = null,
            K = Math.sqrt(t.length / 4);
          try {
            var P = b.getError();
            if ("FUCKING_BIG_ERROR" === P) return !1;
            I = m.instance({ isFloat: !1, S: M, array: t, width: K });
            P = b.getError();
            if (P !== b.NO_ERROR) return !1;
          } catch (ba) {
            return !1;
          }
          va.$();
          b.viewport(0, 0, K, K);
          b.clearColor(0, 0, 0, 0);
          b.clear(b.COLOR_BUFFER_BIT);
          ob.set("s0");
          I.Cb(0);
          Y.l(!0, !0);
          t = 4 * K * K;
          M = new Uint8Array(t);
          b.readPixels(0, 0, K, K, b.RGBA, b.UNSIGNED_BYTE, M);
          K = !0;
          for (P = 0; P < t; ++P) K = K && 3 > Math.abs(M[P] - 127);
          I.remove();
          va.fa();
          return K;
        }
        var n = 0,
          k = null,
          B = 0,
          l = null,
          u = null,
          p = null,
          G = null,
          H = null,
          E = null,
          r = !1,
          C = [],
          g = {
            isFloat: !1,
            isPot: !0,
            isLinear: !1,
            isMipmap: !1,
            isAnisotropicFiltering: !1,
            isMirrorX: !1,
            isMirrorY: !1,
            isSrgb: !1,
            isKeepArray: !1,
            isFlipY: null,
            width: 0,
            height: 0,
            url: null,
            array: null,
            data: null,
            ia: null,
            Fh: null,
            gm: !1,
            S: !1,
            R: null,
            F: 4,
            If: 0,
          },
          f = !1,
          y = null,
          J = null,
          x = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
          ],
          q = !1,
          h = !1,
          L = new Float32Array(1),
          O = new Int32Array(L.buffer),
          v = { kf: null, lf: null },
          m = {
            m: function () {
              r ||
                ((H = [b.RGBA, null, b.RGBA, b.RGBA]),
                (E = [b.RGBA, null, b.RGBA, b.RGBA]),
                (k = [
                  b.TEXTURE0,
                  b.TEXTURE1,
                  b.TEXTURE2,
                  b.TEXTURE3,
                  b.TEXTURE4,
                  b.TEXTURE5,
                  b.TEXTURE6,
                  b.TEXTURE7,
                ]),
                (q = "undefined" !== typeof da),
                (h = "undefined" !== typeof xa),
                (l = [-1, -1, -1, -1, -1, -1, -1, -1]),
                (G = [b.UNSIGNED_BYTE, b.FLOAT, b.FLOAT]),
                (r = !0));
            },
            Yl: function () {
              if (!u) {
                for (var t = new Float32Array(16384), M = 0; 16384 > M; ++M)
                  t[M] = 2 * Math.random() - 1;
                u = {
                  random: m.instance({
                    isFloat: !0,
                    isPot: !0,
                    array: t,
                    width: 64,
                  }),
                  pj: m.instance({
                    isFloat: !1,
                    isPot: !0,
                    width: 1,
                    array: new Uint8Array([0, 0, 0, 0]),
                  }),
                };
              }
              m.lo();
            },
            Eh: function () {
              return u.pj;
            },
            lo: function () {
              G[1] = xa.We(b);
            },
            Kn: function () {
              E = H = [b.RGBA, b.RGBA, b.RGBA, b.RGBA];
            },
            Fi: function (t) {
              ca.set("s1");
              va.$();
              var M = t.L(),
                I = t.Y();
              b.viewport(0, 0, M, I);
              t.g(0);
              Y.l(!1, !1);
            },
            Mp: function (t, M) {
              m.Fi(t);
              b.readPixels(0, 0, t.L(), t.Y(), b.RGBA, b.UNSIGNED_BYTE, M);
            },
            Np: function (t, M) {
              m.Fi(t);
              return xa.Wf(0, 0, t.L(), t.Y(), M);
            },
            th: function (t, M, I, K, P, ba, ja) {
              t.activeTexture(t.TEXTURE0);
              var U = t.createTexture();
              t.bindTexture(t.TEXTURE_2D, U);
              P = P instanceof Float32Array ? P : new Float32Array(P);
              t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE);
              t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE);
              t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.NEAREST);
              t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.NEAREST);
              t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, ba);
              t.texImage2D(
                t.TEXTURE_2D,
                0,
                t.RGBA,
                I,
                K,
                0,
                t.RGBA,
                t.FLOAT,
                P
              );
              t.bindTexture(t.TEXTURE_2D, null);
              t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, !1);
              ja && (va.fa(), ca.qb(t));
              t.viewport(0, 0, I, K);
              t.framebufferTexture2D(
                t.FRAMEBUFFER,
                t.COLOR_ATTACHMENT0,
                t.TEXTURE_2D,
                M,
                0
              );
              t.bindTexture(t.TEXTURE_2D, U);
              ja ? Y.l(!0, !0) : Y.Ib(t);
              t.deleteTexture(U);
              r && ((l[0] = -1), (p = null), (n = 0));
            },
            oe: function (t) {
              t !== n && (b.activeTexture(k[t]), (n = t));
            },
            instance: function (t) {
              function M() {
                ka = void 0 !== w.ia.videoWidth ? w.ia.videoWidth : w.ia.width;
                la =
                  void 0 !== w.ia.videoHeight ? w.ia.videoHeight : w.ia.height;
              }
              function I(A) {
                var Q = b.getError();
                if ("FUCKING_BIG_ERROR" === Q) return !1;
                b.texImage2D(b.TEXTURE_2D, 0, Wa, Ta, Va, A);
                Q = b.getError();
                Q !== b.NO_ERROR &&
                  Ta !== b.RGBA &&
                  ((Ta = b.RGBA), b.texImage2D(b.TEXTURE_2D, 0, Wa, Ta, Va, A));
                return !0;
              }
              function K() {
                if (!V) {
                  a(oa);
                  jb && b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL, jb);
                  w.isPot
                    ? (b.texParameteri(
                        b.TEXTURE_2D,
                        b.TEXTURE_WRAP_S,
                        w.isMirrorX ? b.MIRRORED_REPEAT : b.REPEAT
                      ),
                      b.texParameteri(
                        b.TEXTURE_2D,
                        b.TEXTURE_WRAP_T,
                        w.isMirrorY ? b.MIRRORED_REPEAT : b.REPEAT
                      ))
                    : (b.texParameteri(
                        b.TEXTURE_2D,
                        b.TEXTURE_WRAP_S,
                        b.CLAMP_TO_EDGE
                      ),
                      b.texParameteri(
                        b.TEXTURE_2D,
                        b.TEXTURE_WRAP_T,
                        b.CLAMP_TO_EDGE
                      ));
                  w.isAnisotropicFiltering &&
                    "undefined" !== typeof T &&
                    b.texParameterf(
                      b.TEXTURE_2D,
                      da.wl().TEXTURE_MAX_ANISOTROPY_EXT,
                      T.Sj
                    );
                  b.texParameteri(
                    b.TEXTURE_2D,
                    b.TEXTURE_MAG_FILTER,
                    w.isLinear ? b.LINEAR : b.NEAREST
                  );
                  w.isLinear
                    ? b.texParameteri(
                        b.TEXTURE_2D,
                        b.TEXTURE_MIN_FILTER,
                        w.isMipmap && !ib ? b.NEAREST_MIPMAP_LINEAR : b.LINEAR
                      )
                    : b.texParameteri(
                        b.TEXTURE_2D,
                        b.TEXTURE_MIN_FILTER,
                        w.isMipmap && !ib ? b.NEAREST_MIPMAP_NEAREST : b.NEAREST
                      );
                  Ta = H[w.F - 1];
                  Wa = E[w.F - 1];
                  Va = G[D];
                  if (xa.ja()) {
                    var A = xa.yl();
                    Ta === b.RGBA && Va === b.FLOAT
                      ? w.isMipmap || w.isLinear
                        ? (Wa = Bb.Al(b))
                        : xa.ea()
                        ? A && (Wa = A)
                        : (Wa = b.RGBA16F || b.RGBA)
                      : Ta === b.RGB &&
                        Va === b.FLOAT &&
                        A &&
                        ((Wa = A), (Ta = b.RGBA));
                  }
                  if (
                    (w.S && !w.isFloat) ||
                    (w.isFloat && w.isMipmap && Bb.pm())
                  )
                    (Wa = xa.zl()), (Va = xa.We(b));
                  w.If && (qb = w.If);
                  w.isSrgb && 4 === w.F && (Ta = da.Pl());
                  if (w.ia) I(w.ia);
                  else if (w.url) I(Ma);
                  else if (Da) {
                    A = Da;
                    try {
                      "FUCKING_BIG_ERROR" !== b.getError() &&
                        (b.texImage2D(
                          b.TEXTURE_2D,
                          0,
                          Wa,
                          ka,
                          la,
                          0,
                          Ta,
                          Va,
                          A
                        ),
                        b.getError() !== b.NO_ERROR &&
                          (b.texImage2D(
                            b.TEXTURE_2D,
                            0,
                            Wa,
                            ka,
                            la,
                            0,
                            Ta,
                            Va,
                            null
                          ),
                          b.getError() !== b.NO_ERROR &&
                            b.texImage2D(
                              b.TEXTURE_2D,
                              0,
                              b.RGBA,
                              ka,
                              la,
                              0,
                              b.RGBA,
                              b.UNSIGNED_BYTE,
                              null
                            )));
                    } catch (fb) {
                      b.texImage2D(
                        b.TEXTURE_2D,
                        0,
                        Wa,
                        ka,
                        la,
                        0,
                        Ta,
                        Va,
                        null
                      );
                    }
                    w.isKeepArray || (Da = null);
                  } else
                    (A = b.getError()),
                      "FUCKING_BIG_ERROR" !== A &&
                        (b.texImage2D(
                          b.TEXTURE_2D,
                          0,
                          Wa,
                          ka,
                          la,
                          0,
                          Ta,
                          Va,
                          null
                        ),
                        (A = b.getError()),
                        A !== b.NO_ERROR &&
                          ((Ta = b.RGBA),
                          w.S &&
                            Va !== b.FLOAT &&
                            ((Va = b.FLOAT),
                            b.texImage2D(
                              b.TEXTURE_2D,
                              0,
                              Wa,
                              ka,
                              la,
                              0,
                              Ta,
                              Va,
                              null
                            ))));
                  if (w.isMipmap)
                    if (!ib && Na) Na.ld(), (rb = !0);
                    else if (ib) {
                      A = Math.log2(Math.min(ka, la));
                      nb = Array(1 + A);
                      nb[0] = oa;
                      for (var Q = 1; Q <= A; ++Q) {
                        var fa = Math.pow(2, Q),
                          ia = ka / fa;
                        fa = la / fa;
                        var Ha = b.createTexture();
                        a(Ha);
                        b.texParameteri(
                          b.TEXTURE_2D,
                          b.TEXTURE_MIN_FILTER,
                          b.NEAREST
                        );
                        b.texParameteri(
                          b.TEXTURE_2D,
                          b.TEXTURE_MAG_FILTER,
                          b.NEAREST
                        );
                        b.texImage2D(
                          b.TEXTURE_2D,
                          0,
                          Wa,
                          ia,
                          fa,
                          0,
                          Ta,
                          Va,
                          null
                        );
                        a(null);
                        nb[Q] = Ha;
                      }
                      rb = !0;
                    }
                  a(null);
                  l[n] = -1;
                  jb && b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL, !1);
                  Ba = !0;
                  w.R && Na && (w.R(Na), (w.R = null));
                }
              }
              function P() {
                for (
                  var A = ka * la, Q = 2 * A, fa = 3 * A, ia = 0;
                  ia < A;
                  ++ia
                )
                  (ra[0][ia] = sb[ia]),
                    (ra[1][ia] = sb[ia + A]),
                    (ra[2][ia] = sb[ia + Q]),
                    (ra[3][ia] = sb[ia + fa]);
              }
              function ba() {
                var A = ka * la * 4;
                Ga = [
                  new Uint8Array(A),
                  new Uint8Array(A),
                  new Uint8Array(A),
                  new Uint8Array(A),
                ];
                ra = [
                  new Float32Array(Ga[0].buffer),
                  new Float32Array(Ga[1].buffer),
                  new Float32Array(Ga[2].buffer),
                  new Float32Array(Ga[3].buffer),
                ];
                Ia = new Uint8Array(4 * A);
                sb = new Float32Array(Ia.buffer);
                ha = !0;
              }
              function ja() {
                U = new Uint8Array(ka * la * 4);
                Xa = new Float32Array(U.buffer);
                Fb = !0;
              }
              var U,
                w = Object.assign({}, g, t),
                z = B++;
              null === w.isFlipY && (w.isFlipY = w.url ? !0 : !1);
              w.data &&
                ((w.array =
                  "string" === typeof w.data
                    ? hb(w.data)
                    : w.isFloat
                    ? new Float32Array(w.data)
                    : new Uint8Array(w.data)),
                (w.isFlipY = !1));
              var D = 0,
                S = w.ia ? !0 : !1,
                ea = null,
                X = null,
                aa = !1;
              w.S = w.S || w.isFloat;
              w.S && (D = 1);
              !w.gm && w.isFloat && h && !xa.ea() && (w.isFloat = !1);
              w.isFloat && (D = 2);
              w.isAnisotropicFiltering &&
                q &&
                !da.om() &&
                (w.isAnisotropicFiltering = !1);
              var oa = w.Fh || b.createTexture(),
                Ma = null,
                Da = !1,
                ka = 0,
                la = 0,
                Ba = !1,
                V = !1,
                ha = !1,
                ra = null,
                Ga = null,
                Ia = null,
                sb = null,
                Wa = null,
                Ta = null,
                Va = null,
                jb = w.isFlipY,
                lc = (t = w.S && w.isMipmap) && Bb.Bk(),
                ib = t && lc ? !0 : !1,
                nb = null,
                qb = -1,
                rb = !1,
                Fb = !1,
                Xa = (U = null);
              w.width && ((ka = w.width), (la = w.height ? w.height : ka));
              var Na = {
                get: function () {
                  return oa;
                },
                L: function () {
                  return ka;
                },
                Y: function () {
                  return la;
                },
                Rl: function () {
                  return w.url;
                },
                Yh: function () {
                  return w.isFloat;
                },
                Zh: function () {
                  return w.S;
                },
                Ep: function () {
                  return w.isLinear;
                },
                ld: function () {
                  b.generateMipmap(b.TEXTURE_2D);
                },
                sk: function (A, Q) {
                  ib
                    ? (A || (A = Na.Ch()), m.oe(Q), a(nb[A]), (l[Q] = -1))
                    : Na.g(Q);
                },
                Ch: function () {
                  -1 === qb && (qb = Math.log(ka) / Math.log(2));
                  return qb;
                },
                pl: function (A) {
                  if (ib) {
                    A || (A = Na.Ch());
                    ca.set("s12");
                    m.oe(0);
                    for (var Q = ka, fa = la, ia = 1; ia <= A; ++ia)
                      (Q /= 2),
                        (fa /= 2),
                        ca.N("u8", 0.25 / Q, 0.25 / fa),
                        b.viewport(0, 0, Q, fa),
                        a(nb[ia - 1]),
                        b.framebufferTexture2D(
                          va.pd(),
                          b.COLOR_ATTACHMENT0,
                          b.TEXTURE_2D,
                          nb[ia],
                          0
                        ),
                        Y.l(!1, 1 === ia);
                    l[0] = -1;
                  } else Na.ld();
                },
                Yp: function (A) {
                  (S = !(
                    Array.isArray(A) ||
                    A.constructor === Float32Array ||
                    A.constructor === Uint8Array
                  ))
                    ? ((Da = null), (w.ia = A), M())
                    : (Da = A);
                },
                g: function (A) {
                  if (!Ba) return !1;
                  m.oe(A);
                  if (l[A] === z) return !1;
                  a(oa);
                  l[A] = z;
                  return !0;
                },
                Cb: function (A) {
                  b.activeTexture(k[A]);
                  n = A;
                  a(oa);
                  l[A] = z;
                },
                o: function () {
                  p = Na;
                  b.framebufferTexture2D(
                    va.pd(),
                    b.COLOR_ATTACHMENT0,
                    b.TEXTURE_2D,
                    oa,
                    0
                  );
                },
                M: function () {
                  p = Na;
                  b.viewport(0, 0, ka, la);
                  b.framebufferTexture2D(
                    va.pd(),
                    b.COLOR_ATTACHMENT0,
                    b.TEXTURE_2D,
                    oa,
                    0
                  );
                },
                Yd: m.Yd,
                Dn: function (A, Q) {
                  ka = A;
                  la = Q;
                },
                resize: function (A, Q) {
                  Na.Dn(A, Q);
                  K();
                },
                clone: function (A) {
                  A = m.instance({
                    width: ka,
                    height: la,
                    S: w.S,
                    isFloat: w.isFloat,
                    isLinear: w.isLinear,
                    isMirrorY: w.isMirrorY,
                    isFlipY: A ? !jb : jb,
                    isPot: w.isPot,
                  });
                  ob.set("s0");
                  va.fa();
                  A.o();
                  b.viewport(0, 0, ka, la);
                  Na.g(0);
                  Y.l(!0, !0);
                  return A;
                },
                Ic: function () {
                  b.viewport(0, 0, ka, la);
                },
                remove: function () {
                  b.deleteTexture(oa);
                  V = !0;
                  C.splice(C.indexOf(Na), 1);
                  Na = null;
                },
                refresh: function () {
                  Na.Cb(0);
                  jb && b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL, !0);
                  S
                    ? b.texImage2D(b.TEXTURE_2D, 0, Wa, Ta, Va, w.ia)
                    : b.texImage2D(b.TEXTURE_2D, 0, Wa, ka, la, 0, Ta, Va, Da);
                  jb && b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL, !1);
                },
                Di: function () {
                  ha || ba();
                  b.readPixels(0, 0, ka, 4 * la, b.RGBA, b.UNSIGNED_BYTE, Ia);
                  P();
                  return ra;
                },
                an: function () {
                  ha || ba();
                  return xa.Wf(0, 0, ka, 4 * la, Ia).then(function () {
                    P();
                    return ra;
                  });
                },
                cn: function () {
                  Fb || ja();
                  b.readPixels(0, 0, ka, la, b.RGBA, b.UNSIGNED_BYTE, U);
                  return Xa;
                },
                bn: function () {
                  Fb || ja();
                  return xa.Wf(0, 0, ka, la, U);
                },
                ih: function (A) {
                  va.$();
                  ca.set("s13");
                  Na.g(0);
                  if (A)
                    b.viewport(0, 0, ka, la),
                      ca.Pn("u9", 0.25, 0.25, 0.25, 0.25),
                      Y.l(!1, !0);
                  else
                    for (A = 0; 4 > A; ++A)
                      b.viewport(0, la * A, ka, la),
                        ca.ya("u9", x[A]),
                        Y.l(!1, 0 === A);
                },
                Bg: function (A) {
                  var Q;
                  if ((Q = Va === G[0]))
                    null !== v.lf
                      ? (Q = v.lf)
                      : ((Q = d(new Uint8Array([127, 127, 127, 127]), !1)),
                        (Q = null === Q ? !0 : (v.lf = Q))),
                      (Q = !Q);
                  a(oa);
                  jb && b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL, !0);
                  Q
                    ? (aa ||
                        ((ea = document.createElement("canvas")),
                        (ea.width = ka),
                        (ea.height = la),
                        (X = ea.getContext("2d")),
                        X.createImageData(ka, la),
                        (aa = !0)),
                      null.data.set(A),
                      X.putImageData(null, 0, 0),
                      b.texImage2D(b.TEXTURE_2D, 0, Wa, Ta, Va, ea))
                    : b.texImage2D(b.TEXTURE_2D, 0, Wa, ka, la, 0, Ta, Va, A);
                  l[n] = z;
                  jb && b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL, !1);
                },
                jq: function (A, Q) {
                  a(oa);
                  Q && b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL, !0);
                  b.texImage2D(b.TEXTURE_2D, 0, Wa, Ta, Va, A);
                  l[n] = z;
                  Q && b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL, !1);
                },
                Fc: function (A, Q) {
                  var fa = ka * la,
                    ia = 4 * fa;
                  A = w.S ? (A ? "RGBE" : "JSON") : "RGBA";
                  Q && (A = Q);
                  Q = xa.ja() && !1;
                  var Ha = null;
                  switch (A) {
                    case "RGBE":
                      Ha = "s43";
                      break;
                    case "JSON":
                      Ha = Q ? "s0" : "s13";
                      break;
                    case "RGBA":
                    case "RGBAARRAY":
                      Ha = "s7";
                  }
                  ha ||
                    ("RGBA" === A || "RGBE" === A || "RGBAARRAY" === A
                      ? ((Ga = new Uint8Array(ia)), (ha = !0))
                      : "JSON" !== A || Q || ba());
                  va.$();
                  ca.set(Ha);
                  Na.g(0);
                  ia = null;
                  if ("RGBA" === A || "RGBE" === A || "RGBAARRAY" === A) {
                    b.viewport(0, 0, ka, la);
                    Y.l(!0, !0);
                    b.readPixels(0, 0, ka, la, b.RGBA, b.UNSIGNED_BYTE, Ga);
                    if ("RGBAARRAY" === A) return { data: Ga };
                    f ||
                      ((y = document.createElement("canvas")),
                      (J = y.getContext("2d")),
                      (f = !0));
                    y.width = ka;
                    y.height = la;
                    fa = J.createImageData(ka, la);
                    fa.data.set(Ga);
                    J.putImageData(fa, 0, 0);
                    ia = y.toDataURL("image/png");
                  } else if ("JSON" === A)
                    if (Q)
                      (ia = new Float32Array(fa)),
                        b.viewport(0, 0, ka, la),
                        Y.l(!0, !0),
                        b.readPixels(0, 0, ka, la, b.RGBA, b.FLOAT, ia);
                    else {
                      for (ia = 0; 4 > ia; ++ia)
                        b.viewport(0, la * ia, ka, la),
                          ca.ya("u9", x[ia]),
                          Y.l(!ia, !ia);
                      Na.Di();
                      ia = Array(fa);
                      for (Q = 0; Q < fa; ++Q)
                        (ia[4 * Q] = ra[0][Q]),
                          (ia[4 * Q + 1] = ra[1][Q]),
                          (ia[4 * Q + 2] = ra[2][Q]),
                          (ia[4 * Q + 3] = ra[3][Q]);
                    }
                  return {
                    format: A,
                    data: ia,
                    width: ka,
                    height: la,
                    isMirrorY: w.isMirrorY,
                    isFlipY: "RGBA" === A ? w.isFlipY : !w.isFlipY,
                  };
                },
              };
              w.isMipmap && !ib && Ba && !rb && (Na.ld(), (rb = !0));
              if (w.url)
                a(oa),
                  b.texImage2D(
                    b.TEXTURE_2D,
                    0,
                    b.RGBA,
                    1,
                    1,
                    0,
                    b.RGBA,
                    b.UNSIGNED_BYTE,
                    null
                  ),
                  (Ma = new Image()),
                  (Ma.$o = "Anonymous"),
                  (Ma.crossOrigin = "Anonymous"),
                  (Ma.src = w.url),
                  (Ma.onload = function () {
                    ka = Ma.width;
                    la = Ma.height;
                    K();
                  });
              else if (w.ia) {
                var Ea = function () {
                  M();
                  ka ? K() : setTimeout(Ea, 1);
                };
                Ea();
              } else
                w.array
                  ? (w.S && !w.isFloat
                      ? w.array instanceof Uint16Array
                        ? ((Da = w.array), K())
                        : e()
                        ? ((Da = c(w.array)), K())
                        : (K(), m.th(b, oa, Na.L(), Na.Y(), w.array, jb, !0))
                      : ((Da = w.isFloat
                          ? w.array instanceof Float32Array
                            ? w.array
                            : new Float32Array(w.array)
                          : w.array instanceof Uint8Array
                          ? w.array
                          : new Uint8Array(w.array)),
                        K()),
                    w.isKeepArray ||
                      (Da && Da !== w.array && (Da = null), delete w.array))
                  : w.Fh
                  ? (Ba = !0)
                  : K();
              Na.wp = Na.L;
              w.R && Ba && (w.R(Na), (w.R = null));
              C.push(Na);
              return Na;
            },
            $: function (t) {
              t !== n && (b.activeTexture(k[t]), (n = t));
              l[t] = -1;
              a(null);
            },
            uk: function (t) {
              u.random.g(t);
            },
            Yd: function () {
              p = null;
              b.framebufferTexture2D(
                va.pd(),
                b.COLOR_ATTACHMENT0,
                b.TEXTURE_2D,
                null,
                0
              );
            },
            reset: function () {
              0 !== n && b.activeTexture(k[0]);
              for (var t = 0; t < k.length; ++t) l[t] = -1;
              n = -1;
            },
            Qp: function () {
              n = -1;
            },
            rj: function () {
              for (var t = 0; t < k.length; ++t) m.$(t);
            },
            K: function () {
              u && (u.random.remove(), u.pj.remove());
            },
            Lc: function (t, M) {
              if ("RGBA" === t.format || "RGBE" === t.format) {
                var I = new Image();
                I.src = t.data;
                I.onload = function () {
                  m.instance({
                    isMirrorY: t.isMirrorY,
                    isFlipY: t.isFlipY,
                    isFloat: !1,
                    ia: I,
                    R: function (K) {
                      if ("RGBA" === t.format) M(K);
                      else {
                        var P = t.width,
                          ba = t.height,
                          ja = m.instance({
                            isMirrorY: t.isMirrorY,
                            isFloat: !0,
                            width: P,
                            height: ba,
                            isFlipY: t.isFlipY,
                          });
                        va.fa();
                        b.viewport(0, 0, P, ba);
                        ca.set("s44");
                        ja.o();
                        K.g(0);
                        Y.l(!0, !0);
                        m.$(0);
                        M(ja);
                        xa.flush();
                        setTimeout(K.remove, 50);
                      }
                    },
                  });
                };
              } else
                "JSON" === t.format
                  ? M(
                      m.instance({
                        isFloat: !0,
                        isFlipY: t.isFlipY,
                        width: t.width,
                        height: t.height,
                        array: new Float32Array(t.data),
                      })
                    )
                  : M(!1);
            },
            Hk: c,
            v: function () {
              p && (va.fa(), m.Yd(), va.$());
              m.rj();
              C.slice(0).forEach(function (t) {
                t.remove();
              });
              C.splice(0);
              r = !1;
              B = 0;
              "undefined" !== typeof Bb && Bb.v();
              u = null;
            },
          };
        return m;
      })(),
      Ec = {
        instance: function (a) {
          var c = [Z.instance(a), Z.instance(a)],
            e = [c[1], c[0]],
            d = e,
            n = {
              Ti: function (k) {
                d[1].o();
                d[0].g(k);
                n.fj();
              },
              yn: function (k) {
                d[1].M();
                d[0].g(k);
                n.fj();
              },
              fj: function () {
                d = d === c ? e : c;
              },
              refresh: function () {
                d[0].refresh();
                d[1].refresh();
              },
              g: function (k) {
                d[0].g(k);
              },
              tk: function (k) {
                d[1].g(k);
              },
              rp: function () {
                return d[0];
              },
              up: function () {
                return d[1];
              },
              Bg: function (k) {
                d[0].Bg(k);
                d[1].Bg(k);
              },
              remove: function () {
                d[0].remove();
                d[1].remove();
                d = null;
              },
              sync: function () {
                n.yn(0);
                ca.set("s0");
                Y.l(!1, !1);
              },
            };
          return n;
        },
      },
      Y = (function () {
        function a(u) {
          var p = { ha: null, U: null };
          p.ha = u.createBuffer();
          u.bindBuffer(u.ARRAY_BUFFER, p.ha);
          u.bufferData(
            u.ARRAY_BUFFER,
            new Float32Array([-1, -1, 3, -1, -1, 3]),
            u.STATIC_DRAW
          );
          p.U = u.createBuffer();
          u.bindBuffer(u.ELEMENT_ARRAY_BUFFER, p.U);
          u.bufferData(
            u.ELEMENT_ARRAY_BUFFER,
            new Uint16Array([0, 1, 2]),
            u.STATIC_DRAW
          );
          return p;
        }
        var c = null,
          e = 0,
          d = !1,
          n = [],
          k = -2,
          B = -2,
          l = {
            reset: function () {
              B = k = -2;
            },
            m: function () {
              d || ((c = a(b)), l.Xc(), (d = !0));
            },
            instance: function (u) {
              var p = e++,
                G = u.U ? u.U.length : 0,
                H = "undefined" === typeof u.mode ? b.STATIC_DRAW : u.mode,
                E = b.createBuffer();
              b.bindBuffer(b.ARRAY_BUFFER, E);
              b.bufferData(
                b.ARRAY_BUFFER,
                u.ha instanceof Float32Array ? u.ha : new Float32Array(u.ha),
                H
              );
              k = p;
              var r = null,
                C = null,
                g = null;
              if (u.U) {
                r = b.createBuffer();
                b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, r);
                var f = null;
                65536 > u.U.length
                  ? ((f = Uint16Array), (C = b.UNSIGNED_SHORT), (g = 2))
                  : ((f = Uint32Array), (C = b.UNSIGNED_INT), (g = 4));
                f = u.U instanceof f ? u.U : new f(u.U);
                b.bufferData(b.ELEMENT_ARRAY_BUFFER, f, H);
                B = p;
              }
              var y = {
                qc: function (J) {
                  k !== p && (b.bindBuffer(b.ARRAY_BUFFER, E), (k = p));
                  J && ob.Od();
                },
                qk: function () {
                  B !== p && (b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, r), (B = p));
                },
                bind: function (J) {
                  y.qc(J);
                  y.qk();
                },
                V: function () {
                  b.drawElements(b.TRIANGLES, G, C, 0);
                },
                Fa: function (J, x) {
                  b.drawElements(b.TRIANGLES, J, C, x * g);
                },
                remove: function () {
                  b.deleteBuffer(E);
                  u.U && b.deleteBuffer(r);
                  y = null;
                },
              };
              n.push(y);
              return y;
            },
            Xc: function () {
              -1 !== k && (b.bindBuffer(b.ARRAY_BUFFER, c.ha), (k = -1));
              -1 !== B && (b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, c.U), (B = -1));
            },
            l: function (u, p) {
              u && Y.Xc();
              p && ob.Zb();
              b.drawElements(b.TRIANGLES, 3, b.UNSIGNED_SHORT, 0);
            },
            Ib: function (u) {
              u = u || b;
              var p = a(u);
              u.bindBuffer(u.ARRAY_BUFFER, p.ha);
              u.bindBuffer(u.ELEMENT_ARRAY_BUFFER, p.U);
              ob.$b(u);
              u.clear(u.COLOR_BUFFER_BIT);
              u.drawElements(u.TRIANGLES, 3, u.UNSIGNED_SHORT, 0);
              u.flush();
              u.bindBuffer(u.ARRAY_BUFFER, null);
              u.bindBuffer(u.ELEMENT_ARRAY_BUFFER, null);
              u.deleteBuffer(p.ha);
              u.deleteBuffer(p.U);
              l.reset();
              d && (l.Xc(), ob.Zb());
            },
            K: function () {
              var u = b,
                p = c;
              u.deleteBuffer(p.ha);
              u.deleteBuffer(p.U);
            },
            v: function () {
              l.K();
              n.forEach(function (u) {
                u.remove();
              });
              b.bindBuffer(b.ARRAY_BUFFER, null);
              b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, null);
              l.reset();
              d = !1;
              n.splice(0);
              e = 0;
            },
          };
        return l;
      })(),
      va = (function () {
        var a = null,
          c = null,
          e = null,
          d = !1,
          n = [],
          k = { na: -2, sh: 1 },
          B = {
            Sb: function () {
              return d;
            },
            m: function () {
              if (!d) {
                a = b.createFramebuffer();
                var l = xa.ja();
                c =
                  l && b.DRAW_FRAMEBUFFER ? b.DRAW_FRAMEBUFFER : b.FRAMEBUFFER;
                e =
                  l && b.READ_FRAMEBUFFER ? b.READ_FRAMEBUFFER : b.FRAMEBUFFER;
                d = !0;
              }
            },
            xl: function () {
              return c;
            },
            zh: function () {
              return e;
            },
            pd: function () {
              return b.FRAMEBUFFER;
            },
            vp: function () {
              return k;
            },
            kp: function () {
              return a;
            },
            instance: function (l) {
              void 0 === l.wc && (l.wc = !1);
              var u = l.ka ? l.ka : null,
                p = l.width,
                G = void 0 !== l.height ? l.height : l.width,
                H = a,
                E = null,
                r = !1,
                C = !1,
                g = 0;
              u && ((p = p ? p : u.L()), (G = G ? G : u.Y()));
              var f = {
                Ni: function () {
                  r || ((H = b.createFramebuffer()), (r = !0), (g = k.sh++));
                },
                Sc: function () {
                  f.Ni();
                  f.o();
                  E = b.createRenderbuffer();
                  b.bindRenderbuffer(b.RENDERBUFFER, E);
                  b.renderbufferStorage(
                    b.RENDERBUFFER,
                    b.DEPTH_COMPONENT16,
                    p,
                    G
                  );
                  b.framebufferRenderbuffer(
                    c,
                    b.DEPTH_ATTACHMENT,
                    b.RENDERBUFFER,
                    E
                  );
                  b.clearDepth(1);
                },
                bind: function (y, J) {
                  g !== k.na && (b.bindFramebuffer(c, H), (k.na = g));
                  u && u.o();
                  J && b.viewport(0, 0, p, G);
                  y && b.clear(b.COLOR_BUFFER_BIT | b.DEPTH_BUFFER_BIT);
                },
                Qg: function () {
                  g !== k.na && (b.bindFramebuffer(c, H), (k.na = g));
                },
                clear: function () {
                  b.clear(b.COLOR_BUFFER_BIT | b.DEPTH_BUFFER_BIT);
                },
                ye: function () {
                  b.clear(b.COLOR_BUFFER_BIT);
                },
                Xg: function () {
                  b.clear(b.DEPTH_BUFFER_BIT);
                },
                Ic: function () {
                  b.viewport(0, 0, p, G);
                },
                o: function () {
                  g !== k.na && (b.bindFramebuffer(c, H), (k.na = g));
                },
                rtt: function (y) {
                  u = y;
                  k.na !== g &&
                    (b.bindFramebuffer(b.FRAMEBUFFER, H), (k.na = g));
                  y.o();
                },
                $: function () {
                  b.bindFramebuffer(c, null);
                  k.na = -1;
                },
                resize: function (y, J) {
                  p = y;
                  G = J;
                  E &&
                    (b.bindRenderbuffer(b.RENDERBUFFER, E),
                    b.renderbufferStorage(
                      b.RENDERBUFFER,
                      b.DEPTH_COMPONENT16,
                      p,
                      G
                    ));
                },
                remove: function () {
                  H === a ||
                    C ||
                    (b.bindFramebuffer(c, H),
                    b.framebufferTexture2D(
                      c,
                      b.COLOR_ATTACHMENT0,
                      b.TEXTURE_2D,
                      null,
                      0
                    ),
                    E &&
                      b.framebufferRenderbuffer(
                        c,
                        b.DEPTH_ATTACHMENT,
                        b.RENDERBUFFER,
                        null
                      ),
                    b.bindFramebuffer(c, null),
                    b.deleteFramebuffer(H),
                    E && b.deleteRenderbuffer(E));
                  C = !0;
                },
              };
              l.wc && f.Sc();
              n.push(f);
              return f;
            },
            $: function () {
              b.bindFramebuffer(c, null);
              k.na = -1;
            },
            hq: function () {
              b.bindFramebuffer(c, null);
              b.clear(b.COLOR_BUFFER_BIT | b.DEPTH_BUFFER_BIT);
              xa.cj();
              k.na = -1;
            },
            reset: function () {
              k.na = -2;
            },
            fa: function () {
              0 !== k.na && (b.bindFramebuffer(c, a), (k.na = 0));
            },
            clear: function () {
              xa.cj();
              b.clear(b.COLOR_BUFFER_BIT);
            },
            v: function () {
              B.$();
              n.forEach(function (l) {
                l.remove();
              });
              null !== a && (b.deleteFramebuffer(a), (a = null));
              B.reset();
              d = !1;
              n.splice(0);
              k.sh = 1;
            },
          };
        return B;
      })(),
      xa = (function () {
        function a() {
          n = "undefined" === typeof ab ? da : ab;
          k = !0;
        }
        function c(f, y) {
          for (var J = 0; J < f.length; ++J) {
            var x = y.getExtension(f[J]);
            if (x) return x;
          }
          return null;
        }
        function e() {
          null !== r.Xd && (clearInterval(r.Xd), (r.Xd = null));
          r.Nb = !1;
        }
        function d() {
          r.uc && (b.deleteSync(r.uc), (r.uc = null));
        }
        var n = null,
          k = !1,
          B = {
            Rh: !1,
            tg: null,
            ug: null,
            Vh: !1,
            mm: !1,
            vg: null,
            Wh: !1,
            wg: null,
            Sh: !1,
            ze: null,
            dm: !1,
            Ae: null,
            em: !1,
          },
          l = null,
          u = { Pa: !0, Ra: !0, Re: !0, Ci: !1 },
          p = null,
          G = !0,
          H = null,
          E = null,
          r = { Nb: !1, Kb: null, uc: null, af: -1, Ga: null, Xd: null },
          C = "undefined" === typeof window ? {} : window,
          g = {
            m: function () {
              if (k) return !0;
              g.reset();
              k || a();
              var f = b;
              if (!l.Rh) {
                l.tg = g.ph(f);
                C.GL_EXT_FLOAT = l.tg;
                l.Vh = l.tg ? !0 : !1;
                if (l.Vh || g.ja())
                  (l.ug = g.qh(f)),
                    (l.mm = l.ug ? !0 : !1),
                    (C.GL_EXT_FLOATLINEAR = l.ug);
                l.Rh = !0;
              }
              if (!l.Sh) {
                l.vg = g.gd(f);
                l.vg && ((l.Wh = !0), (C.GL_EXT_HALFFLOAT = l.vg));
                if (l.Wh || g.ja())
                  (l.wg = g.rh(f)), (C.GL_EXT_HALFFLOATLINEAR = l.wg);
                l.Cp = l.wg ? !0 : !1;
                l.Sh = !0;
              }
              l.ze = g.nh(f);
              l.dm = l.ze ? !0 : !1;
              C.GL_EXT_COLORBUFFERFLOAT = l.ze;
              l.Ae = g.oh(f);
              l.em = l.Ae ? !0 : !1;
              C.GL_EXT_COLORBUFFERHALFFLOAT = l.Ae;
              va.m();
              Z.m();
              if (!g.Tk()) return !1;
              Y.m();
              Z.Yl();
              return !0;
            },
            reset: function () {
              l = Object.assign({}, B);
              p = Object.assign({}, u);
            },
            L: function () {
              k || a();
              return n.L();
            },
            Y: function () {
              k || a();
              return n.Y();
            },
            ja: function () {
              k || a();
              return n.ja();
            },
            mh: function (f) {
              g.nh(f);
              g.oh(f);
              g.ph(f);
              g.qh(f);
              g.gd(f);
              g.rh(f);
            },
            nh: c.bind(null, [
              "EXT_color_buffer_float",
              "WEBGL_color_buffer_float",
              "OES_color_buffer_float",
            ]),
            oh: c.bind(null, [
              "EXT_color_buffer_half_float",
              "WEBGL_color_buffer_half_float",
              "OES_color_buffer_half_float",
            ]),
            ph: c.bind(null, [
              "OES_texture_float",
              "MOZ_OES_texture_float",
              "WEBKIT_OES_texture_float",
            ]),
            qh: c.bind(null, [
              "OES_texture_float_linear",
              "MOZ_OES_texture_float_linear",
              "WEBKIT_OES_texture_float_linear",
            ]),
            gd: c.bind(null, [
              "OES_texture_half_float",
              "MOZ_OES_texture_half_float",
              "WEBKIT_OES_texture_half_float",
            ]),
            rh: c.bind(null, [
              "OES_texture_half_float_linear",
              "MOZ_OES_texture_half_float_linear",
              "WEBKIT_OES_texture_half_float_linear",
            ]),
            We: function (f) {
              var y = g.gd(f);
              return y && y.HALF_FLOAT_OES
                ? y.HALF_FLOAT_OES
                : f.HALF_FLOAT || f.FLOAT;
            },
            yl: function () {
              return E || b.RGBA32F || b.RGBA;
            },
            zl: function () {
              return H || b.RGBA16F || b.RGBA;
            },
            sl: function () {
              return p;
            },
            ea: function () {
              return p.Pa;
            },
            Vo: function () {
              return p.Ra;
            },
            Ak: function () {
              return p.Re;
            },
            Dk: function () {
              return p.Ci && G;
            },
            oj: function (f) {
              G = f;
              !f && r.Nb && (d(), b.bindBuffer(r.Ga, null), (r.Nb = !1));
            },
            Fp: function () {
              return r.Nb;
            },
            Ud: function (f, y, J) {
              function x() {
                f.bindTexture(f.TEXTURE_2D, null);
                f.bindFramebuffer(q, null);
                f.deleteTexture(O);
                f.deleteFramebuffer(L);
              }
              var q = f.FRAMEBUFFER,
                h = f.NEAREST,
                L = f.createFramebuffer();
              f.bindFramebuffer(q, L);
              var O = f.createTexture();
              f.activeTexture(f.TEXTURE0);
              f.bindTexture(f.TEXTURE_2D, O);
              f.pixelStorei(f.UNPACK_FLIP_Y_WEBGL, !1);
              f.texParameteri(f.TEXTURE_2D, f.TEXTURE_WRAP_S, f.CLAMP_TO_EDGE);
              f.texParameteri(f.TEXTURE_2D, f.TEXTURE_WRAP_T, f.CLAMP_TO_EDGE);
              f.texParameteri(f.TEXTURE_2D, f.TEXTURE_MAG_FILTER, h);
              f.texParameteri(f.TEXTURE_2D, f.TEXTURE_MIN_FILTER, h);
              f.texImage2D(f.TEXTURE_2D, 0, y, 3, 3, 0, f.RGBA, J, null);
              f.framebufferTexture2D(
                f.FRAMEBUFFER,
                f.COLOR_ATTACHMENT0,
                f.TEXTURE_2D,
                O,
                0
              );
              if (
                f.checkFramebufferStatus(
                  f.READ_FRAMEBUFFER || f.FRAMEBUFFER
                ) !== f.FRAMEBUFFER_COMPLETE
              )
                return x(), !1;
              ob.Md(f);
              f.clearColor(0, 0, 0, 0);
              f.viewport(0, 0, 3, 3);
              f.disable(f.DEPTH_TEST);
              f.clear(f.COLOR_BUFFER_BIT);
              Y.Ib(f);
              f.bindFramebuffer(q, null);
              ob.qb(f);
              f.activeTexture(f.TEXTURE0);
              f.bindTexture(f.TEXTURE_2D, O);
              Y.Ib(f);
              y = new Uint8Array(36);
              f.readPixels(0, 0, 3, 3, f.RGBA, f.UNSIGNED_BYTE, y);
              x();
              for (J = 0; 36 > J; ++J)
                if (3 !== J % 4 && 3 < Math.abs(y[J] - 127)) return !1;
              return !0;
            },
            Je: function (f) {
              var y = { Pa: !1, Ra: !1 };
              f.disable(f.BLEND);
              f.clearColor(0, 0, 0, 0);
              f.clear(f.COLOR_BUFFER_BIT);
              f.RGBA32F &&
                g.Ud(f, f.RGBA32F, f.FLOAT) &&
                ((y.Pa = !0), (E = f.RGBA32F));
              !y.Pa && g.Ud(f, f.RGBA, f.FLOAT) && ((y.Pa = !0), (E = f.RGBA));
              var J = g.We(f);
              H = null;
              f.RGBA16F &&
                g.Ud(f, f.RGBA16F, J) &&
                ((y.Ra = !0), (H = f.RGBA16F));
              !y.Ra && g.Ud(f, f.RGBA, J) && ((y.Ra = !0), (H = f.RGBA));
              return y;
            },
            Vk: function () {
              var f = va.instance({ width: 2 });
              f.Ni();
              var y = Z.instance({ width: 2, isFloat: !0, F: 3 });
              f.o();
              y.o();
              g.flush();
              b.checkFramebufferStatus(va.zh()) !== b.FRAMEBUFFER_COMPLETE
                ? (Z.Kn(), (p.Re = !1))
                : (p.Re = !0);
              f.remove();
              y.remove();
            },
            Wk: function () {
              var f = !1;
              g.ja() &&
                (f =
                  "PIXEL_PACK_BUFFER STREAM_READ SYNC_GPU_COMMANDS_COMPLETE WAIT_FAILED fenceSync deleteSync createBuffer"
                    .split(" ")
                    .every(function (y) {
                      return "undefined" !== typeof b[y];
                    }));
              p.Ci = f;
            },
            Tk: function () {
              var f = g.Je(b);
              Object.assign(p, f);
              if (!p.Pa && !p.Ra) return !1;
              g.Vk();
              g.Wk();
              return !0;
            },
            dn: function (f, y, J, x, q) {
              b.readPixels(f, y, J, x, b.RGBA, b.UNSIGNED_BYTE, q);
              return Promise.resolve(q, !1);
            },
            Wf: function (f, y, J, x, q, h) {
              if (!g.Dk()) return g.dn(f, y, J, x, q);
              null === r.Kb &&
                ((r.Ga = b.PIXEL_PACK_BUFFER),
                (r.Kb = b.createBuffer()),
                (r.af = -1));
              b.bindBuffer(r.Ga, r.Kb);
              q.byteLength !== r.af &&
                (b.bufferData(r.Ga, q.byteLength, b.STREAM_READ),
                (r.af = q.byteLength));
              b.readPixels(f, y, J, x, b.RGBA, b.UNSIGNED_BYTE, 0);
              r.uc = b.fenceSync(b.SYNC_GPU_COMMANDS_COMPLETE, 0);
              g.flush();
              var L = !1;
              return new Promise(function (O, v) {
                function m() {
                  if (!r.Nb) return e(), v(), !1;
                  switch (b.clientWaitSync(r.uc, 0, 0)) {
                    case b.TIMEOUT_EXPIRED:
                    case b.WAIT_FAILED:
                      return !1;
                    default:
                      return (
                        e(),
                        d(),
                        b.getBufferSubData(r.Ga, 0, q),
                        b.bindBuffer(r.Ga, null),
                        O(q, L),
                        !0
                      );
                  }
                }
                e();
                r.Nb = !0;
                m() || (h && !L && ((L = !0), h()), (r.Xd = setInterval(m, 0)));
              });
            },
            cj: function () {
              b.viewport(0, 0, g.L(), g.Y());
            },
            flush: function () {
              b.flush();
            },
            v: function () {
              e();
              d();
              Z.v();
              va.v();
              Y.v();
              null !== r.Kb && (b.deleteBuffer(r.Kb), (r.Kb = null));
              ob.reset();
              k = !1;
            },
          };
        return g;
      })(),
      Bb = (function () {
        function a(h, L, O, v) {
          f.texParameteri(
            f.TEXTURE_2D,
            f.TEXTURE_MIN_FILTER,
            v ? f.NEAREST_MIPMAP_NEAREST : f.LINEAR
          );
          var m = null;
          if (null !== O)
            try {
              m = f.getError();
              if ("FUCKING_BIG_ERROR" === m) return !1;
              f.texImage2D(f.TEXTURE_2D, 0, h, 4, 4, 0, f.RGBA, L, O);
              m = f.getError();
              if (m !== f.NO_ERROR) return !1;
            } catch (t) {
              return !1;
            }
          v && f.generateMipmap(f.TEXTURE_2D);
          f.clear(f.COLOR_BUFFER_BIT);
          Y.Ib(f);
          m = f.getError();
          if ("FUCKING_BIG_ERROR" === m) return !1;
          f.readPixels(0, 0, 2, 2, f.RGBA, f.UNSIGNED_BYTE, G);
          m = f.getError();
          m === f.INVALID_OPERATION &&
            "undefined" !== typeof f.PIXEL_PACK_BUFFER &&
            (f.bindBuffer(f.PIXEL_PACK_BUFFER, null),
            f.readPixels(0, 0, 2, 2, f.RGBA, f.UNSIGNED_BYTE, G),
            (m = f.getError()));
          if (m !== f.NO_ERROR) return !1;
          O = !0;
          for (v = 0; 16 > v; ++v) O = O && 4 > Math.abs(G[v] - 127);
          O && ((u.xi = L), (u.Ph = h));
          return O;
        }
        function c(h, L) {
          return y.Pa && a(h, f.FLOAT, new Float32Array(H), L)
            ? ((l = B.Ng), !0)
            : !1;
        }
        function e(h, L, O) {
          if (!y.Ra) return !1;
          var v = Z.Hk(H),
            m = xa.gd(f);
          if (
            (m && m.HALF_FLOAT_OES && a(h, m.HALF_FLOAT_OES, v, L)) ||
            (f.HALF_FLOAT && a(h, f.HALF_FLOAT, v, L))
          )
            return (l = B.lc), !0;
          v = new Float32Array(H);
          if (a(h, f.FLOAT, v, L)) return (l = B.lc), !0;
          f.bindTexture(f.TEXTURE_2D, O);
          f.texImage2D(
            f.TEXTURE_2D,
            0,
            f.RGBA,
            2,
            2,
            0,
            f.RGBA,
            f.UNSIGNED_BYTE,
            null
          );
          f.bindFramebuffer(u.bd, q);
          Z.th(f, O, 2, 2, v, !1, !1);
          f.bindFramebuffer(u.bd, null);
          f.bindTexture(f.TEXTURE_2D, O);
          return a(h, null, null, L) ? ((l = B.lc), !0) : !1;
        }
        function d(h, L, O) {
          p = !0;
          if (e(h, !0, O) || c(L, !0)) return !0;
          p = !1;
          return e(h, !1, O) || c(L, !1) ? !0 : !1;
        }
        function n(h) {
          if (l === B.H) {
            f = h || b;
            l = B.RGBA8;
            p = !0;
            xa.mh(f);
            y || (y = xa.Je(f));
            va.reset();
            q = f.createFramebuffer();
            u.bd = f.DRAW_FRAMEBUFFER || f.FRAMEBUFFER;
            f.bindFramebuffer(u.bd, null);
            f.clearColor(0, 0, 0, 0);
            f.viewport(0, 0, 2, 2);
            ca.H();
            J = ca.qb(f);
            h = f.createTexture();
            f.activeTexture(f.TEXTURE0);
            f.bindTexture(f.TEXTURE_2D, h);
            f.texParameteri(f.TEXTURE_2D, f.TEXTURE_WRAP_S, f.REPEAT);
            f.texParameteri(f.TEXTURE_2D, f.TEXTURE_WRAP_T, f.REPEAT);
            f.texParameteri(f.TEXTURE_2D, f.TEXTURE_MAG_FILTER, f.NEAREST);
            x = h;
            var L = (h = f.RGBA),
              O = f.RGBA16F,
              v = f.RGBA32F;
            v && (h = v);
            O && (L = O);
            if ((O || v) && d(L, h, x)) return k(), !0;
            h = L = f.RGBA;
            if (d(L, h, x)) return k(), !0;
            l = B.RGBA8;
            k();
            return !1;
          }
        }
        function k() {
          f.deleteProgram(J.oa);
          f.deleteTexture(x);
          x = J = null;
        }
        for (
          var B = { H: -1, Ng: 3, lc: 2, RGBA8: 0 },
            l = B.H,
            u = { xi: null, Ph: null, bd: null },
            p = !0,
            G = new Uint8Array(16),
            H = Array(64),
            E = 0;
          4 > E;
          ++E
        )
          for (var r = 0; 4 > r; ++r) {
            var C = 0 === (r + E) % 2 ? 1 : 0,
              g = 4 * E + r;
            H[4 * g] = C;
            H[4 * g + 1] = C;
            H[4 * g + 2] = C;
            H[4 * g + 3] = C;
          }
        var f = null,
          y = null,
          J = null,
          x = null,
          q = null;
        return {
          Bk: function (h) {
            n(h);
            return p;
          },
          Vg: function (h, L) {
            l === B.H && (typeof ("undefined" !== L) && (y = L), n(h));
            return l !== B.RGBA8;
          },
          Dp: function (h) {
            n(h);
            return l === B.Ng;
          },
          pm: function (h) {
            n(h);
            return l === B.lc;
          },
          qp: function (h) {
            n(h);
            return u.xi;
          },
          Al: function (h) {
            n(h);
            return u.Ph;
          },
          v: function () {
            f = null;
            p = !0;
            l = B.H;
            y = null;
          },
        };
      })(),
      cd = {
        instance: function (a) {
          var c = Z.instance(a.alpha),
            e = Z.instance(a.beta);
          return {
            cl: function () {
              c.g(1);
              e.g(2);
            },
          };
        },
      },
      Qc = {
        instance: function (a) {
          var c = null,
            e = !1,
            d = !1,
            n = null,
            k = !1,
            B = !1,
            l = null,
            u = "undefined" === typeof a.preprocessing ? !1 : a.preprocessing,
            p =
              "undefined" === typeof a.preprocessingSize
                ? a.size
                : a.preprocessingSize;
          a.mask &&
            ((e = !0),
            N && void 0 !== N.aa && (a.mask = N.aa + a.mask),
            (c = Z.instance({ isFloat: !1, url: a.mask })));
          var G = !1;
          a.customInputShader &&
            ((G = "s45"),
            ca.pa({
              name: "_",
              id: G,
              h: a.customInputShader,
              iq: ["uSource"],
              precision: "lowp",
            }),
            ca.j(G, [{ type: "1i", name: "_", value: 0 }]));
          switch (u) {
            case "sobel":
              l = "s32";
              k = !0;
              break;
            case "meanNormalization":
              l = "s33";
              k = !0;
              break;
            case "grayScale":
              l = "s29";
              k = !1;
              break;
            case "grayScaleTilt":
              l = "s30";
              B = !0;
              k = !1;
              break;
            case "rgbGrayTilt":
              l = "s31";
              B = !0;
              k = !1;
              break;
            case "copy":
              l = G ? G : "s0";
              break;
            case "inputLightRegulation":
              l = G ? G : "s29";
              n = dd.instance({ Oh: p, ri: a.size, li: a.nBlurPass, ud: !1 });
              d = !0;
              break;
            case "inputMix0":
              l = "none";
              n = ed.instance({
                ua: p,
                xj: a.varianceMin,
                Rg: a.blurKernelSizePx,
                ud: !1,
              });
              d = !0;
              break;
            case "direct":
            case "none":
              l = "abort";
              break;
            default:
              l = "s4";
          }
          B && ca.j(l, [{ name: "u27", type: "1f", value: a.tilt }]);
          e && (l += "Mask");
          var H = Z.instance({ isFloat: !1, isPot: !1, width: a.size }),
            E = {
              L: function () {
                return p;
              },
              Xe: function () {
                return E.L();
              },
              Fl: function () {
                return d ? n.Ye() : H;
              },
              xa: function (r) {
                va.fa();
                "abort" !== l &&
                  ("none" !== l &&
                    (ca.set(l),
                    k && ca.G("u28", 1 / a.size),
                    H.M(),
                    e && c.g(1),
                    Y.l(!1, !1),
                    H.g(0),
                    (r = H)),
                  d && n.process(r));
              },
              v: function () {
                H.remove();
                e && c.remove();
              },
            };
          return E;
        },
      },
      Rc = {
        instance: function (a) {
          function c(I) {
            n.forEach(function (K, P) {
              k[P][0] = I[0][K];
              k[P][1] = I[1][K];
              k[P][2] = I[2][K];
              k[P][3] = I[3][K];
            });
            return k;
          }
          a.normalize = a.normalize || !1;
          var e = {
              input: null,
              bias: null,
              pf: null,
              La: null,
              Cd: null,
              Qf: null,
              Rf: null,
            },
            d = null,
            n = [],
            k = [],
            B = !1,
            l = null,
            u = !0,
            p = -1,
            G = a.isReorganize ? a.isReorganize : !1,
            H = a.kernelsCount ? !0 : !1,
            E = a.dynPelu ? cd.instance(a.dynPelu) : !1,
            r = E ? !0 : !1,
            C = { isEnabled: !1 };
          a.jm
            ? ((a.sparsity =
                "undefined" !== typeof a.sparsity ? a.sparsity : a.Id.Xe()),
              (u = !1))
            : "full" === a.connectivityUp && (a.sparsity = a.Id.Xe());
          var g = {
              elu: "s16",
              elu01: "s17",
              relu: "s15",
              arctan: "s19",
              sigmoid: "s14",
              copy: "s0",
              softplus: "s20",
              dynPelu: "s18",
            }[a.activation],
            f = a.sparsity * a.sparsity,
            y = !1,
            J = a.size,
            x = "";
          if (a.maxPooling) {
            switch (a.maxPooling.size) {
              case 2:
                x = "s34";
                break;
              case 4:
                x = "s35";
            }
            y = !0;
            J /= a.maxPooling.size;
            e.Qf = Z.instance({ isFloat: !0, isPot: !1, width: J });
          }
          var q = a.normalization ? !0 : !1,
            h = null,
            L = null,
            O = null;
          if (q) {
            h = "s46" + a.index.toString();
            ca.Mh("s46", h, [((a.normalization.n - 1) / 2).toFixed(1)]);
            ca.j(h, [
              { type: "1i", name: "u1", value: 0 },
              { type: "2f", name: "u8", value: [1 / a.size, 1 / a.size] },
              { type: "1f", name: "u7", value: a.normalization.alpha },
              { type: "1f", name: "u10", value: a.normalization.beta },
              { type: "1f", name: "u31", value: a.normalization.k },
            ]);
            var v = { isFloat: !0, isPot: !0, width: a.size };
            L = Z.instance(v);
            O = Z.instance(v);
          }
          var m = -1,
            t = null;
          u && (e.La = Z.instance({ isFloat: !0, isPot: !1, width: a.size }));
          e.bias = Z.instance(a.bias);
          var M = {
            L: function () {
              return a.size;
            },
            Xe: function () {
              return J;
            },
            wh: function () {
              return a.classesCount;
            },
            rk: function (I) {
              d.g(I);
            },
            Um: function () {
              a.remap &&
                a.remap.isEnabled &&
                (C = {
                  isEnabled: !0,
                  Dm: Z.instance({
                    isFloat: !1,
                    isFlipY: !1,
                    array: new Uint8Array(a.remap.maskTexture.data),
                    width: a.remap.maskTexture.width,
                    isPot: !1,
                  }),
                  wd: a.remap.layers.map(function (I) {
                    return a.parent.Cl(I);
                  }),
                  depth: a.remap.depth,
                });
            },
            Ln: function () {
              switch (a.connectivityUp) {
                case "direct":
                  t = fd.instance(a.connectivity);
                  break;
                case "square":
                  t = gd.instance(a.connectivity);
                  break;
                case "squareFast":
                  t = hd.instance(a.connectivity, a.activation);
                  break;
                case "full":
                  t = id.instance(a.connectivity);
                  break;
                case "conv":
                  (p = a.kernelsCount),
                    (t = jd.instance(a.connectivity)),
                    G &&
                      (e.Cd = Z.instance({
                        width: J,
                        isFloat: !0,
                        isFlipY: !1,
                        isPot: !1,
                      }));
              }
              if (t.dc) {
                var I = a.size * a.sparsity;
                m = Math.log(I / a.size) / Math.log(2);
                e.input = Z.instance({
                  isMipmap: !0,
                  isFloat: !0,
                  isPot: !0,
                  width: I,
                  If: m,
                });
                e.pf = Z.instance({ isFloat: !0, isPot: !0, width: a.size });
              }
            },
            xa: function (I, K) {
              d = I;
              t.dc
                ? (e.input.M(),
                  H && e.bias.g(2),
                  t.xa(C),
                  e.input.g(0),
                  e.input.pl(m),
                  e.pf.M(),
                  H
                    ? ca.set("s0")
                    : (ca.set("s28"), ca.G("u26", f), e.bias.g(1)),
                  e.input.sk(m, 0),
                  Y.l(!1, !1),
                  ca.set(g),
                  q ? L.o() : e.La.o(),
                  e.pf.g(0),
                  r && E.cl(),
                  Y.l(!1, !1))
                : (e.La.M(), e.bias.g(1), t.xa());
              q &&
                (ca.set(h),
                O.o(),
                L.g(0),
                Y.l(!1, !1),
                ca.set("s47"),
                ca.G("u7", 1),
                e.La.o(),
                O.g(1),
                Y.l(!1, !1));
              if (u)
                return (
                  y
                    ? (e.Qf.M(),
                      e.La.g(0),
                      ca.set(x),
                      ca.N("u8", 1 / a.size, 1 / a.size),
                      Y.l(!1, !1),
                      (K = e.Qf))
                    : (K = e.La),
                  K.g(0),
                  G &&
                    (e.Cd.o(),
                    ca.set("s22"),
                    ca.N("u13", p, J / p),
                    Y.l(!1, !1),
                    (K = e.Cd),
                    e.Cd.g(0)),
                  K
                );
              var P = e.La;
              a.normalize &&
                (ca.set("gpuRawAvg" === B ? "s9" : "s8"),
                ca.G("u4", 1 / a.size),
                e.Rf.M(),
                e.La.g(0),
                Y.l(!1, !1),
                (P = e.Rf));
              I = null;
              switch (B) {
                case "cpuRGBA2Float":
                  P.ih(!1);
                  K ? (I = M.Zm(P).then(l)) : ((P = M.$m(P)), l(P));
                  break;
                case "cpuMeanFloat":
                  P.ih(!0);
                  if (K) I = P.bn().then(l);
                  else {
                    P = P.cn();
                    for (var ba = 0; ba < P.length; ++ba);
                    l(P);
                  }
                  break;
                case "gpuRawAvg":
                case "gpuRaw":
                  P.g(0);
                case "none":
                  null !== l && l(P);
              }
              K && null === I && (I = Promise.resolve());
              return I;
            },
            Jk: function (I) {
              I && ((B = I.Sf || "none"), (l = I.Pf || null));
              e.La = Z.instance({
                isFloat: !0,
                isPot: !0,
                isMipmap: !1,
                width: a.size,
              });
              I =
                "undefined" !== typeof a.classesCount && a.classesCount
                  ? a.classesCount
                  : a.size * a.size;
              for (var K = 0, P = 0, ba = 0; K < I; ++K)
                n.push(P + (a.size - 1 - ba) * a.size),
                  k.push([-1, -1, -1, -1]),
                  ++P,
                  P === a.size && ((P = 0), ++ba);
              a.normalize &&
                (e.Rf = Z.instance({ isFloat: !0, isPot: !0, width: a.size }));
            },
            Zm: function (I) {
              return I.an().then(c);
            },
            $m: function (I) {
              I = I.Di();
              c(I);
              return k;
            },
            v: function () {
              for (var I in e) {
                var K = e[I];
                K && K.remove();
              }
              t && (t.v(), (t = null));
            },
          };
          a.Id && M.Ln(a.Id);
          return M;
        },
      },
      fd = {
        instance: function (a) {
          var c = Z.instance(a.weights);
          return {
            dc: !0,
            od: function () {
              return 1;
            },
            v: function () {
              c.remove();
            },
            Sl: function () {
              return c;
            },
            xa: function () {
              ca.set("s27");
              c.g(1);
              Y.l(!1, !1);
            },
          };
        },
      },
      id = {
        instance: function (a) {
          var c = a.fromLayerSize,
            e = Z.instance(a.weights);
          return {
            dc: !0,
            od: function () {
              return c;
            },
            v: function () {
              e.remove();
            },
            xa: function (d) {
              if (d.isEnabled) {
                ca.set("s25");
                d.Dm.g(3);
                var n,
                  k = Math.min(d.wd.length, d.depth);
                for (n = 0; n < k; ++n) d.wd[n].rk(4 + n);
              } else ca.set("s24");
              ca.G("u17", a.toLayerSize);
              e.g(1);
              Y.l(!1, !1);
            },
          };
        },
      },
      gd = {
        instance: function (a) {
          for (
            var c = a.fromLayerSize,
              e = a.toLayerSize,
              d = a.toSparsity,
              n = d * e,
              k = n / c,
              B = c / e,
              l = 0,
              u = 0,
              p = 0,
              G = Array(d * e * d * e * 4),
              H = Array(d * e * d * e * 4),
              E = Array(c * c),
              r = 0;
            r < E.length;
            ++r
          )
            E[r] = 0;
          r = Math.floor(d / 2);
          for (var C = 0.5 / e, g = 0.5 / c, f = 0.5 / n, y = 0; y < e; ++y)
            for (var J = Math.round(y * B), x = 0; x < e; ++x) {
              var q = Math.round(x * B),
                h = y / e,
                L = x / e;
              h += C;
              L += C;
              for (var O = 0; O < d; ++O) {
                var v = J + O - r;
                0 > v && (v += c);
                v >= c && (v -= c);
                for (var m = 0; m < d; ++m) {
                  var t = l / n,
                    M = u / n,
                    I = q + m - r;
                  0 > I && (I += c);
                  I >= c && (I -= c);
                  var K = v / c,
                    P = I / c;
                  M = 1 - M - 1 / n;
                  K += g;
                  P += g;
                  t += f;
                  M += f;
                  var ba = y * d + O,
                    ja = x * d + m;
                  ja = e * d - ja - 1;
                  ba = ja * e * d + ba;
                  G[4 * ba] = t;
                  G[4 * ba + 1] = M;
                  G[4 * ba + 2] = K;
                  G[4 * ba + 3] = P;
                  P = E[I * c + v]++;
                  ba = P % k;
                  K = v * k + ba;
                  I = I * k + (P - ba) / k;
                  I = c * k - 1 - I;
                  I = I * c * k + K;
                  H[4 * I] = t;
                  H[4 * I + 1] = M;
                  H[4 * I + 2] = h;
                  H[4 * I + 3] = L;
                  ++l >= n && ((l = 0), ++u);
                  ++p;
                }
              }
            }
          E = null;
          var U = Z.instance(a.weights);
          delete a.weights.data;
          var w = Z.instance({
            width: n,
            isFloat: !0,
            array: new Float32Array(H),
            isPot: !0,
          });
          H = null;
          var z = Z.instance({
            width: n,
            isFloat: !0,
            array: new Float32Array(G),
            isPot: !0,
          });
          G = null;
          return {
            dc: !0,
            od: function () {
              return k;
            },
            v: function () {
              w.remove();
              z.remove();
              U.remove();
            },
            xa: function () {
              ca.set("s23");
              U.g(1);
              z.g(2);
              Y.l(!1, !1);
            },
          };
        },
      },
      jd = {
        instance: function (a) {
          var c = a.kernelsCount,
            e = a.toSparsity,
            d = (e * a.toLayerSize) / a.fromLayerSize,
            n = Z.instance(a.weights);
          return {
            dc: !0,
            od: function () {
              return d;
            },
            yp: function () {
              return e;
            },
            Sl: function () {
              return n;
            },
            v: function () {
              n.remove();
            },
            xa: function () {
              ca.set("s26");
              ca.G("u23", c);
              ca.G("u24", e);
              ca.G("u17", a.toLayerSize);
              ca.G("u25", a.fromLayerSize);
              n.g(1);
              Y.l(!1, !1);
            },
          };
        },
      },
      hd = {
        instance: function (a, c) {
          var e = a.fromLayerSize,
            d = a.toLayerSize,
            n = a.toSparsity,
            k = a.stride ? a.stride : 1,
            B = (n * d) / e,
            l = d < e,
            u = e / d,
            p = Z.instance(a.weights),
            G =
              "s48" +
              [e.toString(), d.toString(), n.toString(), k.toString(), c].join(
                "_"
              );
          ca.ml(G) ||
            ((a = gb(c)),
            (d = [
              { type: "1f", name: "u17", value: d },
              { type: "1f", name: "u30", value: k },
            ]),
            l && d.push({ type: "1f", name: "u25", value: e }),
            (e = [(l ? B : n).toFixed(1), a]),
            l && e.push(u.toFixed(1)),
            ca.Mh(l ? "s40" : "s39", G, e),
            ca.j(
              G,
              d.concat([
                { type: "1i", name: "u15", value: 0 },
                { type: "1i", name: "u22", value: 1 },
                { type: "1i", name: "u14", value: 3 },
              ])
            ));
          return {
            dc: !1,
            od: function () {
              return B;
            },
            v: function () {
              p.remove();
            },
            xa: function () {
              ca.set(G);
              p.g(3);
              Y.l(!1, !1);
            },
          };
        },
      },
      dd = {
        instance: function (a) {
          var c = a.li ? a.li : 3,
            e = a.Oh ? a.Oh : 64,
            d = a.ri ? a.ri : 64,
            n = a.ud ? !0 : !1;
          a = { isFloat: !1, width: e, isPot: !1, isFlipY: !1 };
          var k = Z.instance(a),
            B = Z.instance(a),
            l = Z.instance(a),
            u = Z.instance(a),
            p = Z.instance({ isFloat: !0, width: d, isPot: !1, isFlipY: !1 }),
            G = 1 / e;
          return {
            process: function (H) {
              ca.set("s36");
              u.o();
              Y.l(n, !1);
              ca.set("s37");
              for (var E = 0; E < c; ++E)
                k.o(),
                  ca.N("u8", G, 0),
                  Y.l(n, !1),
                  l.o(),
                  u.g(0),
                  Y.l(n, !1),
                  B.o(),
                  k.g(0),
                  ca.N("u8", 0, G),
                  Y.l(n, !1),
                  u.o(),
                  l.g(0),
                  Y.l(n, !1),
                  E !== c - 1 && B.g(0);
              ca.set("s38");
              p.o();
              H.g(0);
              B.g(1);
              u.g(2);
              Y.l(n, !1);
              p.g(0);
            },
            Ye: function () {
              return p;
            },
          };
        },
      },
      ed = {
        instance: function (a) {
          function c(p) {
            return Z.instance({
              isFloat: p,
              width: e.ua,
              isPot: !1,
              isFlipY: !1,
            });
          }
          var e = Object.assign({ xj: 0.1, Rg: 9, ua: 128, ud: !1 }, a),
            d = c(!1),
            n = [c(!1), c(!1), c(!1)],
            k = [c(!1), c(!1), c(!1)],
            B = c(!0),
            l = [d, k[0], k[1]];
          a =
            "uniform sampler2D u1;const float e=1.1111,g=2.2222;uniform vec2 u32;varying vec2 vv0;void main(){float b=0.,c=0.;for(float a=-e;a<=e;a+=1.){vec2 i=u32*a,j=vv0+i*g;float d=1.2*a/e,f=exp(-d*d);b+=f*texture2D(u1,j).r,c+=f;}b/=c,gl_FragColor=vec4(b,0.,0.,1.);}"
              .replace("1.1111", Math.round((e.Rg - 1) / 2).toFixed(2))
              .replace("2.2222", (1 / e.ua).toFixed(6));
          var u = { u1: 0 };
          ca.pe([
            {
              id: "s50",
              name: "_",
              h: "uniform sampler2D u1;varying vec2 vv0;const vec3 f=vec3(.2126,.7152,.0722),g=vec3(1.,1.,1.);void main(){vec3 b=texture2D(u1,vv0).rgb;float a=dot(b,f);gl_FragColor=vec4(a,a,a,a);}",
              u: u,
              i: ["u1"],
              precision: "lowp",
            },
            {
              id: "s51",
              name: "_",
              h: a,
              u: u,
              i: ["u1", "u32"],
              precision: "lowp",
            },
            {
              id: "s52",
              name: "_",
              h: "uniform sampler2D u33,u34,u35,u36;const float f=1.1111;const vec3 g=vec3(1.,1.,1.);varying vec2 vv0;void main(){vec3 a=texture2D(u33,vv0).rgb;float c=texture2D(u34,vv0).r,d=texture2D(u35,vv0).r,h=texture2D(u36,vv0).r,i=a.r*a.r;vec3 b=vec3(c,d,h),j=max(g*f,abs(i-b*b)),k=sqrt(j);gl_FragColor=vec4(a.r,(a-b)/k);}".replace(
                "1.1111",
                e.xj.toFixed(4)
              ),
              u: { u33: 0, u34: 1, u35: 2, u36: 3 },
              i: ["u33", "u34", "u35", "u36"],
              precision: "highp",
            },
          ]);
          return {
            process: function () {
              ca.set("s50");
              d.M();
              Y.l(e.ud, !1);
              ca.set("s51");
              for (var p = 0; 3 > p; ++p)
                ca.N("u32", 1, 0),
                  n[p].o(),
                  l[p].g(0),
                  Y.l(!1, !1),
                  ca.N("u32", 0, 1),
                  k[p].o(),
                  n[p].g(0),
                  Y.l(!1, !1);
              ca.set("s52");
              B.o();
              d.g(0);
              k[0].g(1);
              k[1].g(2);
              k[2].g(3);
              Y.l(!1, !1);
              B.g(0);
            },
            Ye: function () {
              return B;
            },
          };
        },
      },
      Ab = (function () {
        function a(C, g, f, y, J, x, q) {
          if (!E)
            if (q === x.length) J();
            else {
              switch (x[q]) {
                case "A":
                  f();
                  break;
                case "D":
                  C();
                  break;
                case "S":
                  g()
                    .then(function (h, L) {
                      r.nj();
                      a(C, g, f, L ? null : y, J, x, ++q);
                    })
                    .catch(function () {
                      J();
                    });
                  return;
                case "R":
                  y && y();
              }
              a(C, g, f, y, J, x, ++q);
            }
        }
        var c = {
            n: 5,
            Nf: 1,
            ci: 0,
            kd: [35, 49],
            fd: [2, 200],
            k: 0.7,
            jo: 200,
            Om: 0.05,
          },
          e = -1,
          d = null,
          n = -1,
          k = -1,
          B = 0,
          l = -1,
          u = -1,
          p = 0,
          G = 0,
          H = c.fd[1],
          E = !0,
          r = {
            T: function () {
              switch (e) {
                case -1:
                  return -1;
                case 0:
                  return u + d.ci;
                case 1:
                  return p;
              }
            },
            xh: function (C) {
              return Math.pow(
                Math.min(Math.max(l, 0), d.n - 1) / (d.n - 1),
                C || 1
              );
            },
            m: function (C) {
              d = Object.assign({}, c, C);
              l = u = d.Nf;
              e = 0;
              r.reset();
            },
            nj: function (C) {
              C = ("undefined" === typeof C ? Date.now() : C) || 0;
              var g = Math.min(Math.max(C - G, d.fd[0]), d.fd[1]);
              H = g;
              G = C;
              var f = -1 === n ? 0 : d.k;
              n = Math.min(Math.max(1e3 / g, 5), 120) * (1 - f) + n * f;
              C - k > d.jo &&
                5 < ++B &&
                ((g = d.k),
                (l =
                  l * (1 - g) +
                  (n < d.kd[0] ? u - 1 : n > d.kd[1] ? u + 1 : u) * g),
                Math.abs(l - u) > 1 - d.Om &&
                  ((g = Math.min(Math.max(Math.round(l), 0), d.n - 1)),
                  g !== u && ((l = u = g), (n = (d.kd[1] - d.kd[0]) / 2))),
                (k = C));
            },
            Yf: function (C, g, f, y, J, x) {
              E = !1;
              a(C, g, f, y, J, x, 0);
            },
            stop: function () {
              E = !0;
            },
            Fn: function (C) {
              p = C;
              e = 1;
            },
            io: function () {
              e = 0;
              r.reset();
            },
            reset: function () {
              H = c.fd[1];
              k = n = -1;
              B = 0;
            },
            pp: function () {
              return H;
            },
          };
        return r;
      })(),
      Fc = (function () {
        var a = {
            mi: 4,
            Dd: [1.5, 1.5, 2],
            ra: [0.1, 0.1, 0.1],
            Ki: 1,
            ua: -1,
            jf: -1,
            ao: 2,
            Lm: 1,
            Li: !0,
            kl: 0.8,
          },
          c = null,
          e = [],
          d = [0],
          n = [0.5, 0.5, 1];
        return {
          m: function (k) {
            c = Object.assign({}, a, k);
            e.splice(0);
            k = c.Dd[0] * c.ra[0];
            var B = c.Dd[1] * c.ra[1],
              l = 1 / (1 + c.Dd[2] * c.ra[2]),
              u = c.Ki * Math.min(c.ua, c.jf),
              p = u / c.ua;
            u /= c.jf;
            var G = 0.5 * c.kl;
            G *= G;
            for (var H = 0; H < c.mi; ++H) {
              var E = Math.pow(l, H),
                r = p * E,
                C = u * E;
              E = r * c.Lm;
              var g = r * k,
                f = C * B;
              r /= 2;
              C /= 2;
              for (
                var y = 1 + (1 - r - r) / g, J = 1 + (1 - C - C) / f, x = 0;
                x < J;
                ++x
              )
                for (var q = C + x * f, h = q - 0.5, L = 0; L < y; ++L) {
                  var O = r + L * g,
                    v = O - 0.5;
                  v * v + h * h > G || e.push([O, q, E]);
                }
            }
            c.Li &&
              e.sort(function (m, t) {
                var M = m[0] - 0.5;
                m = m[1] - 0.5;
                var I = t[0] - 0.5;
                t = t[1] - 0.5;
                return M * M + m * m - (I * I + t * t);
              });
          },
          get: function (k) {
            var B = e.length;
            if (0 === B) return n;
            for (; k >= d.length; ) d.push(0);
            d[k] >= B && (d[k] = 0);
            var l = e[Math.floor(d[k])];
            d[k] = (d[k] + 1 / c.ao) % B;
            return l;
          },
          reset: function () {
            for (var k = e.length / d.length, B = 0; B < d.length; ++B)
              d[B] = Math.floor(B * k);
          },
        };
      })(),
      xb = (function () {
        function a() {
          e(g + r.Jf);
          f.port.postMessage("DONE");
        }
        function c() {
          var m = r.ma;
          h.isEnabled && (m = Math.max(m, h.ma));
          q.Tc = 0 === m ? J(e) : J(d);
        }
        function e(m) {
          x.Qb &&
            null !== C &&
            ((m -= g),
            (m = Math.min(Math.max(m, r.lh[0]), r.lh[1])),
            (g += m),
            k(),
            h.isEnabled && h.xc && x.Ia && g - h.uf > r.Mg && (p(), (h.uf = g)),
            C(g));
        }
        function d(m) {
          x.Qb && (q.timeout = setTimeout(e.bind(null, m), r.ma));
        }
        function n() {
          C = null;
          x.Qb = !1;
          k();
        }
        function k() {
          q.Tc && (window.cancelAnimationFrame(q.Tc), (q.Tc = null));
          q.timeout && (window.clearTimeout(q.timeout), (q.timeout = null));
        }
        function B(m) {
          m && !x.Ia
            ? ((x.Ia = !0),
              y && Ab.io(),
              f.port.postMessage("STOP"),
              xa.oj(!0),
              c())
            : !m &&
              x.Ia &&
              ((x.Ia = !1),
              y && Ab.Fn(1),
              xa.oj(!1),
              f.port.postMessage("START"));
        }
        function l(m) {
          m.target.hidden ? O() : L();
        }
        function u(m, t, M) {
          t = m.createShader(t);
          m.shaderSource(t, M);
          m.compileShader(t);
          return t;
        }
        function p() {
          h.xc = !1;
          var m = h.Qa,
            t = h.qd,
            M = h.rd,
            I = h.Ga;
          m.uniform1f(h.Gh, Math.random());
          h.Rb ? t.beginQueryEXT(I, M) : m.beginQuery(I, M);
          m.drawElements(m.POINTS, 1, m.UNSIGNED_SHORT, 0);
          h.Rb ? t.endQueryEXT(I) : m.endQuery(I);
          xa.flush();
          H()
            .then(function (K) {
              K = (r.Fj * r.Kg * 1e3) / K;
              h.be = (h.be + 1) % r.kc;
              h.vf[h.be] = K;
              if (++h.ai > r.kc) {
                h.vd.set(h.vf);
                h.vd.sort(function (ba, ja) {
                  return ba - ja;
                });
                K = h.vd[Math.floor(r.kc / 2)];
                h.jd = Math.max(h.jd, K);
                var P = 0;
                for (
                  P = 0;
                  P < h.yg &&
                  !(K > h.jd * (1 - (r.Lg[P] + r.Gj * (P >= h.Wd ? 1 : -1))));
                  ++P
                )
                  P === h.yg - 1 && ++P;
                P !== h.Wd &&
                  (console.log("THERMAL THROTTLING LEVEL = " + P.toString()),
                  (h.Wd = P),
                  (h.ma = 0 === P ? 0 : r.Ej[P - 1]),
                  r.Jg && r.Jg(P));
              }
              h.xc = !0;
            })
            .catch(function () {
              h.xc = !0;
            });
        }
        function G(m) {
          var t = h.Qa,
            M = h.qd,
            I = h.rd;
          I = h.Rb
            ? M.jp(I, M.QUERY_RESULT_AVAILABLE_EXT)
            : t.getQueryParameter(I, t.QUERY_RESULT_AVAILABLE);
          t = t.getParameter(M.GPU_DISJOINT_EXT);
          I ? m(!t) : setTimeout(G.bind(null, m), 0.1);
        }
        function H() {
          return new Promise(function (m, t) {
            G(function (M) {
              if (M) {
                M = h.Qa;
                var I = h.qd,
                  K = h.rd;
                M = h.Rb
                  ? I.getQueryObjectEXT(K, I.QUERY_RESULT_EXT)
                  : M.getQueryParameter(K, M.QUERY_RESULT);
                m(M);
              } else t();
            });
          });
        }
        var E = {
            Th: !0,
            lh: [1, 200],
            Jf: 20,
            ma: 0,
            Hj: !1,
            Kg: 50,
            Fj: 240,
            Mg: 3e3,
            kc: 3,
            Lg: [0.2, 0.35, 0.5],
            Gj: 0.05,
            Ej: [8, 20, 40],
            Jg: null,
          },
          r = null,
          C = null,
          g = 0,
          f = null,
          y = !1,
          J = null,
          x = { Ha: !1, Ia: !0, tf: !1, sf: !1, rf: !1, Qb: !1 },
          q = { Tc: null, timeout: null },
          h = {
            isEnabled: !1,
            xc: !1,
            Qa: null,
            qd: null,
            rd: null,
            Ga: null,
            Gh: null,
            Rb: !0,
            Wd: 0,
            yg: 0,
            ma: 0,
            uf: 0,
            ai: 0,
            vf: null,
            vd: null,
            be: 0,
            jd: 0,
          },
          L = B.bind(null, !0),
          O = B.bind(null, !1),
          v = {
            m: function (m) {
              r = Object.assign(E, m);
              Object.assign(x, { Ia: !0, Ha: !0, Qb: !1 });
              J =
                window.requestPostAnimationFrame ||
                window.requestAnimationFrame;
              if (r.Hj) {
                m = document.createElement("canvas");
                m.setAttribute("width", "1");
                m.setAttribute("height", "1");
                var t = { antialias: !1 };
                m = m.getContext("webgl2", t) || m.getContext("webgl", t);
                if (
                  (t =
                    m.getExtension("EXT_disjoint_timer_query") ||
                    m.getExtension("EXT_disjoint_timer_query_webgl2"))
                ) {
                  h.Qa = m;
                  h.qd = t;
                  h.isEnabled = !0;
                  h.Rb = t.beginQueryEXT ? !0 : !1;
                  var M = u(
                      m,
                      m.VERTEX_SHADER,
                      "attribute vec4 a0;void main(){gl_Position=a0;}"
                    ),
                    I = u(
                      m,
                      m.FRAGMENT_SHADER,
                      "precision lowp float;uniform float u37;void main(){vec4 a=u37*vec4(1.,2.,3.,4.);for(int b=0;b<666;b+=1)a=cos(a);gl_FragColor=a;}".replace(
                        "666",
                        r.Kg.toString()
                      )
                    ),
                    K = m.createProgram();
                  m.attachShader(K, M);
                  m.attachShader(K, I);
                  m.linkProgram(K);
                  M = m.getAttribLocation(K, "a0");
                  h.Gh = m.getUniformLocation(K, "u37");
                  m.useProgram(K);
                  m.enableVertexAttribArray(M);
                  K = m.createBuffer();
                  m.bindBuffer(m.ARRAY_BUFFER, K);
                  m.bufferData(
                    m.ARRAY_BUFFER,
                    new Float32Array([0.5, 0.5, 0, 1]),
                    m.STATIC_DRAW
                  );
                  m.vertexAttribPointer(M, 4, m.FLOAT, !1, 16, 0);
                  K = m.createBuffer();
                  m.bindBuffer(m.ELEMENT_ARRAY_BUFFER, K);
                  m.bufferData(
                    m.ELEMENT_ARRAY_BUFFER,
                    new Uint16Array([0]),
                    m.STATIC_DRAW
                  );
                  m.disable(m.DEPTH_TEST);
                  m.disable(m.DITHER);
                  m.disable(m.STENCIL_TEST);
                  m.viewport(0, 0, 1, 1);
                  K = h.Rb ? t.createQueryEXT() : m.createQuery();
                  h.rd = K;
                  h.Ga = t.TIME_ELAPSED_EXT || m.TIME_ELAPSED;
                  h.Wd = 0;
                  h.yg = r.Lg.length;
                  h.ma = 0;
                  h.uf = -r.Mg;
                  h.vf = new Float32Array(r.kc);
                  h.vd = new Float32Array(r.kc);
                  h.jd = 0;
                  h.be = 0;
                  h.ai = 0;
                  h.xc = !0;
                }
              }
              if (r.Th) {
                m = !1;
                try {
                  if ("undefined" === typeof SharedWorker) {
                    var P = URL.createObjectURL(
                        new Blob(
                          [
                            "let handler = null;\n      self.addEventListener('message', function(e){\n        if (handler !== null){\n          clearTimeout(handler);\n          handler = null;\n        }\n        switch (e.data) {\n          case 'START':\n          case 'DONE':\n            handler = setTimeout(function(){\n              self.postMessage('TICK');\n            }, " +
                              r.Jf.toString() +
                              ");\n            break;\n          case 'STOP':\n            break;\n        };\n      }, false);",
                          ],
                          { type: "text/javascript" }
                        )
                      ),
                      ba = new Worker(P);
                    ba.addEventListener("message", a);
                    f = { Ai: ba, port: ba };
                    x.tf = !0;
                  } else {
                    var ja = URL.createObjectURL(
                        new Blob(
                          [
                            "let handler = null;\n      onconnect = function(e) {\n        const port = e.ports[0];\n        port.addEventListener('message', function(e) {\n          \n          if (handler !== null){\n            clearTimeout(handler);\n            handler = null;\n          }\n          switch (e.data) {\n            case 'START':\n            case 'DONE':\n              handler = setTimeout(function(){\n                port.postMessage('TICK');\n              }, " +
                              r.Jf.toString() +
                              ");\n              break;\n            case 'STOP':\n              break;\n          };\n          \n        });\n        \n        port.start();\n      } // end onconnect()",
                          ],
                          { type: "text/javascript" }
                        )
                      ),
                      U = new SharedWorker(ja);
                    U.port.start();
                    U.port.addEventListener("message", a);
                    f = { Ai: U, port: U.port };
                    x.sf = !0;
                  }
                  m = !0;
                } catch (w) {}
                m &&
                  ("onvisibilitychange" in document
                    ? document.addEventListener("visibilitychange", l)
                    : (window.addEventListener("blur", O),
                      window.addEventListener("focus", L)),
                  (x.rf = !0));
              }
              y = "undefined" !== typeof Ab;
            },
            v: function () {
              n();
              x.rf &&
                ("onvisibilitychange" in document
                  ? document.removeEventListener("visibilitychange", l)
                  : (window.removeEventListener("blur", O),
                    window.removeEventListener("focus", L)),
                (x.rf = !1));
              x.sf
                ? (f.port.close(), (x.sf = !1))
                : x.tf && (f.Ai.terminate(), (x.tf = !1));
              Object.assign(x, { Ia: !0, Ha: !1, Qb: !1 });
              C = null;
            },
            Ip: function () {
              return x.Ia;
            },
            update: function (m) {
              Object.assign(r, m);
            },
            Yf: function (m) {
              x.Ha || v.m({});
              k();
              x.Qb = !0;
              C = m;
              x.Ia && c();
            },
            stop: n,
          };
        return v;
      })(),
      tc = {
        Ve: function () {
          return Date.now();
        },
        mp: function () {
          return performance.now();
        },
      },
      tb = (function () {
        function a(V) {
          switch (L) {
            case h.movePinch:
              var ha = -V.deltaY;
              0 === O && g("pinch", -1, 0.001 * ha, null);
          }
          V.deltaY;
          V.preventDefault();
        }
        function c(V) {
          if (-1 !== O)
            switch (L) {
              case h.swipe:
                if (1 !== O) break;
                u();
                G(V, m);
                var ha = m[0] - v[0];
                n(ha);
                V = ha / ((20 * J.offsetWidth) / 100);
                g("swipeMove", Math.min(Math.max(V, -1), 1), V, null);
                break;
              case h.movePinch:
                if (2 === O || 3 === O) {
                  G(V, m);
                  ha = m[0] - v[0];
                  var ra = m[1] - v[1];
                  2 === O
                    ? ((X += Math.sqrt(ha * ha + ra * ra)),
                      10 > X
                        ? ((v[0] = m[0]), (v[1] = m[1]))
                        : (Ma || ((Ma = !0), g("moveStart", null, null, null)),
                          (aa[0] = ha),
                          (aa[1] = ra),
                          (M[0] = ha - t[0]),
                          (M[1] = ra - t[1]),
                          g("move", aa, M, null),
                          (t[0] = aa[0]),
                          (t[1] = aa[1])))
                    : 3 === O &&
                      ((V = p(V) / oa), g("pinch", V, V - Da, null), (Da = V));
                }
            }
        }
        function e(V) {
          if (-1 !== O)
            switch (L) {
              case h.swipe:
                if (1 !== O) break;
                u();
                G(V, m);
                V = m[0] - v[0];
                var ha = 0 > V;
                (V = 20 < (100 * Math.abs(V)) / J.offsetWidth) && ha
                  ? g("swipeLeft", I, null, null)
                  : V && !ha && g("swipeRight", I, null, null);
                var ra = function () {
                  setTimeout(function () {
                    l();
                    O = 0;
                    g("swipeEnd", null, null, null);
                  }, 202);
                };
                V
                  ? ((V = function () {
                      var Ga = (ha ? -1 : 1) * J.width,
                        Ia = ((ha ? 1 : -1) * Ga) / J.width;
                      I.style.transitionDuration = (400).toString() + "ms";
                      I.style.left = (U[0] + Ga).toString() + "px";
                      I.style.top = U[1].toString() + "px";
                      I.style.transform = "rotate( " + Ia.toString() + "rad )";
                      ra();
                    }),
                    ja ? V() : (w = V))
                  : ((I.style.transitionDuration = (200).toString() + "ms"),
                    (I.style.opacity = "0"),
                    (I.style.left = U[0].toString() + "px"),
                    (I.style.top = U[1].toString() + "px"),
                    (I.style.transform = ""),
                    ra());
                O = -1;
                break;
              case h.movePinch:
                if (2 === O || 3 === O)
                  O === O.move
                    ? g("moveEnd", null, null, null)
                    : 3 === O && g("pinchEnd", null, null, null),
                    (O = 0);
            }
        }
        function d(V) {
          V.preventDefault();
          if (-1 !== O)
            switch (L) {
              case h.swipe:
                if (0 !== O) break;
                u();
                O = 1;
                z = setTimeout(function () {
                  l();
                  z = null;
                  1 === O && ((O = 0), g("swipeEnd", null, null, null));
                }, 1e3);
                k();
                g("swipeStart", null, null, null);
                g("swipeGetCanvas", I, P, K);
                G(V, v);
                break;
              case h.movePinch:
                0 !== O
                  ? 2 !== O ||
                    Ma ||
                    (void 0 === V.changedTouches && void 0 === V.touches) ||
                    ((oa = p(V)),
                    20 < oa &&
                      ((O = 3), (Da = 1), g("pinchStart", null, null, null)))
                  : 3 !== O &&
                    ((Ma = !1),
                    G(V, v),
                    (t[0] = 0),
                    (t[1] = 0),
                    (O = 2),
                    (X = 0));
            }
        }
        function n(V) {
          var ha = 0 > V;
          I.style.left = U[0] + V + "px";
          I.style.transformOrigin = ha ? S : D;
          I.style.transform =
            "rotate( " + (((ha ? 1 : -1) * V) / J.width).toString() + "rad )";
        }
        function k() {
          ja = !1;
          var V = J.getBoundingClientRect();
          U[0] = V.left;
          U[1] = V.top;
          I.width = Math.round(J.width / 4);
          I.height = Math.round(J.height / 4);
          K.width = I.width;
          K.height = I.height;
          I.style.width = J.offsetWidth + "px";
          I.style.height = J.offsetHeight + "px";
          I.style.left = U[0] + "px";
          I.style.top = U[1] + "px";
          setTimeout(B, 0);
        }
        function B() {
          P.drawImage(J, 0, 0, I.width, I.height);
          ba.drawImage(I, 0, 0);
          ja = !0;
          document.body.appendChild(I);
          w && (w(), (w = !1));
        }
        function l() {
          I.style.transitionDuration = "0ms";
          I.style.opacity = "1";
          I.style.transform = "";
          ja && (document.body.removeChild(I), (ja = !1));
        }
        function u() {
          z && (window.clearTimeout(z), (z = null));
        }
        function p(V) {
          H(V, ka, 0);
          H(V, la, 1);
          return Math.sqrt(ka[0] * ka[0] + la[0] * la[0]);
        }
        function G(V, ha) {
          void 0 !== V.changedTouches || void 0 !== V.touches
            ? H(V, ha, 0)
            : ((ha[0] = V.pageX), (ha[1] = V.pageY));
        }
        function H(V, ha, ra) {
          V.touches.length > ra
            ? ((ha[0] = V.touches[ra].pageX), (ha[1] = V.touches[ra].pageY))
            : ((ha[0] = V.changedTouches[ra].pageX),
              (ha[1] = V.changedTouches[ra].pageY));
        }
        function E() {
          q.forEach(function (V) {
            J.removeEventListener(V.type, V.jb, !1);
          });
          return q.splice(0, q.length);
        }
        function r(V) {
          V.forEach(function (ha) {
            C(ha.type, ha.jb);
          });
        }
        function C(V, ha) {
          J.removeEventListener(V, ha, !1);
          I.removeEventListener(V, ha, !1);
          J.addEventListener(V, ha, !1);
          I.addEventListener(V, ha, !1);
          0 ===
            q.filter(function (ra) {
              return ra.type === V && ra.jb === ha;
            }).length && q.push({ type: V, jb: ha });
        }
        function g(V, ha, ra, Ga) {
          x[V].forEach(function (Ia) {
            Ia.jb(ha, ra, Ga);
          });
        }
        function f(V) {
          return V[0] + "% " + (100 - V[1]).toString() + "%";
        }
        var y = !1,
          J = null,
          x = {
            swipeStart: [],
            swipeEnd: [],
            swipeLeft: [],
            swipeRight: [],
            swipeMove: [],
            swipeGetCanvas: [],
            pinch: [],
            pinchStart: [],
            pinchEnd: [],
            move: [],
            moveStart: [],
            moveEnd: [],
          },
          q = [],
          h = { idle: 0, swipe: 1, movePinch: 2 },
          L = h.idle,
          O = 0,
          v = [0, 0],
          m = [0, 0],
          t = [0, 0],
          M = [0, 0],
          I = document.createElement("canvas"),
          K = document.createElement("canvas"),
          P = I.getContext("2d"),
          ba = K.getContext("2d");
        I.style.position = "fixed";
        I.style.zIndex = "800";
        I.style.cursor = "move";
        I.style.pointerEvents = "none";
        I.className = "swipeImage";
        I.setAttribute("draggable", !1);
        var ja = !1,
          U = [0, 0],
          w = null,
          z = null,
          D = f([50, 100]),
          S = f([50, 0]),
          ea = null,
          X = 0,
          aa = [0, 0],
          oa = 0,
          Ma = !1,
          Da = 1,
          ka = [0, 0],
          la = [0, 0],
          Ba = {
            init: function (V) {
              if (y) Ba.switch_canvas(V.qa);
              else
                return (
                  (J = V.qa),
                  C("mousedown", d),
                  C("mouseup", e),
                  C("mouseout", e),
                  C("mousemove", c),
                  C("mousemove", c),
                  C("wheel", a),
                  C("touchstart", d),
                  C("touchend", e),
                  C("touchmove", c),
                  (y = !0),
                  Ba
                );
            },
            switch_canvas: function (V) {
              if (!y) Ba.init({ qa: V });
              else if (J !== V) {
                var ha = E();
                J = V;
                r(ha);
                for (var ra in x)
                  for (V = x[ra], ha = V.length - 1; 0 <= ha; --ha)
                    V[ha].fn && V.splice(ha, 1);
              }
            },
            get_mode: function () {
              for (var V in h) if (h[V] === L) return V;
              return !1;
            },
            switch_mode: function (V) {
              y &&
                "undefined" !== typeof h[V] &&
                ((V = h[V]), L !== V && (u(), (L = V), (O = 0)));
            },
            add_listener: function (V, ha, ra) {
              x[V].push({ jb: ha, fn: "undefined" === typeof ra ? !1 : ra });
              return Ba;
            },
            remove_listener: function (V) {
              x[V].splice(0, x[V].length);
              return Ba;
            },
            animate_swipe: function (V, ha) {
              ea && (clearInterval(ea), (ea = null));
              k();
              var ra = (J.width / (ha / 1e3)) * ("left" === V ? -1 : 1),
                Ga = 0,
                Ia,
                sb = Date.now();
              ea = setInterval(function () {
                ea &&
                  ((Ia = Date.now()),
                  (Ga += ((Ia - sb) / 1e3) * ra),
                  n(Ga),
                  (sb = Ia),
                  Math.abs(Ga) > 0.75 * J.width &&
                    ea &&
                    (clearInterval(ea), (ea = null), l()));
              }, 16);
            },
          };
        return Ba;
      })();
    window.CanvasListeners = tb;
    var R = {
        VERSION: "3.3.2",
        Qc: [],
        Pc: [],
        le: !1,
        ke: !1,
        me: !1,
        ready: !1,
        isBusy: !1,
      },
      Ya = {
        idealWidth: 800,
        idealHeight: 600,
        minWidth: 480,
        maxWidth: 1280,
        minHeight: 480,
        maxHeight: 1280,
        FOVdesktop: 60,
        rotate: 0,
        Dj: 23,
        ie: 10,
        he: 8e3,
      },
      Hc = {
        Lf: "models3D",
        Hf: "materials",
        fo: "tweakers",
        neuralNetworkPath: "built/jeefitNNC.json",
        aa: "",
        va: "",
        je: "",
        ma: 0,
        Rj: 20,
        width: 1024,
        height: 1024,
        Nm: [2, 3.5],
        Ii: 300,
        Nc: [1, 6],
        scanOverlapFactors: [2, 2, 3],
        scanNScaleLevels: 2,
        scanScale0Factor: 0.7,
        ra: [0.2, 0.2, 0.3],
        hc: [
          [0.8, 0.5],
          [0.8, 0.5],
          [1, 1],
        ],
        co: 30,
        Rk: 1.92,
        Xm: [0.3, 0.7],
        Wm: 1,
        eo: [0.005, 0.025],
        nn: [0.002, 0.005],
        rg: [0, 0.6],
        ol: 0.2,
        Ua: [0.698111, 1.047166, 0.122169],
        mj: [-0.1, 0, 0],
        Hd: [0, -62, 8],
        Sm: 1.03,
        Ba: [0, -60, 0],
        Mf: 40,
        sc: 0.4,
        Se: 73,
        qe: [0.04, 1],
        Pj: [4, 1],
        vk: [0, 0.5],
        pn: 0.3,
        mn: 1,
        uo: 20,
        hp: !1,
        vc: 145,
        hf: -18,
        ff: 20,
        gf: 3,
        Ac: [-110, 0],
        bc: 1,
        dj: 0.4,
        ej: 3,
        Qd: [0, 0, 0],
        cc: [1.1, 1],
        Zc: 0,
        He: 0.95,
        Ge: 90,
        Fe: 50,
        Uc: 30,
        Bb: 0.05,
        df: !0,
        yd: !0,
        Ef: "images/masks/target.jpg",
        Ff: !1,
        xd: [1 / 255, 175 / 255, 236 / 255, 0],
        zd: -0.001,
        Df: 3.14,
        ue: 0,
        te: "images/masks/burka.png",
        re: Math.PI - Math.PI / 4,
        De: Math.PI / 4,
        Xf: [0.3, 0.2, 0.1],
        Tb: 1,
        di: [700, 90],
        xm: [0.2, 0.04],
        vo: "images/backgrounds/viewer3D.png",
        Ig: [0, 0, 0],
        Hg: [0, 15, 60],
        fe: 0.3,
        Do: 50,
        zo: Nc ? Fa : !1,
        Ao: Nc ? Fa : !1,
        Co: 1e3,
        Fo: 1e3,
        Bo: 40,
        yo: [0, 0, -400],
        gi: 0.1,
        Bm: 0.5,
        hi: [0.5, 1.5],
        Ad: 30,
        Am: !0,
      },
      N = Object.assign({}, Hc);
    T.model = !1;
    T.Vb = 1;
    T.Gd = 1;
    T.dh = !0;
    T.eh = !0;
    T.bh = !1;
    T.Ja = !0;
    var Za = {
      $f: 3.5,
      Wb: "images/debug/picsou.png",
      Jd: 45,
      Af: 0.785,
      Bf: 0.3925,
      Cf: 5,
      yf: 2,
      zf: 0,
      xf: 0,
      wo: "images/backgrounds/bg1.jpg",
      xo: "images/backgrounds/bg1_light.jpg",
      zj: 1,
      Aj: 2,
    };
    N.fx = [4, 50];
    N.Ac = [-110, 0];
    N.dj = 0.25;
    N.ej = 3;
    N.Qd = [0, -2, 20];
    N.cc = [0.95, 1];
    T.Vb = 2.1289;
    T.Gd = 1;
    Za.$f = 2.5858;
    Za.Af = 0.4388;
    Za.Bf = 0.118;
    Za.Wb = "images/debug/hdri2.png";
    Za.Jd = 180;
    Za.Zf = 0.8065;
    Za.Cf = 5.3887;
    Za.yf = 0.5351;
    Za.zf = -0.3019;
    Za.xf = 0;
    Za.zj = 3.5288;
    Za.Aj = 6.2168;
    var Gc = {
        element: null,
        $g: null,
        ka: null,
        xg: null,
        deviceId: -1,
        Jb: -1,
        ed: 0,
        yi: null,
        ee: -1,
      },
      Aa = Object.assign({}, Gc),
      bb = null,
      Nb = -1,
      Ob = -1,
      Oc = N.Nm,
      yc = window.devicePixelRatio ? window.devicePixelRatio : 1;
    var kc = { nl: Math.max(Oc[0], yc) / yc, Qe: Math.min(yc, Oc[1]) };
    var cb = null;
    R.onLoad = function (a) {
      R.ready ? a() : R.Qc.push(a);
    };
    R.onHalfLoad = function (a) {
      R.load_model ? a() : R.Pc.push(a);
    };
    R.onWebcamAsk = function (a) {
      R.le = a;
    };
    R.onContextLost = function (a) {
      R.ke = a;
    };
    R.onWebcamGet = function (a) {
      R.me = a;
    };
    R.get_onHalfLoadCallstack = function () {
      return R.Pc;
    };
    R.set_size = function (a, c, e) {
      e = e ? kc.Qe : 1;
      N.width = a * e;
      N.height = c * e;
    };
    R.get_videoDevices = function (a) {
      Sc(a);
    };
    R.set_videoDevice = function (a) {
      Aa.deviceId = a;
    };
    R.set_videoSizes = function (a, c, e, d, n, k) {
      Ya.idealWidth = a;
      Ya.idealHeight = c;
      Ya.minWidth = e;
      Ya.maxWidth = d;
      Ya.minHeight = n;
      Ya.maxHeight = k;
    };
    R.set_loading = function (a, c, e) {
      a && ((N.Ff = !0), (N.Ef = a));
      "number" === typeof c && ((a = new Pb(c)), (N.xd = [a.r, a.X, a.b, 0]));
      "number" === typeof e && (N.zd = e);
    };
    R.set_settings = function (a, c, e) {
      a && Object.assign(N, a);
      c && Object.assign(Ya, c);
      e && Object.assign(Za, e);
    };
    R.get_size = function () {
      return { width: N.width, height: N.height };
    };
    R.get_cv = function () {
      return ab.kb();
    };
    R.set_NNCPath = function (a) {
      N.je = a;
    };
    R.set_materialsPath = function (a) {
      N.Hf = a;
    };
    R.set_modelsPath = function (a) {
      N.Lf = a;
    };
    R.destroy = function () {
      return cb ? cb.v() : Promise.resolve();
    };
    R.init = function (a, c, e, d) {
      cb = Tc();
      R.hb = e
        ? function (n, k) {
            e(n, k);
            R.hb = !1;
          }
        : function () {};
      R.Lo = cb;
      a && (N.aa = a);
      c && R.Qc.push(c);
      cb.bo();
      if (
        !ab.m({
          Ce: "jeefitCanvas",
          qa: d,
          width: Nb,
          height: Ob,
          debug: !1,
          Of: function () {
            R.ke && R.ke();
          },
          premultipliedAlpha: !0,
        })
      )
        return R.hb && R.hb("GL_INCOMPATIBLE", "Cannot init Context"), !1;
      R.le && R.le();
      a = {
        width: { min: Ya.minWidth, max: Ya.maxWidth, ideal: Ya.idealWidth },
        height: { min: Ya.minHeight, max: Ya.maxHeight, ideal: Ya.idealHeight },
        facingMode: { ideal: "user" },
      };
      c = { video: a, audio: !1 };
      Aa.$g = c;
      a && -1 !== Aa.deviceId && Xb(c, Aa.deviceId);
      $b(
        navigator.mediaDevices && navigator.mediaDevices.getUserMedia
          ? document.createElement("video")
          : !1,
        function (n) {
          R.me && R.me(n);
          Aa.element = n;
          n = Aa.element.videoWidth;
          var k = Aa.element.videoHeight;
          Aa.xg = { ia: Aa.element, isPot: !1, isFloat: !1, isFlipY: !0 };
          Aa.ka = Z.instance(Aa.xg);
          cb.jg(n, k);
          cb.mf(n, k) && cb.qg();
        },
        function (n) {
          R.hb && R.hb("WEBCAM_UNAVAILABLE", n);
        },
        c
      );
      return !0;
    };
    JEELIZVTO = R;
    var Dc = (function () {
        function a() {
          va.$();
          b.viewport(0, 0, 1, 1);
          ca.set("s64");
          d.g(0);
          Y.l(!1);
          b.readPixels(0, 0, 1, 1, b.RGBA, b.UNSIGNED_BYTE, k);
          c(0 < k[0]);
        }
        var c = null,
          e = !1,
          d = null,
          n = !1,
          k = null,
          B = {
            m: function (l) {
              if (n) return !1;
              d = l;
              ca.pe([
                {
                  id: "s64",
                  name: "_",
                  h: "uniform sampler2D u39;const vec2 e=vec2(.16,.5);void main(){vec4 a=texture2D(u39,e);float b=step(1.99,a.r);gl_FragColor=vec4(b,0.,0.,1.);}",
                  i: ["u39"],
                  precision: "lowp",
                },
              ]);
              ca.j("s64", [{ type: "1i", name: "u39", value: 0 }]);
              k = new Uint8Array(4);
              return (n = !0);
            },
            start: function (l, u) {
              B.stop();
              c = u;
              e = window.setInterval(a, l);
            },
            stop: function () {
              e && (window.clearInterval(a), (e = !1));
            },
          };
        return B;
      })(),
      oc = oc || {};
    Pb.prototype = {
      constructor: Pb,
      r: 1,
      X: 1,
      b: 1,
      set: function (a) {
        a instanceof Pb
          ? this.J(a)
          : "number" === typeof a
          ? Ic(this, a)
          : "string" === typeof a && Wc(this, a);
        return this;
      },
      sn: (function () {
        function a(c, e, d) {
          0 > d && (d += 1);
          1 < d && --d;
          return d < 1 / 6
            ? c + 6 * (e - c) * d
            : 0.5 > d
            ? e
            : d < 2 / 3
            ? c + 6 * (e - c) * (2 / 3 - d)
            : c;
        }
        return function (c, e, d) {
          c = oc.Math.ip(c, 1);
          e = oc.Math.xe(e, 0, 1);
          d = oc.Math.xe(d, 0, 1);
          0 === e
            ? (this.r = this.X = this.b = d)
            : ((e = 0.5 >= d ? d * (1 + e) : d + e - d * e),
              (d = 2 * d - e),
              (this.r = a(d, e, c + 1 / 3)),
              (this.X = a(d, e, c)),
              (this.b = a(d, e, c - 1 / 3)));
          return this;
        };
      })(),
      clone: function () {
        return new this.constructor(this.r, this.X, this.b);
      },
      J: function (a) {
        this.r = a.r;
        this.X = a.X;
        this.b = a.b;
        return this;
      },
      add: function (a) {
        this.r += a.r;
        this.X += a.X;
        this.b += a.b;
        return this;
      },
      multiply: function (a) {
        this.r *= a.r;
        this.X *= a.X;
        this.b *= a.b;
        return this;
      },
      Aa: function (a) {
        this.r *= a;
        this.X *= a;
        this.b *= a;
        return this;
      },
      ib: function (a, c) {
        void 0 === c && (c = 0);
        this.r = a[c];
        this.X = a[c + 1];
        this.b = a[c + 2];
        return this;
      },
    };
    var Xc = {};
    mc.prototype = {
      constructor: mc,
      get x() {
        return this.B;
      },
      set x(a) {
        this.B = a;
      },
      get y() {
        return this.C;
      },
      set y(a) {
        this.C = a;
      },
      get z() {
        return this.D;
      },
      set z(a) {
        this.D = a;
      },
      get w() {
        return this.O;
      },
      set w(a) {
        this.O = a;
      },
      set: function (a, c, e, d) {
        this.B = a;
        this.C = c;
        this.D = e;
        this.O = d;
        return this;
      },
      clone: function () {
        return new this.constructor(this.B, this.C, this.D, this.O);
      },
      J: function (a) {
        this.B = a.x;
        this.C = a.y;
        this.D = a.z;
        this.O = a.w;
        return this;
      },
      inverse: function () {
        this.B *= -1;
        this.C *= -1;
        this.D *= -1;
        this.normalize();
        return this;
      },
      ad: function (a) {
        return this.B * a.B + this.C * a.C + this.D * a.D + this.O * a.O;
      },
      wf: function () {
        return (
          this.B * this.B + this.C * this.C + this.D * this.D + this.O * this.O
        );
      },
      length: function () {
        return Math.sqrt(
          this.B * this.B + this.C * this.C + this.D * this.D + this.O * this.O
        );
      },
      normalize: function () {
        var a = this.length();
        0 === a
          ? ((this.D = this.C = this.B = 0), (this.O = 1))
          : ((a = 1 / a),
            (this.B *= a),
            (this.C *= a),
            (this.D *= a),
            (this.O *= a));
        return this;
      },
      multiply: function (a, c) {
        return void 0 !== c
          ? (console.warn(
              "JETHREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead."
            ),
            Jc(this, a, c))
          : Jc(this, this, a);
      },
      ib: function (a, c) {
        void 0 === c && (c = 0);
        this.B = a[c];
        this.C = a[c + 1];
        this.D = a[c + 2];
        this.O = a[c + 3];
        return this;
      },
    };
    Qb.prototype = {
      constructor: Qb,
      get width() {
        return this.x;
      },
      set width(a) {
        this.x = a;
      },
      get height() {
        return this.y;
      },
      set height(a) {
        this.y = a;
      },
      set: function (a, c) {
        this.x = a;
        this.y = c;
        return this;
      },
      Oi: function (a) {
        this.x = a;
        return this;
      },
      Pi: function (a) {
        this.y = a;
        return this;
      },
      clone: function () {
        return new this.constructor(this.x, this.y);
      },
      J: function (a) {
        this.x = a.x;
        this.y = a.y;
        return this;
      },
      add: function (a, c) {
        if (void 0 !== c)
          return (
            console.warn(
              "JETHREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead."
            ),
            this.Rc(a, c)
          );
        this.x += a.x;
        this.y += a.y;
        return this;
      },
      Rc: function (a, c) {
        this.x = a.x + c.x;
        this.y = a.y + c.y;
        return this;
      },
      sub: function (a, c) {
        if (void 0 !== c)
          return (
            console.warn(
              "JETHREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."
            ),
            this.Za(a, c)
          );
        this.x -= a.x;
        this.y -= a.y;
        return this;
      },
      Za: function (a, c) {
        this.x = a.x - c.x;
        this.y = a.y - c.y;
        return this;
      },
      multiply: function (a) {
        this.x *= a.x;
        this.y *= a.y;
        return this;
      },
      Aa: function (a) {
        isFinite(a) ? ((this.x *= a), (this.y *= a)) : (this.y = this.x = 0);
        return this;
      },
      Le: function (a) {
        return this.Aa(1 / a);
      },
      min: function (a) {
        this.x = Math.min(this.x, a.x);
        this.y = Math.min(this.y, a.y);
        return this;
      },
      max: function (a) {
        this.x = Math.max(this.x, a.x);
        this.y = Math.max(this.y, a.y);
        return this;
      },
      xe: function (a, c) {
        this.x = Math.max(a.x, Math.min(c.x, this.x));
        this.y = Math.max(a.y, Math.min(c.y, this.y));
        return this;
      },
      floor: function () {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
      },
      ceil: function () {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
      },
      round: function () {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
      },
      ad: function (a) {
        return this.x * a.x + this.y * a.y;
      },
      wf: function () {
        return this.x * this.x + this.y * this.y;
      },
      length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
      },
      normalize: function () {
        return this.Le(this.length());
      },
      ib: function (a, c) {
        void 0 === c && (c = 0);
        this.x = a[c];
        this.y = a[c + 1];
        return this;
      },
    };
    Oa.prototype = {
      constructor: Oa,
      set: function (a, c, e) {
        this.x = a;
        this.y = c;
        this.z = e;
        return this;
      },
      Oi: function (a) {
        this.x = a;
        return this;
      },
      Pi: function (a) {
        this.y = a;
        return this;
      },
      clone: function () {
        return new this.constructor(this.x, this.y, this.z);
      },
      J: function (a) {
        this.x = a.x;
        this.y = a.y;
        this.z = a.z;
        return this;
      },
      add: function (a, c) {
        if (void 0 !== c)
          return (
            console.warn(
              "JETHREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead."
            ),
            this.Rc(a, c)
          );
        this.x += a.x;
        this.y += a.y;
        this.z += a.z;
        return this;
      },
      Rc: function (a, c) {
        this.x = a.x + c.x;
        this.y = a.y + c.y;
        this.z = a.z + c.z;
        return this;
      },
      sub: function (a, c) {
        if (void 0 !== c)
          return (
            console.warn(
              "JETHREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."
            ),
            this.Za(a, c)
          );
        this.x -= a.x;
        this.y -= a.y;
        this.z -= a.z;
        return this;
      },
      Za: function (a, c) {
        this.x = a.x - c.x;
        this.y = a.y - c.y;
        this.z = a.z - c.z;
        return this;
      },
      multiply: function (a, c) {
        if (void 0 !== c)
          return (
            console.warn(
              "JETHREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead."
            ),
            (this.x = a.x * c.x),
            (this.y = a.y * c.y),
            (this.z = a.z * c.z),
            this
          );
        this.x *= a.x;
        this.y *= a.y;
        this.z *= a.z;
        return this;
      },
      Aa: function (a) {
        isFinite(a)
          ? ((this.x *= a), (this.y *= a), (this.z *= a))
          : (this.z = this.y = this.x = 0);
        return this;
      },
      Le: function (a) {
        return this.Aa(1 / a);
      },
      min: function (a) {
        this.x = Math.min(this.x, a.x);
        this.y = Math.min(this.y, a.y);
        this.z = Math.min(this.z, a.z);
        return this;
      },
      max: function (a) {
        this.x = Math.max(this.x, a.x);
        this.y = Math.max(this.y, a.y);
        this.z = Math.max(this.z, a.z);
        return this;
      },
      xe: function (a, c) {
        this.x = Math.max(a.x, Math.min(c.x, this.x));
        this.y = Math.max(a.y, Math.min(c.y, this.y));
        this.z = Math.max(a.z, Math.min(c.z, this.z));
        return this;
      },
      floor: function () {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        return this;
      },
      ceil: function () {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.z = Math.ceil(this.z);
        return this;
      },
      round: function () {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        return this;
      },
      ad: function (a) {
        return this.x * a.x + this.y * a.y + this.z * a.z;
      },
      wf: function () {
        return this.x * this.x + this.y * this.y + this.z * this.z;
      },
      length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
      },
      normalize: function () {
        return this.Le(this.length());
      },
      ib: function (a, c) {
        void 0 === c && (c = 0);
        this.x = a[c];
        this.y = a[c + 1];
        this.z = a[c + 2];
        return this;
      },
    };
    Rb.Cj = "XYZ";
    Rb.prototype = {
      constructor: Rb,
      get x() {
        return this.B;
      },
      set x(a) {
        this.B = a;
      },
      get y() {
        return this.C;
      },
      set y(a) {
        this.C = a;
      },
      get z() {
        return this.D;
      },
      set z(a) {
        this.D = a;
      },
      get order() {
        return this.Na;
      },
      set order(a) {
        this.Na = a;
      },
      set: function (a, c, e, d) {
        this.B = a;
        this.C = c;
        this.D = e;
        this.Na = d || this.Na;
        return this;
      },
      clone: function () {
        return new this.constructor(this.B, this.C, this.D, this.Na);
      },
      J: function (a) {
        this.B = a.B;
        this.C = a.C;
        this.D = a.D;
        this.Na = a.Na;
        return this;
      },
      ib: function (a) {
        this.B = a[0];
        this.C = a[1];
        this.D = a[2];
        void 0 !== a[3] && (this.Na = a[3]);
        return this;
      },
    };
    vc.prototype = {
      constructor: vc,
      set: function (a, c) {
        this.min.J(a);
        this.max.J(c);
        return this;
      },
      clone: function () {
        return new this.constructor().J(this);
      },
      J: function (a) {
        this.min.J(a.min);
        this.max.J(a.max);
        return this;
      },
      empty: function () {
        return (
          this.max.x < this.min.x ||
          this.max.y < this.min.y ||
          this.max.z < this.min.z
        );
      },
      size: function (a) {
        return (a || new Oa()).Za(this.max, this.min);
      },
      getParameter: function (a, c) {
        return (c || new Oa()).set(
          (a.x - this.min.x) / (this.max.x - this.min.x),
          (a.y - this.min.y) / (this.max.y - this.min.y),
          (a.z - this.min.z) / (this.max.z - this.min.z)
        );
      },
      translate: function (a) {
        this.min.add(a);
        this.max.add(a);
        return this;
      },
    };
    Sb.prototype = {
      constructor: Sb,
      set: function (a, c, e, d, n, k, B, l, u, p, G, H, E, r, C, g) {
        var f = this.elements;
        f[0] = a;
        f[4] = c;
        f[8] = e;
        f[12] = d;
        f[1] = n;
        f[5] = k;
        f[9] = B;
        f[13] = l;
        f[2] = u;
        f[6] = p;
        f[10] = G;
        f[14] = H;
        f[3] = E;
        f[7] = r;
        f[11] = C;
        f[15] = g;
        return this;
      },
      clone: function () {
        return new Sb().ib(this.elements);
      },
      J: function (a) {
        this.elements.set(a.elements);
        return this;
      },
      multiply: function (a, c) {
        return void 0 !== c
          ? (console.warn(
              "JETHREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead."
            ),
            Lc(this, a, c))
          : Lc(this, this, a);
      },
      Aa: function (a) {
        var c = this.elements;
        c[0] *= a;
        c[4] *= a;
        c[8] *= a;
        c[12] *= a;
        c[1] *= a;
        c[5] *= a;
        c[9] *= a;
        c[13] *= a;
        c[2] *= a;
        c[6] *= a;
        c[10] *= a;
        c[14] *= a;
        c[3] *= a;
        c[7] *= a;
        c[11] *= a;
        c[15] *= a;
        return this;
      },
      setPosition: function (a) {
        var c = this.elements;
        c[12] = a.x;
        c[13] = a.y;
        c[14] = a.z;
        return this;
      },
      translate: function () {
        console.error("JETHREE.Matrix4: .translate() has been removed.");
      },
      scale: function (a) {
        var c = this.elements,
          e = a.x,
          d = a.y;
        a = a.z;
        c[0] *= e;
        c[4] *= d;
        c[8] *= a;
        c[1] *= e;
        c[5] *= d;
        c[9] *= a;
        c[2] *= e;
        c[6] *= d;
        c[10] *= a;
        c[3] *= e;
        c[7] *= d;
        c[11] *= a;
        return this;
      },
      ib: function (a) {
        this.elements.set(a);
        return this;
      },
    };
    wc.prototype = {
      constructor: wc,
      clone: function () {
        return new this.constructor().J(this);
      },
      J: function (a) {
        this.a = a.a;
        this.b = a.b;
        this.c = a.c;
        this.Ka.J(a.Ka);
        this.color.J(a.color);
        this.Ub = a.Ub;
        for (var c = 0, e = a.de.length; c < e; c++)
          this.de[c] = a.de[c].clone();
        c = 0;
        for (e = a.Fg.length; c < e; c++) this.Fg[c] = a.Fg[c].clone();
        return this;
      },
    };
    var F = (function () {
        function a(q, h, L) {
          h = q.createShader(h);
          q.shaderSource(h, L);
          q.compileShader(h);
          return q.getShaderParameter(h, q.COMPILE_STATUS) ? h : !1;
        }
        function c(q, h) {
          da.ja() && (h.h = h.h.replace(/gl_FragData\[([0-3])\]/g, "gbuf$1"));
          h.cf = a(q, q.VERTEX_SHADER, h.s, h.name + " VERTEX");
          h.bf = a(q, q.FRAGMENT_SHADER, h.h, h.name + " FRAGMENT");
          var L = q.createProgram();
          q.attachShader(L, h.cf);
          q.attachShader(L, h.bf);
          q.linkProgram(L);
          return L;
        }
        function e(q) {
          q.s = "#version 300 es\n" + q.s.replace(/varying/g, "out");
          q.h = "#version 300 es\n" + q.h.replace(/varying/g, "in");
          q.s = q.s.replace(/texture2D\(/g, "texture(");
          q.h = q.h.replace(/texture2D\(/g, "texture(");
          q.ca ||
            ((q.h = q.h.replace(
              /void main/g,
              "out vec4 FragColor;\nvoid main"
            )),
            (q.h = q.h.replace(/gl_FragColor/g, "FragColor")));
          var h = 0,
            L = [];
          q.s = q.s.replace(
            /attribute ([a-z]+[0-4]*) ([_a-zA-Z,0-9\s]+);/g,
            function (O, v, m) {
              var t = "";
              m.split(",").forEach(function (M) {
                M = M.trim();
                t += "layout(location = " + h + ") in " + v + " " + M + ";\n";
                L.push(M);
                ++h;
              });
              return t;
            }
          );
          q.Lj = L;
        }
        function d(q) {
          return ["float", "sampler2D", "int"]
            .map(function (h) {
              return "precision " + q + " " + h + ";\n";
            })
            .join("");
        }
        function n(q, h) {
          if (h.Nh) return !1;
          var L = da.ja();
          T.Bp || L || q.enableVertexAttribArray(0);
          void 0 === h.ca && (h.ca = !1);
          h.ca && (h.Oc = L ? 3 : 2);
          h.id = J++;
          void 0 === h.Oc && (h.Oc = 2);
          void 0 === h.precision && (h.precision = "highp");
          h.ca &&
            (h.h =
              (da.ja()
                ? "precision highp float;\n          layout(location = 0) out vec4 gbuf0;\n          layout(location = 1) out vec4 gbuf1;\n          layout(location = 2) out vec4 gbuf2;\n          layout(location = 3) out vec4 gbuf3;\n"
                : "#extension GL_EXT_draw_buffers : require\n") + h.h);
          void 0 === h.s &&
            (h.s =
              "precision lowp float;attribute vec2 a0;varying vec2 vv0;void main(){gl_Position=vec4(a0,0.,1.),vv0=a0*.5+vec2(.5,.5);}");
          var O = d(h.precision);
          h.h = O + h.h;
          h.s = O + h.s;
          L && 3 <= h.Oc && e(h);
          h.Ca &&
            h.Ca.forEach(function (v) {
              h.s = h.s.replace(v.search, v.replace);
              h.h = h.h.replace(v.search, v.replace);
            });
          h.oa = c(q, h);
          h.A = {};
          h.i.forEach(function (v) {
            h.A[v] = q.getUniformLocation(h.oa, v);
          });
          h.attributes = {};
          h.wa = [];
          h.Eg = 0;
          void 0 === h.I && (h.I = ["a0"]);
          void 0 === h.P && (h.P = [2]);
          h.I.forEach(function (v, m) {
            var t =
              L && 3 <= h.Oc ? h.Lj.indexOf(v) : q.getAttribLocation(h.oa, v);
            h.attributes[v] = t;
            h.wa.push(t);
            h.Eg += 4 * h.P[m];
          });
          h.set = function () {
            f !== h.id &&
              (-1 !== f && y.H(),
              (f = h.id),
              (y = h),
              q.useProgram(h.oa),
              h.wa.forEach(function (v) {
                0 !== v && q.enableVertexAttribArray(v);
              }));
          };
          h.H = function () {
            f = -1;
            h.wa.forEach(function (v) {
              0 !== v && q.disableVertexAttribArray(v);
            });
          };
          h.Nh = !0;
        }
        function k(q, h) {
          n(q, h);
          h.set();
          f = -1;
          return h;
        }
        function B() {
          return {
            name: "_",
            h: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
            i: ["u1"],
            precision: "highp",
          };
        }
        function l() {
          x.j("s93", [{ type: "1i", name: "u1", value: 0 }]);
          x.j("s94", [{ type: "1i", name: "u146", value: 0 }]);
          x.j("s95", [{ type: "1i", name: "u68", value: 0 }]);
        }
        function u() {
          var q = "u39 u136 u137 u138 u139 u40 u72".split(" ").concat(r, C);
          g.s96 = {
            name: "_",
            h: "varying vec3 vv0;varying float vv1;void main(){gl_FragColor=vec4(vv0,vv1);}",
            s: "attribute vec3 a0;uniform sampler2D u39;uniform vec3 u136;uniform vec2 u40,u144;uniform float u137,u142,u143,u138,u139,u145;varying vec3 vv0;varying float vv1;const vec2 e=vec2(1.,1.);const vec3 o=vec3(1.,1.,1.);const vec2 D=vec2(-1.,1.),p=vec2(.16,.5),q=vec2(.5,.5),r=vec2(.84,.5);uniform mat4 u70;uniform vec3 u72,u76,u77,u78;uniform float u71,u79,u80,u73,u74,u75,u81;mat3 s(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,p);vec2 f=u79*e;vec3 c=u79*o;vec2 t=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,q).rgb+vec3(u73,0.,0.),u76,c);float u=mix(texture2D(u39,r).r,0.,u79);a.z+=u;mat3 v=s(a);vec3 w=mix(u136,u77,c);float x=mix(u137,u80,u79);vec3 b=mix(u72,u78,c);b.x+=u71*sin(a.y);float h=cos(a.z),i=sin(a.z);mat2 y=mat2(h,i,-i,h);b.xy=y*b.xy;float z=mix(u75,1.,u79);vec2 j=u74/t;vec3 k=a0;float A=max(0.,-a0.z-u138)*u139;k.x+=A*sign(a0.x)*(1.-u79);vec3 l=v*(k+w)*x+b;vec2 B=j*z;vec3 C=vec3(g*B,-j)+l*vec3(1.,-1.,-1.);gl_Position=u70*(vec4(u81*e,e)*vec4(C,1.)),vv0=l,vv1=smoothstep(u142,u143,a0.z);}",
            i: ["u142", "u143"].concat(q),
            I: ["a0"],
            precision: "highp",
          };
          g.s97 = {
            name: "_",
            h: "uniform sampler2D u1;uniform vec3 u140;uniform float u67;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0);vec3 b=mix(u140,a.rgb,a.a);vec4 c=vec4(mix(a.rgb*u140,b,u67),a.a);gl_FragColor=c;}",
            s: "attribute vec3 a0;attribute vec2 a1;uniform sampler2D u39;uniform vec3 u136;uniform vec2 u40,u144;uniform float u137,u138,u139,u145;varying vec2 vv0;const vec2 e=vec2(1.,1.);const vec3 m=vec3(1.,1.,1.);const vec2 C=vec2(-1.,1.),n=vec2(.16,.5),o=vec2(.5,.5),p=vec2(.84,.5);uniform mat4 u70;uniform vec3 u72,u76,u77,u78;uniform float u71,u79,u80,u73,u74,u75,u81;mat3 q(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,n);vec2 f=u79*e;vec3 c=u79*m;vec2 r=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,o).rgb+vec3(u73,0.,0.),u76,c);float s=mix(texture2D(u39,p).r,0.,u79);a.z+=s;mat3 t=q(a);vec3 u=mix(u136,u77,c);float v=mix(u137,u80,u79);vec3 b=mix(u72,u78,c);b.x+=u71*sin(a.y);float h=cos(a.z),i=sin(a.z);mat2 w=mat2(h,i,-i,h);b.xy=w*b.xy;float x=mix(u75,1.,u79);vec2 j=u74/r;vec3 k=a0;float y=max(0.,-a0.z-u138)*u139;k.x+=y*sign(a0.x)*(1.-u79);vec3 z=t*(k+u)*v+b;vec2 A=j*x;vec3 B=vec3(g*A,-j)+z*vec3(1.,-1.,-1.);gl_Position=u70*(vec4(u81*e,e)*vec4(B,1.)),vv0=a1;}",
            i: ["u140"].concat(H, q),
            I: ["a0", "a1"],
            P: [3, 2],
            precision: "lowp",
          };
          g.s98 = {
            name: "_",
            h: "uniform vec3 u140;void main(){gl_FragColor=vec4(u140,0.);}",
            s: "attribute vec3 a0;uniform sampler2D u39;uniform vec3 u136;uniform vec2 u40,u144;uniform float u137,u138,u139,u145;const vec2 e=vec2(1.,1.);const vec3 l=vec3(1.,1.,1.);const vec2 B=vec2(-1.,1.),m=vec2(.16,.5),n=vec2(.5,.5),o=vec2(.84,.5);uniform mat4 u70;uniform vec3 u72,u76,u77,u78;uniform float u71,u79,u80,u73,u74,u75,u81;mat3 p(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,m);vec2 f=u79*e;vec3 c=u79*l;vec2 q=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,n).rgb+vec3(u73,0.,0.),u76,c);float r=mix(texture2D(u39,o).r,0.,u79);a.z+=r;mat3 s=p(a);vec3 t=mix(u136,u77,c);float u=mix(u137,u80,u79);vec3 b=mix(u72,u78,c);b.x+=u71*sin(a.y);float h=cos(a.z),i=sin(a.z);mat2 v=mat2(h,i,-i,h);b.xy=v*b.xy;float w=mix(u75,1.,u79);vec2 j=u74/q;vec3 k=a0;float x=max(0.,-a0.z-u138)*u139;k.x+=x*sign(a0.x)*(1.-u79);vec3 y=s*(k+t)*u+b;vec2 z=j*w;vec3 A=vec3(g*z,-j)+y*vec3(1.,-1.,-1.);gl_Position=u70*(vec4(u81*e,e)*vec4(A,1.));}",
            i: ["u140"].concat(q),
            P: [3],
            precision: "lowp",
          };
          g.s99 = {
            name: "_",
            h: "uniform vec4 u7;varying vec3 vv0;varying float vv1;void main(){float a=u7.x+u7.y*smoothstep(-u7.w,-u7.z,vv1);gl_FragColor=vec4(normalize(vv0),a);}",
            s: "attribute vec3 a0,a2;uniform sampler2D u39;uniform vec3 u136;uniform vec2 u40,u144;uniform float u137,u138,u139,u145;varying vec3 vv0;varying float vv1;const vec2 e=vec2(1.,1.);const vec3 o=vec3(1.,1.,1.);const vec2 D=vec2(-1.,1.),p=vec2(.16,.5),q=vec2(.5,.5),r=vec2(.84,.5);uniform mat4 u70;uniform vec3 u72,u76,u77,u78;uniform float u71,u79,u80,u73,u74,u75,u81;mat3 s(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,p);vec2 f=u79*e;vec3 c=u79*o;vec2 t=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,q).rgb+vec3(u73,0.,0.),u76,c);float u=mix(texture2D(u39,r).r,0.,u79);a.z+=u;mat3 h=s(a);vec3 v=mix(u136,u77,c);float w=mix(u137,u80,u79);vec3 b=mix(u72,u78,c);b.x+=u71*sin(a.y);float i=cos(a.z),j=sin(a.z);mat2 x=mat2(i,j,-j,i);b.xy=x*b.xy;float y=mix(u75,1.,u79);vec2 k=u74/t;vec3 l=a0;float z=max(0.,-a0.z-u138)*u139;l.x+=z*sign(a0.x)*(1.-u79);vec3 A=h*(l+v)*w+b;vec2 B=k*y;vec3 C=vec3(g*B,-k)+A*vec3(1.,-1.,-1.);gl_Position=u70*(vec4(u81*e,e)*vec4(C,1.)),vv0=h*a2*vec3(1.,-1.,-1.),vv1=a0.y;}",
            i: ["u7", "u72"].concat(q),
            I: ["a0", "a2"],
            precision: "highp",
          };
          g.s100 = {
            name: "_",
            h: "uniform sampler2D u146;uniform vec4 u7;varying vec4 vv0;varying vec3 vv1;varying vec2 vv2;varying float vv3;const vec3 i=vec3(1.,1.,1.);void main(){vec3 j=vec3(0.,0.,-1.),c=normalize(vv1),b=texture2D(u146,vv2).xyz;b=normalize(b*255./127.-1.007874*i);vec3 d=vv0.xyz,k=cross(c,d)*vv0.w;mat3 l=mat3(d,k,c);vec3 a=l*b;a=dot(a,j)>0.?vv1:a;float m=u7.x+u7.y*smoothstep(-u7.w,-u7.z,vv3);gl_FragColor=vec4(a,m);}",
            s: "attribute vec4 a3;attribute vec3 a0,a2;attribute vec2 a1;uniform sampler2D u39;uniform vec3 u136;uniform vec2 u40,u144;uniform float u137,u138,u139,u145;varying vec4 vv0;varying vec3 vv1;varying vec2 vv2;varying float vv3;const vec2 e=vec2(1.,1.);const vec3 q=vec3(1.,1.,1.);const vec2 F=vec2(-1.,1.),r=vec2(.16,.5),s=vec2(.5,.5),t=vec2(.84,.5);uniform mat4 u70;uniform vec3 u72,u76,u77,u78;uniform float u71,u79,u80,u73,u74,u75,u81;mat3 u(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,r);vec2 f=u79*e;vec3 c=u79*q;vec2 v=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,s).rgb+vec3(u73,0.,0.),u76,c);float w=mix(texture2D(u39,t).r,0.,u79);a.z+=w;mat3 h=u(a);vec3 x=mix(u136,u77,c);float y=mix(u137,u80,u79);vec3 b=mix(u72,u78,c);b.x+=u71*sin(a.y);float i=cos(a.z),j=sin(a.z);mat2 z=mat2(i,j,-j,i);b.xy=z*b.xy;float A=mix(u75,1.,u79);vec2 k=u74/v;vec3 l=a0;float B=max(0.,-a0.z-u138)*u139;l.x+=B*sign(a0.x)*(1.-u79);vec3 C=h*(l+x)*y+b;vec2 D=k*A;vec3 E=vec3(g*D,-k)+C*vec3(1.,-1.,-1.);gl_Position=u70*(vec4(u81*e,e)*vec4(E,1.)),vv1=h*a2*vec3(1.,-1.,-1.),vv0=a3,vv2=a1,vv3=a0.y;}",
            i: ["u7", "u72", "u146"].concat(q),
            I: ["a3", "a0", "a2", "a1"],
            P: [4, 3, 3, 2],
            precision: "highp",
          };
          g.s101 = {
            name: "_",
            h: "uniform vec4 u105;uniform float u141;void main(){float b=u141;vec4 a=u105;float c=floor(15.99*b),d=floor(15.99*a.b);a.b=(c+16.*d)/255.,gl_FragColor=a;}",
            s: "attribute vec3 a0;uniform sampler2D u39;uniform vec3 u136;uniform vec2 u40,u144;uniform float u137,u138,u139,u145;const vec2 e=vec2(1.,1.);const vec3 l=vec3(1.,1.,1.);const vec2 B=vec2(-1.,1.),m=vec2(.16,.5),n=vec2(.5,.5),o=vec2(.84,.5);uniform mat4 u70;uniform vec3 u72,u76,u77,u78;uniform float u71,u79,u80,u73,u74,u75,u81;mat3 p(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,m);vec2 f=u79*e;vec3 c=u79*l;vec2 q=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,n).rgb+vec3(u73,0.,0.),u76,c);float r=mix(texture2D(u39,o).r,0.,u79);a.z+=r;mat3 s=p(a);vec3 t=mix(u136,u77,c);float u=mix(u137,u80,u79);vec3 b=mix(u72,u78,c);b.x+=u71*sin(a.y);float h=cos(a.z),i=sin(a.z);mat2 v=mat2(h,i,-i,h);b.xy=v*b.xy;float w=mix(u75,1.,u79);vec2 j=u74/q;vec3 k=a0;float x=max(0.,-a0.z-u138)*u139;k.x+=x*sign(a0.x)*(1.-u79);vec3 y=s*(k+t)*u+b;vec2 z=j*w;vec3 A=vec3(g*z,-j)+y*vec3(1.,-1.,-1.);gl_Position=u70*(vec4(u81*e,e)*vec4(A,1.));}",
            i: ["u105", "u141"].concat(q),
            precision: "lowp",
          };
          g.s102 = {
            name: "_",
            h: "uniform sampler2D u68;uniform vec4 u105,u69;uniform float u141;varying vec2 vv0;vec2 i(float d,float e){float f=floor(d*255.+.01),a=pow(2.,e),g=256./a,b=f/a,c=floor(b),h=(b-c)*a;return vec2(c/(g-1.),h/(a-1.));}void main(){float c=u141;vec4 a=u105,d=texture2D(u68,vv0);vec2 b=i(d.b,4.);float f=1.-b.x,g=b.y;b=i(d.a,1.);float h=b.x,e=b.y;vec4 k=vec4(d.rg,g,h);float l=f;a=mix(a,k,u69*e),c=mix(c,l,u69.b*e);float m=floor(15.99*c),n=floor(15.99*a.b);a.b=(m+16.*n)/255.,gl_FragColor=a;}",
            s: "attribute vec3 a0;attribute vec2 a1;uniform sampler2D u39;uniform vec3 u136;uniform vec2 u40,u144;uniform float u137,u138,u139,u145;varying vec2 vv0;const vec2 e=vec2(1.,1.);const vec3 m=vec3(1.,1.,1.);const vec2 C=vec2(-1.,1.),n=vec2(.16,.5),o=vec2(.5,.5),p=vec2(.84,.5);uniform mat4 u70;uniform vec3 u72,u76,u77,u78;uniform float u71,u79,u80,u73,u74,u75,u81;mat3 q(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,n);vec2 f=u79*e;vec3 c=u79*m;vec2 r=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,o).rgb+vec3(u73,0.,0.),u76,c);float s=mix(texture2D(u39,p).r,0.,u79);a.z+=s;mat3 t=q(a);vec3 u=mix(u136,u77,c);float v=mix(u137,u80,u79);vec3 b=mix(u72,u78,c);b.x+=u71*sin(a.y);float h=cos(a.z),i=sin(a.z);mat2 w=mat2(h,i,-i,h);b.xy=w*b.xy;float x=mix(u75,1.,u79);vec2 j=u74/r;vec3 k=a0;float y=max(0.,-a0.z-u138)*u139;k.x+=y*sign(a0.x)*(1.-u79);vec3 z=t*(k+u)*v+b;vec2 A=j*x;vec3 B=vec3(g*A,-j)+z*vec3(1.,-1.,-1.);gl_Position=u70*(vec4(u81*e,e)*vec4(B,1.)),vv0=a1;}",
            i: ["u105", "u141"].concat(E, q),
            I: ["a0", "a1"],
            P: [3, 2],
            precision: "lowp",
          };
          q = ["u129", "u117", "u130"];
          g.s103 = {
            name: "_",
            h: "varying vec3 vv0;varying float vv1;void main(){gl_FragColor=vec4(vv0,vv1);}",
            s: "attribute vec3 a0;uniform mat4 u129,u117,u130;varying vec3 vv0;varying float vv1;void main(){vec4 a=u130*vec4(a0,1.);gl_Position=u129*u117*a,vv0=a.xyz,vv1=1.;}",
            i: q,
            precision: "highp",
          };
          g.s104 = {
            name: "_",
            h: "varying vec3 vv0;void main(){gl_FragColor=vec4(normalize(vv0),1.);}",
            s: "attribute vec3 a0,a2;uniform mat4 u129,u117,u130;varying vec3 vv0;varying float vv1;void main(){vec4 a=u130*vec4(a2,0.);gl_Position=u129*u117*u130*vec4(a0,1.),vv0=a.xyz,vv1=a0.y;}",
            i: q,
            I: ["a0", "a2"],
            precision: "highp",
          };
          g.s94 = {
            name: "_",
            h: "uniform sampler2D u146;uniform vec3 u147;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;const vec3 i=vec3(1.,1.,1.);void main(){vec3 j=normalize(vv1+u147),c=normalize(vv2),b=texture2D(u146,vv3).xyz;b=normalize(b*255./127.-1.007874*i);vec3 d=vv0.xyz,k=cross(c,d)*vv0.w;mat3 l=mat3(d,k,c);vec3 a=l*b;a=dot(a,j)>0.?vv2:a,gl_FragColor=vec4(a,1.);}",
            s: "attribute vec4 a3;attribute vec3 a0,a2;attribute vec2 a1;uniform mat4 u129,u117,u130;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;void main(){vec4 b=u130*vec4(a2,0.),a=u130*vec4(a0,1.);gl_Position=u129*u117*a,vv0=a3,vv2=b.xyz,vv3=a1,vv1=a.xyz;}",
            i: ["u146", "u147"].concat(q),
            I: ["a0", "a2", "a1", "a3"],
            precision: "highp",
          };
          g.s93 = {
            name: "_",
            h: "uniform sampler2D u1;uniform vec3 u140;uniform float u67;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0);vec3 b=mix(u140,a.rgb,a.a);vec4 c=vec4(mix(a.rgb*u140,b,u67),a.a);gl_FragColor=c;}",
            s: "attribute vec3 a0;attribute vec2 a1;uniform mat4 u129,u117,u130;varying vec2 vv0;const vec4 f=vec4(0.,0.,5e-4,0.);void main(){gl_Position=u129*u117*u130*vec4(a0,1.)+f,vv0=a1;}",
            i: ["u140"].concat(H, q),
            I: ["a0", "a1"],
            Ca: [{ search: "0.0005", replace: xa.ea() ? "0.0005" : "0.0" }],
            precision: "lowp",
          };
          g.s105 = {
            name: "_",
            h: "uniform vec4 u105;uniform float u141;void main(){float b=u141;vec4 a=u105;float c=floor(15.99*b),d=floor(15.99*a.b);a.b=(c+16.*d)/255.,gl_FragColor=a;}",
            s: "attribute vec3 a0;uniform mat4 u129,u117,u130;void main(){gl_Position=u129*u117*u130*vec4(a0,1.);}",
            i: ["u105"].concat(q),
            precision: "highp",
          };
          g.s95 = {
            name: "_",
            h: "uniform sampler2D u68;uniform vec4 u105,u69;uniform float u141;varying vec2 vv0;vec2 i(float d,float e){float f=floor(d*255.+.01),a=pow(2.,e),g=256./a,b=f/a,c=floor(b),h=(b-c)*a;return vec2(c/(g-1.),h/(a-1.));}void main(){float c=u141;vec4 a=u105,d=texture2D(u68,vv0);vec2 b=i(d.b,4.);float f=1.-b.x,g=b.y;b=i(d.a,1.);float h=b.x,e=b.y;vec4 k=vec4(d.rg,g,h);float l=f;a=mix(a,k,u69*e),c=mix(c,l,u69.b*e);float m=floor(15.99*c),n=floor(15.99*a.b);a.b=(m+16.*n)/255.,gl_FragColor=a;}",
            s: "attribute vec3 a0;attribute vec2 a1;uniform mat4 u129,u117,u130;varying vec2 vv0;void main(){gl_Position=u129*u117*u130*vec4(a0,1.),vv0=a1;}",
            i: ["u105"].concat(E, q),
            I: ["a0", "a1"],
            P: [3, 2],
            precision: "highp",
          };
        }
        function p() {
          for (var q in g) n(b, g[q]);
        }
        var G = !1,
          H = ["u1", "u67"],
          E = ["u68", "u69"],
          r = "u70 u71 u72 u73 u74 u75".split(" "),
          C = "u76 u77 u78 u79 u80 u81".split(" "),
          g = {},
          f = -1,
          y = null,
          J = 0,
          x = {
            pa: function (q, h) {
              g[q] = h;
              G && n(b, g[q]);
            },
            Pp: function (q, h) {
              g[q] = h;
              h.Nh = !1;
              n(b, g[q]);
            },
            Sb: function () {
              return G;
            },
            m: function () {
              g.s0 = B();
              g.s1 = {
                name: "_",
                h: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
                i: ["u1"],
                precision: "lowp",
              };
              g.s65 = {
                name: "_",
                h: "uniform sampler2D u1,u6;uniform float u7;varying vec2 vv0;const vec3 f=vec3(1.,1.,1.);void main(){gl_FragColor=vec4(mix(texture2D(u6,vv0).rgb,texture2D(u1,vv0).rgb,u7*f),1.);}",
                i: ["u1", "u6", "u7"],
                precision: "highp",
              };
              g.s66 = {
                name: "_",
                h: "uniform sampler2D u1,u6;uniform float u7;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){gl_FragColor=mix(texture2D(u6,vv0),texture2D(u1,vv0),u7*f);}",
                i: ["u1", "u6", "u7"],
                precision: "highp",
              };
              g.s12 = {
                name: "_",
                h: "uniform sampler2D u1,u82;uniform vec2 u83;uniform float u84,u85;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 b=texture2D(u82,vv0*u83),c=texture2D(u1,vv0*u83);float a=smoothstep(u84,0.,vv0.y);a+=smoothstep(1.-u84,1.,vv0.y),gl_FragColor=pow(mix(c,b,a*f),u85*f);}",
                i: ["u1", "u83", "u82", "u84", "u85"],
              };
              g.s67 = {
                name: "_",
                h: "uniform sampler2D u1,u82;uniform vec2 u83;uniform float u84,u85;varying vec2 vv0;const vec3 h=vec3(1.,1.,1.);vec4 i(vec3 d){vec3 b=d/65536.,a=clamp(ceil(log2(b)),-128.,127.);float c=max(max(a.r,a.g),a.b),f=exp2(c);vec3 g=clamp(b/f,0.,1.);return vec4(g,(c+128.)/256.);}void main(){vec2 a=vv0*u83;float c=floor(a.x),d=mod(c,2.);a.x=mod(a.x,1.),a.x=mix(a.x,1.-a.x,d);vec3 f=texture2D(u82,a).rgb,g=texture2D(u1,a).rgb;float b=smoothstep(u84,0.,vv0.y);b+=smoothstep(1.-u84,1.,vv0.y);vec3 j=mix(g,f,b*h);vec4 k=i(pow(j,u85*h));gl_FragColor=k;}",
                i: ["u1", "u83", "u82", "u84", "u85"],
                precision: "highp",
              };
              g.s68 = {
                name: "_",
                h: "uniform sampler2D u1;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0);if(a.a<.5)discard;gl_FragColor=a;}",
                i: ["u1"],
                precision: "lowp",
              };
              g.s69 = {
                name: "_",
                h: "uniform sampler2D u1,u86;uniform vec2 u8;varying vec2 vv0;const vec2 f=vec2(-.9,.4),g=vec2(.4,.9),h=vec2(-.4,-.9),i=vec2(.9,-.4);void main(){vec2 a=vv0;vec3 b=texture2D(u1,a).rgb+texture2D(u1,a+u8*f).rgb+texture2D(u1,a+u8*g).rgb+texture2D(u1,a+u8*h).rgb+texture2D(u1,a+u8*i).rgb;gl_FragColor=vec4(b/5.,1.);}",
                i: ["u1", "u8"],
                precision: "lowp",
              };
              g.s70 = {
                name: "_",
                h: "uniform sampler2D u1,u86,u39;uniform vec2 u8,u87;varying vec2 vv0;const vec3 k=vec3(1.,1.,1.);const vec2 f=vec2(-.9,.4),g=vec2(.4,.9),h=vec2(-.4,-.9),i=vec2(.9,-.4);void main(){vec2 a=vv0;vec3 b=texture2D(u1,a).rgb+texture2D(u1,a+u8*f).rgb+texture2D(u1,a+u8*g).rgb+texture2D(u1,a+u8*h).rgb+texture2D(u1,a+u8*i).rgb;float c=texture2D(u39,vec2(.5,.5)).a,d=u87.x+pow(c,2.)*(u87.y-u87.x);vec3 j=mix(b/5.,texture2D(u86,a).rgb,d);gl_FragColor=vec4(j,1.);}",
                i: ["u1", "u86", "u8", "u39", "u87"],
                precision: "lowp",
              };
              g.s71 = {
                name: "_",
                h: "uniform sampler2D u1;uniform vec2 u8;varying vec2 vv0;const vec3 f=vec3(.299,.587,.114);const float m=.007813,n=.125,h=8.;void main(){vec2 x=vv0;vec3 o=texture2D(u1,vv0+vec2(-1.,-1.)*u8).xyz,p=texture2D(u1,vv0+vec2(1.,-1.)*u8).xyz,q=texture2D(u1,vv0+vec2(-1.,1.)*u8).xyz,r=texture2D(u1,vv0+vec2(1.,1.)*u8).xyz,s=texture2D(u1,vv0).xyz;float b=dot(o,f),c=dot(p,f),e=dot(q,f),g=dot(r,f),i=dot(s,f),t=min(i,min(min(b,c),min(e,g))),u=max(i,max(max(b,c),max(e,g)));vec2 a;a.x=-(b+c-(e+g)),a.y=b+e-(c+g);float v=max((b+c+e+g)*(.25*n),m),w=1./(min(abs(a.x),abs(a.y))+v);a=min(vec2(h,h),max(vec2(-h,-h),a*w))*u8;vec3 j=.5*(texture2D(u1,vv0+a*-.166667).rgb+texture2D(u1,vv0+a*.166667).rgb),k=j*.5+.25*(texture2D(u1,vv0+a*-.5).rgb+texture2D(u1,vv0+a*.5).rgb);float l=dot(k,f);gl_FragColor=l<t||l>u?vec4(j,1.):vec4(k,1.);}",
                i: ["u1", "u8"],
                precision: "lowp",
              };
              g.s43 = {
                name: "_",
                h: "uniform sampler2D u1;varying vec2 vv0;const vec3 f=vec3(0.,0.,0.);vec4 g(vec3 d){vec3 b=d/65536.,a=clamp(ceil(log2(b)),-128.,127.);float c=max(max(a.r,a.g),a.b),h=exp2(c);vec3 i=clamp(b/h,0.,1.);return vec4(i,(c+128.)/256.);}void main(){vec3 a=texture2D(u1,vv0).rgb;gl_FragColor=g(max(a,f));}",
                i: ["u1"],
                precision: "highp",
              };
              g.s72 = {
                name: "_",
                h: "uniform sampler2D u88,u89;uniform float u90,u91;varying vec2 vv0;void main(){vec3 a=texture2D(u89,vv0).rgb,b=texture2D(u88,vv0).rgb;gl_FragColor=vec4(b*u91+u90*a,1.);}",
                i: ["u88", "u89", "u90", "u91"],
                precision: "highp",
              };
              g.s73 = {
                name: "_",
                h: "uniform sampler2D u92,u93;uniform float u85;varying vec2 vv0;const int j=8888;const float e=3.141592;const vec2 k=vec2(0.,0.);const vec3 n=vec3(1.,1.,1.),o=vec3(0.,0.,0.);void main(){float p=e*(vv0.x*2.-1.),q=e/2.*(vv0.y*2.-1.),b,c,r,l,m;vec4 d;vec3 f=o;vec2 g=k,a=k;for(int h=0;h<j;h+=1)a.x=float(h),a.y=floor(a.x/64.),d=texture2D(u93,a/64.),b=e*d.r,c=2.*asin(sqrt(.25+d.g*.25)),l=p+c*cos(b),m=q+c*sin(b),g.x=.5+.5*l/e,g.y=.5+m/e,f+=pow(texture2D(u92,g).rgb,u85*n);f/=float(j),gl_FragColor=vec4(f,1.);}",
                i: ["u92", "u93", "u85"],
                precision: "lowp",
                Ca: [{ search: "8888", replace: T.cm[da.T()] }],
              };
              g.s74 = {
                name: "_",
                h: "uniform sampler2D u1;uniform vec2 u8;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0);float b=.031496*texture2D(u1,vv0-3.*u8).a+.110236*texture2D(u1,vv0-2.*u8).a+.220472*texture2D(u1,vv0-u8).a+.275591*a.a+.220472*texture2D(u1,vv0+u8).a+.110236*texture2D(u1,vv0+2.*u8).a+.031496*texture2D(u1,vv0+3.*u8).a;gl_FragColor=vec4(a.rgb,4.*b);}",
                i: ["u1", "u8"],
                precision: "lowp",
              };
              g.s75 = {
                name: "_",
                h: "uniform sampler2D u1;varying vec2 vv0;const vec3 f=vec3(1.,1.,1.);void main(){vec4 a=texture2D(u1,vv0);float b=.3*pow(a.a,2.);gl_FragColor=vec4(a.rgb+b*f,1.);}",
                i: ["u1"],
                precision: "lowp",
              };
              g.s76 = {
                name: "_",
                h: "uniform sampler2D u1;uniform vec2 u8;varying vec2 vv0;void main(){vec4 a=.031496*texture2D(u1,vv0-3.*u8)+.110236*texture2D(u1,vv0-2.*u8)+.220472*texture2D(u1,vv0-u8)+.275591*texture2D(u1,vv0)+.220472*texture2D(u1,vv0+u8)+.110236*texture2D(u1,vv0+2.*u8)+.031496*texture2D(u1,vv0+3.*u8);gl_FragColor=a;}",
                i: ["u1", "u8"],
                precision: "lowp",
              };
              g.s77 = {
                name: "_",
                h: "uniform sampler2D u1;uniform vec2 u8;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0-3.*u8)+texture2D(u1,vv0-2.*u8)+texture2D(u1,vv0-u8)+texture2D(u1,vv0)+texture2D(u1,vv0+u8)+texture2D(u1,vv0+2.*u8)+texture2D(u1,vv0+3.*u8);gl_FragColor=a/7.;}",
                i: ["u1", "u8"],
                precision: "lowp",
              };
              g.s78 = {
                name: "_",
                h: "uniform sampler2D u1;varying vec2 vv0;const vec4 g=vec4(0.,0.,0.,0.);const float e=256.;void main(){vec4 b=g;float c=0.;vec2 d;for(float a=0.;a<e;a+=1.)d=vec2((a+.5)/e,vv0.y),b+=texture2D(u1,d),c+=1.;gl_FragColor=b/c;}",
                i: ["u1"],
                precision: "highp",
              };
              g.s79 = {
                name: "_",
                h: "uniform sampler2D u1,u82;varying vec2 vv0;const vec4 h=vec4(1.,1.,1.,1.);const float f=0.,g=.3;void main(){vec4 b=texture2D(u82,vv0),c=texture2D(u1,vv0);float a=smoothstep(g,f,vv0.y);a+=smoothstep(1.-g,1.-f,vv0.y),gl_FragColor=mix(c,b,a*h);}",
                i: ["u1", "u82"],
                precision: "highp",
              };
              g.s80 = {
                name: "_",
                h: "uniform sampler2D u1,u82;varying vec2 vv0;const vec3 h=vec3(1.,1.,1.);const float f=0.,g=.3;vec4 i(vec3 d){vec3 b=d/65536.,a=clamp(ceil(log2(b)),-128.,127.);float c=max(max(a.r,a.g),a.b),j=exp2(c);vec3 k=clamp(b/j,0.,1.);return vec4(k,(c+128.)/256.);}void main(){vec3 b=texture2D(u82,vv0).rgb,c=texture2D(u1,vv0).rgb;float a=smoothstep(g,f,vv0.y);a+=smoothstep(1.-g,1.-f,vv0.y),gl_FragColor=i(mix(c,b,a*h));}",
                i: ["u1", "u82"],
                precision: "highp",
              };
              g.s81 = {
                name: "_",
                h: "uniform sampler2D u1,u94,u2,u95;uniform vec4 u96;uniform vec2 u97;uniform float u98,u99,u100,u101;varying vec2 vv0;const vec2 g=vec2(1.,1.),h=vec2(.5,.5);const float e=3.141592;void main(){vec4 d=texture2D(u1,vv0),i=texture2D(u94,vec2(1.-vv0.x,vv0.y));float j=step(texture2D(u95,vec2(.25,.5)).r,1.);vec2 a=vv0*2.-g;float k=texture2D(u2,a*u97*.5+h).r,l=atan(a.x,a.y),m=-(mod(u98,2.*e)-e),b=mod(l-m+e,2.*e)-e,n=smoothstep(0.,u99,b),c=.5+u101*(.5-n);c*=(sign(b)+1.)/2.;vec4 o=i+c*u96*k;gl_FragColor=mix(d,o,j*u100);}",
                i: "u1 u2 u95 u94 u96 u98 u99 u100 u97 u101".split(" "),
                precision: "lowp",
              };
              var q =
                "u102 u103 u104 u105 u92 u106 u22 u107 u94 u108 u109 u110 u111 u112 u8".split(
                  " "
                );
              T.da &&
                (g.s82 = {
                  name: "_",
                  h: "uniform sampler2D u102,u103,u104,u105,u92,u106,u113,u94;uniform vec3 u107,u110;uniform vec2 u8;uniform float u22,u114,u109,u111,u108;varying vec2 vv0;const float j=3.141592;const vec3 u=vec3(0.,0.,0.),v=vec3(.299,.587,.114);const float w=2.;vec3 l(vec4 a){float b=a.a*256.-128.;vec3 c=a.rgb;return exp2(b)*c*65536.;}vec2 x(vec3 a){float b=atan(a.x,a.z),c=acos(-a.y);return vec2(.5-.5*b/j,1.-c/j);}vec2 y(vec3 a,float b){vec2 d=vec2(1.,.5)/pow(2.,b),f=vec2(0.,1.-pow(.5,b));float g=atan(a.x,a.z),h=acos(-a.y),c=.5+.5*g/j,i=h/j,k=pow(2.,b)/u108;c=(1.-k)*c;return f+vec2(c,i)*d;}void main(){vec4 c=texture2D(u102,vv0);vec3 k=texture2D(u94,vec2(1.-vv0.x,vv0.y)).rgb;if(c.a<.01){gl_FragColor=vec4(k,0.);return;}float z=c.a;vec3 A=c.rgb,B=A+u107;vec4 b=texture2D(u105,vv0),m=texture2D(u103,vv0);vec3 d=m.rgb;float f=m.a;vec4 n=texture2D(u104,vv0);vec3 C=n.rgb;float o=b.r,D=b.g,p=floor(b.b*255.),g=floor(p/16.),E=(p-16.*g)/16.;g/=16.;float F=b.a;f=1.-(1.-f)*(1.-n.a);vec2 G=x(-d);vec3 q=(1.-F)*l(texture2D(u106,G)),r=normalize(B),h=u,s=reflect(-r,d);vec2 H=y(s,floor(D*u22));float I=acos(-s.z),J=smoothstep(u109-u111,u109+u111,I);h=mix(l(texture2D(u92,H)),u110,J);float a=o+(E-o)*pow(1.-dot(d,-r),g*16.);a=clamp(a,0.,1.);float t=1.-u114*texture2D(u113,vv0).r;h*=pow(t,2.),q*=t;vec3 i=C*mix(q,h,a),M=mix(k,i,z*(f*(1.-a)+a));float K=dot(i,v),L=max(0.,(K-1.)/(w-1.));gl_FragColor=vec4(i,L);}",
                  i: q.concat(["u113", "u114"]),
                  precision: "highp",
                });
              g.s83 = {
                name: "_",
                h: "uniform sampler2D u102,u103,u104,u105,u92,u106,u94;uniform vec3 u107,u110;uniform vec2 u8;uniform float u22,u109,u111,u112,u115,u116,u108;varying vec2 vv0;const float g=3.141592;const vec3 D=vec3(0.,0.,0.),m=vec3(1.,1.,1.),E=vec3(.299,.587,.114);const float F=2.;vec3 p(vec4 a){float b=a.a*256.-128.;vec3 c=a.rgb;return exp2(b)*c*65536.;}vec2 G(vec3 a){float b=atan(a.x,-a.z),c=acos(-a.y);return vec2(.5-.5*b/g,1.-c/g);}vec2 H(vec3 a,float d){float b=pow(2.,d);vec2 f=vec2(1.,.5)/b,h=vec2(0.,1.-1./b);float i=atan(a.x,a.z),j=acos(-a.y),c=.5+.5*i/g,k=j/g,l=.5*b/u108;c=(1.-l)*c;return h+vec2(c,k)*f;}float n(vec3 a,vec3 b){return abs(acos(dot(a,b)));}float o(vec2 a){float b=texture2D(u102,a).a;return step(.01,b);}void main(){vec4 h=texture2D(u102,vv0),i=texture2D(u94,vec2(1.-vv0.x,vv0.y));if(h.a<.01){gl_FragColor=vec4(i.rgb,0.);return;}float q=h.a;vec3 I=h.rgb,J=I+u107;vec4 c=texture2D(u105,vv0),r=texture2D(u103,vv0);vec3 a=r.rgb;float j=r.a;vec4 k=texture2D(u104,vv0);vec3 d=k.rgb;if(q>1.){gl_FragColor=vec4(mix(i.rgb,d,k.a),1.);return;}d=pow(d,u115*m);float s=c.r,K=c.g,L=c.a,t=floor(c.b*255.),l=floor(t/16.),M=(t-16.*l)/16.;l/=16.,j=1.-(1.-j)*(1.-k.a);vec2 u=vv0+vec2(-1.,0.)*u8,v=vv0+vec2(1.,0.)*u8,w=vv0+vec2(0.,1.)*u8,x=vv0+vec2(0.,-1.)*u8;vec3 N=texture2D(u103,u).rgb,O=texture2D(u103,v).rgb,P=texture2D(u103,w).rgb,Q=texture2D(u103,x).rgb;float R=n(a,N)*o(u),S=n(a,O)*o(v),T=n(a,P)*o(w),U=n(a,Q)*o(x),V=2.*max(max(R,S),max(T,U)),W=1.2*clamp(V/g,0.,1.),X=max(K,W);vec2 Y=G(a);vec3 Z=p(texture2D(u106,Y)),_=(1.-L)*Z,y=normalize(J),z=D,A=reflect(-y,a);float aa=floor(X*u22);vec2 ba=H(A,aa);float ca=acos(-A.z),da=smoothstep(u109-u111,u109+u111,ca);vec3 ea=p(texture2D(u92,ba));z=mix(ea,u110,da*u112);float b=s+(M-s)*pow(1.+dot(a,y),l*15.);b=clamp(b,0.,1.);vec3 fa=d*mix(_,z,b);float B=q*(j*(1.-b)+b);vec3 f=mix(i.rgb,pow(fa,m/u115),B);float C=dot(f,E),ga_=max(0.,(C-1.)/(F-1.));f=mix(C*m,f,mix(1.,u116,B)*m),gl_FragColor=vec4(f,ga_);}",
                i: q.concat(["u115", "u116"]),
                precision: "highp",
              };
              T.da &&
                ((g.s84 = {
                  name: "_",
                  h: "uniform sampler2D u102,u103;uniform mat4 u117;uniform vec2 u118,u8,u119;uniform float u120,u121,u122,u123,u124,u125,u126,u127,u114;varying vec2 vv0;const float PI=3.141593,HALFPI=1.570796,N=8888.8;void main(){vec2 uvt=vv0+u119;vec4 pos=texture2D(u102,uvt);if(pos.a<.01){gl_FragColor=vec4(0.,0.,0.,1.);return;}vec3 co0=pos.rgb;float c=cos(u120),s=sin(u120);vec3 no0=texture2D(u103,uvt).rgb;float zv=(u117*vec4(co0,1.)).z;vec3 co;vec2 scale=u118/abs(zv),uv,duv=u8*vec2(c,s)*scale;vec3 dp,dpn;float dzMax=0.,angleMin=0.,angle;for(float i=0.;i<N;i+=1.)uv=uvt+i*duv,co=texture2D(u102,uv).rgb,dp=co-co0,dpn=normalize(dp),angle=atan(dot(no0,dpn),length(cross(no0,dpn))),angle*=1.-smoothstep(u126,u127,length(dp)),angleMin=max(angleMin,angle),dzMax=max(dzMax,sin(angle)*length(dp));float angleMinInv=0.;for(float i=0.;i<N;i+=1.)uv=uvt-i*duv,co=texture2D(u102,uv).rgb,dp=co-co0,dpn=normalize(dp),angle=atan(dot(no0,dpn),length(cross(no0,dpn))),angle*=1.-smoothstep(u126,u127,length(dp)),dzMax=max(dzMax,sin(angle)*length(dp)),angleMinInv=max(angleMinInv,angle);duv=u8*vec2(s,c)*scale;float angleMin2=0.;for(float i=0.;i<N;i+=1.)uv=uvt+i*duv,co=texture2D(u102,uv).rgb,dp=co-co0,dpn=normalize(dp),angle=atan(dot(no0,dpn),length(cross(no0,dpn))),angle*=1.-smoothstep(u126,u127,length(dp)),dzMax=max(dzMax,sin(angle)*length(dp)),angleMin2=max(angleMin2,angle);float angleMin2Inv=0.;for(float i=0.;i<N;i+=1.)uv=uvt-i*duv,co=texture2D(u102,uv).rgb,dp=co-co0,dpn=normalize(dp),angle=atan(dot(no0,dpn),length(cross(no0,dpn))),angle*=1.-smoothstep(u126,u127,length(dp)),dzMax=max(dzMax,sin(angle)*length(dp)),angleMin2Inv=max(angleMin2Inv,angle);float omegaMin=PI/4.*(angleMin+angleMinInv)*(angleMin2+angleMin2Inv),dzFactor=clamp(dzMax/u123,u124,1.),ao=dzFactor*clamp(u122*omegaMin*u125,0.,u114);gl_FragColor=vec4(ao,ao,ao,u121);}",
                  i: "u102 u103 u122 u121 u120 u8 u128 u123 u124 u125 u126 u127 u117 u118 u114".split(
                    " "
                  ),
                  Ca: [{ search: "8888.8", replace: T.ek[da.T()].toFixed(1) }],
                  precision: "lowp",
                }),
                (g.s85 = {
                  name: "_",
                  h: "uniform sampler2D u1;uniform vec2 u8;varying vec2 vv0;const vec2 f=vec2(-.9,.4),g=vec2(.4,.9),h=vec2(-.4,-.9),i=vec2(.9,-.4),j=vec2(-1.9,.9),k=vec2(.9,1.9),l=vec2(-.9,-1.9),m=vec2(1.9,-.9);void main(){vec2 a=vv0;vec4 b=texture2D(u1,a)+texture2D(u1,a+u8*f)+texture2D(u1,a+u8*g)+texture2D(u1,a+u8*h)+texture2D(u1,a+u8*i);b+=texture2D(u1,a+u8*j)+texture2D(u1,a+u8*k)+texture2D(u1,a+u8*l)+texture2D(u1,a+u8*m),gl_FragColor=b/9.;}",
                  i: ["u1", "u8"],
                  precision: "lowp",
                }));
              g.s86 = {
                name: "_",
                h: "varying vec3 vv0;void main(){gl_FragColor=vec4(vv0,1.);}",
                s: "attribute vec3 a0;uniform mat4 u129,u117,u130;varying vec3 vv0;void main(){vec4 a=u129*u117*u130*vec4(a0,1.);gl_Position=a,vv0=a.xyz/a.w;}",
                i: ["u129", "u117", "u130"],
                precision: "lowp",
              };
              g.s87 = {
                name: "_",
                h: "uniform sampler2D u131,u106,u93;uniform mat4 u129,u132;uniform vec2 u133;uniform float u134;varying vec2 vv0;const float n=8888.8,o=9999.9,p=25.,v=50.,w=1.2,e=3.141592;const vec4 x=vec4(0.,0.,0.,0.),A=vec4(1.,1.,1.,1.);const vec2 f=vec2(.5,.5);vec2 y(vec3 a){float b=atan(a.x,a.z),c=acos(a.y);return vec2(.5-.5*b/e,1.-c/e);}void main(){float d,a,q;vec2 z=vec2(vv0.x,1.-vv0.y),b;vec3 r=vec3(u133*(z-f),0.),B=vec3(u132*vec4(r,1.)),g,s;vec4 t=x,h,c,u;vec3 i;int j;for(float k=0.;k<n;k+=1.){b.x=k,b.y=floor(b.x/64.),c=texture2D(u93,b/64.),d=e*c.r,a=2.*asin(sqrt(.25+c.g*.25)),g=vec3(cos(d)*sin(a),sin(d)*sin(a),-cos(a)),q=p+(.5+.5*c.b)*(v-p),j=0;for(float l=0.;l<=o;l+=1.){u=vec4(r+g*q*pow(l/o,w),1.),h=u129*u,i=h.xyz/h.w;if(texture2D(u131,f+f*i.xy).z<i.z){j=1;break;}}if(j==1)continue;s=vec3(u132*vec4(g,0.)),t+=texture2D(u106,y(s));}gl_FragColor=vec4(u134*t.rgb/n,1.);}",
                i: "u131 u106 u93 u129 u132 u133 u134".split(" "),
                Ca: [
                  { search: "8888.8", replace: T.Wn[da.T()].toFixed(1) },
                  { search: "9999.9", replace: T.Xn[da.T()].toFixed(1) },
                ],
                precision: "lowp",
              };
              g.s88 = {
                name: "_",
                h: "uniform sampler2D u1;uniform vec2 u8;varying vec2 vv0;void main(){vec4 a=.285714*texture2D(u1,vv0-u8)+.428571*texture2D(u1,vv0)+.285714*texture2D(u1,vv0+u8);gl_FragColor=a;}",
                i: ["u1", "u8"],
                precision: "lowp",
              };
              g.s89 = {
                name: "_",
                h: "uniform sampler2D u1,u135;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
                s: "attribute vec3 a0;attribute vec2 a1;uniform mat4 u129,u117;varying vec2 vv0;void main(){vec4 a=u129*u117*vec4(a0,1.);gl_Position=a,vv0=a1;}",
                i: ["u129", "u117", "u1"],
                I: ["a0", "a1"],
                precision: "lowp",
              };
              if (da.Z()) {
                q =
                  "u39 u136 u137 u138 u139 u40 u105 u140 u141 u7 u142 u143 u72"
                    .split(" ")
                    .concat(r, C);
                da.Xh() ||
                  (g.s90 = {
                    name: "_",
                    s: "attribute vec2 a0;void main(){gl_Position=vec4(a0,0.,1.);}",
                    h: "void main(){gl_FragData[0]=vec4(0.,0.,0.,0.),gl_FragData[1]=vec4(0.,0.,0.,0.),gl_FragData[2]=vec4(0.,0.,0.,0.),gl_FragData[3]=vec4(0.,0.,0.,0.);}",
                    i: [],
                    precision: "lowp",
                    ca: !0,
                  });
                g.s91 = {
                  name: "_",
                  s: "attribute vec2 a0;void main(){gl_Position=vec4(a0,0.,1.);}",
                  h: "uniform vec4 color;void main(){gl_FragData[0]=color,gl_FragData[1]=color,gl_FragData[2]=color,gl_FragData[3]=color;}",
                  i: ["color"],
                  ca: !0,
                };
                g.s92NNGLcolor = {
                  name: "_",
                  h: "uniform vec4 u105,u7;uniform vec3 u140;uniform float u141;varying vec3 vv0,vv1;varying float vv2,vv3;void main(){float b=u7.x+u7.y*smoothstep(-u7.w,-u7.z,vv3),c=u141;vec4 a=u105;float d=floor(15.99*c),i=floor(15.99*a.b);a.b=(d+16.*i)/255.,gl_FragData[0]=vec4(vv0,vv2),gl_FragData[1]=vec4(normalize(vv1),b),gl_FragData[2]=vec4(u140,0.),gl_FragData[3]=a;}",
                  s: "attribute vec3 a0,a2;uniform sampler2D u39;uniform vec3 u136;uniform vec2 u40,u144;uniform float u137,u142,u143,u138,u139,u145;varying vec3 vv0,vv1;varying float vv2,vv3;const vec2 e=vec2(1.,1.);const vec3 r=vec3(1.,1.,1.);const vec2 F=vec2(-1.,1.),s=vec2(.16,.5),t=vec2(.5,.5),u=vec2(.84,.5);uniform mat4 u70;uniform vec3 u72,u76,u77,u78;uniform float u71,u79,u80,u73,u74,u75,u81;mat3 v(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,s);vec2 f=u79*e;vec3 c=u79*r;vec2 w=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,t).rgb+vec3(u73,0.,0.),u76,c);float x=mix(texture2D(u39,u).r,0.,u79);a.z+=x;mat3 h=v(a);vec3 y=mix(u136,u77,c);float z=mix(u137,u80,u79);vec3 b=mix(u72,u78,c);b.x+=u71*sin(a.y);float i=cos(a.z),j=sin(a.z);mat2 A=mat2(i,j,-j,i);b.xy=A*b.xy;float B=mix(u75,1.,u79);vec2 k=u74/w;vec3 l=a0;float C=max(0.,-a0.z-u138)*u139;l.x+=C*sign(a0.x)*(1.-u79);vec3 m=h*(l+y)*z+b;vec2 D=k*B;vec3 E=vec3(g*D,-k)+m*vec3(1.,-1.,-1.);gl_Position=u70*(vec4(u81*e,e)*vec4(E,1.)),vv1=h*a2*vec3(1.,-1.,-1.),vv2=smoothstep(u142,u143,a0.z),vv0=m,vv3=a0.y;}",
                  i: q,
                  I: ["a0", "a2"],
                  P: [3, 3],
                  ca: !0,
                };
                g.s92NNGLtexture = {
                  name: "_",
                  h: "uniform sampler2D u1;uniform vec4 u105,u7;uniform vec3 u140;uniform float u141,u67;varying vec3 vv0,vv1;varying vec2 vv2;varying float vv3,vv4;void main(){float c=u7.x+u7.y*smoothstep(-u7.w,-u7.z,vv4),d=u141;vec4 b=u105;float j=floor(15.99*d),k=floor(15.99*b.b);b.b=(j+16.*k)/255.;vec4 a=texture2D(u1,vv2);vec3 l=mix(u140,a.rgb,a.a);vec4 m=vec4(mix(a.rgb*u140,l,u67),a.a);gl_FragData[0]=vec4(vv0,vv3),gl_FragData[1]=vec4(normalize(vv1),c),gl_FragData[2]=m,gl_FragData[3]=b;}",
                  s: "attribute vec3 a0,a2;attribute vec2 a1;uniform sampler2D u39;uniform vec3 u136;uniform vec2 u40,u144;uniform float u137,u142,u143,u138,u139,u145;varying vec3 vv0,vv1;varying vec2 vv2;varying float vv3,vv4;const vec2 e=vec2(1.,1.);const vec3 s=vec3(1.,1.,1.);const vec2 G=vec2(-1.,1.),t=vec2(.16,.5),u=vec2(.5,.5),v=vec2(.84,.5);uniform mat4 u70;uniform vec3 u72,u76,u77,u78;uniform float u71,u79,u80,u73,u74,u75,u81;mat3 w(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,t);vec2 f=u79*e;vec3 c=u79*s;vec2 x=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,u).rgb+vec3(u73,0.,0.),u76,c);float y=mix(texture2D(u39,v).r,0.,u79);a.z+=y;mat3 h=w(a);vec3 z=mix(u136,u77,c);float A=mix(u137,u80,u79);vec3 b=mix(u72,u78,c);b.x+=u71*sin(a.y);float i=cos(a.z),j=sin(a.z);mat2 B=mat2(i,j,-j,i);b.xy=B*b.xy;float C=mix(u75,1.,u79);vec2 k=u74/x;vec3 l=a0;float D=max(0.,-a0.z-u138)*u139;l.x+=D*sign(a0.x)*(1.-u79);vec3 m=h*(l+z)*A+b;vec2 E=k*C;vec3 F=vec3(g*E,-k)+m*vec3(1.,-1.,-1.);gl_Position=u70*(vec4(u81*e,e)*vec4(F,1.)),vv1=h*a2*vec3(1.,-1.,-1.),vv3=smoothstep(u142,u143,a0.z),vv2=a1,vv0=m,vv4=a0.y;}",
                  i: q.concat(H),
                  I: ["a0", "a2", "a1"],
                  P: [3, 3, 2],
                  ca: !0,
                };
                g.s92NNGLtextureNormalMap = {
                  name: "_",
                  h: "uniform vec4 u105,u7;uniform vec3 u140;uniform sampler2D u1,u146;uniform float u141,u67;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;varying float vv4,vv5;const vec3 l=vec3(1.,1.,1.);void main(){float m=u7.x+u7.y*smoothstep(-u7.w,-u7.z,vv5);vec3 v=vec3(0.,0.,-1.),d=normalize(vv2),b=texture2D(u146,vv3).xyz;b=normalize(b*255./127.-1.007874*l);vec3 g=vv0.xyz,n=cross(d,g)*vv0.w;mat3 o=mat3(g,n,d);vec3 p=o*b;float q=u141;vec4 c=u105;float r=floor(15.99*q),s=floor(15.99*c.b);c.b=(r+16.*s)/255.;vec4 a=texture2D(u1,vv3);vec3 t=mix(u140,a.rgb,a.a);vec4 u=vec4(mix(a.rgb*u140,t,u67),a.a);gl_FragData[0]=vec4(vv1,vv4),gl_FragData[1]=vec4(p,m),gl_FragData[2]=u,gl_FragData[3]=c;}",
                  s: "attribute vec4 a3;attribute vec3 a0,a2;attribute vec2 a1;uniform sampler2D u39;uniform vec3 u136;uniform vec2 u40,u144;uniform float u137,u142,u143,u138,u139,u145;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;varying float vv4,vv5;const vec2 e=vec2(1.,1.);const vec3 t=vec3(1.,1.,1.);const vec2 H=vec2(-1.,1.),u=vec2(.16,.5),v=vec2(.5,.5),w=vec2(.84,.5);uniform mat4 u70;uniform vec3 u72,u76,u77,u78;uniform float u71,u79,u80,u73,u74,u75,u81;mat3 x(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,u);vec2 f=u79*e;vec3 c=u79*t;vec2 y=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,v).rgb+vec3(u73,0.,0.),u76,c);float z=mix(texture2D(u39,w).r,0.,u79);a.z+=z;mat3 h=x(a);vec3 A=mix(u136,u77,c);float B=mix(u137,u80,u79);vec3 b=mix(u72,u78,c);b.x+=u71*sin(a.y);float i=cos(a.z),j=sin(a.z);mat2 C=mat2(i,j,-j,i);b.xy=C*b.xy;float D=mix(u75,1.,u79);vec2 k=u74/y;vec3 l=a0;float E=max(0.,-a0.z-u138)*u139;l.x+=E*sign(a0.x)*(1.-u79);vec3 m=h*(l+A)*B+b;vec2 F=k*D;vec3 G=vec3(g*F,-k)+m*vec3(1.,-1.,-1.);gl_Position=u70*(vec4(u81*e,e)*vec4(G,1.)),vv2=h*a2*vec3(1.,-1.,-1.),vv4=smoothstep(u142,u143,a0.z),vv0=a3,vv3=a1,vv1=m,vv5=a0.y;}",
                  i: q.concat(H, ["u146"]),
                  I: ["a3", "a0", "a2", "a1"],
                  P: [4, 3, 3, 2],
                  ca: !0,
                };
                g.s92NNGLtextureParamsMap = {
                  name: "_",
                  h: "uniform sampler2D u1,u68;uniform vec4 u105,u7,u69;uniform vec3 u140;uniform float u141,u67;varying vec3 vv0,vv1;varying vec2 vv2;varying float vv3,vv4;vec2 j(float d,float e){float f=floor(d*255.+.01),a=pow(2.,e),g=256./a,b=f/a,c=floor(b),h=(b-c)*a;return vec2(c/(g-1.),h/(a-1.));}void main(){float g=u7.x+u7.y*smoothstep(-u7.w,-u7.z,vv4),d=u141;vec4 a=u105,e=texture2D(u68,vv2);vec2 b=j(e.b,4.);float h=1.-b.x,o=b.y;b=j(e.a,1.);float p=b.x,f=b.y;vec4 q=vec4(e.rg,o,p);float r=h;a=mix(a,q,u69*f),d=mix(d,r,u69.b*f);float s=floor(15.99*d),t=floor(15.99*a.b);a.b=(s+16.*t)/255.;vec4 c=texture2D(u1,vv2);vec3 u=mix(u140,c.rgb,c.a);vec4 v=vec4(mix(c.rgb*u140,u,u67),c.a);gl_FragData[0]=vec4(vv0,vv3),gl_FragData[1]=vec4(normalize(vv1),g),gl_FragData[2]=v,gl_FragData[3]=a;}",
                  s: "attribute vec3 a0,a2;attribute vec2 a1;uniform sampler2D u39;uniform vec3 u136;uniform vec2 u40,u144;uniform float u137,u142,u143,u138,u139,u145;varying vec3 vv0,vv1;varying vec2 vv2;varying float vv3,vv4;const vec2 e=vec2(1.,1.);const vec3 s=vec3(1.,1.,1.);const vec2 G=vec2(-1.,1.),t=vec2(.16,.5),u=vec2(.5,.5),v=vec2(.84,.5);uniform mat4 u70;uniform vec3 u72,u76,u77,u78;uniform float u71,u79,u80,u73,u74,u75,u81;mat3 w(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,t);vec2 f=u79*e;vec3 c=u79*s;vec2 x=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,u).rgb+vec3(u73,0.,0.),u76,c);float y=mix(texture2D(u39,v).r,0.,u79);a.z+=y;mat3 h=w(a);vec3 z=mix(u136,u77,c);float A=mix(u137,u80,u79);vec3 b=mix(u72,u78,c);b.x+=u71*sin(a.y);float i=cos(a.z),j=sin(a.z);mat2 B=mat2(i,j,-j,i);b.xy=B*b.xy;float C=mix(u75,1.,u79);vec2 k=u74/x;vec3 l=a0;float D=max(0.,-a0.z-u138)*u139;l.x+=D*sign(a0.x)*(1.-u79);vec3 m=h*(l+z)*A+b;vec2 E=k*C;vec3 F=vec3(g*E,-k)+m*vec3(1.,-1.,-1.);gl_Position=u70*(vec4(u81*e,e)*vec4(F,1.)),vv1=h*a2*vec3(1.,-1.,-1.),vv3=smoothstep(u142,u143,a0.z),vv2=a1,vv0=m,vv4=a0.y;}",
                  i: q.concat(H, E),
                  I: ["a0", "a2", "a1"],
                  P: [3, 3, 2],
                  ca: !0,
                };
                g.s92NNGLtextureNormalParamsMap = {
                  name: "_",
                  h: "uniform sampler2D u1,u146,u68;uniform vec4 u105,u7,u69;uniform vec3 u140;uniform float u141,u67;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;varying float vv4,vv5;const vec3 q=vec3(1.,1.,1.);vec2 k(float d,float e){float f=floor(d*255.+.01),a=pow(2.,e),g=256./a,b=f/a,c=floor(b),h=(b-c)*a;return vec2(c/(g-1.),h/(a-1.));}void main(){float r=u7.x+u7.y*smoothstep(-u7.w,-u7.z,vv5);vec3 E=vec3(0.,0.,-1.),g=normalize(vv2),d=texture2D(u146,vv3).xyz;d=normalize(d*255./127.-1.007874*q);vec3 h=vv0.xyz,s=cross(g,h)*vv0.w;mat3 t=mat3(h,s,g);vec3 u=t*d;float e=u141;vec4 a=u105,f=texture2D(u68,vv3);vec2 b=k(f.b,4.);float v=1.-b.x,w=b.y;b=k(f.a,1.);float x=b.x,l=b.y;vec4 y=vec4(f.rg,w,x);float z=v;a=mix(a,y,u69*l),e=mix(e,z,u69.b*l);float A=floor(15.99*e),B=floor(15.99*a.b);a.b=(A+16.*B)/255.;vec4 c=texture2D(u1,vv3);vec3 C=mix(u140,c.rgb,c.a);vec4 D=vec4(mix(c.rgb*u140,C,u67),c.a);gl_FragData[0]=vec4(vv1,vv4),gl_FragData[1]=vec4(u,r),gl_FragData[2]=D,gl_FragData[3]=a;}",
                  s: "attribute vec4 a3;attribute vec3 a0,a2;attribute vec2 a1;uniform sampler2D u39;uniform vec3 u136;uniform vec2 u40,u144;uniform float u137,u142,u143,u138,u139,u145;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;varying float vv4,vv5;const vec2 e=vec2(1.,1.);const vec3 t=vec3(1.,1.,1.);const vec2 H=vec2(-1.,1.),u=vec2(.16,.5),v=vec2(.5,.5),w=vec2(.84,.5);uniform mat4 u70;uniform vec3 u72,u76,u77,u78;uniform float u71,u79,u80,u73,u74,u75,u81;mat3 x(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,u);vec2 f=u79*e;vec3 c=u79*t;vec2 y=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,v).rgb+vec3(u73,0.,0.),u76,c);float z=mix(texture2D(u39,w).r,0.,u79);a.z+=z;mat3 h=x(a);vec3 A=mix(u136,u77,c);float B=mix(u137,u80,u79);vec3 b=mix(u72,u78,c);b.x+=u71*sin(a.y);float i=cos(a.z),j=sin(a.z);mat2 C=mat2(i,j,-j,i);b.xy=C*b.xy;float D=mix(u75,1.,u79);vec2 k=u74/y;vec3 l=a0;float E=max(0.,-a0.z-u138)*u139;l.x+=E*sign(a0.x)*(1.-u79);vec3 m=h*(l+A)*B+b;vec2 F=k*D;vec3 G=vec3(g*F,-k)+m*vec3(1.,-1.,-1.);gl_Position=u70*(vec4(u81*e,e)*vec4(G,1.)),vv2=h*a2*vec3(1.,-1.,-1.),vv4=smoothstep(u142,u143,a0.z),vv0=a3,vv3=a1,vv1=m,vv5=a0.y;}",
                  i: q.concat(H, ["u146"], E),
                  I: ["a3", "a0", "a2", "a1"],
                  P: [4, 3, 3, 2],
                  ca: !0,
                };
                q = "u129 u117 u130 u105 u140 u141 u7".split(" ");
                g.s92color = {
                  name: "_",
                  h: "uniform vec4 u105,u7;uniform vec3 u140;uniform float u141;varying vec3 vv0,vv1;varying float vv2,vv3;void main(){float b=u7.x+u7.y*smoothstep(-u7.w,-u7.z,vv3),c=u141;vec4 a=u105;float d=floor(15.99*c),i=floor(15.99*a.b);a.b=(d+16.*i)/255.,gl_FragData[0]=vec4(vv0,vv2),gl_FragData[1]=vec4(normalize(vv1),b),gl_FragData[2]=vec4(u140,0.),gl_FragData[3]=a;}",
                  s: "attribute vec3 a0,a2;uniform mat4 u129,u117,u130;varying vec3 vv0,vv1;varying float vv2,vv3;void main(){vec4 a=u130*vec4(a0,1.),b=u130*vec4(a2,0.);gl_Position=u129*u117*a,vv0=a.xyz,vv1=b.xyz,vv2=1.,vv3=a0.y;}",
                  i: q,
                  I: ["a0", "a2"],
                  ca: !0,
                };
                g.s92 = {
                  name: "_",
                  h: "uniform sampler2D u1;uniform vec4 u105,u7;uniform vec3 u140;uniform float u141,u67;varying vec3 vv0,vv1;varying vec2 vv2;varying float vv3,vv4;void main(){float c=u7.x+u7.y*smoothstep(-u7.w,-u7.z,vv4),d=u141;vec4 b=u105;float j=floor(15.99*d),k=floor(15.99*b.b);b.b=(j+16.*k)/255.;vec4 a=texture2D(u1,vv2);vec3 l=mix(u140,a.rgb,a.a);vec4 m=vec4(mix(a.rgb*u140,l,u67),a.a);gl_FragData[0]=vec4(vv0,vv3),gl_FragData[1]=vec4(normalize(vv1),c),gl_FragData[2]=m,gl_FragData[3]=b;}",
                  s: "attribute vec3 a0,a2;attribute vec2 a1;uniform mat4 u129,u117,u130;varying vec3 vv0,vv1;varying vec2 vv2;varying float vv3,vv4;void main(){vec4 a=u130*vec4(a0,1.),b=u130*vec4(a2,0.);gl_Position=u129*u117*a,vv2=a1,vv0=a.xyz,vv1=b.xyz,vv3=1.,vv4=a0.y;}",
                  i: q.concat(H),
                  I: ["a0", "a2", "a1"],
                  ca: !0,
                };
                var h = ["u146", "u147"];
                g.s92NormalMap = {
                  name: "_",
                  h: "uniform sampler2D u1,u146;uniform vec4 u105,u7;uniform vec3 u147,u140;uniform float u141,u67;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;varying float vv4,vv5;const vec3 l=vec3(1.,1.,1.);void main(){float m=u7.x+u7.y*smoothstep(-u7.w,-u7.z,vv5);vec3 v=vec3(0.,0.,-1.),d=normalize(vv2),b=texture2D(u146,vv3).xyz;b=normalize(b*255./127.-1.007874*l);vec3 g=vv0.xyz,n=cross(d,g)*vv0.w;mat3 o=mat3(g,n,d);vec3 p=o*b;float q=u141;vec4 c=u105;float r=floor(15.99*q),s=floor(15.99*c.b);c.b=(r+16.*s)/255.;vec4 a=texture2D(u1,vv3);vec3 t=mix(u140,a.rgb,a.a);vec4 u=vec4(mix(a.rgb*u140,t,u67),a.a);gl_FragData[0]=vec4(vv1,vv4),gl_FragData[1]=vec4(p,m),gl_FragData[2]=u,gl_FragData[3]=c;}",
                  s: "attribute vec4 a3;attribute vec3 a0,a2;attribute vec2 a1;uniform mat4 u129,u117,u130;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;varying float vv4,vv5;void main(){vec4 a=u130*vec4(a0,1.),b=u130*vec4(a2,0.);gl_Position=u129*u117*a,vv0=a3,vv3=a1,vv1=a.xyz,vv2=b.xyz,vv4=1.,vv5=a0.y;}",
                  i: q.concat(H, h),
                  I: ["a0", "a2", "a1", "a3"],
                  ca: !0,
                };
                g.s92ParamsMap = {
                  name: "_",
                  h: "uniform sampler2D u1,u68;uniform vec4 u105,u7,u69;uniform vec3 u140;uniform float u141,u67;varying vec3 vv0,vv1;varying vec2 vv2;varying float vv3,vv4;vec2 j(float d,float e){float f=floor(d*255.+.01),a=pow(2.,e),g=256./a,b=f/a,c=floor(b),h=(b-c)*a;return vec2(c/(g-1.),h/(a-1.));}void main(){float g=u7.x+u7.y*smoothstep(-u7.w,-u7.z,vv4),d=u141;vec4 a=u105,e=texture2D(u68,vv2);vec2 b=j(e.b,4.);float h=1.-b.x,o=b.y;b=j(e.a,1.);float p=b.x,f=b.y;vec4 q=vec4(e.rg,o,p);float r=h;a=mix(a,q,u69*f),d=mix(d,r,u69.b*f);float s=floor(15.99*d),t=floor(15.99*a.b);a.b=(s+16.*t)/255.;vec4 c=texture2D(u1,vv2);vec3 u=mix(u140,c.rgb,c.a);vec4 v=vec4(mix(c.rgb*u140,u,u67),c.a);gl_FragData[0]=vec4(vv0,vv3),gl_FragData[1]=vec4(normalize(vv1),g),gl_FragData[2]=v,gl_FragData[3]=a;}",
                  s: "attribute vec3 a0,a2;attribute vec2 a1;uniform mat4 u129,u117,u130;varying vec3 vv0,vv1;varying vec2 vv2;varying float vv3,vv4;void main(){vec4 a=u130*vec4(a0,1.),b=u130*vec4(a2,0.);gl_Position=u129*u117*a,vv2=a1,vv0=a.xyz,vv1=b.xyz,vv3=1.,vv4=a0.y;}",
                  i: q.concat(H, E),
                  I: ["a0", "a2", "a1"],
                  ca: !0,
                };
                g.s92NormalParamsMap = {
                  name: "_",
                  h: "uniform sampler2D u1,u146,u68;uniform vec4 u105,u7,u69;uniform vec3 u147,u140;uniform float u141,u67;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;varying float vv4,vv5;const vec3 q=vec3(1.,1.,1.);vec2 k(float d,float e){float f=floor(d*255.+.01),a=pow(2.,e),g=256./a,b=f/a,c=floor(b),h=(b-c)*a;return vec2(c/(g-1.),h/(a-1.));}void main(){float r=u7.x+u7.y*smoothstep(-u7.w,-u7.z,vv5);vec3 E=vec3(0.,0.,-1.),g=normalize(vv2),d=texture2D(u146,vv3).xyz;d=normalize(d*255./127.-1.007874*q);vec3 h=vv0.xyz,s=cross(g,h)*vv0.w;mat3 t=mat3(h,s,g);vec3 u=t*d;float e=u141;vec4 a=u105,f=texture2D(u68,vv3);vec2 b=k(f.b,4.);float v=1.-b.x,w=b.y;b=k(f.a,1.);float x=b.x,l=b.y;vec4 y=vec4(f.rg,w,x);float z=v;a=mix(a,y,u69*l),e=mix(e,z,u69.b*l);float A=floor(15.99*e),B=floor(15.99*a.b);a.b=(A+16.*B)/255.;vec4 c=texture2D(u1,vv3);vec3 C=mix(u140,c.rgb,c.a);vec4 D=vec4(mix(c.rgb*u140,C,u67),c.a);gl_FragData[0]=vec4(vv1,vv4),gl_FragData[1]=vec4(u,r),gl_FragData[2]=D,gl_FragData[3]=a;}",
                  s: "attribute vec4 a3;attribute vec3 a0,a2;attribute vec2 a1;uniform mat4 u129,u117,u130;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;varying float vv4,vv5;void main(){vec4 a=u130*vec4(a0,1.),b=u130*vec4(a2,0.);gl_Position=u129*u117*a,vv0=a3,vv3=a1,vv1=a.xyz,vv2=b.xyz,vv4=1.,vv5=a0.y;}",
                  i: q.concat(H, h, E),
                  I: ["a0", "a2", "a1", "a3"],
                  ca: !0,
                };
              } else u();
              p();
              q = [{ type: "1i", name: "u1", value: 0 }];
              x.j("s0", q);
              x.j("s1", q);
              x.j("s65", [{ type: "1i", name: "u6", value: 1 }].concat(q));
              x.j("s66", [{ type: "1i", name: "u6", value: 1 }].concat(q));
              x.j("s12", [{ type: "1i", name: "u82", value: 1 }].concat(q));
              x.j("s67", [{ type: "1i", name: "u82", value: 1 }].concat(q));
              x.j("s68", q);
              x.j("s69", q);
              x.j(
                "s70",
                [
                  { type: "1i", name: "u86", value: 1 },
                  { type: "1i", name: "u39", value: 2 },
                ].concat(q)
              );
              x.j("s71", q);
              x.j("s43", q);
              x.j("s72", [
                { type: "1i", name: "u88", value: 0 },
                { type: "1i", name: "u89", value: 1 },
              ]);
              x.j("s73", [
                { type: "1i", name: "u92", value: 0 },
                { type: "1i", name: "u93", value: 1 },
              ]);
              x.j("s74", q);
              x.j("s75", q);
              x.j("s76", q);
              x.j("s77", q);
              x.j("s78", q);
              x.j("s79", [{ type: "1i", name: "u82", value: 1 }].concat(q));
              x.j("s80", [{ type: "1i", name: "u82", value: 1 }].concat(q));
              T.da &&
                (x.j("s84", [
                  { type: "1i", name: "u102", value: 0 },
                  { type: "1i", name: "u103", value: 1 },
                  { type: "1f", name: "u123", value: T.Tj },
                  { type: "1f", name: "u124", value: T.Uj },
                  { type: "1f", name: "u125", value: T.fk },
                  { type: "1f", name: "u126", value: T.Xj },
                  { type: "1f", name: "u127", value: T.Yj },
                  { type: "1f", name: "u122", value: 1 },
                  { type: "1f", name: "u114", value: 1 },
                ]),
                x.j("s85", q));
              h = [
                { type: "1i", name: "u102", value: 0 },
                { type: "1i", name: "u103", value: 1 },
                { type: "1i", name: "u104", value: 2 },
                { type: "1i", name: "u92", value: 3 },
                { type: "1i", name: "u106", value: 4 },
                { type: "1i", name: "u105", value: 6 },
                { type: "1i", name: "u94", value: 7 },
                { type: "1f", name: "u112", value: 0 },
                { type: "1f", name: "u109", value: 0 },
                { type: "1f", name: "u111", value: 0 },
              ];
              T.da &&
                x.j(
                  "s82",
                  h.concat([
                    { type: "1f", name: "u114", value: T.Wj[da.T()] },
                    { type: "1i", name: "u113", value: 5 },
                  ])
                );
              x.j(
                "s83",
                h.concat([
                  { type: "1f", name: "u115", value: T.Vb },
                  { type: "1f", name: "u116", value: T.Gd },
                ])
              );
              x.j("s87", [
                { type: "1i", name: "u131", value: 0 },
                { type: "1i", name: "u106", value: 1 },
                { type: "1i", name: "u93", value: 2 },
                { type: "1f", name: "u134", value: T.Vn },
              ]);
              x.j("s88", q);
              x.j("s89", q);
              x.j(
                "s81",
                [
                  { type: "1i", name: "u2", value: 1 },
                  { type: "1i", name: "u95", value: 2 },
                  { type: "1i", name: "u94", value: 3 },
                  { type: "1f", name: "u100", value: 1 },
                  { type: "2f", name: "u97", value: [0, 0] },
                ].concat(q)
              );
              da.Z()
                ? (x.j("s92", q),
                  x.j(
                    "s92NormalMap",
                    [{ type: "1i", name: "u146", value: 1 }].concat(q)
                  ),
                  x.j(
                    "s92ParamsMap",
                    [{ type: "1i", name: "u68", value: 1 }].concat(q)
                  ),
                  x.j(
                    "s92NormalParamsMap",
                    [
                      { type: "1i", name: "u146", value: 1 },
                      { type: "1i", name: "u68", value: 2 },
                    ].concat(q)
                  ))
                : l();
              G = !0;
            },
            Jn: function () {
              u();
              p();
              l();
            },
            nd: function () {
              return y.id;
            },
            Ze: function () {
              return r;
            },
            $e: function () {
              return C;
            },
            set: function (q) {
              ob.aj(x);
              g[q].set();
            },
            qb: function (q) {
              return k(q, B());
            },
            Md: function (q) {
              return k(q, {
                name: "_",
                h: "void main(){gl_FragColor=vec4(.5,.5,.5,.5);}",
                i: [],
                precision: "highp",
              });
            },
            Mn: function (q) {
              return k(q, {
                name: "_",
                h: "const vec4 d=vec4(.5,.5,.5,.5);void main(){gl_FragData[0]=d,gl_FragData[1]=d,gl_FragData[2]=d,gl_FragData[3]=d;}",
                i: [],
                precision: "highp",
                ca: !0,
              });
            },
            H: function () {
              -1 !== f && y.H();
            },
            Od: function () {
              var q = 0;
              y.wa.forEach(function (h, L) {
                L = y.P[L];
                b.vertexAttribPointer(h, L, b.FLOAT, !1, y.Eg, q);
                q += 4 * L;
              });
            },
            Zb: function () {
              x.$b(b);
            },
            $b: function (q) {
              q.vertexAttribPointer(y.wa[0], 2, q.FLOAT, !1, 8, 0);
            },
            Tp: function () {
              b.vertexAttribPointer(y.attributes.a0, 3, b.FLOAT, !1, 12, 0);
            },
            Ma: function () {
              b.vertexAttribPointer(y.attributes.a0, 3, b.FLOAT, !1, 32, 0);
            },
            Va: function () {
              b.vertexAttribPointer(y.attributes.a0, 3, b.FLOAT, !1, 24, 0);
            },
            Ui: function () {
              b.vertexAttribPointer(y.attributes.a2, 3, b.FLOAT, !1, 32, 12);
            },
            Vi: function () {
              b.vertexAttribPointer(y.attributes.a2, 3, b.FLOAT, !1, 24, 12);
            },
            Gc: function () {
              b.vertexAttribPointer(y.attributes.a1, 2, b.FLOAT, !1, 32, 24);
            },
            Up: function () {
              b.vertexAttribPointer(y.attributes.a0, 3, b.FLOAT, !1, 20, 0);
              b.vertexAttribPointer(y.attributes.a1, 2, b.FLOAT, !1, 20, 12);
            },
            zn: function () {
              b.vertexAttribPointer(y.attributes.a0, 3, b.FLOAT, !1, 32, 0);
              b.vertexAttribPointer(y.attributes.a2, 3, b.FLOAT, !1, 32, 12);
              b.vertexAttribPointer(y.attributes.a1, 2, b.FLOAT, !1, 32, 24);
            },
            An: function () {
              b.vertexAttribPointer(y.attributes.a0, 3, b.FLOAT, !1, 32, 0);
              b.vertexAttribPointer(y.attributes.a2, 3, b.FLOAT, !1, 32, 12);
            },
            Bn: function () {
              b.vertexAttribPointer(y.attributes.a0, 3, b.FLOAT, !1, 24, 0);
              b.vertexAttribPointer(y.attributes.a2, 3, b.FLOAT, !1, 24, 12);
            },
            Kd: function () {
              b.vertexAttribPointer(y.attributes.a3, 4, b.FLOAT, !1, 16, 0);
            },
            Nd: function (q, h) {
              b.uniform1i(y.A[q], h);
            },
            G: function (q, h) {
              b.uniform1f(y.A[q], h);
            },
            N: function (q, h, L) {
              b.uniform2f(y.A[q], h, L);
            },
            bj: function (q, h) {
              b.uniform2fv(y.A[q], h);
            },
            hg: function (q, h, L, O) {
              b.uniform3f(y.A[q], h, L, O);
            },
            ig: function (q, h) {
              b.uniform3fv(y.A[q], h);
            },
            ya: function (q, h) {
              b.uniform4fv(y.A[q], h);
            },
            Qn: function (q, h) {
              b.uniformMatrix2fv(y.A[q], !1, h);
            },
            Rn: function (q, h) {
              b.uniformMatrix3fv(y.A[q], !1, h);
            },
            Hc: function (q, h) {
              b.uniformMatrix4fv(y.A[q], !1, h);
            },
            j: function (q, h) {
              x.set(q);
              h.forEach(function (L) {
                switch (L.type) {
                  case "4f":
                    b.uniform4fv(y.A[L.name], L.value);
                    break;
                  case "3f":
                    b.uniform3fv(y.A[L.name], L.value);
                    break;
                  case "2f":
                    b.uniform2fv(y.A[L.name], L.value);
                    break;
                  case "1f":
                    b.uniform1f(y.A[L.name], L.value);
                    break;
                  case "1i":
                    b.uniform1i(y.A[L.name], L.value);
                    break;
                  case "mat2":
                    b.uniformMatrix2fv(y.A[L.name], !1, L.value);
                    break;
                  case "mat4":
                    b.uniformMatrix4fv(y.A[L.name], !1, L.value);
                }
              });
            },
            K: function () {
              for (var q in g) {
                var h = g[q];
                b.detachShader(h.oa, h.cf);
                b.detachShader(h.oa, h.bf);
                b.deleteShader(h.cf);
                b.deleteShader(h.bf);
                b.deleteProgram(h.oa);
              }
            },
            v: function () {
              b.disableVertexAttribArray(0);
              x.H();
              x.K();
              J = 0;
              G = !1;
              y = null;
              f = -1;
            },
          };
        return x;
      })(),
      Qa = (function () {
        var a = {},
          c = [],
          e = !1,
          d = 0,
          n = 0,
          k = -1,
          B = -1,
          l = -1,
          u = 1,
          p = null,
          G = !1,
          H = null,
          E = !1,
          r = !1,
          C = !1,
          g = !1,
          f = !1,
          y = !1,
          J = !1,
          x = null,
          q = null,
          h = -1,
          L = -1,
          O = null,
          v = -1,
          m,
          t = null,
          M = null,
          I = null,
          K = null,
          P = null,
          ba = null,
          ja = null,
          U = [
            { type: "1f", name: "u79", value: 0 },
            { type: "1f", name: "u142", value: 0 },
            { type: "1f", name: "u143", value: 0 },
            { type: "1f", name: "u74", value: 1 },
            { type: "1f", name: "u71", value: 0 },
            { type: "1f", name: "u81", value: 1 },
          ],
          w = {
            m: function (z, D) {
              a.kg = z;
              da.Ag();
              zc.Pe();
              Ib.Pe(z.fe);
              k = z.Se;
              B = z.Eo;
              l = z.Mf;
              u = z.ee;
              var S = [
                { type: "1f", name: "u74", value: k },
                { type: "1f", name: "u71", value: l },
                { type: "1f", name: "u75", value: z.qn },
                { type: "mat4", name: "u70", value: z.Vm },
                { type: "2f", name: "u40", value: z.Bj },
              ];
              z.zg = S;
              var ea = [
                { type: "3f", name: "u76", value: [0, 0, 0] },
                { type: "3f", name: "u77", value: z.Ig },
                { type: "3f", name: "u78", value: z.Hg },
                { type: "1f", name: "u79", value: 0 },
                { type: "1f", name: "u80", value: z.fe },
                { type: "1f", name: "u81", value: 1 },
              ];
              z.sj = ea;
              w.Zl(z, D);
              e || void 0 !== z.Ba || (z.Ba = [0, 0, 120]);
              J = y = N.df;
              if (!e && y) {
                D = 1 * da.mb();
                var X = 1 * da.lb(),
                  aa = { isLinear: !0, isPot: !1, width: D, height: X };
                x = Z.instance(aa);
                q = Z.instance(aa);
                h = 1 / D;
                L = 1 / X;
              }
              S = [
                { type: "1i", name: "u39", value: 1 },
                { type: "3f", name: "u72", value: z.Ba },
                { type: "1f", name: "u138", value: z.Uc },
                { type: "1f", name: "u139", value: z.Bb },
              ].concat(S, ea);
              p = z.Ac;
              ea = [
                { type: "1f", name: "u142", value: p[0] },
                { type: "1f", name: "u143", value: p[1] },
              ];
              da.Z()
                ? ((D = [{ type: "1i", name: "u1", value: 0 }]),
                  (X = [{ type: "1i", name: "u146", value: 2 }]),
                  F.j("s92NNGLcolor", S.concat(ea)),
                  F.j("s92NNGLtexture", [].concat(D, S, ea)),
                  F.j("s92NNGLtextureNormalMap", [].concat(D, X, S, ea)),
                  F.j(
                    "s92NNGLtextureParamsMap",
                    [{ type: "1i", name: "u68", value: 2 }].concat(D, S, ea)
                  ),
                  F.j(
                    "s92NNGLtextureNormalParamsMap",
                    [{ type: "1i", name: "u68", value: 3 }].concat(D, X, S, ea)
                  ))
                : (F.j("s96", S.concat(ea)),
                  F.j("s97", [{ type: "1i", name: "u1", value: 0 }].concat(S)),
                  F.j("s98", S),
                  F.j("s99", S),
                  F.j(
                    "s100",
                    S.concat([{ type: "1i", name: "u146", value: 0 }])
                  ),
                  F.j("s101", S),
                  F.j(
                    "s102",
                    S.concat([{ type: "1i", name: "u68", value: 0 }])
                  ));
              F.j("s70", [{ type: "2f", name: "u87", value: z.rg }]);
              F.j(T.da ? "s82" : "s83", [
                { type: "1f", name: "u109", value: z.re },
                { type: "3f", name: "u110", value: z.Xf },
                { type: "1f", name: "u111", value: z.De },
                { type: "1f", name: "u112", value: 1 },
                { type: "3f", name: "u107", value: z.Jj },
              ]);
              if ((m = z.yd))
                (O = z.zm),
                  (v = z.zd),
                  F.j("s81", [
                    { type: "4f", name: "u96", value: z.xd },
                    { type: "1f", name: "u99", value: z.Df },
                    { type: "2f", name: "u97", value: z.ym },
                    { type: "1f", name: "u101", value: Math.sign(v) },
                  ]);
              c.forEach(function (oa) {
                oa.Qi(z);
              });
              e = !0;
            },
            Xb: function (z) {
              r && ta.la.Xb(z);
              C && ta.sa.Xb(z);
            },
            Zl: function (z, D) {
              void 0 !== ta.la &&
                z.bc &&
                da.Z() &&
                (ta.la.m(z),
                (E = !0),
                D.push(function (S) {
                  ta.la.Xb(S);
                  r = !0;
                }));
              void 0 !== ta.sa &&
                z.Zc &&
                (ta.sa.m(z),
                D.push(function (S) {
                  ta.sa.Xb(S);
                  C = !0;
                }));
              void 0 !== ta.jc && z.ue && (ta.jc.m(z), (f = g = !0));
              void 0 !== ta.gb &&
                (ta.gb.m(z),
                (H = ta.gb.am({
                  width: z.vc,
                  height: 2 * z.vc,
                  depth: 1.5 * z.vc,
                  jl: -z.hf,
                  Oa: z.ff,
                  Mk: z.gf,
                })),
                (G = !0));
            },
            On: function (z, D, S, ea) {
              z &&
                ((ja = z),
                E && ta.la.Yb(z),
                C && ta.sa.Yb(z),
                g && ta.jc.Yb(z),
                c.forEach(function (X) {
                  X.Yb(z);
                }));
              S && (K = S);
              ea && (P = ea);
            },
            rb: function (z) {
              da.Z()
                ? (F.j("s92NNGLcolor", z),
                  F.j("s92NNGLtexture", z),
                  F.j("s92NNGLtextureNormalMap", z),
                  F.j("s92NNGLtextureParamsMap", z),
                  F.j("s92NNGLtextureNormalParamsMap", z))
                : (F.j("s96", z),
                  F.j("s97", z),
                  F.j("s98", z),
                  F.j("s99", z),
                  F.j("s100", z),
                  F.j("s101", z),
                  F.j("s102", z));
            },
            Xa: function (z, D, S) {
              var ea = [z[0] + D[0], z[1] + D[1], z[2] + D[2]];
              ea = [ea[0] + S[0], ea[1] + S[1], ea[2] + S[2]];
              a.Hd = ea;
              a.Gm = D;
              a.so = S;
              w.rb([{ type: "3f", name: "u136", value: ea }]);
              da.Z() && (E && ta.la.Xa(z, D, S), C && ta.sa.Xa(ea));
              G && ta.gb.Xa(z);
            },
            Ya: function (z, D, S) {
              var ea = z * D * S;
              a.Hm = D;
              a.to = S;
              a.Tl = z;
              w.rb([{ type: "1f", name: "u137", value: ea }]);
              da.Z() && (E && ta.la.Ya(z * D, S), C && ta.sa.Ya(ea));
              G && ta.gb.Ya(z);
            },
            Ji: function () {
              w.Xa(a.Hd, a.Gm, a.so);
              w.Ya(a.Tl, a.Hm, a.to);
              w.Zi(a.rx);
              w.m(a.kg);
              w.Wi(a.nk, a.Bb);
            },
            Zi: function (z) {
              a.rx = z;
              w.rb([{ type: "1f", name: "u73", value: z }]);
              da.Z() && (E && ta.la.fg(z), C && ta.sa.fg(z));
            },
            Wi: function (z, D) {
              a.nk = z;
              a.Bb = D;
              w.rb([
                { type: "1f", name: "u138", value: z },
                { type: "1f", name: "u139", value: D },
              ]);
            },
            Hn: function (z) {
              p = z;
              0 === d &&
                w.rb([
                  { type: "1f", name: "u142", value: p[0] },
                  { type: "1f", name: "u143", value: p[1] },
                ]);
            },
            Wa: function (z) {
              function D() {
                G && ta.gb.toggle(!1);
                m && F.j("s81", [{ type: "1f", name: "u100", value: 0 }]);
              }
              0 >= z
                ? ((n = 0),
                  0 !== d &&
                    ((d = 0),
                    Ib.kn(),
                    G && ta.gb.toggle(!0),
                    m && F.j("s81", [{ type: "1f", name: "u100", value: 1 }])))
                : 1 <= z
                ? ((n = 1), 1 !== d && ((d = 1), Ib.hj(!0)), D())
                : ((n = z), 2 !== d && (Ib.hj(!1), (d = 2), D()));
              F.j("s83", [{ type: "1f", name: "u112", value: 1 - z }]);
              U[0].value = n;
              U[1].value = p[0] * (1 - z) + -300 * z;
              U[2].value = p[1] * (1 - z) + -300 * z;
              U[3].value = k * (1 - z) + z * B;
              U[4].value = l * (1 - z);
              U[5].value = 1 - z + z * u;
              r && ta.la.gg(n, U);
              C && ta.sa.gg(n, U);
              w.rb(U);
            },
            gl: function (z) {
              ja.g(1);
              z.forEach(function (D) {
                D.al();
              });
              G && H.V();
            },
            sm: function () {
              return 1 === d;
            },
            se: function (z) {
              ja.Cb(z);
            },
            Oj: function (z) {
              c.push(z);
            },
            pg: function (z) {
              r = z && E;
            },
            og: function (z) {
              f = z && g;
            },
            cg: function (z) {
              C && da.Z() && ta.sa.Sn(z);
            },
            sb: function (z) {
              da.Z() && (E && ta.la.sb(z), C && ta.sa.sb(z));
            },
            dl: function (z, D) {
              if (!J) return !1;
              x.M();
              z.g(0);
              F.set("s74");
              F.N("u8", 0, L);
              Y.l(!1, !1);
              q.o();
              x.g(0);
              F.N("u8", h, 0);
              Y.l(!1, !1);
              F.set("s75");
              D.M();
              q.g(0);
              Y.l(!1, !1);
              return !0;
            },
            gj: function (z) {
              J = z && y;
            },
            resize: function (z, D, S) {
              y &&
                ((z *= S),
                (D *= S),
                x.resize(z, D),
                q.resize(z, D),
                (h = 1 / z),
                (L = 1 / D));
            },
            ag: function (z, D) {
              var S = z.L(),
                ea = z.Y(),
                X = { width: S, height: ea, isPot: !1 };
              E && (I && I.remove(), (I = Z.instance(X)));
              t = va.instance({ width: S, height: ea });
              g || C
                ? (ta.jc.bg(S, ea), M && M.remove(), (M = Z.instance(X)))
                : (M = z);
              E && ta.la.bg(S, ea);
              D && (ba && ba.remove(), (ba = Z.instance(X)));
            },
            Zk: function (z) {
              var D = null;
              switch (d) {
                case 0:
                  D = z;
                  break;
                case 2:
                  t.bind(!1, !0);
                  ba.o();
                  F.set("s65");
                  F.G("u7", n);
                  z.g(1);
                  P.g(0);
                  Y.l(!0, !0);
                  D = ba;
                  break;
                case 1:
                  D = P;
              }
              if (!r || 1 === d || !da.Z()) return D;
              D.Cb(0);
              f && ta.jc.V(D, M);
              t.bind(!1, !f);
              C && (f ? D.g(0) : (M.o(), F.set("s1"), Y.l(!0, !0)), ta.sa.V());
              M.g(0);
              K.Cb(2);
              ta.la.V();
              I.o();
              F.set("s1");
              f || C ? M.g(0) : D.g(0);
              Y.l(!0, !T.da);
              ta.la.add();
              return I;
            },
            el: function (z, D) {
              if (!m) return !1;
              F.set("s81");
              F.G("u98", z * v);
              O.g(1);
              Qa.se(2);
              M ? M.g(3) : D.g(3);
              return !0;
            },
            v: function () {
              e = !1;
              n = d = 0;
              l = B = k = -1;
              u = 1;
              p = null;
              G = !1;
              H = null;
              f = g = C = r = E = !1;
              ta.la.v();
              ta.fb.v();
            },
          };
        return w;
      })(),
      sa = (function () {
        function a() {
          l.forEach(function (D) {
            D.hl(K);
          });
        }
        function c() {
          l.forEach(function (D) {
            D.cd(K);
          });
        }
        function e() {
          l.forEach(function (D) {
            D.fl(K);
          });
        }
        function d() {
          l.forEach(function (D) {
            D.dd(K);
          });
        }
        function n() {
          K
            ? Qa.gl(l)
            : l.forEach(function (D) {
                D.bl();
              });
        }
        function k() {
          t && clearTimeout(t);
          t = setTimeout(function () {
            t = h = !1;
          }, 16);
        }
        function B(D) {
          D();
        }
        var l = [],
          u = [],
          p = { ga_: !1, position: !1, ob: !1 },
          G = [],
          H = [],
          E = null,
          r = 0,
          C = null,
          g = null,
          f = null,
          y = null,
          J = !1,
          x = !1,
          q = !1,
          h = !1,
          L = !1,
          O = !1,
          v = null,
          m = null,
          t = null,
          M = null,
          I = !1,
          K = !1,
          P = !1,
          ba = !1,
          ja = !1,
          U = !1,
          w = !1,
          z = {
            m: function () {
              b.enable(b.DEPTH_TEST);
              b.depthFunc(b.LEQUAL);
              b.clearDepth(1);
              T.Kk
                ? (b.enable(b.CULL_FACE),
                  b.frontFace("CCW" === T.Lk ? b.CCW : b.CW),
                  b.cullFace(b.BACK))
                : b.disable(b.CULL_FACE);
              z.ah();
              var D = {
                isPot: !1,
                isLinear: !1,
                width: da.mb(),
                height: da.lb(),
                F: 4,
                isFloat: !1,
              };
              C = Z.instance(D);
              D = Object.assign({}, D, {
                isLinear: !0,
                width: da.L(),
                height: da.Y(),
              });
              g = Z.instance(D);
              f = Z.instance(D);
              T.Ja &&
                ((D = Object.assign({}, D, { isLinear: !1 })),
                (y = Z.instance(D)));
              O = xa.ea();
              T.Ja ||
                (E = bc.instance({ Ab: T.Ab, oc: T.oc, pc: T.pc, nc: T.nc }));
              J = !0;
            },
            ah: function () {
              da.Z()
                ? (p = pc.instance({}))
                : ((p.ga_ = Cb.instance({
                    ac: T.Ja ? !1 : "s93",
                    isFloat: !1,
                    Ob: !0,
                    clearColor: [0, 0, 0, 0],
                    F: 4,
                  })),
                  (p.position = Cb.instance({
                    ac: T.Ja ? !1 : "s103",
                    isFloat: !0,
                    Ob: !0,
                    clearColor: [0, 0, 0, 0],
                    F: 4,
                  })),
                  (p.ob = Cb.instance({
                    ac: !1,
                    isFloat: !0,
                    Ob: !0,
                    clearColor: [0, 0, 0, 0],
                    F: 4,
                  })),
                  (p.Bc = Cb.instance({
                    ac: !1,
                    isFloat: !1,
                    Ob: !0,
                    clearColor: [0, 0, 0, 0],
                    F: 4,
                  })));
            },
            Dl: function () {
              return E;
            },
            ta: function (D) {
              E = D;
            },
            gq: function () {},
            sb: function (D) {
              Qa.sb(D);
            },
            Qi: function (D) {
              Qa.m(D, G);
              da.Z() || (p.ga_.$i(!1), p.position.$i("s96"));
              K = ba = !0;
            },
            Rp: function () {
              Qa.Ji();
            },
            Mo: function (D) {
              Qa.Oj(D);
            },
            vn: function (D, S, ea) {
              Qa.Xa(D, S, ea);
            },
            wn: function (D, S, ea) {
              Qa.Ya(D, S, ea);
            },
            tn: function (D, S) {
              Qa.Wi(D, S);
            },
            un: function (D) {
              Qa.Hn(D);
            },
            xn: function (D) {
              Qa.Zi(D);
            },
            Wa: function (D) {
              Qa.Wa(D);
            },
            Ri: function (D, S, ea, X) {
              Qa.On(D, S, ea, X);
              S && z.ag(S, X ? !0 : !1);
              P = !0;
            },
            pg: function (D) {
              Qa.pg(D);
            },
            cg: function (D) {
              Qa.cg(D);
            },
            og: function (D) {
              Qa.og(D);
            },
            gj: function (D) {
              Qa.gj(D);
            },
            No: function (D) {
              I &&
                ((ja = !0),
                (U = Z.instance({ width: M.L(), height: M.Y(), isPot: !1 })),
                (w = D));
            },
            ag: function (D, S) {
              M =
                "string" === typeof D ? Z.instance({ url: D, isFloat: !1 }) : D;
              K && Qa.ag(M, S);
              I = !0;
            },
            Nj: function (D) {
              l.push(D);
              0 !== G.length &&
                (G.forEach(function (S) {
                  S(D);
                }),
                G.splice(0, G.length));
            },
            gn: function (D) {
              D = l.indexOf(D);
              -1 !== D && l.splice(D, 1);
            },
            Oo: function (D) {
              u.push(D);
            },
            Op: function (D) {
              D = u.indexOf(D);
              -1 !== D && u.splice(D, 1);
            },
            Td: function (D) {
              K && (x = D);
            },
            animate: function (D) {
              !T.Ja || (K && P)
                ? x &&
                  (h || (r > T.Im && L)
                    ? (v && clearTimeout(v),
                      ++r,
                      window.cancelAnimationFrame(z.animate),
                      (v = setTimeout(function () {
                        window.requestAnimationFrame(z.animate);
                      }, 16)))
                    : (z.Ei(D),
                      ++r,
                      K || (x && window.requestAnimationFrame(z.animate))))
                : setTimeout(z.animate, 100);
            },
            Qo: function (D) {
              H.push(D);
            },
            Ei: function (D) {
              if ((!T.Ja || (K && P)) && J) {
                H.forEach(B);
                if (da.Z()) {
                  if (!p.set() && !da.ja()) {
                    da.ho();
                    z.ah();
                    Cb.Sc();
                    F.Jn();
                    T.Ja && Qa.Ji();
                    b.flush();
                    window.requestAnimationFrame(z.animate);
                    return;
                  }
                  K || uc.jn();
                  n();
                  p.H();
                  O && b.depthMask(!1);
                } else
                  K && Qa.se(1),
                    p.ga_.set(!0, !0, !0),
                    c(),
                    p.ga_.H(),
                    O && b.depthMask(!1),
                    p.Bc.set(!1, !O, !1),
                    e(),
                    p.Bc.H(),
                    p.position.set(!0, !O, !1),
                    kb.V(),
                    a(),
                    p.position.H(),
                    p.ob.set(!1, !O, !1),
                    d(),
                    p.ob.H();
                b.disable(b.DEPTH_TEST);
                O || b.depthMask(!1);
                T.da && yb.V();
                var S = z.uh();
                null !== S &&
                  (S.g(7),
                  F.set(T.da ? "s82" : "s83"),
                  F.N("u8", 1 / da.mb(), 1 / da.lb()),
                  Cb.pk(),
                  C.M(),
                  T.Ym
                    ? (b.enable(b.BLEND),
                      b.clearColor(0, 0, 0, 0),
                      b.clear(b.COLOR_BUFFER_BIT),
                      b.blendFunc(b.ONE, b.ONE_MINUS_SRC_ALPHA))
                    : b.disable(b.BLEND),
                  K || kb.Oe(),
                  p.position.g(0),
                  p.ob.g(1),
                  p.ga_.g(2),
                  E.Vc(3),
                  p.Bc.g(6),
                  E.Wc(4),
                  E.fh(),
                  T.da && yb.g(5),
                  Y.l(!0, !0),
                  va.fa(),
                  Qa.dl(C, g) || (F.set("s1"), g.M(), C.g(0), Y.l(!1, !1)),
                  F.set("s71"),
                  f.M(),
                  g.g(0),
                  Y.l(!1, !1),
                  g.o(),
                  f.g(0),
                  ba && K
                    ? (F.set("s70"),
                      y.g(1),
                      Qa.se(2),
                      Y.l(!1, !1),
                      F.set("s1"),
                      y.M(),
                      g.g(0),
                      Y.l(!1, !1))
                    : (F.set("s69"), Y.l(!1, !1), g.g(0)),
                  va.$(),
                  b.viewport(0, 0, da.L(), da.Y()),
                  (K && Qa.el(D, S)) || F.set("s1"),
                  Y.l(!1, !1),
                  b.enable(b.DEPTH_TEST),
                  b.depthMask(!0),
                  b.flush());
              }
            },
            uh: function () {
              if (!I) return Z.Eh();
              if (!K) return M;
              if (ja && !Qa.sm()) {
                F.set(w);
                va.fa();
                U.Ic();
                U.o();
                M.g(0);
                var D = U;
                Y.l(!0, !0);
              } else D = M;
              return Qa.Zk(D);
            },
            Zn: function () {
              T.Qk ||
                x ||
                ((x = !0),
                z.animate(Date.now()),
                q || qc.$n(),
                q || Ib.ic(!1),
                m && clearTimeout(m),
                T.da && yb.Ld(),
                (m = setTimeout(z.za, T.kk)),
                q || da.Wl(),
                (q = !0));
            },
            eq: function () {
              x && ((L = x = !1), cancelAnimationFrame(z.animate));
            },
            za: function () {
              L ||
                !q ||
                h ||
                T.dh ||
                ((L = h = !0),
                m && clearTimeout(m),
                t && clearTimeout(t),
                kb.Ue().Gi(),
                (m = setTimeout(function () {
                  da.Cg(T.Mm);
                  T.da && yb.tj();
                  r = 0;
                  k();
                }, 24)));
            },
            wake: function () {
              L &&
                q &&
                !h &&
                ((h = !0),
                (L = !1),
                (r = 0),
                kb.Ue().Gi(),
                m && clearTimeout(m),
                t && clearTimeout(t),
                (m = setTimeout(function () {
                  da.Cg(1);
                  T.da && yb.Ld();
                  k();
                }, 16)));
            },
            zp: function () {},
            fp: function () {},
            Sd: function (D) {
              ba = D;
            },
            kq: function () {
              F.j("s83", [
                { type: "1f", name: "u115", value: T.Vb },
                { type: "1f", name: "u116", value: T.Gd },
              ]);
            },
            resize: function (D, S, ea) {
              C.resize(D * ea, S * ea);
              g.resize(D, S);
              f.resize(D, S);
              T.Ja && y.resize(D, S);
              Qa.resize(D, S, ea);
              D = [{ type: "2f", name: "u8", value: [1 / D, 1 / S] }];
              F.j("s71", D);
              F.j("s69", D);
            },
            K: function () {
              v && clearTimeout(v);
              m && clearTimeout(m);
              t && clearTimeout(t);
              l.concat(u).forEach(function (D) {
                D.K();
              });
              l.splice(0, l.length);
              u.splice(0, u.length);
              p.ga_.remove();
              p.ob.remove();
              p.Bc.remove();
              p.position.remove();
              C.remove();
              g.remove();
              f.remove();
              y && y.remove();
              h = !0;
            },
            v: function () {
              z.K();
              O = L = h = q = x = K = P = h = !1;
            },
          };
        return z;
      })(),
      ta = {},
      da = (function () {
        function a() {
          Cb.resize(e * u, d * u);
          C.Z() && pc.resize(e * u, d * u);
          sa.resize(e, d, u);
          T.da && yb.resize(e * u, d * u, u);
          C.Ag();
        }
        var c = null,
          e = 0,
          d = 0,
          n = -1,
          k = !1,
          B = {
            Vd: !1,
            sg: !1,
            qj: !1,
            lg: !1,
            drawBuffers: !1,
            lm: !1,
            Uh: !1,
            nm: !1,
            yc: !1,
            Sa: !1,
          },
          l = Object.assign({}, B),
          u = 1,
          p = !1,
          G = !1,
          H = !1,
          E = !1,
          r = !1,
          C = {
            m: function (g) {
              void 0 !== g.onload && g.onload && (G = g.onload);
              void 0 === g.expand && (g.expand = !1);
              void 0 === g.td && (g.td = !1);
              void 0 === g.qa && (g.qa = !1);
              void 0 === g.Lb && (g.Lb = !1);
              void 0 === g.alpha && (g.alpha = !1);
              void 0 === g.preserveDrawingBuffer &&
                (g.preserveDrawingBuffer = !1);
              g.td && (k = !0);
              c = g.qa ? g.qa : document.getElementById(g.Ek);
              g.expand && C.expand();
              try {
                window.Jo = g.Lb
                  ? g.Lb.ql()
                  : c.getContext("webgl", {
                      antialias: !1,
                      alpha: g.alpha,
                      depth: !0,
                      premultipliedAlpha: !1,
                      stencil: !1,
                      preserveDrawingBuffer: g.preserveDrawingBuffer,
                    });
                E = g.Lb ? g.Lb.ja() : !1;
                H = !E;
                8 > b.getParameter(b.MAX_TEXTURE_IMAGE_UNITS) &&
                  C.$c("too few texture image units");
                if (!xa.m()) return C.$c("invalid config");
                T.po &&
                  ((l.sg = b.getExtension("EXT_texture_filter_anisotropic")),
                  l.sg && (l.Uh = !0));
                T.qo &&
                  ((l.Vd = b.getExtension("WEBGL_compressed_texture_s3tc")),
                  l.Vd &&
                    void 0 !== l.Vd.COMPRESSED_RGBA_S3TC_DXT5_EXT &&
                    l.Vd.COMPRESSED_RGBA_S3TC_DXT5_EXT &&
                    (l.lm = !0));
                H &&
                  ((l.qj =
                    b.getExtension("OES_element_index_uint") ||
                    b.getExtension("MOZ_OES_element_index_uint") ||
                    b.getExtension("WEBKIT_OES_element_index_uint")),
                  l.qj && (l.nm = !0));
                !E &&
                  T.ro &&
                  ((l.lg = b.getExtension("EXT_sRGB")), l.lg && (l.yc = !0));
                H
                  ? ((l.drawBuffers = b.getExtension("WEBGL_draw_buffers")),
                    l.drawBuffers && !T.bh && (l.Sa = !0))
                  : (l.Sa = 4 <= b.getParameter(b.MAX_DRAW_BUFFERS));
                if (l.Sa) {
                  var f = C.Sk();
                  l.Sa = l.Sa && f;
                }
              } catch (y) {
                return C.$c(y);
              }
              if (null === b || !b) return C.$c("NO_GL");
              g.expand && window.addEventListener("resize", C.expand, !1);
              c.addEventListener(
                "contextmenu",
                function (y) {
                  y.preventDefault();
                  return !1;
                },
                !1
              );
              e = c.width;
              d = c.height;
              C.mf();
              return !0;
            },
            mf: function () {
              n = k ? 3 : 2;
              xa.ea() || (n = Math.min(n, 1));
              xa.Ak() || (n = Math.min(n, 0));
              zc.m();
              Cb.m();
              for (var g in ta) ta[g].Ec();
              F.m();
              kb.m();
              Ib.m();
              sa.m();
              qc.m();
              T.da && yb.m();
              "undefined" !== typeof FPSCounter && FPSCounter.m();
              C.Ag();
              C.Uk();
              p = !0;
              G && G();
              return !0;
            },
            Uk: function () {
              if (l.Sa) {
                var g = pc.instance({ width: 256, height: 1 });
                g.bind();
                b.viewport(0, 0, 256, 1);
                F.set("s91");
                F.ya("color", [1, 0, 0, 1]);
                Y.l(!0, !0);
                b.clearColor(0, 0, 0, 0);
                b.clear(b.COLOR_BUFFER_BIT || b.DEPTH_BUFFER_BIT);
                va.$();
                F.set("s1");
                g.ob.g(0);
                Y.l(!1, !1);
                g = new Uint8Array(1024);
                b.readPixels(0, 0, 256, 1, b.RGBA, b.UNSIGNED_BYTE, g);
                r = 1 >= g[1020];
              }
            },
            Sk: function () {
              var g = pc.instance({ width: 1, height: 1 });
              if (!g.set()) return g.remove(), !1;
              F.Mn(b);
              Y.Ib(b);
              b.bindFramebuffer(b.FRAMEBUFFER, null);
              F.qb(b);
              g.ga_.Cb(0);
              Y.Ib(b);
              var f = new Uint8Array(4);
              b.readPixels(0, 0, 1, 1, b.RGBA, b.UNSIGNED_BYTE, f);
              g.remove();
              return 3 < Math.abs(f[0] - 127) ? !1 : !0;
            },
            ja: function () {
              return E;
            },
            L: function () {
              return e;
            },
            Y: function () {
              return d;
            },
            mb: function () {
              return u * C.L();
            },
            lb: function () {
              return u * C.Y();
            },
            rl: function () {
              return e / d;
            },
            T: function () {
              return n;
            },
            qm: function () {
              return 3 === n;
            },
            Xh: function () {
              return r;
            },
            Z: function () {
              return l.Sa;
            },
            ho: function () {
              l.Sa = !1;
            },
            Gp: function () {
              return !1;
            },
            Ck: function () {
              return 0 < C.T();
            },
            Wo: function () {
              return C.Z() && 0 < C.T();
            },
            Te: function (g) {
              var f = b,
                y = "";
              E || ((f = l.drawBuffers), (y = "_WEBGL"));
              return [
                f["COLOR_ATTACHMENT0" + y],
                f["COLOR_ATTACHMENT1" + y],
                f["COLOR_ATTACHMENT2" + y],
                f["COLOR_ATTACHMENT3" + y],
              ].splice(0, g);
            },
            md: function (g) {
              return C.Te(4)[g];
            },
            Pl: function () {
              return E
                ? b.SRGB
                  ? b.SRGB
                  : b.RGBA
                : l.yc
                ? l.lg.SRGB_ALPHA_EXT
                : b.RGBA;
            },
            om: function () {
              return l.Uh;
            },
            wl: function () {
              return l.sg;
            },
            Cm: function (g) {
              C.ja()
                ? b.drawBuffers(C.Te(g))
                : l.drawBuffers.drawBuffersWEBGL(C.Te(g));
            },
            expand: function () {
              sa.wake();
              C.resize(window.innerWidth, window.innerHeight);
              sa.za();
            },
            resize: function (g, f) {
              !c ||
                (g === e && f === d) ||
                ((e = g),
                (d = f),
                (c.width = e),
                (c.height = d),
                p && (kb.resize(), a()));
            },
            Ag: function () {
              var g = [
                { type: "2f", name: "u8", value: [1 / da.mb(), 1 / da.lb()] },
              ];
              F.j("s71", g);
              F.j("s69", g);
            },
            Cg: function (g) {
              u = g;
              a();
            },
            Ea: function (g, f) {
              c.addEventListener(g, f, !1);
            },
            $c: function () {
              n = -1;
              return !1;
            },
            Wg: function () {
              return 0 <= n;
            },
            Jp: function () {},
            Sp: function () {},
            cq: function () {
              var g = document.getElementById("loading");
              g && (g.style.display = "block");
            },
            Wl: function () {
              var g = document.getElementById("loading");
              g && (g.style.display = "none");
            },
            K: function () {
              C.Wg() &&
                (Z.rj(),
                sa.K(),
                Y.K(),
                Cb.K(),
                T.da && yb.K(),
                bc.K(),
                qc.K(),
                F.K(),
                Z.K(),
                b.flush(),
                (b = null));
            },
            v: function () {
              sa.v();
              Qa.v();
              F.v();
              Object.assign(l, B);
              p = !1;
            },
          };
        return C;
      })(),
      kb = (function () {
        var a = !1,
          c = !1,
          e = [];
        return {
          m: function () {},
          instance: function (d) {
            void 0 === d.Hi && (d.Hi = !0);
            void 0 === d.ie && (d.ie = 0.1);
            void 0 === d.he && (d.he = 100);
            void 0 === d.direction && (d.direction = [0, 0, -1]);
            void 0 === d.Jb && (d.Jb = 45);
            var n = new Sb(),
              k = new Oa(50, -50, -400),
              B = null;
            n.setPosition(k);
            var l = new Int8Array(20),
              u = new Int8Array(20),
              p = 0,
              G = 0,
              H = 0,
              E = 0,
              r = {
                V: function () {
                  u[F.nd()] || (F.Hc("u117", n.elements), (u[F.nd()] = 1));
                  l[F.nd()] || (F.Hc("u129", B), (l[F.nd()] = 1));
                },
                Ne: function () {
                  G || (F.Hc("u117", n.elements), (G = 1));
                  p || (F.N("u118", B[0], B[5]), (p = 1));
                },
                Oe: function () {
                  H || (F.hg("u107", k.x, k.y, k.z), (H = 1));
                },
                Fb: function () {
                  E || (F.hg("u147", k.x, k.y, k.z), (E = 1));
                },
                Yg: function () {
                  var C = d.ie,
                    g = d.he,
                    f = Math.tan((0.5 * d.Jb * Math.PI) / 180);
                  B = [
                    0.5 / f,
                    0,
                    0,
                    0,
                    0,
                    (0.5 * da.rl()) / f,
                    0,
                    0,
                    0,
                    0,
                    -(g + C) / (g - C),
                    -1,
                    0,
                    0,
                    (-2 * g * C) / (g - C),
                    0,
                  ];
                  for (C = 0; 20 > C; ++C) l[C] = 0;
                  p = 0;
                },
                In: function (C, g) {
                  k.Oi(g[0]).Pi(g[1]).z = g[2];
                  n.elements.set(C);
                  for (C = 0; 20 > C; ++C) u[C] = 0;
                  E = H = G = 0;
                },
                Gi: function () {
                  for (var C = (E = H = 0); 20 > C; ++C) u[C] = 0;
                },
              };
            r.Yg();
            a = r;
            c = !0;
            d.Hi && e.push(r);
            return r;
          },
          V: function () {
            c && a.V();
          },
          Ne: function () {
            c && a.Ne();
          },
          Oe: function () {
            c && a.Oe();
          },
          Fb: function () {
            c && a.Fb();
          },
          resize: function () {
            e.forEach(function (d) {
              d.Yg();
            });
          },
          Ue: function () {
            return a;
          },
        };
      })(),
      Cb = (function () {
        var a = [],
          c = null;
        return {
          m: function () {
            c = va.instance({ width: da.mb(), height: da.lb(), wc: !da.Z() });
          },
          instance: function (e) {
            void 0 === e.width && (e.width = da.mb());
            void 0 === e.height && (e.height = da.lb());
            void 0 === e.isFloat && (e.isFloat = !1);
            void 0 === e.Ob && (e.Ob = !1);
            void 0 === e.clearColor && (e.clearColor = [0, 0, 0, 0]);
            void 0 === e.F && (e.F = 4);
            var d = Z.instance({
                isFloat: e.isFloat && xa.ea(),
                S: e.isFloat,
                width: e.width,
                height: e.height,
                isPot: !1,
                isLinear: !1,
                F: e.F,
              }),
              n = void 0 !== e.ac && e.ac ? !0 : !1,
              k = e.ac,
              B = {
                set: function (l, u, p) {
                  p && c.bind(!1, p);
                  d.o();
                  l &&
                    (b.clearColor(
                      e.clearColor[0],
                      e.clearColor[1],
                      e.clearColor[2],
                      e.clearColor[3]
                    ),
                    c.ye());
                  u && c.Xg();
                  n && F.set(k);
                },
                $i: function (l) {
                  n = (k = l) ? !0 : !1;
                },
                H: function () {
                  d.Yd();
                },
                g: function (l) {
                  d.g(l);
                },
                resize: function (l, u) {
                  d.resize(l, u);
                },
                debug: function () {
                  d.debug();
                },
                remove: function () {
                  d.remove();
                },
              };
            e.Ob && a.push(B);
            return B;
          },
          resize: function (e, d) {
            c.resize(e, d);
            a.forEach(function (n) {
              n.resize(e, d);
            });
          },
          pk: function () {
            c.Qg();
          },
          Sc: function () {
            c.Sc();
          },
          Ic: function () {
            c.Ic();
          },
          Zo: function () {
            c.Xg();
          },
          Yo: function () {
            c.ye();
          },
          Xo: function () {
            c.clear();
          },
          K: function () {
            c.remove();
          },
        };
      })(),
      pc = (function () {
        var a = [];
        return {
          instance: function (c) {
            void 0 === c.width && (c.width = da.mb());
            void 0 === c.height && (c.height = da.lb());
            var e = b.createFramebuffer(),
              d = c.width,
              n = c.height,
              k = !0;
            c = {
              isFloat: xa.ea(),
              S: !0,
              width: d,
              height: n,
              isPot: !1,
              isLinear: !1,
              F: 4,
            };
            var B = Z.instance(c),
              l = Z.instance(c),
              u = Z.instance(c),
              p = Z.instance(c),
              G = va.xl(),
              H = va.zh();
            b.bindFramebuffer(G, e);
            var E = b.createRenderbuffer();
            b.bindRenderbuffer(b.RENDERBUFFER, E);
            b.renderbufferStorage(b.RENDERBUFFER, b.DEPTH_COMPONENT16, d, n);
            b.framebufferRenderbuffer(G, b.DEPTH_ATTACHMENT, b.RENDERBUFFER, E);
            b.clearDepth(1);
            b.framebufferTexture2D(G, da.md(0), b.TEXTURE_2D, B.get(), 0);
            b.framebufferTexture2D(G, da.md(1), b.TEXTURE_2D, l.get(), 0);
            b.framebufferTexture2D(G, da.md(2), b.TEXTURE_2D, p.get(), 0);
            b.framebufferTexture2D(G, da.md(3), b.TEXTURE_2D, u.get(), 0);
            da.Cm(4);
            b.bindFramebuffer(G, null);
            va.reset();
            var r = {
              position: B,
              ob: l,
              Bc: u,
              ga_: p,
              bind: function () {
                b.bindFramebuffer(G, e);
                va.reset();
              },
              set: function () {
                b.checkFramebufferStatus(H);
                b.bindFramebuffer(G, e);
                va.reset();
                if (k) {
                  if (b.checkFramebufferStatus(H) !== b.FRAMEBUFFER_COMPLETE)
                    return !1;
                  k = !1;
                }
                b.viewport(0, 0, d, n);
                b.clearColor(0, 0, 0, 0);
                F.Sb() && !da.Xh() && (F.set("s90"), Y.l(!1, !1));
                b.clear(b.COLOR_BUFFER_BIT | b.DEPTH_BUFFER_BIT);
                return !0;
              },
              H: function () {},
              resize: function (C, g) {
                d = C;
                n = g;
                B.resize(C, g);
                l.resize(C, g);
                p.resize(C, g);
                u.resize(C, g);
                b.bindRenderbuffer(b.RENDERBUFFER, E);
                b.renderbufferStorage(
                  b.RENDERBUFFER,
                  b.DEPTH_COMPONENT16,
                  d,
                  n
                );
                b.bindRenderbuffer(b.RENDERBUFFER, null);
              },
              remove: function () {
                B.remove();
                l.remove();
                p.remove();
                u.remove();
                b.deleteRenderbuffer(E);
                b.deleteFramebuffer(e);
                var C = a.indexOf(r);
                -1 !== C && a.splice(C, 1);
              },
            };
            a.push(r);
            return r;
          },
          resize: function (c, e) {
            a.forEach(function (d) {
              d.resize(c, e);
            });
          },
        };
      })(),
      bc = (function () {
        var a = [],
          c = T.Pg;
        return {
          instance: function (e) {
            function d() {
              u
                ? n()
                : ((f = kd.instance({ ka: H, km: c })),
                  (l = T.lk[da.T()]),
                  (E = Z.instance({
                    isFloat: xa.ea(),
                    S: !0,
                    isPot: !0,
                    isLinear: !1,
                    Mb: !0,
                    width: l,
                    height: l / 2,
                    F: 3,
                  })),
                  (r = Z.instance({
                    isFloat: xa.ea(),
                    S: !0,
                    isPot: !0,
                    isLinear: !1,
                    Mb: !0,
                    width: l,
                    height: l / 2,
                    F: 3,
                  })),
                  (C = Z.instance({
                    isFloat: xa.ea(),
                    S: !0,
                    isPot: !0,
                    width: 1,
                    height: l / 2,
                    F: 3,
                  })),
                  (g = Z.instance({
                    isFloat: xa.ea() && !c,
                    S: !c,
                    isPot: !1,
                    isLinear: !0,
                    Mb: !0,
                    isMipmap: !1,
                    width: l,
                    height: l / 2,
                    F: c ? 4 : 3,
                  })),
                  (u = !0),
                  n(),
                  J.forEach(function (x) {
                    x();
                  }),
                  J.splice(0, J.length));
            }
            function n() {
              if (u) {
                va.fa();
                f.en();
                E.M();
                F.set("s73");
                H.g(0);
                F.G("u85", T.Vb);
                Z.uk(1);
                Y.l(!0, !0);
                for (var x = T.bm[da.T()], q = 0; q < x; ++q)
                  r.o(),
                    F.set("s76"),
                    F.N("u8", 1 / l, 0),
                    E.g(0),
                    Y.l(!1, !1),
                    E.o(),
                    F.N("u8", 0, 2 / l),
                    r.g(0),
                    Y.l(!1, !1);
                C.M();
                F.set("s78");
                E.g(0);
                Y.l(!1, !1);
                F.set(c ? "s80" : "s79");
                g.M();
                E.g(0);
                C.g(1);
                Y.l(!1, !1);
                Z.$(0);
                Z.$(1);
              }
            }
            var k = Object.assign({ Ab: null, oc: null, nc: 0, pc: 0 }, e),
              B = 0,
              l = 0,
              u = !1,
              p = null,
              G = null,
              H = null,
              E = null,
              r = null,
              C = null,
              g = null,
              f = null,
              y = 0,
              J = [];
            e = {
              m: function () {
                function x() {
                  2 === ++q &&
                    ((H = Z.instance({
                      isFloat: xa.ea(),
                      S: !0,
                      isPot: !1,
                      isMipmap: !1,
                      isLinear: !1,
                      Mb: !0,
                      width: B,
                      height: B / 2,
                      F: 3,
                    })),
                    va.fa(),
                    H.M(),
                    F.set("s72"),
                    F.G("u90", k.pc),
                    F.G("u91", k.nc),
                    p.g(0),
                    G.g(1),
                    Y.l(!0, !0),
                    d());
                }
                var q = 0;
                B = T.mk[da.T()];
                y = Math.log2(B) - 1;
                k.Ab &&
                  ((p = Z.instance({
                    isPot: !1,
                    url: k.Ab,
                    R: x,
                    F: 3,
                    isFlipY: !1,
                  })),
                  (G = Z.instance({
                    isPot: !1,
                    url: k.oc,
                    R: x,
                    F: 3,
                    isFlipY: !1,
                  })));
              },
              Xi: function (x) {
                H = x;
                d();
              },
              Vc: function (x) {
                u && (f.g(x), F.G("u108", f.L()));
              },
              Wc: function (x) {
                u && g.g(x);
              },
              fh: function () {
                F.G("u22", y);
              },
              vh: function () {
                return y;
              },
              L: function () {
                return B;
              },
              Db: function (x) {
                u ? x() : J.push(x);
              },
              K: function () {
                p && p.remove();
                G && G.remove();
                E.remove();
                C.remove();
                r.remove();
                f.remove();
                g.remove();
                H.remove();
              },
            };
            a.push(e);
            e.m();
            return e;
          },
          K: function () {
            a.forEach(function (e) {
              e.K();
            });
          },
        };
      })(),
      Vc = {
        instance: function (a) {
          var c = a.wm,
            e = a.um,
            d = 0,
            n = c.L();
          a = T.Pg;
          var k = Z.instance({
              isFloat: xa.ea() && !a,
              S: !a,
              isLinear: !0,
              isMipmap: !1,
              isPot: !1,
              width: n,
              F: a ? 4 : 3,
              isFlipY: !1,
            }),
            B = Z.instance({
              isFloat: xa.ea() && !a,
              S: !a,
              isPot: !1,
              isLinear: !0,
              Mb: !0,
              isMipmap: !1,
              width: n,
              height: n / 2,
              F: a ? 4 : 3,
            }),
            l = va.instance({ width: n, height: n }),
            u = a ? "s66" : "s65";
          return {
            Nn: function (p) {
              d = p;
              F.set(u);
              b.viewport(0, 0, n, n);
              l.o();
              k.o();
              F.G("u7", d);
              c.Vc(1);
              e.Vc(0);
              Y.l(!0, !0);
              b.viewport(0, 0, n, n / 2);
              B.o();
              c.Wc(1);
              e.Wc(0);
              Y.l(!1, !1);
              b.flush();
            },
            Vc: function (p) {
              k.g(p);
            },
            Wc: function (p) {
              B.g(p);
            },
            fh: function () {
              F.G("u22", c.vh() * (1 - d) + e.vh() * d);
            },
          };
        },
      },
      Ib = (function () {
        function a(M) {
          var I = (h - T.we) / (T.Tg - T.we);
          I = 1 - Math.pow(1 - I, T.Ho);
          h += M * (1 + I * T.Io);
          h = Math.min(Math.max(h, T.we), T.Tg);
          t.ic();
        }
        function c(M) {
          -1 !== l &&
            ((y = f = 0),
            B(),
            a((T.Go * M.deltaY) / window.innerHeight),
            M.preventDefault());
        }
        function e() {
          x += f;
          q += y;
          q = Math.min(Math.max(q, T.Qm), T.Pm);
          t.ic();
        }
        function d(M) {
          if (0 === l || -1 === l) return !1;
          var I = void 0 !== M.touches && M.touches.length;
          M.preventDefault();
          if (2 === l) {
            var K = Mc(
              M.touches[0].pageX,
              M.touches[0].pageY,
              M.touches[1].pageX,
              M.touches[1].pageY
            );
            a(-(C - K) * T.Rm);
            C = K;
          } else
            (K = I ? M.touches[0].clientX : M.clientX),
              (M = I ? M.touches[0].clientY : M.clientY),
              (f = (2 * (K - E) * Math.PI) / da.L()),
              (y = (2 * (M - r) * Math.PI) / da.Y()),
              4 === l
                ? ((m[0] += f * T.si),
                  (m[1] -= y * T.si),
                  (m[0] = Math.min(Math.max(m[0], -T.vi), T.vi)),
                  (m[1] = Math.min(Math.max(m[1], -T.wi), T.wi)),
                  t.ic())
                : e(),
              (E = K),
              (r = M);
        }
        function n() {
          0 !== l &&
            -1 !== l &&
            ((0 === f && 0 === y) || 1 !== l || !O
              ? sa.za()
              : (B(), (g = Date.now()), (L = setInterval(t.tm, J))),
            (l = 0));
        }
        function k(M) {
          if (2 !== l && -1 !== l) {
            y = f = 0;
            B();
            sa.wake();
            var I = void 0 !== M.changedTouches && M.touches.length;
            M.preventDefault();
            I && 2 === M.touches.length
              ? ((l = 2),
                (C = Mc(
                  M.touches[0].pageX,
                  M.touches[0].pageY,
                  M.touches[1].pageX,
                  M.touches[1].pageY
                )))
              : ((l = I || 2 !== M.button ? 1 : 4),
                (E = I ? M.touches[0].clientX : M.clientX),
                (r = I ? M.touches[0].clientY : M.clientY));
            return !1;
          }
        }
        function B() {
          L && (clearInterval(L), (L = !1));
        }
        var l = 0,
          u = !1,
          p = !1,
          G = !1,
          H = 1,
          E = 0,
          r = 0,
          C = 0,
          g = 0,
          f = 0,
          y = 0,
          J = 16,
          x = T.lj,
          q = T.ui,
          h = T.ve,
          L = !1,
          O = 0,
          v = new Float32Array([0, 0, 0, 0, 0]),
          m = [T.yk, T.zk],
          t = {
            m: function () {
              O = T.Qj[da.T()];
              J = T.ed[da.T()];
              da.Ea("mousedown", k);
              da.Ea("mouseup", n);
              da.Ea("mouseout", n);
              da.Ea("mousemove", d);
              da.Ea("mousemove", d);
              da.Ea("wheel", c);
              da.Ea("touchstart", k);
              da.Ea("touchend", n);
              da.Ea("touchmove", d);
            },
            ic: function (M) {
              u
                ? ((p[0] = -q),
                  (p[1] = x),
                  (G[1].value = (H / T.ve) * h),
                  Qa.rb(G))
                : ((v[0] = x),
                  (v[1] = q),
                  (v[2] = h),
                  (v[3] = m[0]),
                  (v[4] = m[1]),
                  qc.rn(v, M));
            },
            tm: function () {
              if ((1e-4 > f && 1e-4 > y) || -1 === l)
                B(), (y = f = 0), 0 === l && sa.za();
              var M = Date.now(),
                I = M - g;
              g = M;
              M = Math.pow(O, I / J);
              f *= M;
              y *= M;
              e();
            },
            Pe: function (M) {
              u ||
                ((u = !0),
                (l = -1),
                (p = [0, 0, 0]),
                (G = [
                  { name: "u76", type: "3f", value: p },
                  { name: "u80", type: "1f", value: 1 },
                ]),
                (H = M));
            },
            hj: function (M) {
              -1 === l && M && (l = 0);
              M || (l = -1);
            },
            kn: function () {
              y = f = 0;
              x = T.lj;
              q = T.ui;
              h = T.ve;
              t.ic();
            },
            Wp: function (M) {
              h = M;
            },
            Xp: function (M) {
              m[0] = M[0];
              m[1] = M[1];
              T.Ug = M[2];
            },
            Vp: function (M, I) {
              x = M;
              q = I;
            },
          };
        return t;
      })(),
      uc = (function () {
        var a = {
          s92: !1,
          s92color: !1,
          s92NormalMap: !1,
          s92ParamsMap: !1,
          s92NormalParamsMap: !1,
        };
        return {
          instance: function (c) {
            function e(w) {
              if (U) {
                w.tweaker &&
                  JEELIZVTO &&
                  "undefined" !== typeof R &&
                  R.Og(w.tweaker);
                v.splice(0, v.length);
                v.push({ n: 0, offset: 0 });
                h.min.set(Infinity, Infinity, Infinity);
                h.max.set(-Infinity, -Infinity, -Infinity);
                var z = w.uvs;
                z &&
                  (z = z.filter(function (ha) {
                    return ha;
                  }));
                ba = z && 0 < z.length && 0 < z[0].length ? !0 : !1;
                "undefined" !== typeof $a &&
                  "string" === typeof w.faces &&
                  (w.faces = $a(w.faces));
                "undefined" !== typeof hb &&
                  ("string" === typeof w.vertices &&
                    (w.vertices = hb(w.vertices)),
                  z &&
                    z.length &&
                    z.forEach(function (ha, ra) {
                      "string" === typeof ha && (z[ra] = hb(ha));
                    }));
                var D = w.metadata.faces,
                  S = 1 + (ba ? 1 : 0);
                D = (w.faces.length - D) / (w.metadata.faces * S);
                (6 !== D && 8 !== D) || ba || (++S, (D /= 2));
                if (4 === D) {
                  D = 6 * S + 2;
                  for (
                    var ea = 4 * S + 1, X = Array(w.metadata.faces * D), aa = 0;
                    aa < w.metadata.faces;
                    ++aa
                  )
                    for (var oa = 0; oa < S; ++oa)
                      (X[aa * D + 4 * oa] = w.faces[aa * ea + 5 * oa]),
                        (X[aa * D + 4 * oa + 1] =
                          w.faces[aa * ea + 5 * oa + 1]),
                        (X[aa * D + 4 * oa + 2] =
                          w.faces[aa * ea + 5 * oa + 2]),
                        0 === oa && (X[aa * D + 3] = w.faces[aa * ea + 4]),
                        (X[aa * D + 4 * oa + 3 * S + 1] =
                          w.faces[aa * ea + 5 * oa]),
                        (X[aa * D + 4 * oa + 3 * S + 2] =
                          w.faces[aa * ea + 5 * oa + 2]),
                        (X[aa * D + 4 * oa + 3 * S + 3] =
                          w.faces[aa * ea + 5 * oa + 3]),
                        0 === oa &&
                          (X[aa * D + 3 * S + 4] = w.faces[aa * ea + 4]);
                  w.faces = X;
                  w.metadata.faces *= 2;
                }
                E = Array(w.metadata.vertices);
                for (D = 0; D < w.metadata.vertices; ++D)
                  (E[D] = new Oa(
                    w.vertices[3 * D],
                    w.vertices[3 * D + 1],
                    w.vertices[3 * D + 2]
                  )),
                    Yc(h, E[D]);
                r = Array(w.metadata.faces);
                S = 3 * S + 1;
                for (D = 0; D < w.metadata.faces; ++D)
                  (r[D] = new wc(
                    w.faces[S * D],
                    w.faces[S * D + 1],
                    w.faces[S * D + 2]
                  )),
                    (r[D].Ub = w.faces[S * D + 3]);
                t = 3 < E.length;
                U && (U.visible = t);
                $c(E, r);
                C = ad(E, r);
                if (ba) {
                  S = Array(E.length);
                  D = ["a", "b", "c"];
                  for (ea = 0; ea < w.metadata.faces; ++ea)
                    for (X = 0; 3 > X; ++X)
                      if (
                        ((aa = w.faces[7 * ea + X]),
                        (oa = w.faces[7 * ea + 1 + X + 3]),
                        "undefined" === typeof S[aa])
                      )
                        S[aa] = [[aa, oa]];
                      else if (S[aa][0][1] !== oa) {
                        for (var Ma = -1, Da = 1; Da < S[aa].length; ++Da)
                          if (S[aa][Da][1] === oa) {
                            Ma = S[aa][Da][0];
                            break;
                          }
                        Da = -1;
                        -1 === Ma
                          ? ((Da = E.length),
                            E.push(E[aa].clone()),
                            C.push(C[aa].clone()),
                            S[aa].push([Da, oa]),
                            (S[Da] = [[Da, oa]]))
                          : (Da = Ma);
                        w.faces[7 * ea + X] = Da;
                        r[ea][D[X]] = Da;
                      }
                  g = Array(E.length);
                  for (w = 0; w < E.length; ++w)
                    (D = "undefined" === typeof S[w] ? w : S[w][0][1]),
                      (g[w] = new Qb(z[0][2 * D], z[0][2 * D + 1]));
                }
                var ka = nc(h);
                c.yb &&
                  (E.forEach(function (ha) {
                    ha.x -= ka.x;
                    ha.z -= ka.z;
                    ha.y -= h.min.y;
                  }),
                  (h.min.x -= ka.x),
                  (h.max.x -= ka.x),
                  (h.min.z -= ka.z),
                  (h.max.z -= ka.z),
                  (h.max.y -= h.min.y),
                  (h.min.y = 0));
                if (c.zb) {
                  var la =
                    T.jk /
                    Math.max(
                      h.max.x - h.min.x,
                      h.max.y - h.min.y,
                      h.max.z - h.min.z
                    );
                  E.forEach(function (ha) {
                    ha.Aa(la);
                  });
                  h.min.Aa(la);
                  h.max.Aa(la);
                }
                w = ba ? 8 : 6;
                S = new Float32Array(E.length * w);
                for (D = 0; D < E.length; ++D)
                  (S[w * D] = E[D].x),
                    (S[w * D + 1] = E[D].y),
                    (S[w * D + 2] = E[D].z),
                    (S[w * D + 3] = C[D].x),
                    (S[w * D + 4] = C[D].y),
                    (S[w * D + 5] = C[D].z),
                    ba && ((S[w * D + 6] = g[D].x), (S[w * D + 7] = g[D].y));
                r.sort(function (ha, ra) {
                  return ha.Ub - ra.Ub;
                });
                var Ba = new (65536 > 3 * r.length ? Uint16Array : Uint32Array)(
                    3 * r.length
                  ),
                  V = 0;
                r.forEach(function (ha, ra) {
                  ha.Ub === V
                    ? (v[V].n += 3)
                    : (v.push({ n: 3, offset: 3 * ra }), ++V);
                  Ba[3 * ra] = ha.a;
                  Ba[3 * ra + 1] = ha.b;
                  Ba[3 * ra + 2] = ha.c;
                });
                f && f.remove();
                f = Y.instance({ ha: S, U: Ba });
                x = J = !1;
                P && U.Zg();
                M = !0;
                U.Me();
                c.R && (c.R(U), (c.R = null));
              }
            }
            function d(w) {
              f.Fa(w.n, w.offset);
            }
            function n(w, z) {
              K[z] &&
                (F.set(K[z].Kl()),
                f.bind(!1),
                ba ? (F.Ma(), F.Ui()) : (F.Va(), F.Vi()),
                K[z].zc() && (F.Gc(), J.qc(!1), F.Kd(), kb.Fb()),
                K[z].Xk(),
                K[z].dd(),
                f.Fa(w.n, w.offset));
            }
            function k(w, z) {
              K[z] &&
                (F.set(K[z].Ll()),
                f.bind(!1),
                ba ? (F.Ma(), F.Ui()) : (F.Va(), F.Vi()),
                K[z].zc() && (F.Gc(), J.qc(!1), F.Kd(), kb.Fb()),
                U.tc(),
                K[z].dd(),
                f.Fa(w.n, w.offset));
            }
            function B(w, z) {
              ja && K[z] && (K[z].Yk(), f.Fa(w.n, w.offset));
            }
            function l(w, z) {
              ja && K[z] && (K[z].$k(ba), f.Fa(w.n, w.offset));
            }
            function u(w, z) {
              K[z] && (F.set(K[z].Gl()), K[z].kh(), f.Fa(w.n, w.offset));
            }
            function p(w, z) {
              K[z] &&
                (F.set(K[z].Hl()), U.tc(), K[z].kh(), f.Fa(w.n, w.offset));
            }
            function G(w, z) {
              K[z] &&
                (F.set(K[z].Il()),
                K[z].zc() && (J.qc(!1), F.Kd(), kb.Fb()),
                f.bind(!1),
                K[z].hh(ba),
                f.Fa(w.n, w.offset));
            }
            function H(w, z) {
              if (K[z]) {
                var D = K[z].Jl();
                F.set(D);
                K[z].zc() && (J.qc(!1), F.Kd(), kb.Fb(), f.bind(!1));
                a[D] || (U.tc(), f.bind(!1), (a[D] = !0));
                K[z].hh(ba);
                f.Fa(w.n, w.offset);
              }
            }
            if (!da.Wg()) return !1;
            void 0 === c.yb && (c.yb = !1);
            void 0 === c.zb && (c.zb = !1);
            void 0 === c.Sg && (c.Sg = !1);
            var E = null,
              r = null,
              C = null,
              g = null,
              f = null,
              y = null,
              J = null,
              x = !1,
              q = new Sb(),
              h = new vc(),
              L = [],
              O = null,
              v = [{ n: 0, offset: 0 }],
              m = [],
              t = !1,
              M = !1,
              I = [],
              K = [],
              P = !1,
              ba = !1,
              ja = !1,
              U = {
                visible: t,
                Ik: function () {
                  return v.length;
                },
                Zg: function () {
                  !x &&
                    ba &&
                    ((r = r.filter(function (w) {
                      return null !== w;
                    })),
                    (y = bd(E, C, g, r)),
                    (J = Y.instance({ ha: y, U: !1 })),
                    (g = C = r = E = y = null),
                    (x = !0));
                },
                tc: function () {
                  kb.V();
                  U.jh();
                },
                jh: function () {
                  F.Hc("u130", q.elements);
                },
                gp: function () {
                  t && (U.jh(), f.bind(!1), ba ? F.Ma() : F.Va(), f.V());
                },
                hl: function (w) {
                  t && (w || U.tc(), f.bind(!1), ba ? F.Ma() : F.Va(), f.V());
                },
                il: function () {
                  t && (f.bind(!1), ba ? F.Ma() : F.Va(), v.forEach(B));
                },
                gh: function () {
                  t && (f.bind(!1), ba ? F.Ma() : F.Va(), m.forEach(d));
                },
                fl: function (w) {
                  ja &&
                    t &&
                    (f.bind(!1),
                    ba ? F.Ma() : F.Va(),
                    w ? v.forEach(u) : v.forEach(p));
                },
                cd: function (w) {
                  t &&
                    (w || U.tc(),
                    f.bind(!1),
                    w || (F.Ma(), F.Gc()),
                    ja && v.forEach(l));
                },
                dd: function (w) {
                  ja && t && (w ? v.forEach(n) : v.forEach(k));
                },
                bl: function () {
                  ja && t && v.forEach(H);
                },
                al: function () {
                  ja && t && v.forEach(G);
                },
                Dh: function () {
                  return O;
                },
                Bh: function () {
                  return I;
                },
                no: function (w, z) {
                  K[w].update(z);
                  U.vj();
                },
                dg: function (w, z) {
                  function D(X, aa) {
                    X &&
                      ((X.R = function () {
                        U &&
                          ++ea === S &&
                          ((ja = !0),
                          P && U.Db(U.Zg, 5),
                          U.Me(),
                          z &&
                            U.Db(function () {
                              z(U);
                            }, 10));
                      }),
                      (X = zc.instance(X)),
                      K[aa] && K[aa].K(),
                      (K[aa] = X),
                      (P = P || X.zc()));
                  }
                  I = w;
                  ja = !1;
                  var S = w.length,
                    ea = 0;
                  K = Array(S);
                  P = !1;
                  w.forEach(function (X, aa) {
                    "string" === typeof X
                      ? xc(
                          -1 === X.indexOf(".json") ? X + ".json" : X,
                          function (oa) {
                            oa.name = X;
                            D(oa, aa, X);
                          }
                        )
                      : D(X, aa, !1);
                  });
                  U.Db(function () {
                    U.vj();
                    sa.sb(U);
                    sa.Td(!0);
                  }, 4);
                },
                vj: function () {
                  m.splice(0, m.length);
                  v.forEach(function (w, z) {
                    K[z] && K[z].rm() && m.push(w);
                  });
                },
                Db: function (w, z) {
                  M && ja ? w(U) : L.push({ jb: w, order: z ? z : 0 });
                },
                Me: function () {
                  M &&
                    ja &&
                    (L.sort(function (w, z) {
                      return 0 > w.order - z.order ? 1 : -1;
                    }),
                    L.forEach(function (w) {
                      w.jb(U);
                    }),
                    L.splice(0, L.length));
                },
                remove: function () {
                  U.K();
                  U = null;
                },
                K: function () {
                  t = M = !1;
                  f && f.remove();
                  K.forEach(function (w) {
                    w.K();
                  });
                  x && J.remove();
                },
                Nl: function () {
                  return h.size().x;
                },
                Ol: function () {
                  return h.size().y;
                },
                xp: function () {
                  return h.size().z;
                },
                tl: function () {
                  return nc(h).x;
                },
                ul: function () {
                  return nc(h).y;
                },
                lp: function () {
                  return nc(h).z;
                },
                tp: function () {
                  return h.min.y;
                },
                replace: function (w, z, D) {
                  if (w === O) return z && U && (U.Me(), z(U)), !1;
                  O = w;
                  sa.Td(!1);
                  xc(
                    w,
                    function (S) {
                      e(S);
                      z && z(U);
                    },
                    D
                  );
                  return !0;
                },
              };
            c.Cc && U.dg(c.Cc, c.Sg);
            O = c.url;
            xc(c.url, e);
            return U;
          },
          jn: function () {
            a.s92 = !1;
            a.s92color = !1;
            a.s92NormalMap = !1;
            a.s92ParamsMap = !1;
            a.s92NormalParamsMap = !1;
          },
        };
      })(),
      qc = (function () {
        var a = null,
          c = !1,
          e = !1,
          d = null,
          n = new Float32Array(16),
          k = new Float32Array(3),
          B = { data: 0 },
          l = {
            m: function () {
              a = T.Gb
                ? new Worker("js/worker.php")
                : {
                    postMessage: function (u) {
                      B.data = u;
                      Ac.Km(B);
                    },
                    terminate: function () {},
                  };
              a.onmessage = function (u) {
                switch (u.data[0]) {
                  case 3:
                    for (var p = 0; 16 > p; ++p) n[p] = u.data[p + 1];
                    for (p = 0; 3 > p; ++p) k[p] = u.data[p + 17];
                    kb.Ue().In(n, k);
                    break;
                  case 6:
                    l.Cn(), (c = !0), Ib.ic(!1), T.da && (yb.enable(), yb.Ld());
                }
              };
              d = new Float32Array(6);
              d[0] = 2;
              T.Gb || Ac.En(a);
            },
            $n: function () {
              T.eh || (e = !0);
            },
            fq: function () {
              e = !1;
            },
            rn: function (u, p) {
              if (p || (c && e))
                (d[1] = u[0]),
                  (d[2] = u[1]),
                  (d[3] = u[2]),
                  (d[4] = u[3]),
                  (d[5] = u[4]),
                  a.postMessage(d);
            },
            Cn: function () {
              a.postMessage([5, T.Ug]);
            },
            K: function () {
              T.Gb && a.terminate();
            },
          };
        return l;
      })(),
      Ac = (function () {
        var a = 0,
          c = 0,
          e = 0,
          d = [0, 0],
          n = new Sb(),
          k = new mc(),
          B = new mc(),
          l = new Oa(),
          u = new Oa(),
          p = new Rb(),
          G = 0,
          H = new Float32Array(20);
        H[0] = 3;
        var E = !1,
          r = { data: !1 },
          C = {
            m: function () {
              "undefined" === typeof T && (self.Ko = { Gb: !0 });
              T.Gb && C.Tf([6]);
            },
            Km: function (g) {
              switch (g.data[0]) {
                case 2:
                  C.eg(g.data);
                  break;
                case 5:
                  G = g.data[1];
              }
            },
            Tf: function (g) {
              T.Gb ? postMessage(g) : ((r.data = g), E.onmessage(r));
            },
            eg: function (g) {
              a = g[1];
              c = g[2];
              e = g[3];
              d[0] = g[4];
              d[1] = g[5];
              l.set(d[0], d[1], -e);
              p.set(c, a, 0, "XYZ");
              if (!1 === p instanceof Rb)
                throw Error(
                  "JETHREE.Quaternion: .setFromEuler() now expects a Euler rotation rather than a Vector3 and order."
                );
              g = Math.cos(p.B / 2);
              var f = Math.cos(p.C / 2),
                y = Math.cos(p.D / 2),
                J = Math.sin(p.B / 2),
                x = Math.sin(p.C / 2),
                q = Math.sin(p.D / 2),
                h = p.order;
              "XYZ" === h
                ? ((k.B = J * f * y + g * x * q),
                  (k.C = g * x * y - J * f * q),
                  (k.D = g * f * q + J * x * y),
                  (k.O = g * f * y - J * x * q))
                : "YXZ" === h
                ? ((k.B = J * f * y + g * x * q),
                  (k.C = g * x * y - J * f * q),
                  (k.D = g * f * q - J * x * y),
                  (k.O = g * f * y + J * x * q))
                : "ZXY" === h
                ? ((k.B = J * f * y - g * x * q),
                  (k.C = g * x * y + J * f * q),
                  (k.D = g * f * q + J * x * y),
                  (k.O = g * f * y - J * x * q))
                : "ZYX" === h
                ? ((k.B = J * f * y - g * x * q),
                  (k.C = g * x * y + J * f * q),
                  (k.D = g * f * q - J * x * y),
                  (k.O = g * f * y + J * x * q))
                : "YZX" === h
                ? ((k.B = J * f * y + g * x * q),
                  (k.C = g * x * y + J * f * q),
                  (k.D = g * f * q - J * x * y),
                  (k.O = g * f * y - J * x * q))
                : "XZY" === h &&
                  ((k.B = J * f * y - g * x * q),
                  (k.C = g * x * y - J * f * q),
                  (k.D = g * f * q + J * x * y),
                  (k.O = g * f * y + J * x * q));
              l.y -= G;
              g = n.elements;
              q = k.x;
              var L = k.y,
                O = k.z;
              J = k.w;
              var v = q + q,
                m = L + L;
              x = O + O;
              f = q * v;
              y = q * m;
              q *= x;
              h = L * m;
              L *= x;
              O *= x;
              v *= J;
              m *= J;
              J *= x;
              g[0] = 1 - (h + O);
              g[4] = y - J;
              g[8] = q + m;
              g[1] = y + J;
              g[5] = 1 - (f + O);
              g[9] = L - v;
              g[2] = q - m;
              g[6] = L + v;
              g[10] = 1 - (f + h);
              g[3] = 0;
              g[7] = 0;
              g[11] = 0;
              g[12] = 0;
              g[13] = 0;
              g[14] = 0;
              g[15] = 1;
              n.setPosition(l);
              B.J(k).inverse();
              g = u.J(l);
              L = g.x;
              v = g.y;
              O = g.z;
              f = B.x;
              y = B.y;
              J = B.z;
              x = B.w;
              q = x * L + y * O - J * v;
              h = x * v + J * L - f * O;
              m = x * O + f * v - y * L;
              L = -f * L - y * v - J * O;
              g.x = q * x + L * -f + h * -J - m * -y;
              g.y = h * x + L * -y + m * -f - q * -J;
              g.z = m * x + L * -J + q * -y - h * -f;
              for (g = 1; 17 > g; ++g) H[g] = n.elements[g - 1];
              H[17] = u.x;
              H[18] = u.y;
              H[19] = u.z;
              C.Tf(H);
            },
            En: function (g) {
              E = g;
              C.Tf([6]);
            },
          };
        return C;
      })();
    Ac.m();
    var zc = (function () {
        function a(B) {
          var l = B.split(":").shift();
          return "data" === l || "blob" === l
            ? B
            : ("undefined" !== typeof N && N.aa ? N : T).aa + T.Em + B;
        }
        function c(B, l) {
          return Math.min(l + B + l * B, 1);
        }
        var e = !1,
          d = null,
          n = 1,
          k = {
            diffuseTexture: null,
            normalTexture: null,
            paramsTexture: null,
            colorTextureUsage: 0,
            metalness: 0.5,
            roughness: 0.5,
            fresnelMin: 0,
            fresnelMax: 1,
            fresnelPow: 5,
            alpha: 1,
            diffuseColor: [255, 255, 255],
            paramsMapMask: [0, 0, 0, 0],
            R: null,
          };
        return {
          m: function () {
            d = Z.instance({
              width: 1,
              height: 1,
              isMipmap: !1,
              F: 4,
              array: new Uint8Array([255, 255, 255, 255]),
              yc: !1,
            });
          },
          Pe: function () {
            e = !0;
            n = 2;
          },
          instance: function (B) {
            function l(t) {
              function M() {
                ++K === I && t && t();
              }
              var I = 1,
                K = 0;
              (p = r.normalTexture && da.Ck() ? !0 : !1) &&
                !f.Ka &&
                (++I,
                (f.Ka = Z.instance({
                  url: a(r.normalTexture),
                  isLinear: !0,
                  isMipmap: !0,
                  Qh: da.qm(),
                  isPot: !0,
                  F: 3,
                  R: M,
                })));
              (G = r.diffuseTexture && "" !== r.diffuseTexture ? !0 : !1) &&
              !f.ga_
                ? (++I,
                  (f.ga_ = Z.instance({
                    url: a(r.diffuseTexture),
                    isMipmap: !0,
                    isLinear: !0,
                    isPot: !0,
                    Qh: !0,
                    yc: !1,
                    Mb: !1,
                    hm: !1,
                    F: 4,
                    R: M,
                  })),
                  (g = "s97"))
                : f.ga_ || ((g = "s98"), (f.ga_ = d));
              C = [
                r.diffuseColor[0] / 255,
                r.diffuseColor[1] / 255,
                r.diffuseColor[2] / 255,
              ];
              (y = r.paramsTexture ? !0 : !1) &&
                !f.pb &&
                (r.paramsTexture === r.diffuseTexture
                  ? (f.pb = f.ga_)
                  : (++I,
                    (f.pb = Z.instance({
                      url: a(r.paramsTexture),
                      isMipmap: !0,
                      isLinear: !0,
                      isPot: !0,
                      Qh: !0,
                      yc: !1,
                      Mb: !1,
                      hm: !1,
                      F: 4,
                      R: M,
                    }))));
              M();
            }
            function u(t) {
              "number" === typeof r.alpha
                ? ((H[0] = r.alpha), (H[1] = 0), (H[2] = 0), (H[3] = 0))
                : ((H[0] = r.alpha[0]),
                  (H[1] = r.alpha[1] - r.alpha[0]),
                  (H[2] = r.alpha[2]),
                  (H[3] = r.alpha[3]));
              var M = 1 <= r.fresnelPow ? r.fresnelMin : r.fresnelMax;
              E[0] = c(H[0], M);
              E[1] = c(H[1], M);
              E[2] = H[2];
              E[3] = H[3];
              J = {
                ti: r.fresnelMax,
                fi: [r.fresnelMin, r.roughness, r.fresnelPow / 15, r.metalness],
                ii: r.paramsMapMask,
              };
              t = r.R ? r.R.bind(null, t) : null;
              l(t);
              p || y || G
                ? p || y
                  ? p && !y
                    ? ((x = "s92NormalMap"), (q = "s92NNGLtextureNormalMap"))
                    : !p && y
                    ? ((x = "s92ParamsMap"), (q = "s92NNGLtextureParamsMap"))
                    : ((x = "s92NormalParamsMap"),
                      (q = "s92NNGLtextureNormalParamsMap"))
                  : ((x = "s92"), (q = "s92NNGLtexture"))
                : ((x = "s92color"), (q = "s92NNGLcolor"));
              h = p ? "s100" : "s99";
              L = p ? "s94" : "s104";
              O = y ? "s102" : "s101";
              v = y ? "s95" : "s105";
            }
            var p,
              G,
              H = [1, 0, 0, 0],
              E = [0, 0, 0, 0],
              r = Object.assign({}, k, B),
              C = null,
              g = null,
              f = { ga_: null, Ka: null, pb: null },
              y = (p = G = !1),
              J = null,
              x = null,
              q = null,
              h = null,
              L = null,
              O = null,
              v = null,
              m = {
                update: function (t) {
                  Object.assign(r, t);
                  u();
                },
                zc: function () {
                  return p;
                },
                rm: function () {
                  return 0.99 > H[0];
                },
                Ll: function () {
                  return L;
                },
                Kl: function () {
                  return h;
                },
                Hl: function () {
                  return v;
                },
                Gl: function () {
                  return O;
                },
                Jl: function () {
                  return x;
                },
                Il: function () {
                  return q;
                },
                dd: function () {
                  p && f.Ka.g(0);
                },
                $k: function (t) {
                  e && F.set(g);
                  t ? F.Ma() : F.Va();
                  G && F.Gc();
                  m.cd();
                },
                cd: function () {
                  G && (F.G("u67", r.colorTextureUsage), f.ga_.g(0));
                  F.ig("u140", C);
                },
                kh: function () {
                  y && (f.pb.g(0), F.ya("u69", J.ii), F.Gc());
                  F.ya("u105", J.fi);
                  F.G("u141", J.ti);
                },
                hh: function (t) {
                  y && !p
                    ? f.pb.g(n)
                    : p && (G || d.g(0), f.Ka.g(n), y && f.pb.g(n + 1));
                  y && F.ya("u69", J.ii);
                  G || p ? F.zn() : t ? F.An() : F.Bn();
                  m.cd();
                  F.ya("u7", H);
                  F.ya("u105", J.fi);
                  F.G("u141", J.ti);
                },
                Xk: function () {
                  F.ya("u7", H);
                },
                Yk: function () {
                  F.ya("u7", E);
                },
                K: function () {
                  G && f.ga_.remove();
                  p && f.Ka.remove();
                  y && r.paramsTexture !== r.diffuseTexture && f.pb.remove();
                },
              };
            u(m);
            return m;
          },
        };
      })(),
      yb = (function () {
        var a = 0,
          c = 0,
          e = 0,
          d = 0,
          n = 0,
          k = 0,
          B = T.hk,
          l = T.gk,
          u = T.ik,
          p = 0,
          G = 0,
          H = null,
          E = null,
          r = 0,
          C = 0,
          g = 0,
          f = 0,
          y = 0,
          J = null,
          x = 0,
          q = 0,
          h = 0,
          L = Date.now(),
          O = null,
          v = !1,
          m = !1,
          t = !1,
          M = 1,
          I = !1,
          K = {
            m: function () {
              a = T.ck[da.T()];
              c = T.bk[da.T()];
              e = T.ak[da.T()];
              q = T.dk[da.T()];
              d = T.Vj[da.T()];
              n = T.Zj[da.T()];
              g = T.$j[da.T()];
              f = da.L();
              y = da.Y();
              p = Math.round(f * a);
              G = Math.round(y * a);
              E = va.instance({ width: p, height: G, wc: !1 });
              H = Z.instance({ width: p, height: G, isPot: !1, isLinear: !0 });
              J = Z.instance({
                width: p,
                height: G,
                isPot: !1,
                isLinear: !0,
                F: 1,
              });
              v = !0;
            },
            resize: function (P, ba, ja) {
              M = ja;
              f = P;
              y = ba;
              p = Math.round(P * a);
              G = Math.round(ba * a);
              E.resize(p, G);
              m = !0;
            },
            V: function () {
              var P = Math.exp(-(Date.now() - L) / q);
              x = t ? h + (1 - P) * (1 - h) : h * P;
              r = c + x * (e - c);
              C = d + (1 - x) * (1 - d);
              k = n + (1 - x) * (1 - n);
              Z.$(5);
              if (m && v)
                Z.$(6),
                  J.resize(p, G),
                  F.set("s0"),
                  F.Nd("u1", 6),
                  E.bind(!1, !0),
                  J.o(),
                  E.ye(),
                  H.g(6),
                  Y.l(!0, !0),
                  H.resize(p, G),
                  H.o(),
                  J.g(6),
                  Y.l(!1, !1),
                  F.Nd("u1", 0),
                  (m = !1);
              else {
                b.enable(b.BLEND);
                b.blendFunc(b.CONSTANT_ALPHA, b.ONE_MINUS_SRC_ALPHA);
                P = r / g;
                b.blendColor(P, P, P, P);
                b.colorMask(!0, !1, !1, !0);
                F.set("s84");
                kb.Ne();
                F.G("u121", r);
                q && (F.G("u122", C), F.G("u114", k));
                var ba = M * (B + Math.pow(Math.random(), u) * (l - B));
                F.N("u8", ba / f, ba / y);
                E.Qg();
                E.Ic();
                H.o();
                ba = 2 * Math.PI * Math.random();
                for (var ja = !0, U = 0; U < g; ++U)
                  1 === U && (b.blendFunc(b.SRC_ALPHA, b.ONE), F.G("u121", P)),
                    F.G("u120", ba + (U / g) * (Math.PI / 2)),
                    F.N(
                      "u119",
                      (Math.random() - 0.5) / f,
                      (Math.random() - 0.5) / y
                    ),
                    Y.l(ja, ja),
                    (ja = !1);
                b.disable(b.BLEND);
                F.set("s85");
                F.N("u8", 1 / p, 1 / G);
                J.o();
                H.g(7);
                Y.l(!1, !1);
                b.colorMask(!0, !0, !0, !0);
              }
            },
            g: function (P) {
              J.g(P);
            },
            enable: function () {
              I = !0;
            },
            Tm: function () {
              if (t || !I) return !1;
              O && clearTimeout(O);
              K.Ld();
              O = setTimeout(K.tj, 400);
            },
            Ld: function () {
              O && (clearTimeout(O), (O = !1));
              !t &&
                I &&
                (window.Ij.disable(), (t = !0), (L = Date.now()), (h = x));
            },
            tj: function () {
              t &&
                I &&
                (O && (clearTimeout(O), (O = null)),
                window.Ij.enable(),
                (t = !1),
                (L = Date.now()),
                (h = x));
            },
            K: function () {
              H.remove();
              J.remove();
              E.remove();
            },
          };
        K.Tm();
        return K;
      })(),
      kd = {
        instance: function (a) {
          var c = a.ka.L(),
            e = a.km ? !0 : !1,
            d = e ? "s67" : "s12",
            n = Z.instance({
              isFloat: a.ka.Yh() && xa.ea() && !e,
              S: a.ka.Zh() && !e,
              isLinear: !0,
              isMipmap: !1,
              isPot: !1,
              width: c,
              height: c,
              F: e ? 4 : 3,
            }),
            k = Z.instance({
              isFloat: a.ka.Yh() && xa.ea(),
              S: a.ka.Zh(),
              isPot: !0,
              width: 1,
              height: c / 2,
              F: 3,
            });
          k.o();
          F.set("s78");
          a.ka.g(0);
          Y.l(!0, !0);
          var B = Math.round(Math.log(c) / Math.log(2));
          n.en = function () {
            n.o();
            F.set(d);
            F.G("u85", T.Vb);
            a.ka.g(0);
            k.g(1);
            for (var l = 0, u = 0; u <= B; ++u) {
              var p = Math.pow(2, B - u),
                G = p / 2;
              b.viewport(0, l, c, G);
              F.N("u83", c / p, 1);
              F.G("u84", Math.min(6 / G, 0.6));
              l += p / 2;
              Y.l(0 === u, 0 === u);
            }
          };
          n.hn = n.remove;
          n.remove = function () {
            n.hn();
            k.remove();
          };
          return n;
        },
      };
    ta.fb = (function () {
      var a = {
          Jd: 45,
          Zf: 1,
          Wb: "../../images/debug/picsou.png",
          $f: 0.8,
          Af: 3.14 / 6,
          Bf: 0.314,
          Cf: 4,
          yf: 0.5,
          zf: -0.25,
          vm: 1,
          ua: 256,
          xf: 0.15,
        },
        c = { Hb: null, hd: null, screen: null },
        e = !1,
        d = !1,
        n = -1,
        k = null,
        B = null,
        l = null,
        u = Math.PI / 180,
        p = [1, 1],
        G = {
          m: function (H) {
            n = H.width;
            H = {
              isFloat: xa.ea(),
              S: !0,
              isPot: !1,
              isMipmap: !1,
              isLinear: !1,
              isMirrorY: !0,
              width: n,
              height: n / 2,
              F: 3,
            };
            c.Hb = Z.instance(H);
            c.hd = Z.instance(H);
            F.j("s106", [{ type: "1i", name: "u148", value: 0 }]);
            F.j("s107", [{ type: "1i", name: "u153", value: 0 }]);
            G.oo();
          },
          oo: function () {
            F.j("s107", [
              { type: "1f", name: "u154", value: a.Af },
              { type: "1f", name: "u155", value: a.Bf },
              { type: "1f", name: "u156", value: a.Cf },
              { type: "1f", name: "u157", value: a.yf },
              { type: "1f", name: "u158", value: a.zf },
            ]);
          },
          Hp: function () {
            return d;
          },
          ta: function (H) {
            k = H;
          },
          Ec: function () {
            B =
              "uniform sampler2D u148;uniform vec2 u149,u150,u4;uniform int u151;uniform float u152,u134;varying vec2 vv0;const float h=3.141593;const vec2 i=vec2(.5,.5);const float e=1.2;const vec3 g=vec3(1.,1.,1.);void main(){vec2 c=vec2(vv0.x*2.,-vv0.y+.5)*h,a=i+u4*(c-u149)/u150;float b=1.;if(u151==0){if(a.x<0.||a.x>1.||a.y<0.||a.y>1.)discard;}else b*=smoothstep(-e,0.,a.x),b*=1.-smoothstep(1.,1.+e,a.x),b*=smoothstep(-e,0.,a.y),b*=1.-smoothstep(1.,1.+e,a.y);vec3 d=mix(u152*g,texture2D(u148,a).rgb*u134,b*g);gl_FragColor=vec4(d,1.);}";
            l =
              "uniform sampler2D u153;uniform float u154,u155,u156,u157,u158;varying vec2 vv0;const float f=3.141593;const vec2 o=vec2(.5,.5);const vec3 h=vec3(1.,1.,1.);void main(){float i=(vv0.x*2.-1.)*f,c=(-vv0.y+.5)*f;vec4 a=texture2D(u153,vec2(.5,.5));float d=a.r,j=u156*a.g,k=u157*(a.b+u158),b=a.a,g=asin(cos(b)*cos(d)),l=atan(cos(b)*sin(d),-sin(b)),m=acos(sin(c)*sin(g)+cos(c)*cos(g)*cos(i-l)),n=1.-smoothstep(u154-u155,u154+u155,m);gl_FragColor=vec4(h*(max(k,0.)+max(j,0.)*n),1.);}";
            F.pa("s106", {
              name: "_",
              h: B,
              i: "u148 u149 u151 u150 u152 u134 u4".split(" "),
              precision: "highp",
            });
            F.pa("s107", {
              name: "_",
              h: l,
              i: "u153 u154 u155 u156 u157 u158".split(" "),
              precision: "highp",
            });
          },
          ng: function (H, E, r, C, g, f, y) {
            F.N("u149", E, r);
            F.Nd("u151", C ? 1 : 0);
            F.N("u150", g, g / f);
            F.bj("u4", y);
            H.g(0);
            Y.l(!1, !1);
          },
          Mj: function (H) {
            b.viewport(0, 0, a.ua, a.ua / 2);
            F.set("s107");
            H.g(0);
            Y.l(!1, !1);
          },
          Ql: function () {
            return c.Hb;
          },
          xk: function (H) {
            G.m({ width: a.ua });
            G.wj(H, !1, 1);
            d = !0;
          },
          wk: function () {
            (e && c.screen.Rl() === a.Wb) ||
              ((e = !1),
              (c.screen = Z.instance({
                url: a.Wb,
                isFloat: !1,
                R: function () {
                  e = !0;
                },
              })));
          },
          eg: function (H) {
            Object.assign(a, H);
          },
          wj: function (H, E, r) {
            var C = a.ua;
            va.fa();
            c.hd.M();
            F.set("s0");
            c.Hb.g(0);
            Y.l(!0, !0);
            c.Hb.o();
            F.set("s106");
            F.G("u152", a.xf);
            F.G("u134", a.vm);
            G.ng(H, Math.PI, 0, !0, 90 * u, H.L() / H.Y(), p);
            e &&
              (F.G("u134", a.$f),
              b.viewport(0, 0, C / 2, C / 2),
              G.ng(c.screen, 0, 0, !1, 2 * a.Jd * u, 2 * a.Zf, p),
              b.viewport(C / 2, 0, C / 2, C / 2),
              G.ng(c.screen, 2 * Math.PI, 0, !1, 2 * a.Jd * u, 2 * a.Zf, p));
            b.enable(b.BLEND);
            b.blendFunc(b.ONE, b.ONE);
            E && G.Mj(E);
            F.set("s0");
            b.blendColor(0, 0, 0, 1 - r);
            b.blendFunc(b.CONSTANT_ALPHA, b.ONE_MINUS_CONSTANT_ALPHA);
            c.hd.g(0);
            Y.l(!1, !1);
            b.disable(b.BLEND);
            k.Xi(c.Hb);
          },
          v: function () {
            Object.assign(c, { Hb: null, hd: null, screen: null });
            d = e = !1;
            n = -1;
            k = null;
          },
        };
      return G;
    })();
    ta.gb = (function () {
      var a = !1,
        c = !0,
        e = !1,
        d = !1,
        n = {
          Ec: function () {
            da.Z() &&
              (F.pa("s108", {
                name: "_",
                s: "attribute vec3 a0;uniform sampler2D u39;uniform vec2 u40;uniform vec3 u136;const float l=1.,m=0.,n=0.,E=1.;const vec2 e=vec2(1.,1.);const vec3 o=vec3(1.,1.,1.);const vec2 F=vec2(-1.,1.),p=vec2(.16,.5),q=vec2(.5,.5),r=vec2(.84,.5);uniform mat4 u70;uniform vec3 u72,u76,u77,u78;uniform float u71,u79,u80,u73,u74,u75,u81;mat3 s(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,p);vec2 f=u79*e;vec3 c=u79*o;vec2 t=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,q).rgb+vec3(u73,0.,0.),u76,c);float u=mix(texture2D(u39,r).r,0.,u79);a.z+=u;mat3 v=s(a);vec3 w=mix(u136,u77,c);float x=mix(l,u80,u79);vec3 b=mix(u72,u78,c);b.x+=u71*sin(a.y);float h=cos(a.z),i=sin(a.z);mat2 y=mat2(h,i,-i,h);b.xy=y*b.xy;float z=mix(u75,1.,u79);vec2 j=u74/t;vec3 k=a0;float A=max(0.,-a0.z-m)*n;k.x+=A*sign(a0.x)*(1.-u79);vec3 B=v*(k+w)*x+b;vec2 C=j*z;vec3 D=vec3(g*C,-j)+B*vec3(1.,-1.,-1.);gl_Position=u70*(vec4(u81*e,e)*vec4(D,1.));}",
                h: "void main(){gl_FragData[0]=vec4(0.,0.,0.,0.),gl_FragData[1]=vec4(0.,0.,1.,1.),gl_FragData[2]=vec4(1.,0.,0.,0.),gl_FragData[3]=vec4(0.,.5,1.,0.);}",
                i: ["u39", "u40", "u72", "u136"].concat(F.Ze(), F.$e()),
                I: ["a0"],
                P: [3],
                ca: !0,
              }),
              (a = !0));
          },
          m: function (k) {
            a &&
              F.j(
                "s108",
                [
                  { type: "1i", name: "u39", value: 1 },
                  { type: "3f", name: "u72", value: k.Ba },
                  { type: "1f", name: "u73", value: 0 },
                  { type: "1f", name: "u81", value: 1 },
                ].concat(k.zg)
              );
          },
          Ya: function (k) {
            d = k;
            e && n.Kh();
          },
          Xa: function (k) {
            e = k;
            d && n.Kh();
          },
          Kh: function () {
            da.Z() &&
              (F.j("s108", [
                {
                  type: "3f",
                  name: "u136",
                  value: [e[0] * d, e[1] * d, e[2] * d],
                },
              ]),
              F.H());
          },
          am: function (k) {
            for (
              var B = k.width / 2,
                l = k.height / 2,
                u = k.depth,
                p = k.jl,
                G = k.height / 4,
                H = k.Mk,
                E = 2 * H + 4,
                r = [],
                C = [],
                g = -B + k.Oa,
                f = -p - k.Oa,
                y = B - k.Oa,
                J = -p - k.Oa,
                x = 0;
              x < E;
              ++x
            ) {
              var q = 0,
                h = 0;
              0 === x
                ? ((q = -B), (h = -p - u))
                : 1 <= x && x <= 1 + H
                ? ((h = (((x - 1) / H) * Math.PI) / 2),
                  (q = g - Math.cos(h) * k.Oa),
                  (h = f + Math.sin(h) * k.Oa))
                : x >= 2 + H && x <= 2 + 2 * H
                ? ((h = (((x - 2 - H) / H) * Math.PI) / 2),
                  (q = y + Math.sin(h) * k.Oa),
                  (h = J + Math.cos(h) * k.Oa))
                : x === E - 1 && ((q = B), (h = -p - u));
              r.push(q, l + G, h, q, -l + G, h);
              0 !== x &&
                C.push(
                  2 * x,
                  2 * x - 2,
                  2 * x - 1,
                  2 * x,
                  2 * x - 1,
                  2 * x + 1
                );
            }
            return n.instance({ ha: r, U: C });
          },
          toggle: function (k) {
            c = k;
          },
          instance: function (k) {
            var B = Y.instance({ ha: k.ha, U: k.U });
            return {
              V: function () {
                a && c && (F.set("s108"), B.bind(!0), B.V());
              },
            };
          },
        };
      return n;
    })();
    ta.la = (function () {
      var a = {
        ef: -87,
        Vl: [85, 95],
        Jh: [90, 90],
        Ih: [85, 70],
        Yc: 24,
        Nk: 12,
        Ok: 2,
        Uf: [-80, 10],
        Hh: [40, 140],
        sd: [1, 8],
        Ul: 80,
        pi: [-120, -10],
        Jm: 2,
        Pd: [0, -15],
        ge: 1024,
        bb: 256,
        Bd: 4,
        Yn: [6, 30],
        oi: 1.2,
      };
      a.zi = a.Uf;
      var c = !1,
        e = !1,
        d = !1,
        n = null,
        k = null,
        B = null,
        l = null,
        u = null,
        p = null,
        G = !1,
        H = !1,
        E = null,
        r = null,
        C = null,
        g = null,
        f = 0.5,
        y = [{ type: "1f", name: "u160", value: 1 }],
        J = null,
        x = null,
        q = null,
        h = null,
        L = null,
        O = {
          Ml: function () {
            return {
              name: "_",
              s: "attribute vec3 a0,a2;attribute vec2 a1;varying vec2 vv0;varying float vv1;uniform sampler2D u39;uniform vec2 u40;uniform float u137;uniform vec3 u136;const float o=0.,p=0.;const vec2 e=vec2(1.,1.);const vec3 q=vec3(1.,1.,1.);const vec2 G=vec2(-1.,1.),r=vec2(.16,.5),s=vec2(.5,.5),t=vec2(.84,.5);uniform mat4 u70;uniform vec3 u72,u76,u77,u78;uniform float u71,u79,u80,u73,u74,u75,u81;mat3 u(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,r);vec2 f=u79*e;vec3 c=u79*q;vec2 v=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,s).rgb+vec3(u73,0.,0.),u76,c);float w=mix(texture2D(u39,t).r,0.,u79);a.z+=w;mat3 h=u(a);vec3 x=mix(u136,u77,c);float y=mix(u137,u80,u79);vec3 b=mix(u72,u78,c);b.x+=u71*sin(a.y);float i=cos(a.z),j=sin(a.z);mat2 z=mat2(i,j,-j,i);b.xy=z*b.xy;float A=mix(u75,1.,u79);vec2 k=u74/v;vec3 l=a0;float B=max(0.,-a0.z-o)*p;l.x+=B*sign(a0.x)*(1.-u79);vec3 C=h*(l+x)*y+b;vec2 D=k*A;vec3 E=vec3(g*D,-k)+C*vec3(1.,-1.,-1.);gl_Position=u70*(vec4(u81*e,e)*vec4(E,1.)),vv0=a1,gl_Position*=vec4(-1.,1.,1.,1.);vec3 F=h*a2;vv1=-F.z;}",
              h: "uniform sampler2D u167,u153;uniform vec2 u83,u168;uniform float u169,u160;varying vec2 vv0;varying float vv1;void main(){vec2 b=u168*u169+u83*vv0;vec4 a=u160*texture2D(u167,b);a.r*=step(0.,vv0.y),gl_FragColor=vec4(0.,0.,0.,a.r*vv1);}",
              i: "u39 u167 u153 u40 u72 u169 u168 u137 u136 u83 u160"
                .split(" ")
                .concat(F.Ze())
                .concat(F.$e()),
              I: ["a0", "a2", "a1"],
              P: [3, 3, 2],
              precision: "lowp",
            };
          },
          Ec: function () {
            F.pa("s109", {
              name: "_",
              s: "attribute vec3 a0;uniform vec3 u136;uniform vec2 u161,u162;uniform float u137,u163,u164,u165;varying float vv0,vv1;void main(){vec3 a=(a0+u136)*u137;float b=atan(a.x,a.z-u163),d=2.*(a.y-u164)/(u165-u164)-1.;vv0=a0.y;float g=1.-u161.x*u161.x/(u161.y*u161.y),c=u161.x/sqrt(1.-g*pow(cos(b),2.));vec3 h=vec3(c*sin(b),a.y,c*cos(b)+u163);vv1=smoothstep(u162.x,u162.y,length(h-a)),gl_Position=vec4(b,d,0.,1.);}",
              h: "uniform float u166;uniform vec4 u7;varying float vv0,vv1;void main(){float a=u7.x+u7.y*smoothstep(-u7.w,-u7.z,vv0),b=min(a,1.)*u166;gl_FragColor=vec4(b,vv1,1.,1.);}",
              i: "u137 u136 u161 u162 u163 u164 u165 u7 u166".split(" "),
              I: ["a0"],
              P: [3],
              precision: "highp",
            });
            F.pa("s110", O.Ml());
            F.pa("s111", {
              name: "_",
              h: "uniform sampler2D u1;uniform vec2 u8;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0),b=texture2D(u1,vv0-3.*u8),c=texture2D(u1,vv0-2.*u8),d=texture2D(u1,vv0-u8),f=texture2D(u1,vv0+u8),g=texture2D(u1,vv0+2.*u8),h=texture2D(u1,vv0+3.*u8);float j=.031496*b.r+.110236*c.r+.220472*d.r+.275591*a.r+.220472*f.r+.110236*g.r+.031496*h.r;vec2 i=b.gb*b.b+c.gb*c.b+d.gb*d.b+a.gb*a.b+f.gb*f.b+g.gb*g.b+h.gb*h.b;i/=b.b+c.b+d.b+a.b+f.b+g.b+h.b,gl_FragColor=vec4(mix(j,a.r,1.-i.x),i,1);}",
              i: ["u1", "u8"],
              precision: "lowp",
            });
            c = !0;
          },
          m: function (v) {
            if (c) {
              if (void 0 === v.bc || !v.bc) return !1;
              if (e) O.Si(v);
              else {
                l = Z.instance({
                  isFloat: !1,
                  isPot: !1,
                  isMipmap: !1,
                  isLinear: !0,
                  width: a.ge,
                  height: a.ge / 4,
                  F: 4,
                });
                var m = a.bb / 4,
                  t = {
                    isFloat: !1,
                    isPot: !1,
                    isMipmap: !1,
                    isLinear: !1,
                    width: a.bb,
                    height: m,
                    F: 4,
                  };
                B = Z.instance(t);
                p = Z.instance(t);
                u = Z.instance({
                  isFloat: !1,
                  isPot: !1,
                  isMipmap: !1,
                  isLinear: !0,
                  width: a.bb,
                  height: m * a.Bd,
                  F: 4,
                });
                m = 0.5 - 0.5 / v.cc[1];
                t = 0.5 + 0.5 / v.cc[1];
                for (
                  var M = a.Nk + 1,
                    I = [],
                    K = [],
                    P = new Float32Array(16 * a.Yc),
                    ba = new Uint16Array(6 * (a.Yc - 1)),
                    ja = 0,
                    U = 0,
                    w = 0,
                    z = 0;
                  z < a.Yc;
                  ++z
                ) {
                  var D = (2 * z) / (a.Yc - 1) - 1;
                  D = Math.sign(D) * Math.pow(Math.abs(D), a.Ok);
                  D = (Math.PI * (D + 1)) / 2 - Math.PI / 2;
                  var S = Math.sin(D),
                    ea = Math.cos(D),
                    X = Math.sin(D * a.oi),
                    aa = Math.cos(D * a.oi),
                    oa = D / (Math.PI * v.cc[0]) + 0.5,
                    Ma = a.Ih[0] * S,
                    Da = a.zi[0],
                    ka = a.Ih[1] * ea + a.ef,
                    la = oa,
                    Ba = m,
                    V = a.Jh[0] * S,
                    ha = a.zi[1],
                    ra = a.Jh[1] * ea + a.ef,
                    Ga = t,
                    Ia = 16 * z;
                  P[Ia] = V;
                  P[Ia + 1] = ha;
                  P[Ia + 2] = ra;
                  P[Ia + 3] = X;
                  P[Ia + 4] = 0;
                  P[Ia + 5] = aa;
                  P[Ia + 6] = oa;
                  P[Ia + 7] = Ga;
                  P[Ia + 8] = Ma;
                  P[Ia + 9] = Da;
                  P[Ia + 10] = ka;
                  P[Ia + 11] = X;
                  P[Ia + 12] = 0;
                  P[Ia + 13] = aa;
                  P[Ia + 14] = la;
                  P[Ia + 15] = Ba;
                  0 !== z &&
                    ((la = 2 * z),
                    (Ba = 6 * (z - 1)),
                    (ba[Ba] = la),
                    (ba[Ba + 1] = la - 1),
                    (ba[Ba + 2] = la - 2),
                    (ba[Ba + 3] = la),
                    (ba[Ba + 4] = la + 1),
                    (ba[Ba + 5] = la - 1));
                  Ba = Math.pow(
                    0.5 *
                      (1 +
                        Math.cos(
                          Math.min(
                            Math.max((Math.PI / a.Hh[0]) * Ma, -Math.PI),
                            Math.PI
                          )
                        )),
                    a.Jm
                  );
                  Da -= a.Ul * Ba;
                  la = a.Hh[1] * Ba;
                  Ma -= S * a.sd[0];
                  ka -= ea * a.sd[1];
                  V -= S * a.sd[0];
                  ra -= ea * a.sd[1];
                  S = 0.001 > Ba ? 2 : M;
                  for (ea = 0; ea < S; ++ea)
                    (Ba = ea / (S - 1)),
                      (oa = Da * (1 - Ba) + ha * Ba),
                      (Ga = a.pi[0]),
                      (Ga = Math.min(
                        Math.max((oa - Ga) / (a.pi[1] - Ga), 0),
                        1
                      )),
                      (Ga = Ga * Ga * (3 - 2 * Ga)),
                      I.push(
                        Ma * (1 - Ba) + V * Ba,
                        oa,
                        (ka +
                          la * Math.exp(400 * -Math.abs(D) * Math.pow(Ba, 4))) *
                          (1 - Ga) +
                          ra * Ga,
                        X,
                        0,
                        aa,
                        0,
                        0
                      );
                  D = 0 === z ? 0 : 2 < S && 2 < U ? S - 1 : 1;
                  for (X = 1; X <= D; ++X)
                    (aa = S > U ? S - 2 : 0),
                      K.push(
                        ja + X + aa,
                        ja + X - 1,
                        w + X - 1,
                        w + X - 1,
                        w + X + (S < U ? U - 2 : 0),
                        ja + X + aa
                      );
                  U = S;
                  w = ja;
                  ja += S;
                }
                h = Y.instance({
                  ha: new Float32Array(I),
                  U: new Uint16Array(K),
                });
                L = Y.instance({ ha: P, U: ba });
                O.Si(v);
                F.j("s111", [{ type: "1i", name: "u1", value: 0 }]);
                e = !0;
              }
            }
          },
          Si: function (v) {
            f = v.Tn;
            g = v.Qd;
            J = [
              { type: "1i", name: "u39", value: 1 },
              { type: "1i", name: "u167", value: 0 },
              { type: "1i", name: "u153", value: 2 },
              {
                type: "3f",
                name: "u72",
                value: [v.Ba[0], v.Ba[1] - a.Pd[0], v.Ba[2] + a.Pd[1]],
              },
              { type: "1f", name: "u169", value: v.Un },
              { type: "2f", name: "u83", value: [1, 1 / a.Bd] },
              { type: "2f", name: "u168", value: [0, 1 / a.Bd] },
              { type: "1f", name: "u160", value: 1 },
            ].concat(v.zg, v.sj);
            F.j("s110", J);
          },
          Yb: function (v) {
            n = v;
          },
          Xb: function (v) {
            x = v;
            x.Db(O.rc);
          },
          $h: function () {
            return d && null !== x && null !== q;
          },
          rc: function () {
            if (!(d || (H && G)) || null === x || null === q) return !1;
            b.viewport(0, 0, a.ge, a.ge / 4);
            va.fa();
            l.o();
            b.clearColor(0, 0, 0, 0);
            b.clear(b.COLOR_BUFFER_BIT);
            F.j("s109", [
              { type: "1f", name: "u163", value: a.ef },
              { type: "1f", name: "u164", value: a.Uf[0] },
              { type: "1f", name: "u165", value: a.Uf[1] },
              {
                type: "3f",
                name: "u136",
                value: [E[0] + r[0], E[1] + r[1], E[2] + r[2]],
              },
              { type: "1f", name: "u166", value: f },
              { type: "2f", name: "u161", value: a.Vl },
              { type: "2f", name: "u162", value: a.Yn },
            ]);
            x.il();
            F.set("s1");
            var v = a.bb / 4;
            b.viewport(0, 0, a.bb, v);
            B.o();
            l.g(0);
            l.ld();
            Y.l(!0, !0);
            for (var m = 0; m < a.Bd; ++m)
              F.set("s111"),
                0 !== m && b.viewport(0, 0, a.bb, v),
                p.o(),
                B.g(0),
                F.N("u8", 1 / a.bb, 0),
                Y.l(!1, !1),
                B.o(),
                p.g(0),
                F.N("u8", 0, 1 / v),
                Y.l(!1, !1),
                a.Pk && b.colorMask(0 === m, 1 === m, 2 === m, !0),
                F.set("s1"),
                u.o(),
                B.g(0),
                b.viewport(0, m * v, a.bb, v),
                Y.l(!1, !1),
                a.Pk && b.colorMask(!0, !0, !0, !0);
            return (d = !0);
          },
          V: function () {
            O.$h() &&
              (q.bind(!1, !1),
              k.o(),
              b.clearColor(0, 0, 0, 0),
              b.enable(b.DEPTH_TEST),
              b.depthMask(!0),
              b.clear(b.COLOR_BUFFER_BIT | b.DEPTH_BUFFER_BIT),
              F.set("s110"),
              n.g(1),
              u.g(0),
              h.bind(!0),
              h.V(),
              L.bind(!0),
              L.V(),
              b.disable(b.DEPTH_TEST),
              b.depthMask(!1));
          },
          add: function () {
            O.$h() &&
              (b.enable(b.BLEND),
              b.blendFunc(b.ONE, b.ONE_MINUS_SRC_ALPHA),
              k.g(0),
              Y.l(!1, !1),
              b.disable(b.BLEND));
          },
          bg: function (v, m) {
            q = va.instance({ width: v, height: m, wc: !0 });
            k = Z.instance({ width: v, height: m, isFloat: !1, isPot: !1 });
            O.rc();
          },
          Xa: function (v, m, t) {
            v || ((v = E), (m = r), (t = C));
            F.j("s110", [
              {
                type: "3f",
                name: "u136",
                value: [
                  t[0] + g[0],
                  t[1] + g[1] - a.Pd[0],
                  t[2] + g[2] + a.Pd[1],
                ],
              },
            ]);
            E = v;
            r = m;
            C = t;
            H = !0;
            !d && G && O.rc();
            F.H();
          },
          Ya: function (v, m) {
            F.j("s109", [{ type: "1f", name: "u137", value: v }]);
            F.j("s110", [{ type: "1f", name: "u137", value: m }]);
            G = !0;
            !d && H && O.rc();
            F.H();
          },
          fg: function (v) {
            F.j("s110", [{ type: "1f", name: "u73", value: v }]);
            F.H();
          },
          sb: function (v) {
            v && (x = v);
            O.rc();
          },
          gg: function (v, m) {
            y[0].value = 1 - v;
            F.j("s110", y);
            F.j("s110", m);
          },
          K: function () {},
          v: function () {
            d = e = c = !1;
            p = u = l = B = k = n = null;
          },
        };
      return O;
    })();
    ta.sa = (function () {
      var a = !1,
        c = null,
        e = 0,
        d = 0,
        n = 0,
        k = [{ type: "1f", name: "u160", value: 1 }],
        B = null,
        l = null,
        u = null,
        p = {
          Ec: function () {
            F.pa("s112", {
              name: "_",
              s: "attribute vec3 a0;uniform vec2 u170,u171;varying vec2 vv0;void main(){vec2 a=2.*(a0.xy-u171)/u170;gl_Position=vec4(a,0.,1.),vv0=a0.xy;}",
              h: "uniform vec2 u172;uniform float u173,u174,u175;varying vec2 vv0;void main(){vec2 b=vec2(sign(vv0.x)*.5*u173,u174),a=vv0-b,c=u175*a,d=(c-a)*u172;gl_FragColor=vec4(d,0.,1.);}",
              i: "u170 u171 u173 u174 u175 u172".split(" "),
              I: ["a0"],
              P: [3],
              precision: "highp",
            });
            F.pa("s113", {
              name: "_",
              s: "attribute vec3 a0;varying vec2 vv0,vv1;uniform sampler2D u39;uniform vec3 u136;uniform vec2 u40,u170,u171;uniform float u137;const float n=0.,o=0.;const vec2 e=vec2(1.,1.);const vec3 p=vec3(1.,1.,1.);const vec2 F=vec2(-1.,1.),q=vec2(.16,.5),r=vec2(.5,.5),s=vec2(.84,.5);uniform mat4 u70;uniform vec3 u72,u76,u77,u78;uniform float u71,u79,u80,u73,u74,u75,u81;mat3 t(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,q);vec2 f=u79*e;vec3 c=u79*p;vec2 u=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,r).rgb+vec3(u73,0.,0.),u76,c);float v=mix(texture2D(u39,s).r,0.,u79);a.z+=v;mat3 w=t(a);vec3 x=mix(u136,u77,c);float y=mix(u137,u80,u79);vec3 b=mix(u72,u78,c);b.x+=u71*sin(a.y);float h=cos(a.z),i=sin(a.z);mat2 z=mat2(h,i,-i,h);b.xy=z*b.xy;float A=mix(u75,1.,u79);vec2 j=u74/u;vec3 k=a0;float B=max(0.,-a0.z-n)*o;k.x+=B*sign(a0.x)*(1.-u79);vec3 C=w*(k+x)*y+b;vec2 D=j*A;vec3 E=vec3(g*D,-j)+C*vec3(1.,-1.,-1.);gl_Position=u70*(vec4(u81*e,e)*vec4(E,1.)),gl_Position*=vec4(-1.,1.,1.,1.),vv0=vec2(.5,.5)+(a0.xy-u171)/u170,vv1=vec2(.5,.5)+.5*gl_Position.xy/gl_Position.w;}",
              h: "uniform sampler2D u176,u177;uniform float u160;varying vec2 vv0,vv1;void main(){vec2 a=u160*texture2D(u176,vv0).rg;gl_FragColor=texture2D(u177,a+vv1);}",
              i: "u160 u39 u176 u177 u170 u171 u40 u72 u137 u136"
                .split(" ")
                .concat(F.Ze(), F.$e()),
              I: ["a0"],
              P: [3],
              precision: "lowp",
            });
            a = !0;
          },
          m: function (G) {
            if (a) {
              if (void 0 === G.bc || !G.Zc) return !1;
              l = Z.instance({
                isFloat: !0,
                isPot: !1,
                isMipmap: !1,
                isLinear: !1,
                width: 256,
                height: 128,
                F: 4,
              });
              u = va.instance({ width: 256, height: 128 });
              F.j(
                "s113",
                [
                  { type: "1i", name: "u39", value: 1 },
                  { type: "1i", name: "u176", value: 2 },
                  { type: "1i", name: "u177", value: 0 },
                  { type: "3f", name: "u72", value: G.Ba },
                  { type: "1f", name: "u160", value: 1 },
                ].concat(G.sj, G.zg)
              );
              d = G.Ge;
              n = G.Fe;
              e = G.He;
            }
          },
          Yb: function (G) {
            c = G;
          },
          Xb: function (G) {
            B = G;
            B.Db(p.Be);
          },
          Be: function () {
            b.viewport(0, 0, 256, 128);
            u.o();
            l.o();
            var G = B.Nl(),
              H = B.Ol(),
              E = [
                { type: "2f", name: "u170", value: [G, H] },
                { type: "2f", name: "u171", value: [B.tl(), B.ul()] },
              ];
            F.j(
              "s112",
              E.concat([
                { type: "1f", name: "u173", value: d },
                { type: "1f", name: "u174", value: n },
                { type: "1f", name: "u175", value: e },
                { type: "2f", name: "u172", value: [1 / G, -1 / H] },
              ])
            );
            B.gh();
            F.j("s113", E);
          },
          V: function () {
            F.set("s113");
            c.g(1);
            l.g(2);
            B.gh();
          },
          Xa: function (G) {
            F.j("s113", [{ type: "3f", name: "u136", value: G }]);
            F.H();
          },
          Ya: function (G) {
            F.j("s113", [{ type: "1f", name: "u137", value: G }]);
            F.H();
          },
          fg: function (G) {
            F.j("s113", [{ type: "1f", name: "u73", value: G }]);
            F.H();
          },
          Sn: function (G) {
            e = G;
            p.Be();
            F.H();
            sa.animate(Date.now());
          },
          sb: function (G) {
            G && (B = G);
            p.Be();
          },
          gg: function (G, H) {
            k.u160 = 1 - G;
            F.j("s113", k);
            F.j("s113", H);
          },
          K: function () {},
        };
      return p;
    })();
    ta.jc = (function () {
      var a = [0, -0.5],
        c = !1,
        e = !1,
        d = null,
        n = null,
        k = null,
        B = null,
        l = null,
        u = -1,
        p = -1;
      return {
        Ec: function () {
          F.pa("s114", {
            name: "_",
            s: "attribute vec2 a0;uniform sampler2D u39;uniform vec2 u40,u5;uniform float u4;varying vec2 vv0;const vec2 f=vec2(1.,1.);void main(){vec4 a=texture2D(u39,vec2(.25,.5));vec2 b=a.a*u40,c=2.*a.gb-f,d=u5+a0*u4;gl_Position=vec4(c+b*d,0.,1.),vv0=vec2(.5,.5)+.5*a0;}",
            h: "uniform sampler2D u178;varying vec2 vv0;void main(){gl_FragColor=texture2D(u178,vv0);}",
            i: ["u39", "u178", "u40", "u5", "u4"],
            precision: "lowp",
          });
          F.pa("s115", {
            name: "_",
            h: "uniform sampler2D u2,u179,u180;varying vec2 vv0;const vec3 f=vec3(1.,1.,1.);void main(){float a=texture2D(u2,vv0).r;vec3 b=texture2D(u180,vv0).rgb,c=texture2D(u179,vv0).rgb;gl_FragColor=vec4(mix(b,c,a*f),1.);}",
            i: ["u2", "u180", "u179"],
            precision: "lowp",
          });
          c = !0;
        },
        m: function (G) {
          c &&
            ((l = Z.instance({
              isFloat: !1,
              isPot: !0,
              url: G.te,
              R: function () {
                e = !0;
              },
            })),
            F.j("s114", [
              { type: "1i", name: "u39", value: 1 },
              { type: "1i", name: "u178", value: 0 },
              { type: "2f", name: "u40", value: G.Bj },
              { type: "2f", name: "u5", value: a },
              { type: "1f", name: "u4", value: 3.8 },
            ]),
            F.j("s115", [
              { type: "1i", name: "u179", value: 0 },
              { type: "1i", name: "u2", value: 1 },
              { type: "1i", name: "u180", value: 2 },
            ]));
        },
        Yb: function (G) {
          n = G;
        },
        bg: function (G, H) {
          var E = {
            isFloat: !1,
            isPot: !1,
            isMipmap: !1,
            isLinear: !1,
            width: G,
            height: H,
            F: 4,
          };
          u = 2 / G;
          p = 2 / H;
          k = Z.instance(E);
          B = Z.instance(E);
          d = va.instance({ width: G, height: H });
        },
        V: function (G, H) {
          if (e) {
            d.bind(!1, !0);
            F.set("s77");
            for (var E = 0; 2 > E; ++E) {
              F.N("u8", u, 0);
              k.o();
              0 !== E && B.g(0);
              var r = 0 === E && !T.da;
              Y.l(r, r);
              F.N("u8", 0, p);
              B.o();
              k.g(0);
              Y.l(!1, !1);
            }
            F.set("s114");
            n.g(1);
            l.g(0);
            k.o();
            b.clearColor(1, 0, 0, 1);
            b.clear(b.COLOR_BUFFER_BIT);
            Y.l(!1, !1);
            F.set("s115");
            H.o();
            B.g(0);
            k.g(1);
            G.g(2);
            Y.l(!1, !1);
          }
        },
        K: function () {},
      };
    })();
    var Cc = (function () {
      var a = {
        instance: function (c) {
          var e = c.ki,
            d = c.ji,
            n = c.Ee,
            k = c.background ? c.background : Z.Eh(),
            B = c.Ta,
            l = { scale: 1, offsetX: 0, offsetY: 0 },
            u = null;
          c.Gf && ((l.scale = c.Gf.scale), (l.offsetY = c.Gf.offsetY));
          return {
            Ah: function () {
              return B;
            },
            uh: function () {
              return k;
            },
            set: function () {
              u = cb.El();
              cb.Yi(l);
              cb.Zd();
              cb.$d();
              sa.Ri(n, k, !1, !1);
            },
            H: function () {
              cb.Yi(u);
            },
            Fc: function () {
              return {
                modelURL: e,
                materialsURLs: d,
                background: k.Fc(!1),
                Ee: n.Fc(!1),
                Ta: B.Fc(!0),
              };
            },
            Po: function (p) {
              k.g(p);
            },
          };
        },
        Lc: function (c, e, d) {
          function n() {
            if (3 === ++u && e) {
              var p = a.instance({
                ki: c.modelURL,
                ji: c.materialsURLs,
                background: k,
                Ee: B,
                Ta: l,
              });
              e(p);
            }
          }
          var k = null,
            B = null,
            l = null,
            u = 0;
          Z.Lc(c.background, function (p) {
            !p && d ? d() : ((k = p), n());
          });
          Z.Lc(c.dataState, function (p) {
            !p && d ? d() : ((B = p), n());
          });
          Z.Lc(c.light, function (p) {
            !p && d ? d() : ((l = p), n());
          });
        },
      };
      return a;
    })();
    return Ra || JEELIZVTO;
  })();
  (function (W, wa) {
    "function" === typeof define && define.amd
      ? define(wa)
      : "object" === typeof exports
      ? (module.exports = wa())
      : (W.ResizeSensor = wa());
  })("undefined" !== typeof window ? window : this, function () {
    function W(Fa, gb) {
      var Sa = Object.prototype.toString.call(Fa),
        Db = 0,
        Ca = Fa.length;
      if (
        "[object Array]" === Sa ||
        "[object NodeList]" === Sa ||
        "[object HTMLCollection]" === Sa ||
        "[object Object]" === Sa ||
        ("undefined" !== typeof jQuery && Fa instanceof jQuery) ||
        ("undefined" !== typeof Elements && Fa instanceof Elements)
      )
        for (; Db < Ca; Db++) gb(Fa[Db]);
      else gb(Fa);
    }
    if ("undefined" === typeof window) return null;
    var wa =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (Fa) {
          return window.setTimeout(Fa, 20);
        },
      La = function (Fa, gb) {
        function Sa() {
          var Ca = [];
          this.add = function (Eb) {
            Ca.push(Eb);
          };
          var $a, hb;
          this.call = function () {
            $a = 0;
            for (hb = Ca.length; $a < hb; $a++) Ca[$a].call();
          };
          this.remove = function (Eb) {
            var mb = [];
            $a = 0;
            for (hb = Ca.length; $a < hb; $a++)
              Ca[$a] !== Eb && mb.push(Ca[$a]);
            Ca = mb;
          };
          this.length = function () {
            return Ca.length;
          };
        }
        function Db(Ca, $a) {
          if (Ca)
            if (Ca.resizedAttached) Ca.resizedAttached.add($a);
            else {
              Ca.resizedAttached = new Sa();
              Ca.resizedAttached.add($a);
              Ca.resizeSensor = document.createElement("div");
              Ca.resizeSensor.className = "resize-sensor";
              Ca.resizeSensor.style.cssText =
                "position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;";
              Ca.resizeSensor.innerHTML =
                '<div class="resize-sensor-expand" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;"><div style="position: absolute; left: 0; top: 0; transition: 0s;"></div></div><div class="resize-sensor-shrink" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;"><div style="position: absolute; left: 0; top: 0; transition: 0s; width: 200%; height: 200%"></div></div>';
              Ca.appendChild(Ca.resizeSensor);
              Ca.resizeSensor.offsetParent !== Ca &&
                (Ca.style.position = "relative");
              var hb = Ca.resizeSensor.childNodes[0],
                Eb = hb.childNodes[0],
                mb = Ca.resizeSensor.childNodes[1],
                Vb,
                Wb,
                Lb,
                Mb,
                Xb = Ca.offsetWidth,
                Yb = Ca.offsetHeight,
                jc = function () {
                  Eb.style.width = "100000px";
                  Eb.style.height = "100000px";
                  hb.scrollLeft = 1e5;
                  hb.scrollTop = 1e5;
                  mb.scrollLeft = 1e5;
                  mb.scrollTop = 1e5;
                };
              jc();
              var sc = function () {
                Wb = 0;
                Vb &&
                  ((Xb = Lb),
                  (Yb = Mb),
                  Ca.resizedAttached && Ca.resizedAttached.call());
              };
              $a = function () {
                Lb = Ca.offsetWidth;
                Mb = Ca.offsetHeight;
                (Vb = Lb != Xb || Mb != Yb) && !Wb && (Wb = wa(sc));
                jc();
              };
              var Hb = function (Zb, ac, $b) {
                Zb.attachEvent
                  ? Zb.attachEvent("on" + ac, $b)
                  : Zb.addEventListener(ac, $b);
              };
              Hb(hb, "scroll", $a);
              Hb(mb, "scroll", $a);
            }
        }
        W(Fa, function (Ca) {
          Db(Ca, gb);
        });
        this.detach = function (Ca) {
          La.detach(Fa, Ca);
        };
      };
    La.detach = function (Fa, gb) {
      W(Fa, function (Sa) {
        if (Sa) {
          if (
            Sa.resizedAttached &&
            "function" == typeof gb &&
            (Sa.resizedAttached.remove(gb), Sa.resizedAttached.length())
          )
            return;
          Sa.resizeSensor &&
            (Sa.contains(Sa.resizeSensor) && Sa.removeChild(Sa.resizeSensor),
            delete Sa.resizeSensor,
            delete Sa.resizedAttached);
        }
      });
    };
    return La;
  });
  var ic = {
      glassesDBURL: "https://glassesdbcached.jeeliz.com/sku/",
      appstaticURL: "https://appstatic.jeeliz.com/",
    },
    eb = { notLoaded: -1, init: 0, realtime: 2, loadingModel: 3, paused: 4 },
    Pa = { isRT: !0, sku: void 0, mode: eb.notLoaded },
    dc = -1,
    ec = -1,
    fc = -1,
    gc = -1,
    Pc = {
      cv: null,
      container: null,
      adjust: null,
      adjustNotice: null,
      adjustExit: null,
      loading: null,
      trackIframe: null,
    },
    qa = Object.assign({}, Pc),
    ld = {
      ADJUST_START: null,
      ADJUST_END: null,
      LOADING_START: null,
      LOADING_END: null,
    },
    Bc = null,
    Kb = { enabled: !1, callback: null, interval: 1e3 },
    rc = { error: !1 },
    cc = null,
    Ub = null,
    pb = {
      start: function (W) {
        console.log("INFO in JeelizVTOWidget.js: start()");
        if (Pa.mode !== eb.notLoaded) pb.resume();
        else {
          pa();
          if (W.settings) for (var wa in W.settings) ic[wa] = W.settings[wa];
          W.NNCPath && Ra.set_NNCPath(W.NNCPath);
          W.faceDetectionCallback &&
            ((Kb.enabled = !0),
            (Kb.callback = W.faceDetectionCallback),
            (Kb.interval =
              "undefined" === typeof W.faceDetectionInterval
                ? 1e3
                : W.faceDetectionInterval));
          Bc = Object.assign({}, ld, W.callbacks || {});
          qa.container =
            W.placeHolder || document.getElementById("JeelizVTOWidget");
          if (!qa.container)
            throw Error(
              "Cannot find a <div> element with id=JeelizVTOWidget to append the VTO widget."
            );
          qa.cv = W.canvas || document.getElementById("JeelizVTOWidgetCanvas");
          qa.cv ||
            ((qa.cv = document.createElement("canvas")),
            qa.container.appendChild(qa.cv));
          qa.loading = document.getElementById("JeelizVTOWidgetLoading");
          W.onError && (rc.error = W.onError);
          Tb();
          if (!zb(qa.container)) return db("PLACEHOLDER_NULL_WIDTH"), !1;
          if (!ma(qa.container)) return db("PLACEHOLDER_NULL_HEIGHT"), !1;
          Gb();
          new ResizeSensor(qa.container, function (La) {
            Gb();
          });
          (W.searchImageMask ||
            W.searchImageColor ||
            W.searchImageRotationSpeed) &&
            Ra.set_loading(
              W.searchImageMask,
              W.searchImageColor,
              W.searchImageRotationSpeed
            );
          W.callbackReady && (Ub = W.callbackReady);
          Pa.mode = eb.init;
          wa =
            "undefined" === typeof W.assetsPath
              ? ic.appstaticURL + "jeefit/"
              : W.assetsPath;
          "undefined" !== typeof W.catalog && (cc = W.catalog);
          if (W.onWebcamGet) Ra.onWebcamGet(W.onWebcamGet);
          Ra.init(wa, na, Ka, qa.cv);
          Ra.onHalfLoad(pb.load.bind(pb, W.sku ? W.sku : null));
          return !0;
        }
      },
      destroy: function () {
        return Ra.destroy().then(function () {
          Pa.mode = eb.notLoaded;
          Pa.sku = void 0;
          Ub = cc = null;
          Object.assign(qa, Pc);
        });
      },
      pause: function (W) {
        if (!Pa.isRT) return Promise.reject();
        Pa.mode = eb.paused;
        var wa = Ra.switch_sleep(!0, W);
        return W ? wa : Promise.resolve(wa);
      },
      resume: function (W) {
        if (!Pa.isRT) return Promise.reject();
        Pa.mode = eb.realtime;
        var wa = Ra.switch_sleep(!1, W);
        return W ? wa : Promise.resolve(wa);
      },
      set_videoRotation: function (W) {
        Pa.isRT && Ra.set_videoRotation(W);
      },
      set_videoSizes: function (W, wa, La, Fa, gb, Sa) {
        Pa.isRT && Ra.set_videoSizes(W, wa, La, Fa, gb, Sa);
      },
      resize: function () {
        Gb();
      },
      set_scale: function (W) {
        Ra.set_scale(W);
      },
      capture_image: function (W, wa, La) {
        Ra && Ra.ready ? Ra.capture_image(W, wa, La, !1) : wa(!1);
      },
      toggle_loading: function (W) {
        W
          ? (ya(qa.loading), hc("LOADING_START"))
          : (Ja(qa.loading), hc("LOADING_END"));
      },
      load_modelStandalone: function (W, wa) {
        if (!Pa.isRT)
          throw Error("Loading standalone models is only available in RT mode");
        Pa.mode === eb.paused && pb.resume();
        Pa.mode = eb.loadingModel;
        var La = "undef";
        "string" === typeof W
          ? ((La = W),
            za(W)
              .then(function (Fa) {
                Ra.set_modelStandalone(Fa, wa, La);
              })
              .catch(Ua))
          : ((La = "RANDOM_SKU_" + Date.now().toString()),
            Ra.set_modelStandalone(W, wa, La));
        Pa.sku = La;
      },
      load: function (W, wa) {
        pb.toggle_loading(!0);
        Pa.isRT && pb.load_RT(W, wa);
      },
      load_RT: function (W, wa) {
        W === Pa.sku
          ? pb.toggle_loading(!1)
          : ((Pa.sku = W),
            (Pa.mode = eb.loadingModel),
            Pa.mode === eb.paused && pb.resume(),
            W
              ? cc && cc[W]
                ? Jb(W, cc[W], wa)
                : za(ic.glassesDBURL + W)
                    .then(function (La) {
                      if (La.error) return Ua();
                      Jb(W, La.intrinsic, wa);
                    })
                    .catch(Ua)
              : ((Pa.mode = eb.realtime),
                pb.toggle_loading(!1),
                Ra.start_rendering(),
                wa && wa()));
      },
      enter_adjustMode: lb,
      exit_adjustMode: ub,
    };
  return pb;
})();
JEELIZVTO = JEELIZVTO;
JEELIZVTOWIDGET = {
  VERSION: "2.2.0",
  start: JeelizVTOWidget.start,
  pause: JeelizVTOWidget.pause,
  resume: JeelizVTOWidget.resume,
  load: JeelizVTOWidget.load,
  load_modelStandalone: JeelizVTOWidget.load_modelStandalone,
  capture_image: JeelizVTOWidget.capture_image,
  set_videoRotation: JeelizVTOWidget.set_videoRotation,
  resize: JeelizVTOWidget.resize,
  set_scale: JeelizVTOWidget.set_scale,
  set_videoSizes: JeelizVTOWidget.set_videoSizes,
  destroy: JeelizVTOWidget.destroy,
  enter_adjustMode: JeelizVTOWidget.enter_adjustMode,
  exit_adjustMode: JeelizVTOWidget.exit_adjustMode,
};

export { JEELIZVTO, JEELIZVTOWIDGET };
/* eslint-enable */

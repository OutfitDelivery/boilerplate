/* Font Face Observer v2.1.0 - © Bram Stein. License: BSD-3-Clause */ (function () {
  let f;
  const g = [];
  function l(a) {
    g.push(a);
    g.length == 1 && f();
  }
  function m() {
    for (; g.length;) g[0](), g.shift();
  }
  f = function () {
    setTimeout(m);
  };
  function n(a) {
    this.a = p;
    this.b = void 0;
    this.f = [];
    const b = this;
    try {
      a(
        (a) => {
          q(b, a);
        },
        (a) => {
          r(b, a);
        },
      );
    } catch (c) {
      r(b, c);
    }
  }
  var p = 2;
  function t(a) {
    return new n((b, c) => {
      c(a);
    });
  }
  function u(a) {
    return new n((b) => {
      b(a);
    });
  }
  function q(a, b) {
    if (a.a == p) {
      if (b == a) throw new TypeError();
      let c = !1;
      try {
        const d = b && b.then;
        if (b != null && typeof b === 'object' && typeof d === 'function') {
          d.call(
            b,
            (b) => {
              c || q(a, b);
              c = !0;
            },
            (b) => {
              c || r(a, b);
              c = !0;
            },
          );
          return;
        }
      } catch (e) {
        c || r(a, e);
        return;
      }
      a.a = 0;
      a.b = b;
      v(a);
    }
  }
  function r(a, b) {
    if (a.a == p) {
      if (b == a) throw new TypeError();
      a.a = 1;
      a.b = b;
      v(a);
    }
  }
  function v(a) {
    l(() => {
      if (a.a != p) {
        for (; a.f.length;) {
          var b = a.f.shift();
          const c = b[0];
          const d = b[1];
          const e = b[2];
          var b = b[3];
          try {
            a.a == 0
              ? typeof c === 'function'
                ? e(c.call(void 0, a.b))
                : e(a.b)
              : a.a == 1
                && (typeof d === 'function' ? e(d.call(void 0, a.b)) : b(a.b));
          } catch (h) {
            b(h);
          }
        }
      }
    });
  }
  n.prototype.g = function (a) {
    return this.c(void 0, a);
  };
  n.prototype.c = function (a, b) {
    const c = this;
    return new n((d, e) => {
      c.f.push([a, b, d, e]);
      v(c);
    });
  };
  function w(a) {
    return new n((b, c) => {
      function d(c) {
        return function (d) {
          h[c] = d;
          e += 1;
          e == a.length && b(h);
        };
      }
      var e = 0;
      var h = [];
      a.length == 0 && b(h);
      for (let k = 0; k < a.length; k += 1) u(a[k]).c(d(k), c);
    });
  }
  function x(a) {
    return new n((b, c) => {
      for (let d = 0; d < a.length; d += 1) u(a[d]).c(b, c);
    });
  }
  window.Promise
    || ((window.Promise = n),
    (window.Promise.resolve = u),
    (window.Promise.reject = t),
    (window.Promise.race = x),
    (window.Promise.all = w),
    (window.Promise.prototype.then = n.prototype.c),
    (window.Promise.prototype.catch = n.prototype.g));
}());

function l(a, b) {
  document.addEventListener
    ? a.addEventListener('scroll', b, !1)
    : a.attachEvent('scroll', b);
}
function m(a) {
  document.body
    ? a()
    : document.addEventListener
      ? document.addEventListener('DOMContentLoaded', function c() {
        document.removeEventListener('DOMContentLoaded', c);
        a();
      })
      : document.attachEvent('onreadystatechange', function k() {
        if (
          document.readyState == 'interactive'
            || document.readyState == 'complete'
        ) document.detachEvent('onreadystatechange', k), a();
      });
}
function t(a) {
  this.a = document.createElement('div');
  this.a.setAttribute('aria-hidden', 'true');
  this.a.appendChild(document.createTextNode(a));
  this.b = document.createElement('span');
  this.c = document.createElement('span');
  this.h = document.createElement('span');
  this.f = document.createElement('span');
  this.g = -1;
  this.b.style.cssText = 'max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;';
  this.c.style.cssText = 'max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;';
  this.f.style.cssText = 'max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;';
  this.h.style.cssText = 'display:inline-block;width:200%;height:200%;font-size:16px;max-width:none;';
  this.b.appendChild(this.h);
  this.c.appendChild(this.f);
  this.a.appendChild(this.b);
  this.a.appendChild(this.c);
}
function u(a, b) {
  a.a.style.cssText = `max-width:none;min-width:20px;min-height:20px;display:inline-block;overflow:hidden;position:absolute;width:auto;margin:0;padding:0;top:-999px;white-space:nowrap;font-synthesis:none;font:${
    b
  };`;
}
function z(a) {
  const b = a.a.offsetWidth;
  const c = b + 100;
  a.f.style.width = `${c}px`;
  a.c.scrollLeft = c;
  a.b.scrollLeft = a.b.scrollWidth + 100;
  return a.g !== b ? ((a.g = b), !0) : !1;
}
function A(a, b) {
  function c() {
    const a = k;
    z(a) && a.a.parentNode && b(a.g);
  }
  var k = a;
  l(a.b, c);
  l(a.c, c);
  z(a);
}
function B(a, b) {
  const c = b || {};
  this.family = a;
  this.style = c.style || 'normal';
  this.weight = c.weight || 'normal';
  this.stretch = c.stretch || 'normal';
  this.load = function (a, b) {
    const c = this;
    const k = a || 'BESbswy';
    let r = 0;
    const n = b || 3e3;
    const H = new Date().getTime();
    return new Promise((a, b) => {
      if (J() && !G()) {
        const M = new Promise((a, b) => {
          function e() {
            new Date().getTime() - H >= n
              ? b(Error(`${n}ms timeout exceeded loading fonts`))
              : document.fonts
                .load(L(c, `"${c.family}"`), k)
                .then((c) => {
                  c.length >= 1 ? a() : setTimeout(e, 25);
                }, b);
          }
          e();
        });
        const N = new Promise((a, c) => {
          r = setTimeout(() => {
            c(Error(`${n}ms timeout exceeded loading fonts`));
          }, n);
        });
        Promise.race([N, M]).then(() => {
          clearTimeout(r);
          a(c);
        }, b);
      } else {
        m(() => {
          function v() {
            let b;
            if (
              (b = (f != -1 && g != -1)
                    || (f != -1 && h != -1)
                    || (g != -1 && h != -1))
            ) {
              (b = f != g && f != h && g != h)
                    || (C === null
                      && ((b = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(
                        window.navigator.userAgent,
                      )),
                      (C = !!b
                        && (parseInt(b[1], 10) < 536
                          || (parseInt(b[1], 10) === 536
                            && parseInt(b[2], 10) <= 11)))),
                    (b = C
                      && ((f == w && g == w && h == w)
                        || (f == x && g == x && h == x)
                        || (f == y && g == y && h == y)))),
              (b = !b);
            }
            b
                  && (d.parentNode && d.parentNode.removeChild(d),
                  clearTimeout(r),
                  a(c));
          }
          function I() {
            if (new Date().getTime() - H >= n) {
              d.parentNode && d.parentNode.removeChild(d),
              b(Error(`${n}ms timeout exceeded loading fonts`));
            } else {
              const a = document.hidden;
              if (!0 === a || void 0 === a) {
                (f = e.a.offsetWidth),
                (g = p.a.offsetWidth),
                (h = q.a.offsetWidth),
                v();
              }
              r = setTimeout(I, 50);
            }
          }
          var e = new t(k);
          var p = new t(k);
          var q = new t(k);
          var f = -1;
          var g = -1;
          var h = -1;
          var w = -1;
          var x = -1;
          var y = -1;
          var d = document.createElement('div');
          d.dir = 'ltr';
          u(e, L(c, 'sans-serif'));
          u(p, L(c, 'serif'));
          u(q, L(c, 'monospace'));
          d.appendChild(e.a);
          d.appendChild(p.a);
          d.appendChild(q.a);
          document.body.appendChild(d);
          w = e.a.offsetWidth;
          x = p.a.offsetWidth;
          y = q.a.offsetWidth;
          I();
          A(e, (a) => {
            f = a;
            v();
          });
          u(e, L(c, `"${c.family}",sans-serif`));
          A(p, (a) => {
            g = a;
            v();
          });
          u(p, L(c, `"${c.family}",serif`));
          A(q, (a) => {
            h = a;
            v();
          });
          u(q, L(c, `"${c.family}",monospace`));
        });
      }
    });
  };
}
var C = null;
let D = null;
let E = null;
let F = null;
function G() {
  if (D === null) {
    if (J() && /Apple/.test(window.navigator.vendor)) {
      const a = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/.exec(
        window.navigator.userAgent,
      );
      D = !!a && parseInt(a[1], 10) < 603;
    } else D = !1;
  }
  return D;
}
function J() {
  F === null && (F = !!document.fonts);
  return F;
}
function K() {
  if (E === null) {
    const a = document.createElement('div');
    try {
      a.style.font = 'condensed 100px sans-serif';
    } catch (b) {}
    E = a.style.font !== '';
  }
  return E;
}
function L(a, b) {
  return [a.style, a.weight, K() ? a.stretch : '', '100px', b].join(' ');
}

export default B;

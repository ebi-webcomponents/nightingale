(function(){'use strict';function e(e){return function(){var t=this.ownerDocument,a=this.namespaceURI;return a===fi&&t.documentElement.namespaceURI===fi?t.createElement(e):t.createElementNS(a,e)}}function t(e){return function(){return this.ownerDocument.createElementNS(e.space,e.local)}}function a(e,t,a){return e=n(e,t,a),function(t){var a=t.relatedTarget;a&&(a===this||8&a.compareDocumentPosition(this))||e.call(this,t)}}function n(e,t,a){return function(n){var i=wi;// Events can be reentrant (e.g., focus).
wi=n;try{e.call(this,this.__data__,t,a)}finally{wi=i}}}function r(e){return e.trim().split(/^|\s+/).map(function(e){var a='',n=e.indexOf('.');return 0<=n&&(a=e.slice(n+1),e=e.slice(0,n)),{type:e,name:a}})}function o(e){return function(){var t=this.__on;if(t){for(var a,n=0,r=-1,i=t.length;n<i;++n)(a=t[n],(!e.type||a.type===e.type)&&a.name===e.name)?this.removeEventListener(a.type,a.listener,a.capture):t[++r]=a;++r?t.length=r:delete this.__on}}}function c(e,t,r){var c=_i.hasOwnProperty(e.type)?a:n;return function(a,n,i){var d,o=this.__on,l=c(t,n,i);if(o)for(var s=0,f=o.length;s<f;++s)if((d=o[s]).type===e.type&&d.name===e.name)return this.removeEventListener(d.type,d.listener,d.capture),this.addEventListener(d.type,d.listener=l,d.capture=r),void(d.value=t);this.addEventListener(e.type,l,r),d={type:e.type,name:e.name,value:t,listener:l,capture:r},o?o.push(d):this.__on=[d]}}function i(){}function d(){return[]}function l(e,t){this.ownerDocument=e.ownerDocument,this.namespaceURI=e.namespaceURI,this._next=null,this._parent=e,this.__data__=t}// Protect against keys like “__proto__”.
function s(e,t,a,n,r,o){// Put any non-null nodes that fit into update.
// Put any null nodes into enter.
// Put any remaining data into enter.
for(var c,d=0,i=t.length,s=o.length;d<s;++d)(c=t[d])?(c.__data__=o[d],n[d]=c):a[d]=new l(e,o[d]);// Put any non-null nodes that don’t fit into exit.
for(;d<i;++d)(c=t[d])&&(r[d]=c)}function f(e,t,a,n,r,o,c){var d,i,s,f={},p=t.length,b=o.length,u=Array(p);// Compute the key for each node.
// If multiple nodes have the same key, the duplicates are added to exit.
for(d=0;d<p;++d)(i=t[d])&&(u[d]=s=Ui+c.call(i,i.__data__,d,t),s in f?r[d]=i:f[s]=i);// Compute the key for each datum.
// If there a node associated with this key, join and add it to update.
// If there is not (or the key is a duplicate), add it to enter.
for(d=0;d<b;++d)s=Ui+c.call(e,o[d],d,o),(i=f[s])?(n[d]=i,i.__data__=o[d],f[s]=null):a[d]=new l(e,o[d]);// Add any remaining nodes that were not bound to data to exit.
for(d=0;d<p;++d)(i=t[d])&&f[u[d]]===i&&(r[d]=i)}function p(e,t){return e<t?-1:e>t?1:e>=t?0:NaN}function b(e){return function(){this.removeAttribute(e)}}function u(e){return function(){this.removeAttributeNS(e.space,e.local)}}function g(e,t){return function(){this.setAttribute(e,t)}}function h(e,t){return function(){this.setAttributeNS(e.space,e.local,t)}}function y(e,t){return function(){var a=t.apply(this,arguments);null==a?this.removeAttribute(e):this.setAttribute(e,a)}}function m(e,t){return function(){var a=t.apply(this,arguments);null==a?this.removeAttributeNS(e.space,e.local):this.setAttributeNS(e.space,e.local,a)}}function _(e){return function(){this.style.removeProperty(e)}}function w(e,t,a){return function(){this.style.setProperty(e,t,a)}}function x(e,t,a){return function(){var n=t.apply(this,arguments);null==n?this.style.removeProperty(e):this.style.setProperty(e,n,a)}}function v(e,t){return e.style.getPropertyValue(t)||Mi(e).getComputedStyle(e,null).getPropertyValue(t)}function j(e){return function(){delete this[e]}}function k(e,t){return function(){this[e]=t}}function T(e,t){return function(){var a=t.apply(this,arguments);null==a?delete this[e]:this[e]=a}}function S(e){return e.trim().split(/^|\s+/)}function U(e){return e.classList||new M(e)}function M(e){this._node=e,this._names=S(e.getAttribute('class')||'')}function F(e,t){for(var a=U(e),r=-1,i=t.length;++r<i;)a.add(t[r])}function O(e,t){for(var a=U(e),r=-1,i=t.length;++r<i;)a.remove(t[r])}function I(e){return function(){F(this,e)}}function P(e){return function(){O(this,e)}}function L(e,t){return function(){(t.apply(this,arguments)?F:O)(this,e)}}function z(){this.textContent=''}function H(e){return function(){this.textContent=e}}function Y(e){return function(){var t=e.apply(this,arguments);this.textContent=null==t?'':t}}function N(){this.innerHTML=''}function q(e){return function(){this.innerHTML=e}}function R(e){return function(){var t=e.apply(this,arguments);this.innerHTML=null==t?'':t}}function V(){this.nextSibling&&this.parentNode.appendChild(this)}function W(){this.previousSibling&&this.parentNode.insertBefore(this,this.parentNode.firstChild)}function $(){return null}function Z(){var e=this.parentNode;e&&e.removeChild(this)}function X(e,t,a){var n=Mi(e),i=n.CustomEvent;'function'==typeof i?i=new i(t,a):(i=n.document.createEvent('Event'),a?(i.initEvent(t,a.bubbles,a.cancelable),i.detail=a.detail):i.initEvent(t,!1,!1)),e.dispatchEvent(i)}function J(e,t){return function(){return X(this,e,t)}}function G(e,t){return function(){return X(this,e,t.apply(this,arguments))}}function K(e,t){this._groups=e,this._parents=t}function Q(e){return function(t,a){return Ii(e(t),a)}}function ee(e,t,a){var n=(t-e)/di(0,a),i=ci(oi(n)/ri),r=n/ii(10,i);return 0<=i?(r>=zi?10:r>=Hi?5:r>=Yi?2:1)*ii(10,i):-ii(10,-i)/(r>=zi?10:r>=Hi?5:r>=Yi?2:1)}function te(e,t,a){var n=ni(t-e)/di(0,a),i=ii(10,ci(oi(n)/ri)),r=n/i;return r>=zi?i*=10:r>=Hi?i*=5:r>=Yi&&(i*=2),t<e?-i:i}function ae(){}function ne(e,t){var a=new ae;// Copy constructor.
if(e instanceof ae)e.each(function(e,t){a.set(t,e)});// Index array by numeric index or specified key function.
else if(Array.isArray(e)){var r,o=-1,i=e.length;if(null==t)for(;++o<i;)a.set(o,e[o]);else for(;++o<i;)a.set(t(r=e[o],o,e),r)}// Convert object to map.
else if(e)for(var n in e)a.set(n,e[n]);return a}function ie(e){function t(t){var o=t+'',c=a.get(o);if(!c){if(n!==Wi)return n;a.set(o,c=r.push(t))}return e[(c-1)%e.length]}var a=ne(),r=[],n=Wi;return e=null==e?[]:Vi.call(e),t.domain=function(e){if(!arguments.length)return r.slice();r=[],a=ne();for(var o,c,d=-1,i=e.length;++d<i;)a.has(c=(o=e[d])+'')||a.set(c,r.push(o));return t},t.range=function(a){return arguments.length?(e=Vi.call(a),t):e.slice()},t.unknown=function(e){return arguments.length?(n=e,t):n},t.copy=function(){return ie().domain(r).range(e).unknown(n)},t}function oe(){function e(){var e=i().length,n=o[1]<o[0],f=o[n-0],p=o[1-n];t=(p-f)/di(1,e-d+2*l),c&&(t=ci(t)),f+=(p-f-t*(e-d))*s,a=t*(1-d),c&&(f=ai(f),a=ai(a));var b=Li(e).map(function(e){return f+t*e});return r(n?b.reverse():b)}var t,a,n=ie().unknown(void 0),i=n.domain,r=n.range,o=[0,1],c=!1,d=0,l=0,s=0.5;return delete n.unknown,n.domain=function(t){return arguments.length?(i(t),e()):i()},n.range=function(t){return arguments.length?(o=[+t[0],+t[1]],e()):o.slice()},n.rangeRound=function(t){return o=[+t[0],+t[1]],c=!0,e()},n.bandwidth=function(){return a},n.step=function(){return t},n.round=function(t){return arguments.length?(c=!!t,e()):c},n.padding=function(t){return arguments.length?(d=l=di(0,si(1,t)),e()):d},n.paddingInner=function(t){return arguments.length?(d=di(0,si(1,t)),e()):d},n.paddingOuter=function(t){return arguments.length?(l=di(0,si(1,t)),e()):l},n.align=function(t){return arguments.length?(s=di(0,si(1,t)),e()):s},n.copy=function(){return oe().domain(i()).range(o).round(c).paddingInner(d).paddingOuter(l).align(s)},e()}function ce(e,t){var a=Object.create(e.prototype);for(var n in t)a[n]=t[n];return a}function de(){}function le(e){var t;return e=(e+'').trim().toLowerCase(),(t=Ji.exec(e))?(t=parseInt(t[1],16),new ue(15&t>>8|240&t>>4,15&t>>4|240&t,(15&t)<<4|15&t,1)// #f00
):(t=Gi.exec(e))?se(parseInt(t[1],16))// #ff0000
:(t=Ki.exec(e))?new ue(t[1],t[2],t[3],1)// rgb(255, 0, 0)
:(t=Qi.exec(e))?new ue(255*t[1]/100,255*t[2]/100,255*t[3]/100,1)// rgb(100%, 0%, 0%)
:(t=er.exec(e))?fe(t[1],t[2],t[3],t[4])// rgba(255, 0, 0, 1)
:(t=tr.exec(e))?fe(255*t[1]/100,255*t[2]/100,255*t[3]/100,t[4])// rgb(100%, 0%, 0%, 1)
:(t=ar.exec(e))?ge(t[1],t[2]/100,t[3]/100,1)// hsl(120, 50%, 50%)
:(t=nr.exec(e))?ge(t[1],t[2]/100,t[3]/100,t[4])// hsla(120, 50%, 50%, 1)
:ir.hasOwnProperty(e)?se(ir[e]):'transparent'===e?new ue(NaN,NaN,NaN,0):null}function se(e){return new ue(255&e>>16,255&e>>8,255&e,1)}function fe(e,t,n,i){return 0>=i&&(e=t=n=NaN),new ue(e,t,n,i)}function pe(e){return(e instanceof de||(e=le(e)),!e)?new ue:(e=e.rgb(),new ue(e.r,e.g,e.b,e.opacity))}function be(e,t,a,n){return 1===arguments.length?pe(e):new ue(e,t,a,null==n?1:n)}function ue(e,t,a,n){this.r=+e,this.g=+t,this.b=+a,this.opacity=+n}function ge(e,t,n,i){return 0>=i?e=t=n=NaN:0>=n||1<=n?e=t=NaN:0>=t&&(e=NaN),new ye(e,t,n,i)}function he(e){if(e instanceof ye)return new ye(e.h,e.s,e.l,e.opacity);if(e instanceof de||(e=le(e)),!e)return new ye;if(e instanceof ye)return e;e=e.rgb();var t=e.r/255,a=e.g/255,n=e.b/255,i=si(t,a,n),r=di(t,a,n),c=NaN,d=r-i,s=(r+i)/2;return d?(c=t===r?(a-n)/d+6*(a<n):a===r?(n-t)/d+2:(t-a)/d+4,d/=0.5>s?r+i:2-r-i,c*=60):d=0<s&&1>s?0:c,new ye(c,d,s,e.opacity)}function ye(e,t,a,n){this.h=+e,this.s=+t,this.l=+a,this.opacity=+n}/* From FvD 13.37, CSS Color Module Level 3 */function me(e,t,a){return 255*(60>e?t+(a-t)*e/60:180>e?a:240>e?t+(a-t)*(240-e)/60:t)}function _e(e){if(e instanceof we)return new we(e.l,e.a,e.b,e.opacity);if(e instanceof Se){var t=e.h*rr;return new we(e.l,ei(t)*e.c,Qn(t)*e.c,e.opacity)}e instanceof ue||(e=pe(e));var n=ke(e.r),i=ke(e.g),a=ke(e.b),r=xe((0.4124564*n+0.3575761*i+0.1804375*a)/Kn),o=xe((0.2126729*n+0.7151522*i+0.072175*a)/Xn),c=xe((0.0193339*n+0.119192*i+0.9503041*a)/Yn);return new we(116*o-16,500*(r-o),200*(o-c),e.opacity)}function we(e,t,n,i){this.l=+e,this.a=+t,this.b=+n,this.opacity=+i}function xe(e){return e>sr?ii(e,1/3):e/lr+Zn}function ve(e){return e>dr?e*e*e:lr*(e-Zn)}function je(e){return 255*(0.0031308>=e?12.92*e:1.055*ii(e,1/2.4)-0.055)}function ke(e){return 0.04045>=(e/=255)?e/12.92:ii((e+0.055)/1.055,2.4)}function Te(e){if(e instanceof Se)return new Se(e.h,e.c,e.l,e.opacity);e instanceof we||(e=_e(e));var t=Gn(e.b,e.a)*or;return new Se(0>t?t+360:t,Jn(e.a*e.a+e.b*e.b),e.l,e.opacity)}function Se(e,t,a,n){this.h=+e,this.c=+t,this.l=+a,this.opacity=+n}function Ce(e){if(e instanceof Ue)return new Ue(e.h,e.s,e.l,e.opacity);e instanceof ue||(e=pe(e));var t=e.r/255,a=e.g/255,n=e.b/255,i=(br*n+E*t-pr*a)/(br+E-pr),r=n-i,o=(D*(a-i)-B*r)/C,c=Jn(o*o+r*r)/(D*i*(1-i)),// NaN if l=0 or l=1
d=c?Gn(o,r)*or-120:NaN;return new Ue(0>d?d+360:d,c,i,e.opacity)}function Ae(e,t,a,n){return 1===arguments.length?Ce(e):new Ue(e,t,a,null==n?1:n)}function Ue(e,t,a,n){this.h=+e,this.s=+t,this.l=+a,this.opacity=+n}function Me(e,a){return function(n){return e+n*a}}function Fe(e,a,n){return e=ii(e,n),a=ii(a,n)-e,n=1/n,function(i){return ii(e+i*a,n)}}function Oe(e){return 1==(e=+e)?De:function(t,a){return a-t?Fe(t,a,e):ur(isNaN(t)?a:t)}}function De(e,t){var a=t-e;return a?Me(e,a):ur(isNaN(e)?t:e)}function Ie(e){return function(){return e}}function Pe(e){return function(a){return e(a)+''}}function Ee(e){return function t(a){function n(n,t){var i=e((n=Ae(n)).h,(t=Ae(t)).h),r=De(n.s,t.s),o=De(n.l,t.l),c=De(n.opacity,t.opacity);return function(e){return n.h=i(e),n.s=r(e),n.l=o(ii(e,a)),n.opacity=c(e),n+''}}return a=+a,n.gamma=t,n}(1)}function Le(e,t){return(t-=e=+e)?function(a){return(a-e)/t}:Cr(t)}function ze(e){return function(t,n){var i=e(t=+t,n=+n);return function(e){return e<=t?0:e>=n?1:i(e)}}}function He(e){return function(n,i){var o=e(n=+n,i=+i);return function(e){return 0>=e?n:1<=e?i:o(e)}}}function Ye(e,t,a,n){var i=e[0],r=e[1],o=t[0],c=t[1];return r<i?(i=a(r,i),o=n(c,o)):(i=a(i,r),o=n(o,c)),function(e){return o(i(e))}}function Ne(e,t,a,n){var o=si(e.length,t.length)-1,c=Array(o),d=Array(o),r=-1;// Reverse descending domains.
for(e[o]<e[0]&&(e=e.slice().reverse(),t=t.slice().reverse());++r<o;)c[r]=a(e[r],e[r+1]),d[r]=n(t[r],t[r+1]);return function(t){var a=Ei(e,t,1,o)-1;return d[a](c[a](t))}}function Be(e,t){return t.domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp())}// deinterpolate(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
// reinterpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding domain value x in [a,b].
function qe(e,t){function a(){return i=2<si(c.length,d.length)?Ne:Ye,r=o=null,n}function n(t){return(r||(r=i(c,d,s?ze(e):e,l)))(+t)}var i,r,o,c=Ur,d=Ur,l=jr,s=!1;return n.invert=function(e){return(o||(o=i(d,c,Le,s?He(t):t)))(+e)},n.domain=function(e){return arguments.length?(c=Ri.call(e,Ar),a()):c.slice()},n.range=function(e){return arguments.length?(d=Vi.call(e),a()):d.slice()},n.rangeRound=function(e){return d=Vi.call(e),l=kr,a()},n.clamp=function(e){return arguments.length?(s=!!e,a()):s},n.interpolate=function(e){return arguments.length?(l=e,a()):l},a()}// Computes the decimal coefficient and exponent of the specified number x with
// significant digits p, where x is positive and p is in [1, 21] or undefined.
// For example, formatDecimal(1.23) returns ["123", 0].
function Re(e){return new Ve(e)}// instanceof
function Ve(e){if(!(t=Er.exec(e)))throw new Error('invalid format: '+e);var t,a=t[1]||' ',n=t[2]||'>',i=t[3]||'-',r=t[4]||'',o=!!t[5],c=t[6]&&+t[6],d=!!t[7],l=t[8]&&+t[8].slice(1),s=t[9]||'';// The "n" type is an alias for ",g".
'n'===s?(d=!0,s='g'):!Pr[s]&&(s=''),(o||'0'===a&&'='===n)&&(o=!0,a='0',n='='),this.fill=a,this.align=n,this.sign=i,this.symbol=r,this.zero=o,this.width=c,this.comma=d,this.precision=l,this.type=s}function We(e){var t=e.domain;return e.ticks=function(e){var a=t();return Ni(a[0],a[a.length-1],null==e?10:e)},e.tickFormat=function(e,a){return Vr(t(),e,a)},e.nice=function(a){null==a&&(a=10);var n,i=t(),r=0,o=i.length-1,c=i[r],d=i[o];return d<c&&(n=c,c=d,d=n,n=r,r=o,o=n),n=ee(c,d,a),0<n?(c=ci(c/n)*n,d=li(d/n)*n,n=ee(c,d,a)):0>n&&(c=li(c*n)/n,d=ci(d*n)/n,n=ee(c,d,a)),0<n?(i[r]=ci(c/n)*n,i[o]=li(d/n)*n,t(i)):0>n&&(i[r]=li(c*n)/n,i[o]=ci(d*n)/n,t(i)),e},e}function $e(){var e=qe(Le,mr);return e.copy=function(){return Be(e,$e())},We(e)}function Ze(e,t,a,n){function i(t){return e(t=new Date(+t)),t}return i.floor=i,i.ceil=function(a){return e(a=new Date(a-1)),t(a,1),e(a),a},i.round=function(e){var t=i(e),a=i.ceil(e);return e-t<a-e?t:a},i.offset=function(e,a){return t(e=new Date(+e),null==a?1:ci(a)),e},i.range=function(a,n,r){var o=[];if(a=i.ceil(a),r=null==r?1:ci(r),!(a<n)||!(0<r))return o;// also handles Invalid Date
do o.push(new Date(+a));while((t(a,r),e(a),a<n));return o},i.filter=function(a){return Ze(function(t){if(t>=t)for(;e(t),!a(t);)t.setTime(t-1)},function(e,n){if(e>=e)if(0>n)for(;0>=++n;)for(;t(e,-1),!a(e););// eslint-disable-line no-empty
else for(;0<=--n;)for(;t(e,1),!a(e););// eslint-disable-line no-empty
})},a&&(i.count=function(t,n){return Wr.setTime(+t),$r.setTime(+n),e(Wr),e($r),ci(a(Wr,$r))},i.every=function(e){return e=ci(e),isFinite(e)&&0<e?1<e?i.filter(n?function(t){return 0==n(t)%e}:function(t){return 0==i.count(0,t)%e}):i:null}),i}function Xe(e){return Ze(function(t){t.setDate(t.getDate()-(t.getDay()+7-e)%7),t.setHours(0,0,0,0)},function(e,t){e.setDate(e.getDate()+7*t)},function(e,t){return(t-e-(t.getTimezoneOffset()-e.getTimezoneOffset())*Jr)/Qr})}function Je(e){return Ze(function(t){t.setUTCDate(t.getUTCDate()-(t.getUTCDay()+7-e)%7),t.setUTCHours(0,0,0,0)},function(e,t){e.setUTCDate(e.getUTCDate()+7*t)},function(e,t){return(t-e)/Qr})}function Ge(e){if(0<=e.y&&100>e.y){var t=new Date(-1,e.m,e.d,e.H,e.M,e.S,e.L);return t.setFullYear(e.y),t}return new Date(e.y,e.m,e.d,e.H,e.M,e.S,e.L)}function Ke(e){if(0<=e.y&&100>e.y){var t=new Date(Date.UTC(-1,e.m,e.d,e.H,e.M,e.S,e.L));return t.setUTCFullYear(e.y),t}return new Date(Date.UTC(e.y,e.m,e.d,e.H,e.M,e.S,e.L))}function Qe(e){return{y:e,m:0,d:1,H:0,M:0,S:0,L:0}}function et(e){function t(e,t){return function(a){var r,o,c,d=[],l=-1,i=0,s=e.length;for(a instanceof Date||(a=new Date(+a));++l<s;)37===e.charCodeAt(l)&&(d.push(e.slice(i,l)),null==(o=Uo[r=e.charAt(++l)])?o='e'===r?' ':'0':r=e.charAt(++l),(c=t[r])&&(r=c(a,o)),d.push(r),i=l+1);return d.push(e.slice(i,l)),d.join('')}}function a(e,t){return function(a){var r=Qe(1900),o=n(r,e,a+='',0);if(o!=a.length)return null;// The am-pm flag is 0 for AM, and 1 for PM.
// Convert day-of-week and week-of-year to day-of-year.
if('p'in r&&(r.H=r.H%12+12*r.p),'W'in r||'U'in r){'w'in r||(r.w='W'in r?1:0);var i='Z'in r?Ke(Qe(r.y)).getUTCDay():t(Qe(r.y)).getDay();r.m=0,r.d='W'in r?(r.w+6)%7+7*r.W-(i+5)%7:r.w+7*r.U-(i+6)%7}// If a time zone is specified, all fields are interpreted as UTC and then
// offset according to the specified time zone.
return'Z'in r?(r.H+=0|r.Z/100,r.M+=r.Z%100,Ke(r)):t(r);// Otherwise, all fields are in local time.
}}function n(e,t,a,r){for(var o,c,d=0,i=t.length,n=a.length;d<i;){if(r>=n)return-1;if(o=t.charCodeAt(d++),37===o){if(o=t.charAt(d++),c=k[o in Uo?t.charAt(d++):o],!c||0>(r=c(e,a,r)))return-1;}else if(o!=a.charCodeAt(r++))return-1}return r}var r=e.dateTime,o=e.date,c=e.time,i=e.periods,l=e.days,s=e.shortDays,f=e.months,p=e.shortMonths,b=nt(i),u=it(i),g=nt(l),h=it(l),y=nt(s),m=it(s),_=nt(f),w=it(f),x=nt(p),v=it(p),d={a:function(e){return s[e.getDay()]},A:function(e){return l[e.getDay()]},b:function(e){return p[e.getMonth()]},B:function(e){return f[e.getMonth()]},c:null,d:_t,e:_t,H:wt,I:xt,j:vt,L:jt,m:kt,M:Tt,p:function(e){return i[+(12<=e.getHours())]},S:St,U:Ct,w:At,W:Ut,x:null,X:null,y:Mt,Y:Ft,Z:Ot,"%":$t},j={a:function(e){return s[e.getUTCDay()]},A:function(e){return l[e.getUTCDay()]},b:function(e){return p[e.getUTCMonth()]},B:function(e){return f[e.getUTCMonth()]},c:null,d:Dt,e:Dt,H:It,I:Pt,j:Et,L:Lt,m:zt,M:Ht,p:function(e){return i[+(12<=e.getUTCHours())]},S:Yt,U:Nt,w:Bt,W:qt,x:null,X:null,y:Rt,Y:Vt,Z:Wt,"%":$t},k={a:function(e,t,a){var i=y.exec(t.slice(a));return i?(e.w=m[i[0].toLowerCase()],a+i[0].length):-1},A:function(e,t,a){var i=g.exec(t.slice(a));return i?(e.w=h[i[0].toLowerCase()],a+i[0].length):-1},b:function(e,t,a){var i=x.exec(t.slice(a));return i?(e.m=v[i[0].toLowerCase()],a+i[0].length):-1},B:function(e,t,a){var i=_.exec(t.slice(a));return i?(e.m=w[i[0].toLowerCase()],a+i[0].length):-1},c:function(e,t,a){return n(e,r,t,a)},d:pt,e:pt,H:ut,I:ut,j:bt,L:yt,m:ft,M:gt,p:function(e,t,a){var i=b.exec(t.slice(a));return i?(e.p=u[i[0].toLowerCase()],a+i[0].length):-1},S:ht,U:ot,w:rt,W:ct,x:function(e,t,a){return n(e,o,t,a)},X:function(e,t,a){return n(e,c,t,a)},y:lt,Y:dt,Z:st,"%":mt};// These recursive directive definitions must be deferred.
return d.x=t(o,d),d.X=t(c,d),d.c=t(r,d),j.x=t(o,j),j.X=t(c,j),j.c=t(r,j),{format:function(e){var a=t(e+='',d);return a.toString=function(){return e},a},parse:function(e){var t=a(e+='',Ge);return t.toString=function(){return e},t},utcFormat:function(e){var a=t(e+='',j);return a.toString=function(){return e},a},utcParse:function(e){var t=a(e,Ke);return t.toString=function(){return e},t}}}function tt(e,t,a){var n=0>e?'-':'',i=(n?-e:e)+'',r=i.length;return n+(r<a?Array(a-r+1).join(t)+i:i)}function at(e){return e.replace(Oo,'\\$&')}function nt(e){return new RegExp('^(?:'+e.map(at).join('|')+')','i')}function it(e){for(var t={},a=-1,i=e.length;++a<i;)t[e[a].toLowerCase()]=a;return t}function rt(e,t,a){var i=Mo.exec(t.slice(a,a+1));return i?(e.w=+i[0],a+i[0].length):-1}function ot(e,t,a){var i=Mo.exec(t.slice(a));return i?(e.U=+i[0],a+i[0].length):-1}function ct(e,t,a){var i=Mo.exec(t.slice(a));return i?(e.W=+i[0],a+i[0].length):-1}function dt(e,t,a){var i=Mo.exec(t.slice(a,a+4));return i?(e.y=+i[0],a+i[0].length):-1}function lt(e,t,a){var i=Mo.exec(t.slice(a,a+2));return i?(e.y=+i[0]+(68<+i[0]?1900:2e3),a+i[0].length):-1}function st(e,t,a){var i=/^(Z)|([+-]\d\d)(?:\:?(\d\d))?/.exec(t.slice(a,a+6));return i?(e.Z=i[1]?0:-(i[2]+(i[3]||'00')),a+i[0].length):-1}function ft(e,t,a){var i=Mo.exec(t.slice(a,a+2));return i?(e.m=i[0]-1,a+i[0].length):-1}function pt(e,t,a){var i=Mo.exec(t.slice(a,a+2));return i?(e.d=+i[0],a+i[0].length):-1}function bt(e,t,a){var i=Mo.exec(t.slice(a,a+3));return i?(e.m=0,e.d=+i[0],a+i[0].length):-1}function ut(e,t,a){var i=Mo.exec(t.slice(a,a+2));return i?(e.H=+i[0],a+i[0].length):-1}function gt(e,t,a){var i=Mo.exec(t.slice(a,a+2));return i?(e.M=+i[0],a+i[0].length):-1}function ht(e,t,a){var i=Mo.exec(t.slice(a,a+2));return i?(e.S=+i[0],a+i[0].length):-1}function yt(e,t,a){var i=Mo.exec(t.slice(a,a+3));return i?(e.L=+i[0],a+i[0].length):-1}function mt(e,t,a){var i=Fo.exec(t.slice(a,a+1));return i?a+i[0].length:-1}function _t(e,t){return tt(e.getDate(),t,2)}function wt(e,t){return tt(e.getHours(),t,2)}function xt(e,t){return tt(e.getHours()%12||12,t,2)}function vt(e,t){return tt(1+no.count(bo(e),e),t,3)}function jt(e,t){return tt(e.getMilliseconds(),t,3)}function kt(e,t){return tt(e.getMonth()+1,t,2)}function Tt(e,t){return tt(e.getMinutes(),t,2)}function St(e,t){return tt(e.getSeconds(),t,2)}function Ct(e,t){return tt(io.count(bo(e),e),t,2)}function At(e){return e.getDay()}function Ut(e,t){return tt(ro.count(bo(e),e),t,2)}function Mt(e,t){return tt(e.getFullYear()%100,t,2)}function Ft(e,t){return tt(e.getFullYear()%1e4,t,4)}function Ot(e){var t=e.getTimezoneOffset();return(0<t?'-':(t*=-1,'+'))+tt(0|t/60,'0',2)+tt(t%60,'0',2)}function Dt(e,t){return tt(e.getUTCDate(),t,2)}function It(e,t){return tt(e.getUTCHours(),t,2)}function Pt(e,t){return tt(e.getUTCHours()%12||12,t,2)}function Et(e,t){return tt(1+ho.count(To(e),e),t,3)}function Lt(e,t){return tt(e.getUTCMilliseconds(),t,3)}function zt(e,t){return tt(e.getUTCMonth()+1,t,2)}function Ht(e,t){return tt(e.getUTCMinutes(),t,2)}function Yt(e,t){return tt(e.getUTCSeconds(),t,2)}function Nt(e,t){return tt(yo.count(To(e),e),t,2)}function Bt(e){return e.getUTCDay()}function qt(e,t){return tt(mo.count(To(e),e),t,2)}function Rt(e,t){return tt(e.getUTCFullYear()%100,t,2)}function Vt(e,t){return tt(e.getUTCFullYear()%1e4,t,4)}function Wt(){return'+0000'}function $t(){return'%'}function Zt(e){var a=e.length;return function(n){return e[di(0,si(a-1,ci(n*a)))]}}/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */function Xt(e,t){for(var a=-1,n=null==e?0:e.length,i=Array(n);++a<n;)i[a]=t(e[a],a,e);return i}/** Detect free variable `global` from Node.js. *//**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */function Jt(e){var t=Zo.call(e,Jo),a=e[Jo];try{e[Jo]=void 0}catch(t){}var n=Xo.call(e);return t?e[Jo]=a:delete e[Jo],n}/** Used for built-in method references. *//**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */function Gt(e){return Ko.call(e)}/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */function Kt(e){return null==e?void 0===e?ec:Qo:tc&&tc in Object(e)?Jt(e):Gt(e)}/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */function Qt(e){var t=typeof e;return null!=e&&('object'==t||'function'==t)}/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */function ea(e){if(!Qt(e))return!1;// The use of `Object#toString` avoids issues with the `typeof` operator
// in Safari 9 which returns 'object' for typed arrays and other constructors.
var t=Kt(e);return t==nc||t==ic||t==ac||t==rc}/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */function ta(e){return!!cc&&cc in e}/** Used for built-in method references. *//**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */function aa(e){if(null!=e){try{return lc.call(e)}catch(t){}try{return e+''}catch(t){}}return''}/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */function na(e){if(!Qt(e)||ta(e))return!1;var t=ea(e)?hc:fc;return t.test(aa(e))}/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */function ia(e,t){return null==e?void 0:e[t]}function ra(e,t){var a=ia(e,t);return na(a)?a:void 0}/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 *//**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 *//**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 *//**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */function oa(e){var t=-1,a=null==e?0:e.length;for(this.clear();++t<a;){var n=e[t];this.set(n[0],n[1])}}// Add methods to `Hash`.
/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 *//**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */function ca(e,t){return e===t||e!==e&&t!==t}function da(e,t){for(var a=e.length;a--;)if(ca(e[a][0],t))return a;return-1}/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */function la(e){var t=-1,a=null==e?0:e.length;for(this.clear();++t<a;){var n=e[t];this.set(n[0],n[1])}}// Add methods to `ListCache`.
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */function sa(e){var t=typeof e;return'string'==t||'number'==t||'symbol'==t||'boolean'==t?'__proto__'!==e:null===e}function fa(e,t){var a=e.__data__;return sa(t)?a['string'==typeof t?'string':'hash']:a.map}function pa(e){var t=-1,a=null==e?0:e.length;for(this.clear();++t<a;){var n=e[t];this.set(n[0],n[1])}}// Add methods to `MapCache`.
/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 *//**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */function ba(e){var t=-1,a=null==e?0:e.length;for(this.__data__=new pa;++t<a;)this.add(e[t])}// Add methods to `SetCache`.
/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */function ua(e,t,a,n){for(var i=e.length,r=a+(n?1:-1);n?r--:++r<i;)if(t(e[r],r,e))return r;return-1}/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */function ga(e){return e!==e}/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */function ha(e,t,a){for(var n=a-1,i=e.length;++n<i;)if(e[n]===t)return n;return-1}function ya(e,t,a){return t===t?ha(e,t,a):ua(e,ga,a)}function ma(e,t){var a=null==e?0:e.length;return!!a&&-1<ya(e,t,0)}/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */function _a(e,t,a){for(var n=-1,i=null==e?0:e.length;++n<i;)if(a(t,e[n]))return!0;return!1}/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */function wa(e){return function(t){return e(t)}}/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */function xa(e,t){return e.has(t)}/**
 * The base implementation of methods like `_.intersection`, without support
 * for iteratee shorthands, that accepts an array of arrays to inspect.
 *
 * @private
 * @param {Array} arrays The arrays to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of shared values.
 */function va(e,t,a){for(var n=a?_a:ma,i=e[0].length,r=e.length,o=r,c=Array(r),d=Infinity,l=[];o--;){var s=e[o];o&&t&&(s=Xt(s,wa(t))),d=Tc(s.length,d),c[o]=!a&&(t||120<=i&&120<=s.length)?new ba(o&&s):void 0}s=e[0];var f=-1,p=c[0];outer:for(;++f<i&&l.length<d;){var b=s[f],u=t?t(b):b;if(b=a||0!==b?b:0,p?!xa(p,u):!n(l,u,a)){for(o=r;--o;){var g=c[o];if(g?!xa(g,u):!n(e[o],u,a))continue outer}p&&p.push(u),l.push(b)}}return l}/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */function ja(e){return e}/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */function ka(e,t,a){switch(a.length){case 0:return e.call(t);case 1:return e.call(t,a[0]);case 2:return e.call(t,a[0],a[1]);case 3:return e.call(t,a[0],a[1],a[2]);}return e.apply(t,a)}/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */function Ta(e,t,a){return t=Sc(void 0===t?e.length-1:t,0),function(){for(var n=arguments,i=-1,r=Sc(n.length-t,0),o=Array(r);++i<r;)o[i]=n[t+i];i=-1;for(var c=Array(t+1);++i<t;)c[i]=n[i];return c[t]=a(o),ka(e,this,c)}}/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */function Sa(e){return function(){return e}}/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 *//**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 *//** Used as references for various `Number` constants. */function Ca(e){return'number'==typeof e&&-1<e&&0==e%1&&e<=Fc}function Aa(e){return null!=e&&Ca(e.length)&&!ea(e)}/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */function Ua(e){return null!=e&&'object'==typeof e}function Ma(e){return Ua(e)&&Aa(e)}function Fa(e){return Ma(e)?e:[]}function Oa(e,t){var a=e.split(', ');Dc(t,a)}function Da(e,t,a){'number'==typeof a?a++:a=1;var n,i=!0,r=!1;try{for(var o,c,d=e[Symbol.iterator]();!(i=(o=d.next()).done);i=!0)c=o.value,c.depth=a,t(c),0<c.children.length&&Da(c.children,t,a)}catch(e){r=!0,n=e}finally{try{!i&&d.return&&d.return()}finally{if(r)throw n}}}/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 *//**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 *//**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 *//**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */function Ia(e){var t=this.__data__=new la(e);this.size=t.size}// Add methods to `Stack`.
/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */function Pa(e,t){for(var a=-1,n=null==e?0:e.length;++a<n&&!(!1===t(e[a],a,e)););return e}function Ea(e,t,a){'__proto__'==t&&Cc?Cc(e,t,{configurable:!0,enumerable:!0,value:a,writable:!0}):e[t]=a}/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */function La(e,t,a){var n=e[t];Pc.call(e,t)&&ca(n,a)&&(a!==void 0||t in e)||Ea(e,t,a)}function za(e,t,a,n){var i=!a;a||(a={});for(var r=-1,o=t.length;++r<o;){var c=t[r],d=n?n(a[c],e[c],c,a,e):void 0;d===void 0&&(d=e[c]),i?Ea(a,c,d):La(a,c,d)}return a}/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */function Ha(e,t){for(var a=-1,n=Array(e);++a<e;)n[a]=t(a);return n}/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */function Ya(e){return Ua(e)&&Kt(e)==Ec}/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 *//**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */function Na(e,t){return t=null==t?Zc:t,!!t&&('number'==typeof e||Xc.test(e))&&-1<e&&0==e%1&&e<t}/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 *//**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */function Ba(e,t){var a=Nc(e),n=!a&&Yc(e),i=!a&&!n&&$c(e),r=!a&&!n&&!i&&nd(e),o=a||n||i||r,c=o?Ha(e.length,String):[],d=c.length;for(var l in e)(t||rd.call(e,l))&&!(o&&(// Safari 9 has enumerable `arguments.length` in strict mode.
'length'==l||// Node.js 0.10 has enumerable non-index properties on buffers.
i&&('offset'==l||'parent'==l)||// PhantomJS 2 has enumerable non-index properties on typed arrays.
r&&('buffer'==l||'byteLength'==l||'byteOffset'==l)||// Skip index properties.
Na(l,d)))&&c.push(l);return c}/** Used for built-in method references. *//**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */function qa(e){var t=e&&e.constructor,a='function'==typeof t&&t.prototype||od;return e===a}/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */function Ra(e,t){return function(a){return e(t(a))}}/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */function Va(e){if(!qa(e))return cd(e);var t=[];for(var a in Object(e))ld.call(e,a)&&'constructor'!=a&&t.push(a);return t}function Wa(e){return Aa(e)?Ba(e):Va(e)}function $a(e,t){return e&&za(t,Wa(t),e)}/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */function Za(e){var t=[];if(null!=e)for(var a in Object(e))t.push(a);return t}/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */function Xa(e){if(!Qt(e))return Za(e);var t=qa(e),a=[];for(var n in e)('constructor'!=n||!t&&fd.call(e,n))&&a.push(n);return a}function Ja(e){return Aa(e)?Ba(e,!0):Xa(e)}function Ga(e,t){return e&&za(t,Ja(t),e)}/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */function Ka(e,t){if(t)return e.slice();var a=e.length,n=hd?hd(a):new e.constructor(a);return e.copy(n),n}/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */function Qa(e,t){var a=-1,n=e.length;for(t||(t=Array(n));++a<n;)t[a]=e[a];return t}/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */function en(e,t){for(var a=-1,n=null==e?0:e.length,i=0,r=[];++a<n;){var o=e[a];t(o,a,e)&&(r[i++]=o)}return r}/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */function tn(){return[]}function an(e,t){return za(e,wd(e),t)}/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */function nn(e,t){for(var a=-1,n=t.length,i=e.length;++a<n;)e[i+a]=t[a];return e}function rn(e,t){return za(e,jd(e),t)}function on(e,t,a){var n=t(e);return Nc(e)?n:nn(n,a(e))}function cn(e){return on(e,Wa,wd)}function dn(e){return on(e,Ja,jd)}/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */function ln(e){var t=e.length,a=e.constructor(t);// Add properties assigned by `RegExp#exec`.
return t&&'string'==typeof e[0]&&Nd.call(e,'index')&&(a.index=e.index,a.input=e.input),a}function sn(e){var t=new e.constructor(e.byteLength);return new Bd(t).set(new Bd(e)),t}function fn(e,t){var a=t?sn(e.buffer):e.buffer;return new e.constructor(a,e.byteOffset,e.byteLength)}/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */function pn(e,t){return e.set(t[0],t[1]),e}/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */function bn(e,t,a,n){var i=-1,r=null==e?0:e.length;for(n&&r&&(a=e[++i]);++i<r;)a=t(a,e[i],i,e);return a}/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */function un(e){var t=-1,a=Array(e.size);return e.forEach(function(e,n){a[++t]=[n,e]}),a}/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */function gn(e,t,a){var n=t?a(un(e),qd):un(e);return bn(n,pn,new e.constructor)}/** Used to match `RegExp` flags from their coerced string values. *//**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */function hn(e){var t=new e.constructor(e.source,Rd.exec(e));return t.lastIndex=e.lastIndex,t}/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */function yn(e,t){return e.add(t),e}/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */function mn(e){var t=-1,a=Array(e.size);return e.forEach(function(e){a[++t]=e}),a}/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */function _n(e,t,a){var n=t?a(mn(e),Vd):mn(e);return bn(n,yn,new e.constructor)}/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */function wn(e){return $d?Object($d.call(e)):{}}function xn(e,t){var a=t?sn(e.buffer):e.buffer;return new e.constructor(a,e.byteOffset,e.length)}/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */function vn(e,t,a,n){var i=e.constructor;return t===al?sn(e):t===Zd||t===Xd?new i(+e):t===nl?fn(e,n):t===il||t===rl||t===ol||t===cl||t===dl||t===ll||t===sl||t===fl||t===pl?xn(e,n):t===Jd?gn(e,n,a):t===Gd||t===el?new i(e):t===Kd?hn(e):t===Qd?_n(e,n,a):t===tl?wn(e):void 0}function jn(e){return'function'!=typeof e.constructor||qa(e)?{}:ul(xd(e))}/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */function kn(e,t,a,n,i,r){var o,c=t&gl,d=t&hl;if(a&&(o=i?a(e,n,i,r):a(e)),void 0!==o)return o;if(!Qt(e))return e;var l=Nc(e);if(!l){var s=Hd(e),f=s==_l||s==wl;if($c(e))return Ka(e,c);if(s!=xl&&s!=ml&&(!f||i)){if(!vl[s])return i?e:{};o=vn(e,s,kn,c)}else if(o=d||f?{}:jn(e),!c)return d?rn(e,Ga(o,e)):an(e,$a(o,e))}else if(o=ln(e),!c)return Qa(e,o);// Check for circular references and return its corresponding clone.
r||(r=new Ia);var p=r.get(e);if(p)return p;r.set(e,o);var b=t&yl?d?dn:cn:d?keysIn:Wa,u=l?void 0:b(e);return Pa(u||e,function(n,i){u&&(i=n,n=e[i]),La(o,i,kn(n,t,a,i,e,r))}),o}/**
 * Creates a shallow clone of `value`.
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
 * and supports cloning arrays, array buffers, booleans, date objects, maps,
 * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
 * arrays. The own enumerable properties of `arguments` objects are cloned
 * as plain objects. An empty object is returned for uncloneable values such
 * as error objects, functions, DOM nodes, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to clone.
 * @returns {*} Returns the cloned value.
 * @see _.cloneDeep
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var shallow = _.clone(objects);
 * console.log(shallow[0] === objects[0]);
 * // => true
 */function Tn(e){return kn(e,jl)}function Sn(e){return fetch('https://www.ebi.ac.uk/proteins/api/proteins/interaction/'+e+'.json').then(function(e){return e.json().then(function(e){return Cn(e)})})}function Cn(e){e=e.map(function(e){return e.interactions||(e.interactions=[]),e});// Add symmetry if required
var t,a=function(t){var a,n=function(a){var n=e.find(function(e){return e.accession===a.id});if(n&&!n.interactions.find(function(e){return e.id===t.accession})){var i=Tn(a);i.id=t.accession,n.interactions.push(i)}},i=!0,r=!1;try{for(var o,c,d=t.interactions[Symbol.iterator]();!(i=(o=d.next()).done);i=!0)c=o.value,n(c)}catch(e){r=!0,a=e}finally{try{!i&&d.return&&d.return()}finally{if(r)throw a}}},n=!0,i=!1;try{for(var r,o,c=e[Symbol.iterator]();!(n=(r=c.next()).done);n=!0)o=r.value,a(o);// remove interactions which are not part of current set
}catch(e){i=!0,t=e}finally{try{!n&&c.return&&c.return()}finally{if(i)throw t}}var d,l=!0,s=!1;try{for(var f,o,p=e[Symbol.iterator]();!(l=(f=p.next()).done);l=!0){o=f.value,o.filterTerms=[];var b=[];o.accession.includes('-')&&(o.isoform=o.accession,o.accession=o.accession.split('-')[0]);// Add source  to the nodes
var u=function(t){t.id&&t.id.includes('-')&&(t.isoform=t.id,t.id=t.id.split('-')[0]),'SELF'===t.interactionType?(t.source=o.accession,t.id=o.accession,An(t,b)):e.some(function(e){//Check that interactor is in the data
return e.accession===t.id})&&(t.source=o.accession.split('-')[0],An(t,b))},g=!0,h=!1,y=void 0;try{for(var m,_,w=o.interactions[Symbol.iterator]();!(g=(m=w.next()).done);g=!0)_=m.value,u(_)}catch(e){h=!0,y=e}finally{try{!g&&w.return&&w.return()}finally{if(h)throw y}}if(o.interactions=b,o.subcellularLocations){var x=!0,v=!1,j=void 0;try{for(var k,T=o.subcellularLocations[Symbol.iterator]();!(x=(k=T.next()).done);x=!0){var S=k.value,C=!0,A=!1,U=void 0;try{for(var M,F,O=S.locations[Symbol.iterator]();!(C=(M=O.next()).done);C=!0){F=M.value,Oa(F.location.value,Ml);var D=F.location.value.split(', ');o.filterTerms=o.filterTerms.concat(D)}}catch(e){A=!0,U=e}finally{try{!C&&O.return&&O.return()}finally{if(A)throw U}}}}catch(e){v=!0,j=e}finally{try{!x&&T.return&&T.return()}finally{if(v)throw j}}}if(o.diseases){var I=!0,P=!1,E=void 0;try{for(var L,z,H=o.diseases[Symbol.iterator]();!(I=(L=H.next()).done);I=!0)z=L.value,z.diseaseId&&(Fl[z.diseaseId]={name:z.diseaseId,selected:!1},o.filterTerms.push(z.diseaseId))}catch(e){P=!0,E=e}finally{try{!I&&H.return&&H.return()}finally{if(P)throw E}}}}}catch(e){s=!0,d=e}finally{try{!l&&p.return&&p.return()}finally{if(s)throw d}}return e}function An(e,t){var a=t.find(function(t){return e.id===t.id});a?e.isoform&&(a.isoform=e.isoform):t.push(e)}function Un(e){var t,a=[],n=!0,i=!1;try{for(var r,o=Object.entries(e)[Symbol.iterator]();!(n=(r=o.next()).done);n=!0){var c=r.value,d=Ul(c,2),l=d[1];a.push(l)}}catch(e){i=!0,t=e}finally{try{!n&&o.return&&o.return()}finally{if(i)throw t}}return a}function Mn(){return[{name:'subcellularLocations',label:'Subcellular location',type:'tree',items:Ml},{name:'diseases',label:'Diseases',items:Un(Fl)}]}function Fn(e){var t=e.el,a=t===void 0?$n('el'):t,n=e.accession,i=n===void 0?'P05067':n;a.style.display='block',a.style.minHeight='6em',Oi(a).select('.interaction-title').remove(),Oi(a).select('svg').remove(),Oi(a).select('.interaction-tooltip').remove(),Oi(a).append('div').attr('class','loader'),Sn(i).then(function(e){In(a,i,e)})}function On(e,t){if(e){var a,n='',i=!0,r=!1;try{for(var o,c,d=e[Symbol.iterator]();!(i=(o=d.next()).done);i=!0)c=o.value,c.dbReference&&(n+='<p><a href="//www.uniprot.org/uniprot/'+t+'#'+c.acronym+'" target="_blank">'+c.diseaseId+'</a></p>')}catch(e){r=!0,a=e}finally{try{!i&&d.return&&d.return()}finally{if(r)throw a}}return n}return'N/A'}function Dn(e){if(e){var t,a='<ul class="tree-list">',n=[],i=!0,r=!1;try{for(var o,c=e[Symbol.iterator]();!(i=(o=c.next()).done);i=!0){var d=o.value,l=!0,s=!1,f=void 0;try{for(var p,b,u=d.locations[Symbol.iterator]();!(l=(p=u.next()).done);l=!0)b=p.value,Oa(b.location.value,n)}catch(e){s=!0,f=e}finally{try{!l&&u.return&&u.return()}finally{if(s)throw f}}}}catch(e){r=!0,t=e}finally{try{!i&&c.return&&c.return()}finally{if(r)throw t}}return Da(n,function(e){return a+='<li style="margin-left:'+e.depth+'em">'+e.name+'</li>'}),a+'</ul>'}return'N/A'}function In(e,t,a){function n(e){Oi(this).classed('active-cell',!0),Di('.interaction-row').classed('active',function(t){return t.accession===e.id}),Di('.interaction-viewer-group').append('line').attr('class','active-row').attr('style','opacity:0').attr('x1',0).attr('y1',f(e.source)+f.bandwidth()/2).attr('x2',f(e.id)).attr('y2',f(e.source)+f.bandwidth()/2),Di('.interaction-viewer-group').append('line').attr('class','active-row').attr('style','opacity:0').attr('x1',f(e.id)+f.bandwidth()/2).attr('y1',0).attr('x2',f(e.id)+f.bandwidth()/2).attr('y2',f(e.source))}function i(t){r(Di('.tooltip-content'),t),d.style('opacity',0.9).style('display','inline').style('left',ki(e)[0]+10+'px').style('top',ki(e)[1]-15+'px')}function r(e,t){e.html('');var a=Ol.find(function(e){return e.accession===t.source}),n=Ol.find(function(e){return e.accession===t.id});e.append('h3').text('Interaction'),e.append('p').append('a').attr('href',o(t.interactor1,t.interactor2)).attr('target','_blank').text('Confirmed by '+t.experiments+' experiment(s)');var i=e.append('table').attr('class','interaction-viewer-table'),r=i.append('tr');r.append('th'),r.append('th').text('Interactor 1'),r.append('th').text('Interactor 2');var c=i.append('tr');c.append('td').text('Name').attr('class','interaction-viewer-table_row-header'),c.append('td').text(''+a.name),c.append('td').text(''+n.name);var d=i.append('tr');d.append('td').text('UniProtKB').attr('class','interaction-viewer-table_row-header'),d.append('td').append('a').attr('href','//uniprot.org/uniprot/'+a.accession).text(''+a.accession),d.append('td').append('a').attr('href','//uniprot.org/uniprot/'+n.accession).text(''+n.accession);var l=i.append('tr');l.append('td').text('Pathology').attr('class','interaction-viewer-table_row-header'),l.append('td').html(On(a.diseases,a.accession)),l.append('td').html(On(n.diseases,n.accession));var s=i.append('tr');s.append('td').text('Subcellular location').attr('class','interaction-viewer-table_row-header'),s.append('td').html(Dn(a.subcellularLocations)),s.append('td').html(Dn(n.subcellularLocations));var f=i.append('tr');f.append('td').text('IntAct').attr('class','interaction-viewer-table_row-header'),f.append('td').attr('colspan',2).append('a').attr('href',o(t.interactor1,t.interactor2)).attr('target','_blank').text(t.interactor1+';'+t.interactor2)}function o(e,t){return'//www.ebi.ac.uk/intact/query/id:'+e+' AND id:'+t}function c(){Di('g').classed('active',!1),Di('circle').classed('active-cell',!1),Di('.active-row').remove()}Oi(e).select('.loader').remove(),Ol=a;var d=Oi(e).append('div').attr('class','interaction-tooltip').attr('display','none').style('opacity',0);d.append('span').attr('class','close-interaction-tooltip').text('Close \u2716').on('click',function(){Di('.interaction-tooltip').style('opacity',0).style('display','none')}),d.append('div').attr('class','tooltip-content'),Oi(e).append('p').attr('class','interaction-title').text(t+' has binary interactions with '+(Ol.length-1)+' proteins'),Wn(e,Mn());var l={top:100,right:0,bottom:10,left:100},s=18*Ol.length,f=oe().rangeRound([0,s]),p=$e().range([0.2,1]),b=Oi(e).append('svg').attr('width',s+l.left+l.right).attr('height',s+l.top+l.bottom).attr('class','interaction-viewer').append('g').attr('class','interaction-viewer-group').attr('transform','translate('+l.left+','+l.top+')');f.domain(Ol.map(function(e){return e.accession})),p.domain([0,10]);// x.domain(nodes.map(entry => entry.accession)); intensity.domain([0,
// d3.max(nodes.map(link => link.experiments))]);
var u=b.selectAll('.interaction-row').data(Ol).enter().append('g').attr('class','interaction-row').attr('transform',function(e){return'translate(0,'+f(e.accession)+')'}).each(function(e){if(e.interactions){var t=Oi(this).selectAll('.cell').data(e.interactions),a=t.enter().append('circle');a.attr('class','cell').attr('cx',function(e){return f(e.id)+f.bandwidth()/2}).attr('cy',function(){return f.bandwidth()/2}).attr('r',f.bandwidth()/3).style('fill-opacity',function(e){return p(e.experiments)}).style('display',function(t){//Only show left half of graph
return f(e.accession)<f(t.id)?'none':''}).on('click',i).on('mouseover',n).on('mouseout',c),t.exit().remove()}});u.append('rect').attr('x',-l.left).attr('width',l.left).attr('height',f.bandwidth()).attr('class','text-highlight'),u.append('text').attr('y',f.bandwidth()/2).attr('dy','.32em').attr('text-anchor','end').text(function(e,t){return Ol[t].name}).attr('class',function(e,a){return Ol[a].accession===t?'main-accession':''});var g=b.selectAll('.column').data(Ol).enter().append('g').attr('class','column').attr('transform',function(e){return'translate('+f(e.accession)+', 0)rotate(-90)'});g.append('rect').attr('x',6).attr('width',l.top).attr('height',f.bandwidth()).attr('class','text-highlight'),g.append('text').attr('x',6).attr('y',f.bandwidth()/2).attr('dy','.32em').attr('text-anchor','start').text(function(e,t){return Ol[t].name}).attr('class',function(e,a){return Ol[a].accession===t?'main-accession':''});var h=f(Ol[1].accession)+' 0,'+f(Ol[Ol.length-1].accession)+' 0,'+f(Ol[Ol.length-1].accession)+' '+f(Ol[Ol.length-1].accession)+','+f(Ol[0].accession)+' 0';b.append('polyline').attr('points',h).attr('class','hidden-side').attr('transform',function(){return'translate('+f(Ol[1].accession)+', 0)'})}function Pn(e){return Ol.find(function(t){return t.accession===e})}// Check if either the source or the target contain one of the specified
// filters. returns true if no filters selected
function En(e,t,a){return!!(0>=a.length)||Oc(e.filterTerms,a.map(function(e){return e.name})).length===a.length||Oc(t.filterTerms,a.map(function(e){return e.name})).length===a.length}// Hide nodes and labels which don't belong to a visible filter
function Ln(){var e=Dl.filter(function(e){return e.selected}),t=[];Di('.cell').attr('opacity',function(a){var n=Pn(a.source),i=Pn(a.id),r=En(n,i,e);return r&&(t.push(n.accession),t.push(i.accession)),r?1:0.1}),Di('.interaction-viewer text').attr('fill-opacity',function(e){return t.includes(e.accession)?1:0.1})}function zn(){var e,t=!0,a=!1;try{for(var n,i=Dl[Symbol.iterator]();!(t=(n=i.next()).done);t=!0){var r=n.value,o=Oi('#'+Hn(r.name));o.classed('active',r.selected)}}catch(t){a=!0,e=t}finally{try{!t&&i.return&&i.return()}finally{if(a)throw e}}Ln()}function Hn(e){return e.toLowerCase().replace(/\s|,|^\d/g,'_')}function Nn(e){var t=25;return e.length>t?e.substr(0,t-1)+'...':e}function Bn(e,t){Di('.dropdown-pane').style('visibility','hidden'),Dl.filter(function(e){return e.type===t}).forEach(function(e){return e.selected=!1}),e.selected=!e.selected,Oi('[data-toggle=iv_'+t+']').text(Nn(e.name)),zn()}function qn(e,t){Di('.dropdown-pane').style('visibility','hidden'),Dl.filter(function(t){return t.type===e}).forEach(function(e){return e.selected=!1}),Oi('[data-toggle=iv_'+e+']').text(t),zn()}function Rn(){Dl.filter(function(e){return e.selected}).forEach(function(e){return e.selected=!1}),Mn().forEach(function(e){Oi('[data-toggle=iv_'+e.name+']').text(e.label)}),zn()}function Vn(){var e='#'+Oi(this).attr('data-toggle'),t=Oi(e).style('visibility');Oi('.dropdown-pane').style('visibility','hidden'),Oi(e).style('visibility','hidden'===t?'visible':'hidden')}// Add a filter to the interface
function Wn(e,t){Oi(e).selectAll('.interaction-filter-container').remove();var a,n=Oi(e).append('div').attr('class','interaction-filter-container'),i=function(e){if(0<e.items.length)if(l=n.append('div').attr('class','interaction-filter'),l.append('a').text(e.label).attr('class','button dropdown').attr('data-toggle','iv_'+e.name).on('click',Vn),s=l.append('ul').attr('id','iv_'+e.name).attr('class','dropdown-pane'),s.append('li').text('None').on('click',function(){return qn(e.name,e.label)}),'tree'===e.type)Da(e.items,function(t){t.type=e.name,Dl.push(t),s.datum(t).append('li').style('padding-left',t.depth+'em').attr('id',function(e){return Hn(e.name)}).text(function(e){return e.name}).on('click',function(t){return Bn(t,e.name)})});else{var t,a=!0,i=!1;try{for(var r,o,c=e.items[Symbol.iterator]();!(a=(r=c.next()).done);a=!0)o=r.value,o.type=e.name,Dl.push(o)}catch(e){i=!0,t=e}finally{try{!a&&c.return&&c.return()}finally{if(i)throw t}}s.selectAll('li').data(e.items).enter().append('li').attr('id',function(e){return Hn(e.name)}).text(function(e){return e.name.toLowerCase()}).on('click',function(t){Bn(t,e.name)})}},r=!0,o=!1;// container.append("div").text('Show only interactions where one or both
// interactors have:');
try{for(var c,d=t[Symbol.iterator]();!(r=(c=d.next()).done);r=!0){var l,s,f=c.value;i(f)}}catch(e){o=!0,a=e}finally{try{!r&&d.return&&d.return()}finally{if(o)throw a}}n.append('button').attr('class','iv_reset').text('Reset filters').on('click',function(){return Rn(),!1})}function $n(e){throw Error('missing option: '+e)}var Jn=Math.sqrt,Gn=Math.atan2,Qn=Math.sin,ei=Math.cos,ti=Math.PI,ai=Math.round,ni=Math.abs,ii=Math.pow,ri=Math.LN10,oi=Math.log,ci=Math.floor,di=Math.max,li=Math.ceil,si=Math.min,fi='http://www.w3.org/1999/xhtml',pi={svg:'http://www.w3.org/2000/svg',xhtml:fi,xlink:'http://www.w3.org/1999/xlink',xml:'http://www.w3.org/XML/1998/namespace',xmlns:'http://www.w3.org/2000/xmlns/'},bi=function(e){var t=e+='',a=t.indexOf(':');return 0<=a&&'xmlns'!==(t=e.slice(0,a))&&(e=e.slice(a+1)),pi.hasOwnProperty(t)?{space:pi[t],local:e}:e},ui=function(a){var n=bi(a);return(n.local?t:e)(n)},gi=function(e){return function(){return this.matches(e)}};if('undefined'!=typeof document){var hi=document.documentElement;if(!hi.matches){var yi=hi.webkitMatchesSelector||hi.msMatchesSelector||hi.mozMatchesSelector||hi.oMatchesSelector;gi=function(e){return function(){return yi.call(this,e)}}}}var mi=gi,_i={},wi=null;if('undefined'!=typeof document){var xi=document.documentElement;'onmouseenter'in xi||(_i={mouseenter:'mouseover',mouseleave:'mouseout'})}var vi=function(){for(var e,t=wi;e=t.sourceEvent;)t=e;return t},ji=function(e,t){var a=e.ownerSVGElement||e;if(a.createSVGPoint){var n=a.createSVGPoint();return n.x=t.clientX,n.y=t.clientY,n=n.matrixTransform(e.getScreenCTM().inverse()),[n.x,n.y]}var i=e.getBoundingClientRect();return[t.clientX-i.left-e.clientLeft,t.clientY-i.top-e.clientTop]},ki=function(e){var t=vi();return t.changedTouches&&(t=t.changedTouches[0]),ji(e,t)},Ti=function(e){return null==e?i:function(){return this.querySelector(e)}},Si=function(e){return null==e?d:function(){return this.querySelectorAll(e)}},Ci=function(e){return Array(e.length)};l.prototype={constructor:l,appendChild:function(e){return this._parent.insertBefore(e,this._next)},insertBefore:function(e,t){return this._parent.insertBefore(e,t)},querySelector:function(e){return this._parent.querySelector(e)},querySelectorAll:function(e){return this._parent.querySelectorAll(e)}};var Ai=function(e){return function(){return e}},Ui='$',Mi=function(e){return e.ownerDocument&&e.ownerDocument.defaultView||// node is a Node
e.document&&e// node is a Window
||e.defaultView;// node is a Document
};M.prototype={add:function(e){var t=this._names.indexOf(e);0>t&&(this._names.push(e),this._node.setAttribute('class',this._names.join(' ')))},remove:function(e){var t=this._names.indexOf(e);0<=t&&(this._names.splice(t,1),this._node.setAttribute('class',this._names.join(' ')))},contains:function(e){return 0<=this._names.indexOf(e)}};var Fi=[null];K.prototype=function(){return new K([[document.documentElement]],Fi)}.prototype={constructor:K,select:function(e){'function'!=typeof e&&(e=Ti(e));for(var t=this._groups,a=t.length,r=Array(a),o=0;o<a;++o)for(var c,d,l=t[o],s=l.length,n=r[o]=Array(s),f=0;f<s;++f)(c=l[f])&&(d=e.call(c,c.__data__,f,l))&&('__data__'in c&&(d.__data__=c.__data__),n[f]=d);return new K(r,this._parents)},selectAll:function(e){'function'!=typeof e&&(e=Si(e));for(var t=this._groups,a=t.length,r=[],o=[],c=0;c<a;++c)for(var d,l=t[c],s=l.length,n=0;n<s;++n)(d=l[n])&&(r.push(e.call(d,d.__data__,n,l)),o.push(d));return new K(r,o)},filter:function(e){'function'!=typeof e&&(e=mi(e));for(var t=this._groups,a=t.length,r=Array(a),o=0;o<a;++o)for(var c,d=t[o],l=d.length,n=r[o]=[],s=0;s<l;++s)(c=d[s])&&e.call(c,c.__data__,s,d)&&n.push(c);return new K(r,this._parents)},data:function(e,t){if(!e)return g=Array(this.size()),l=-1,this.each(function(e){g[++l]=e}),g;var a=t?f:s,n=this._parents,i=this._groups;'function'!=typeof e&&(e=Ai(e));for(var r=i.length,o=Array(r),c=Array(r),d=Array(r),l=0;l<r;++l){var p=n[l],b=i[l],u=b.length,g=e.call(p,p&&p.__data__,l,n),h=g.length,y=c[l]=Array(h),m=o[l]=Array(h),_=d[l]=Array(u);a(p,b,y,m,_,g,t);// Now connect the enter nodes to their following update node, such that
// appendChild can insert the materialized enter node before this node,
// rather than at the end of the parent node.
for(var w,x,v=0,j=0;v<h;++v)if(w=y[v]){for(v>=j&&(j=v+1);!(x=m[j])&&++j<h;);w._next=x||null}}return o=new K(o,n),o._enter=c,o._exit=d,o},enter:function(){return new K(this._enter||this._groups.map(Ci),this._parents)},exit:function(){return new K(this._exit||this._groups.map(Ci),this._parents)},merge:function(e){for(var t=this._groups,a=e._groups,r=t.length,o=a.length,c=si(r,o),d=Array(r),l=0;l<c;++l)for(var s,f=t[l],p=a[l],b=f.length,n=d[l]=Array(b),u=0;u<b;++u)(s=f[u]||p[u])&&(n[u]=s);for(;l<r;++l)d[l]=t[l];return new K(d,this._parents)},order:function(){for(var e=this._groups,t=-1,a=e.length;++t<a;)for(var n,r=e[t],o=r.length-1,i=r[o];0<=--o;)(n=r[o])&&(i&&i!==n.nextSibling&&i.parentNode.insertBefore(n,i),i=n);return this},sort:function(e){function t(t,n){return t&&n?e(t.__data__,n.__data__):!t-!n}e||(e=p);for(var a=this._groups,r=a.length,o=Array(r),c=0;c<r;++c){for(var d,l=a[c],s=l.length,n=o[c]=Array(s),f=0;f<s;++f)(d=l[f])&&(n[f]=d);n.sort(t)}return new K(o,this._parents).order()},call:function(){var e=arguments[0];return arguments[0]=this,e.apply(null,arguments),this},nodes:function(){var e=Array(this.size()),t=-1;return this.each(function(){e[++t]=this}),e},node:function(){for(var e=this._groups,t=0,a=e.length;t<a;++t)for(var r,o=e[t],c=0,i=o.length;c<i;++c)if(r=o[c],r)return r;return null},size:function(){var e=0;return this.each(function(){++e}),e},empty:function(){return!this.node()},each:function(e){for(var t=this._groups,a=0,r=t.length;a<r;++a)for(var o,c=t[a],d=0,i=c.length;d<i;++d)(o=c[d])&&e.call(o,o.__data__,d,c);return this},attr:function(e,t){var a=bi(e);if(2>arguments.length){var n=this.node();return a.local?n.getAttributeNS(a.space,a.local):n.getAttribute(a)}return this.each((null==t?a.local?u:b:'function'==typeof t?a.local?m:y:a.local?h:g)(a,t))},style:function(e,t,a){return 1<arguments.length?this.each((null==t?_:'function'==typeof t?x:w)(e,t,null==a?'':a)):v(this.node(),e)},property:function(e,t){return 1<arguments.length?this.each((null==t?j:'function'==typeof t?T:k)(e,t)):this.node()[e]},classed:function(e,t){var a=S(e+'');if(2>arguments.length){for(var r=U(this.node()),o=-1,i=a.length;++o<i;)if(!r.contains(a[o]))return!1;return!0}return this.each(('function'==typeof t?L:t?I:P)(a,t))},text:function(e){return arguments.length?this.each(null==e?z:('function'==typeof e?Y:H)(e)):this.node().textContent},html:function(e){return arguments.length?this.each(null==e?N:('function'==typeof e?R:q)(e)):this.node().innerHTML},raise:function(){return this.each(V)},lower:function(){return this.each(W)},append:function(e){var t='function'==typeof e?e:ui(e);return this.select(function(){return this.appendChild(t.apply(this,arguments))})},insert:function(e,t){var a='function'==typeof e?e:ui(e),n=null==t?$:'function'==typeof t?t:Ti(t);return this.select(function(){return this.insertBefore(a.apply(this,arguments),n.apply(this,arguments)||null)})},remove:function(){return this.each(Z)},datum:function(e){return arguments.length?this.property('__data__',e):this.node().__data__},on:function(e,a,d){var l,i,t=r(e+''),s=t.length;if(2>arguments.length){var n=this.node().__on;if(n)for(var f,p=0,b=n.length;p<b;++p)for(l=0,f=n[p];l<s;++l)if((i=t[l]).type===f.type&&i.name===f.name)return f.value;return}for(n=a?c:o,null==d&&(d=!1),l=0;l<s;++l)this.each(n(t[l],a,d));return this},dispatch:function(e,t){return this.each(('function'==typeof t?G:J)(e,t))}};var Oi=function(e){return'string'==typeof e?new K([[document.querySelector(e)]],[document.documentElement]):new K([[e]],Fi)},Di=function(e){return'string'==typeof e?new K([document.querySelectorAll(e)],[document.documentElement]):new K([null==e?[]:e],Fi)},Ii=function(e,t){return e<t?-1:e>t?1:e>=t?0:NaN},Pi=function(e){return 1===e.length&&(e=Q(e)),{left:function(t,a,n,i){for(null==n&&(n=0),null==i&&(i=t.length);n<i;){var r=n+i>>>1;0>e(t[r],a)?n=r+1:i=r}return n},right:function(t,a,n,i){for(null==n&&(n=0),null==i&&(i=t.length);n<i;){var r=n+i>>>1;0<e(t[r],a)?i=r:n=r+1}return n}}}(Ii),Ei=Pi.right,Li=function(e,t,a){e=+e,t=+t,a=2>(i=arguments.length)?(t=e,e=0,1):3>i?1:+a;for(var r=-1,i=0|di(0,li((t-e)/a)),n=Array(i);++r<i;)n[r]=e+r*a;return n},zi=7.0710678118654755,Hi=3.1622776601683795,Yi=1.4142135623730951,Ni=function(e,t,a){var r,o,n,c,d=-1;if(t=+t,e=+e,a=+a,e===t&&0<a)return[e];if((r=t<e)&&(o=e,e=t,t=o),0===(c=ee(e,t,a))||!isFinite(c))return[];if(0<c)for(e=li(e/c),t=ci(t/c),n=Array(o=li(t-e+1));++d<o;)n[d]=(e+d)*c;else for(e=ci(e*c),t=li(t*c),n=Array(o=li(e-t+1));++d<o;)n[d]=(e-d)/c;return r&&n.reverse(),n},Bi='$';ae.prototype=ne.prototype={constructor:ae,has:function(e){return Bi+e in this},get:function(e){return this[Bi+e]},set:function(e,t){return this[Bi+e]=t,this},remove:function(e){var t=Bi+e;return t in this&&delete this[t]},clear:function(){for(var e in this)e[0]===Bi&&delete this[e]},keys:function(){var e=[];for(var t in this)t[0]===Bi&&e.push(t.slice(1));return e},values:function(){var e=[];for(var t in this)t[0]===Bi&&e.push(this[t]);return e},entries:function(){var e=[];for(var t in this)t[0]===Bi&&e.push({key:t.slice(1),value:this[t]});return e},size:function(){var e=0;for(var t in this)t[0]===Bi&&++e;return e},empty:function(){for(var e in this)if(e[0]===Bi)return!1;return!0},each:function(e){for(var t in this)t[0]===Bi&&e(this[t],t.slice(1),this)}};var qi=Array.prototype,Ri=qi.map,Vi=qi.slice,Wi={name:'implicit'},$i=function(e,t,a){e.prototype=t.prototype=a,a.constructor=e},Zi=0.7,Xi=1/Zi,Ji=/^#([0-9a-f]{3})$/,Gi=/^#([0-9a-f]{6})$/,Ki=/^rgb\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*\)$/,Qi=/^rgb\(\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)%\s*,\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)%\s*,\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)%\s*\)$/,er=/^rgba\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)\s*\)$/,tr=/^rgba\(\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)%\s*,\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)%\s*,\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)%\s*,\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)\s*\)$/,ar=/^hsl\(\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)\s*,\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)%\s*,\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)%\s*\)$/,nr=/^hsla\(\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)\s*,\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)%\s*,\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)%\s*,\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)\s*\)$/,ir={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};$i(de,le,{displayable:function(){return this.rgb().displayable()},toString:function(){return this.rgb()+''}}),$i(ue,be,ce(de,{brighter:function(e){return e=null==e?Xi:ii(Xi,e),new ue(this.r*e,this.g*e,this.b*e,this.opacity)},darker:function(e){return e=null==e?Zi:ii(Zi,e),new ue(this.r*e,this.g*e,this.b*e,this.opacity)},rgb:function(){return this},displayable:function(){return 0<=this.r&&255>=this.r&&0<=this.g&&255>=this.g&&0<=this.b&&255>=this.b&&0<=this.opacity&&1>=this.opacity},toString:function(){var e=this.opacity;return e=isNaN(e)?1:di(0,si(1,e)),(1===e?'rgb(':'rgba(')+di(0,si(255,ai(this.r)||0))+', '+di(0,si(255,ai(this.g)||0))+', '+di(0,si(255,ai(this.b)||0))+(1===e?')':', '+e+')')}})),$i(ye,function(e,t,a,n){return 1===arguments.length?he(e):new ye(e,t,a,null==n?1:n)},ce(de,{brighter:function(e){return e=null==e?Xi:ii(Xi,e),new ye(this.h,this.s,this.l*e,this.opacity)},darker:function(e){return e=null==e?Zi:ii(Zi,e),new ye(this.h,this.s,this.l*e,this.opacity)},rgb:function(){var e=this.h%360+360*(0>this.h),t=isNaN(e)||isNaN(this.s)?0:this.s,a=this.l,n=a+(0.5>a?a:1-a)*t,i=2*a-n;return new ue(me(240<=e?e-240:e+120,i,n),me(e,i,n),me(120>e?e+240:e-120,i,n),this.opacity)},displayable:function(){return(0<=this.s&&1>=this.s||isNaN(this.s))&&0<=this.l&&1>=this.l&&0<=this.opacity&&1>=this.opacity}}));var rr=ti/180,or=180/ti,cr=18,Kn=0.95047,Xn=1,Yn=1.08883,Zn=4/29,dr=6/29,lr=3*dr*dr,sr=dr*dr*dr;$i(we,function(e,t,a,n){return 1===arguments.length?_e(e):new we(e,t,a,null==n?1:n)},ce(de,{brighter:function(e){return new we(this.l+cr*(null==e?1:e),this.a,this.b,this.opacity)},darker:function(e){return new we(this.l-cr*(null==e?1:e),this.a,this.b,this.opacity)},rgb:function(){var e=(this.l+16)/116,t=isNaN(this.a)?e:e+this.a/500,a=isNaN(this.b)?e:e-this.b/200;return e=Xn*ve(e),t=Kn*ve(t),a=Yn*ve(a),new ue(je(3.2404542*t-1.5371385*e-0.4985314*a),// D65 -> sRGB
je(-0.969266*t+1.8760108*e+0.041556*a),je(0.0556434*t-0.2040259*e+1.0572252*a),this.opacity)}})),$i(Se,function(e,t,a,n){return 1===arguments.length?Te(e):new Se(e,t,a,null==n?1:n)},ce(de,{brighter:function(e){return new Se(this.h,this.c,this.l+cr*(null==e?1:e),this.opacity)},darker:function(e){return new Se(this.h,this.c,this.l-cr*(null==e?1:e),this.opacity)},rgb:function(){return _e(this).rgb()}}));var fr=-0.14861,A=+1.78277,B=-0.29227,C=-0.90649,D=+1.97294,E=D*C,pr=D*A,br=A*B-C*fr;$i(Ue,Ae,ce(de,{brighter:function(e){return e=null==e?Xi:ii(Xi,e),new Ue(this.h,this.s,this.l*e,this.opacity)},darker:function(e){return e=null==e?Zi:ii(Zi,e),new Ue(this.h,this.s,this.l*e,this.opacity)},rgb:function(){var e=isNaN(this.h)?0:(this.h+120)*rr,t=+this.l,n=isNaN(this.s)?0:this.s*t*(1-t),a=ei(e),i=Qn(e);return new ue(255*(t+n*(fr*a+A*i)),255*(t+n*(B*a+C*i)),255*(t+n*(D*a)),this.opacity)}}));var ur=function(e){return function(){return e}},gr=function e(t){function a(e,t){var a=n((e=be(e)).r,(t=be(t)).r),i=n(e.g,t.g),r=n(e.b,t.b),o=De(e.opacity,t.opacity);return function(n){return e.r=a(n),e.g=i(n),e.b=r(n),e.opacity=o(n),e+''}}var n=Oe(t);return a.gamma=e,a}(1),hr=function(e,t){var a,n=t?t.length:0,i=e?si(n,e.length):0,r=Array(n),o=Array(n);for(a=0;a<i;++a)r[a]=jr(e[a],t[a]);for(;a<n;++a)o[a]=t[a];return function(e){for(a=0;a<i;++a)o[a]=r[a](e);return o}},yr=function(e,n){var i=new Date;return e=+e,n-=e,function(a){return i.setTime(e+n*a),i}},mr=function(e,n){return e=+e,n-=e,function(a){return e+n*a}},_r=function(e,t){var n,r={},i={};for(n in(null===e||'object'!=typeof e)&&(e={}),(null===t||'object'!=typeof t)&&(t={}),t)n in e?r[n]=jr(e[n],t[n]):i[n]=t[n];return function(e){for(n in r)i[n]=r[n](e);return i}},wr=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,xr=new RegExp(wr.source,'g'),vr=function(e,a){var// scan index for next number in b
t,// current match in a
n,// current match in b
r,o=wr.lastIndex=xr.lastIndex=0,// string preceding current number in b, if any
c=-1,// index in s
d=[],// string constants and placeholders
l=[];// number interpolators
// Coerce inputs to strings.
// Interpolate pairs of numbers in a & b.
for(e+='',a+='';(t=wr.exec(e))&&(n=xr.exec(a));)(r=n.index)>o&&(r=a.slice(o,r),d[c]?d[c]+=r:d[++c]=r),(t=t[0])===(n=n[0])?d[c]?d[c]+=n:d[++c]=n:(d[++c]=null,l.push({i:c,x:mr(t,n)})),o=xr.lastIndex;// Add remains of b.
// Special optimization for only a single match.
// Otherwise, interpolate each of the numbers and rejoin the string.
return o<a.length&&(r=a.slice(o),d[c]?d[c]+=r:d[++c]=r),2>d.length?l[0]?Pe(l[0].x):Ie(a):(a=l.length,function(e){for(var t,n=0;n<a;++n)d[(t=l[n]).i]=t.x(e);return d.join('')})},jr=function(e,a){var n,i=typeof a;return null==a||'boolean'==i?ur(a):('number'==i?mr:'string'==i?(n=le(a))?(a=n,gr):vr:a instanceof le?gr:a instanceof Date?yr:Array.isArray(a)?hr:'function'!=typeof a.valueOf&&'function'!=typeof a.toString||isNaN(a)?_r:mr)(e,a)},kr=function(e,n){return e=+e,n-=e,function(a){return ai(e+n*a)}};Ee(function(e,t){var a=t-e;return a?Me(e,180<a||-180>a?a-360*ai(a/360):a):ur(isNaN(e)?t:e)});var Tr,Sr=Ee(De),Cr=function(e){return function(){return e}},Ar=function(e){return+e},Ur=[0,1],Mr=function(e,t){if(0>(a=(e=t?e.toExponential(t-1):e.toExponential()).indexOf('e')))return null;// NaN, ±Infinity
var a,n=e.slice(0,a);// The string returned by toExponential either has the form \d\.\d+e[-+]\d+
// (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
return[1<n.length?n[0]+n.slice(2):n,+e.slice(a+1)]},Fr=function(e){return e=Mr(ni(e)),e?e[1]:NaN},Or=function(e,a){return function(n,r){for(var o=n.length,i=[],t=0,c=e[0],d=0;0<o&&0<c&&(d+c+1>r&&(c=di(1,r-d)),i.push(n.substring(o-=c,o+c)),!((d+=c+1)>r));)c=e[t=(t+1)%e.length];return i.reverse().join(a)}},Dr=function(e){return function(t){return t.replace(/[0-9]/g,function(t){return e[+t]})}},Ir=function(e,t){var a=Mr(e,t);if(!a)return e+'';var n=a[0],i=a[1];return 0>i?'0.'+Array(-i).join('0')+n:n.length>i+1?n.slice(0,i+1)+'.'+n.slice(i+1):n+Array(i-n.length+2).join('0')},Pr={"":function(e,t){e=e.toPrecision(t);out:for(var a,r=e.length,n=1,i=-1;n<r;++n)switch(e[n]){case'.':i=a=n;break;case'0':0===i&&(i=n),a=n;break;case'e':break out;default:0<i&&(i=0);}return 0<i?e.slice(0,i)+e.slice(a+1):e},"%":function(e,t){return(100*e).toFixed(t)},b:function(e){return ai(e).toString(2)},c:function(e){return e+''},d:function(e){return ai(e).toString(10)},e:function(e,t){return e.toExponential(t)},f:function(e,t){return e.toFixed(t)},g:function(e,t){return e.toPrecision(t)},o:function(e){return ai(e).toString(8)},p:function(e,t){return Ir(100*e,t)},r:Ir,s:function(e,t){var a=Mr(e,t);if(!a)return e+'';var r=a[0],o=a[1],c=o-(Tr=3*di(-8,si(8,ci(o/3))))+1,i=r.length;return c===i?r:c>i?r+Array(c-i+1).join('0'):0<c?r.slice(0,c)+'.'+r.slice(c):'0.'+Array(1-c).join('0')+Mr(e,di(0,t+c-1))[0];// less than 1y!
},X:function(e){return ai(e).toString(16).toUpperCase()},x:function(e){return ai(e).toString(16)}},Er=/^(?:(.)?([<>=^]))?([+\-\( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?([a-z%])?$/i;Re.prototype=Ve.prototype,Ve.prototype.toString=function(){return this.fill+this.align+this.sign+this.symbol+(this.zero?'0':'')+(null==this.width?'':di(1,0|this.width))+(this.comma?',':'')+(null==this.precision?'':'.'+di(0,0|this.precision))+this.type};var re,Lr,zr,Hr=function(e){return e},Yr=['y','z','a','f','p','n','\xB5','m','','k','M','G','T','P','E','Z','Y'],Nr=function(e){function t(e){function t(e){var t,i,n,s=h,w=y;if('c'===g)w=m(e)+w,e='';else{e=+e;// Perform the initial formatting.
var x=0>e;// Break the formatted value into the integer “value” part that can be
// grouped, and fractional or exponential “suffix” part that is not.
if(e=m(ni(e),u),x&&0==+e&&(x=!1),s=(x?'('===l?l:'-':'-'===l||'('===l?'':l)+s,w=w+('s'===g?Yr[8+Tr/3]:'')+(x&&'('===l?')':''),_)for(t=-1,i=e.length;++t<i;)if(n=e.charCodeAt(t),48>n||57<n){w=(46===n?r+e.slice(t+1):e.slice(t))+w,e=e.slice(0,t);break}}// If the fill character is not "0", grouping is applied before padding.
b&&!f&&(e=a(e,Infinity));// Compute the padding.
var v=s.length+e.length+w.length,j=v<p?Array(p-v+1).join(d):'';// If the fill character is "0", grouping is applied after padding.
// Reconstruct the final output based on the desired alignment.
switch(b&&f&&(e=a(j+e,j.length?p-w.length:Infinity),j=''),c){case'<':e=s+e+w+j;break;case'=':e=s+j+e+w;break;case'^':e=j.slice(0,v=j.length>>1)+s+e+w+j.slice(v);break;default:e=j+s+e+w;}return o(e)}e=Re(e);var d=e.fill,c=e.align,l=e.sign,s=e.symbol,f=e.zero,p=e.width,b=e.comma,u=e.precision,g=e.type,h='$'===s?n[0]:'#'===s&&/[boxX]/.test(g)?'0'+g.toLowerCase():'',y='$'===s?n[1]:/[%p]/.test(g)?i:'',m=Pr[g],_=!g||/[defgprs%]/.test(g);// Compute the prefix and suffix.
// For SI-prefix, the suffix is lazily computed.
// What format function should we use?
// Is this an integer type?
// Can this type generate exponential notation?
// Set the default precision if not specified,
// or clamp the specified precision to the supported range.
// For significant precision, it must be in [1, 21].
// For fixed precision, it must be in [0, 20].
return u=null==u?g?6:12:/[gprs]/.test(g)?di(1,si(21,u)):di(0,si(20,u)),t.toString=function(){return e+''},t}var a=e.grouping&&e.thousands?Or(e.grouping,e.thousands):Hr,n=e.currency,r=e.decimal,o=e.numerals?Dr(e.numerals):Hr,i=e.percent||'%';return{format:t,formatPrefix:function(a,n){var i=t((a=Re(a),a.type='f',a)),r=3*di(-8,si(8,ci(Fr(n)/3))),o=ii(10,-r),c=Yr[8+r/3];return function(e){return i(o*e)+c}}}};(function(e){return re=Nr(e),Lr=re.format,zr=re.formatPrefix,re})({decimal:'.',thousands:',',grouping:[3],currency:['$','']});var Br=function(e){return di(0,-Fr(ni(e)))},qr=function(e,t){return di(0,3*di(-8,si(8,ci(Fr(t)/3)))-Fr(ni(e)))},Rr=function(e,t){return e=ni(e),t=ni(t)-e,di(0,Fr(t)-Fr(e))+1},Vr=function(e,t,a){var n,i=e[0],r=e[e.length-1],o=te(i,r,null==t?10:t);switch(a=Re(null==a?',f':a),a.type){case's':{var c=di(ni(i),ni(r));return null!=a.precision||isNaN(n=qr(o,c))||(a.precision=n),zr(a,c)}case'':case'e':case'g':case'p':case'r':{null!=a.precision||isNaN(n=Rr(o,di(ni(i),ni(r))))||(a.precision=n-('e'===a.type));break}case'f':case'%':{null!=a.precision||isNaN(n=Br(o))||(a.precision=n-2*('%'===a.type));break}}return Lr(a)},Wr=new Date,$r=new Date,Zr=Ze(function(){// noop
},function(e,t){e.setTime(+e+t)},function(e,t){return t-e});// An optimized implementation for this simple case.
Zr.every=function(e){return e=ci(e),isFinite(e)&&0<e?1<e?Ze(function(t){t.setTime(ci(t/e)*e)},function(t,a){t.setTime(+t+a*e)},function(t,a){return(a-t)/e}):Zr:null};var Xr=1e3,Jr=6e4,Gr=36e5,Kr=864e5,Qr=6048e5,eo=Ze(function(e){e.setTime(ci(e/Xr)*Xr)},function(e,t){e.setTime(+e+t*Xr)},function(e,t){return(t-e)/Xr},function(e){return e.getUTCSeconds()}),to=Ze(function(e){e.setTime(ci(e/Jr)*Jr)},function(e,t){e.setTime(+e+t*Jr)},function(e,t){return(t-e)/Jr},function(e){return e.getMinutes()}),ao=Ze(function(e){var t=e.getTimezoneOffset()*Jr%Gr;0>t&&(t+=Gr),e.setTime(ci((+e-t)/Gr)*Gr+t)},function(e,t){e.setTime(+e+t*Gr)},function(e,t){return(t-e)/Gr},function(e){return e.getHours()}),no=Ze(function(e){e.setHours(0,0,0,0)},function(e,t){e.setDate(e.getDate()+t)},function(e,t){return(t-e-(t.getTimezoneOffset()-e.getTimezoneOffset())*Jr)/Kr},function(e){return e.getDate()-1}),io=Xe(0),ro=Xe(1),oo=Xe(2),co=Xe(3),lo=Xe(4),so=Xe(5),fo=Xe(6),po=Ze(function(e){e.setDate(1),e.setHours(0,0,0,0)},function(e,t){e.setMonth(e.getMonth()+t)},function(e,t){return t.getMonth()-e.getMonth()+12*(t.getFullYear()-e.getFullYear())},function(e){return e.getMonth()}),bo=Ze(function(e){e.setMonth(0,1),e.setHours(0,0,0,0)},function(e,t){e.setFullYear(e.getFullYear()+t)},function(e,t){return t.getFullYear()-e.getFullYear()},function(e){return e.getFullYear()});// An optimized implementation for this simple case.
bo.every=function(e){return isFinite(e=ci(e))&&0<e?Ze(function(t){t.setFullYear(ci(t.getFullYear()/e)*e),t.setMonth(0,1),t.setHours(0,0,0,0)},function(t,a){t.setFullYear(t.getFullYear()+a*e)}):null};var uo=Ze(function(e){e.setUTCSeconds(0,0)},function(e,t){e.setTime(+e+t*Jr)},function(e,t){return(t-e)/Jr},function(e){return e.getUTCMinutes()}),go=Ze(function(e){e.setUTCMinutes(0,0,0)},function(e,t){e.setTime(+e+t*Gr)},function(e,t){return(t-e)/Gr},function(e){return e.getUTCHours()}),ho=Ze(function(e){e.setUTCHours(0,0,0,0)},function(e,t){e.setUTCDate(e.getUTCDate()+t)},function(e,t){return(t-e)/Kr},function(e){return e.getUTCDate()-1}),yo=Je(0),mo=Je(1),_o=Je(2),wo=Je(3),xo=Je(4),vo=Je(5),jo=Je(6),ko=Ze(function(e){e.setUTCDate(1),e.setUTCHours(0,0,0,0)},function(e,t){e.setUTCMonth(e.getUTCMonth()+t)},function(e,t){return t.getUTCMonth()-e.getUTCMonth()+12*(t.getUTCFullYear()-e.getUTCFullYear())},function(e){return e.getUTCMonth()}),To=Ze(function(e){e.setUTCMonth(0,1),e.setUTCHours(0,0,0,0)},function(e,t){e.setUTCFullYear(e.getUTCFullYear()+t)},function(e,t){return t.getUTCFullYear()-e.getUTCFullYear()},function(e){return e.getUTCFullYear()});// An optimized implementation for this simple case.
To.every=function(e){return isFinite(e=ci(e))&&0<e?Ze(function(t){t.setUTCFullYear(ci(t.getUTCFullYear()/e)*e),t.setUTCMonth(0,1),t.setUTCHours(0,0,0,0)},function(t,a){t.setUTCFullYear(t.getUTCFullYear()+a*e)}):null};var So,Co,Ao,Uo={0:'0',"-":'',_:' '},Mo=/^\s*\d+/,Fo=/^%/,Oo=/[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;(function(e){return So=et(e),Co=So.utcFormat,Ao=So.utcParse,So})({dateTime:'%x, %X',date:'%-m/%-d/%Y',time:'%-I:%M:%S %p',periods:['AM','PM'],days:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],shortDays:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],months:['January','February','March','April','May','June','July','August','September','October','November','December'],shortMonths:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']});var Do='%Y-%m-%dT%H:%M:%S.%LZ',Io=Date.prototype.toISOString?function(e){return e.toISOString()}:Co(Do),Po=+new Date('2000-01-01T00:00:00.000Z')?function(e){var t=new Date(e);return isNaN(t)?null:t}:Ao(Do),Eo=function(e){return e.match(/.{6}/g).map(function(e){return'#'+e})};Eo('1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf'),Eo('393b795254a36b6ecf9c9ede6379398ca252b5cf6bcedb9c8c6d31bd9e39e7ba52e7cb94843c39ad494ad6616be7969c7b4173a55194ce6dbdde9ed6'),Eo('3182bd6baed69ecae1c6dbefe6550dfd8d3cfdae6bfdd0a231a35474c476a1d99bc7e9c0756bb19e9ac8bcbddcdadaeb636363969696bdbdbdd9d9d9'),Eo('1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5'),Sr(Ae(300,0.5,0),Ae(-240,0.5,1));var Lo=Sr(Ae(-100,0.75,0.35),Ae(80,1.5,0.8)),zo=Sr(Ae(260,0.75,0.35),Ae(80,1.5,0.8)),Ho=Ae();Zt(Eo('44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725'));var Yo=Zt(Eo('00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf')),No=Zt(Eo('00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4')),Bo=Zt(Eo('0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921')),qo='object'==typeof global&&global&&global.Object===Object&&global,Ro='object'==typeof self&&self&&self.Object===Object&&self,Vo=qo||Ro||Function('return this')(),Wo=Vo.Symbol,$o=Object.prototype,Zo=$o.hasOwnProperty,Xo=$o.toString,Jo=Wo?Wo.toStringTag:void 0,Go=Object.prototype,Ko=Go.toString,Qo='[object Null]',ec='[object Undefined]',tc=Wo?Wo.toStringTag:void 0,ac='[object AsyncFunction]',nc='[object Function]',ic='[object GeneratorFunction]',rc='[object Proxy]',oc=Vo['__core-js_shared__'],cc=function(){var e=/[^.]+$/.exec(oc&&oc.keys&&oc.keys.IE_PROTO||'');return e?'Symbol(src)_1.'+e:''}(),dc=Function.prototype,lc=dc.toString,sc=/[\\^$.*+?()[\]{}|]/g,fc=/^\[object .+?Constructor\]$/,pc=Function.prototype,bc=Object.prototype,uc=pc.toString,gc=bc.hasOwnProperty,hc=RegExp('^'+uc.call(gc).replace(sc,'\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,'$1.*?')+'$'),yc=ra(Object,'create'),mc=Object.prototype,_c=mc.hasOwnProperty,wc=Object.prototype,xc=wc.hasOwnProperty;/** Used as a reference to the global object. *//** Used to check objects for own properties. *//**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 *//** Built-in value references. *//**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 *//** Built-in value references. *//** Used to resolve the decompiled source of functions. *//** Used to detect host constructors (Safari). *//** Used for built-in method references. *//** Used to resolve the decompiled source of functions. *//** Used to check objects for own properties. *//** Used to detect if a method is native. *//** Used for built-in method references. *//** Used to check objects for own properties. *//** Used to check objects for own properties. */oa.prototype.clear=function(){this.__data__=yc?yc(null):{},this.size=0},oa.prototype['delete']=function(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t},oa.prototype.get=function(e){var t=this.__data__;if(yc){var a=t[e];return a==='__lodash_hash_undefined__'?void 0:a}return _c.call(t,e)?t[e]:void 0},oa.prototype.has=function(e){var t=this.__data__;return yc?t[e]!==void 0:xc.call(t,e)},oa.prototype.set=function(e,t){var a=this.__data__;return this.size+=this.has(e)?0:1,a[e]=yc&&void 0===t?'__lodash_hash_undefined__':t,this};var vc=Array.prototype,jc=vc.splice;/** Built-in value references. */la.prototype.clear=function(){this.__data__=[],this.size=0},la.prototype['delete']=function(e){var t=this.__data__,a=da(t,e);if(0>a)return!1;var n=t.length-1;return a==n?t.pop():jc.call(t,a,1),--this.size,!0},la.prototype.get=function(e){var t=this.__data__,a=da(t,e);return 0>a?void 0:t[a][1]},la.prototype.has=function(e){return-1<da(this.__data__,e)},la.prototype.set=function(e,t){var a=this.__data__,n=da(a,e);return 0>n?(++this.size,a.push([e,t])):a[n][1]=t,this};var kc=ra(Vo,'Map');pa.prototype.clear=function(){this.size=0,this.__data__={hash:new oa,map:new(kc||la),string:new oa}},pa.prototype['delete']=function(e){var t=fa(this,e)['delete'](e);return this.size-=t?1:0,t},pa.prototype.get=function(e){return fa(this,e).get(e)},pa.prototype.has=function(e){return fa(this,e).has(e)},pa.prototype.set=function(e,t){var a=fa(this,e),n=a.size;return a.set(e,t),this.size+=a.size==n?0:1,this};/** Used to stand-in for `undefined` hash values. */ba.prototype.add=ba.prototype.push=function(e){return this.__data__.set(e,'__lodash_hash_undefined__'),this},ba.prototype.has=function(e){return this.__data__.has(e)};var Tc=si,Sc=di,Cc=function(){try{var e=ra(Object,'defineProperty');return e({},'',{}),e}catch(t){}}(),Ac=Cc?function(e,t){return Cc(e,'toString',{configurable:!0,enumerable:!1,value:Sa(t),writable:!0})}:ja,Uc=Date.now,Mc=function(e){var t=0,a=0;return function(){var n=Uc(),i=16-(n-a);if(a=n,!(0<i))t=0;else if(++t>=800)return arguments[0];return e.apply(void 0,arguments)}}(Ac),Fc=9007199254740991,Oc=function(e,t){return Mc(Ta(e,t,ja),e+'')}(function(e){var t=Xt(e,Fa);return t.length&&t[0]===e[0]?va(t):[]}),Dc=function e(t,a,n){if(!(0>=a.length)){var i,r=!0,o=!1;try{for(var c,d,l=t[Symbol.iterator]();!(r=(c=l.next()).done);r=!0)if(d=c.value,d.name===a[0])return void e(d.children,a.slice(1),d)}catch(e){o=!0,i=e}finally{try{!r&&l.return&&l.return()}finally{if(o)throw i}}var s={name:a[0],selected:!1,parent:n,children:[]};t.push(s),e(s.children,a.slice(1),s)}};/** Used to detect hot functions by number of calls within a span of milliseconds. *//* Built-in method references for those with the same name as other `lodash` methods. */Ia.prototype.clear=function(){this.__data__=new la,this.size=0},Ia.prototype['delete']=function(e){var t=this.__data__,a=t['delete'](e);return this.size=t.size,a},Ia.prototype.get=function(e){return this.__data__.get(e)},Ia.prototype.has=function(e){return this.__data__.has(e)},Ia.prototype.set=function(e,t){var a=this.__data__;if(a instanceof la){var n=a.__data__;if(!kc||n.length<200-1)return n.push([e,t]),this.size=++a.size,this;a=this.__data__=new pa(n)}return a.set(e,t),this.size=a.size,this};var Ic=Object.prototype,Pc=Ic.hasOwnProperty,Ec='[object Arguments]',Lc=Object.prototype,zc=Lc.hasOwnProperty,Hc=Lc.propertyIsEnumerable,Yc=Ya(function(){return arguments}())?Ya:function(e){return Ua(e)&&zc.call(e,'callee')&&!Hc.call(e,'callee')},Nc=Array.isArray,Bc='object'==typeof exports&&exports&&!exports.nodeType&&exports,qc=Bc&&'object'==typeof module&&module&&!module.nodeType&&module,Rc=qc&&qc.exports===Bc,Vc=Rc?Vo.Buffer:void 0,Wc=Vc?Vc.isBuffer:void 0,$c=Wc||function(){return!1},Zc=9007199254740991,Xc=/^(?:0|[1-9]\d*)$/,Jc={};/** Used to check objects for own properties. *//** Used to check objects for own properties. *//** Built-in value references. *//**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 *//**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 *//** Detect free variable `module`. *//** Detect the popular CommonJS extension `module.exports`. *//** Built-in value references. *//* Built-in method references for those with the same name as other `lodash` methods. *//**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 *//** Used as references for various `Number` constants. *//** Used to detect unsigned integer values. *//** Used to identify `toStringTag` values of typed arrays. */Jc['[object Float32Array]']=Jc['[object Float64Array]']=Jc['[object Int8Array]']=Jc['[object Int16Array]']=Jc['[object Int32Array]']=Jc['[object Uint8Array]']=Jc['[object Uint8ClampedArray]']=Jc['[object Uint16Array]']=Jc['[object Uint32Array]']=!0,Jc['[object Arguments]']=Jc['[object Array]']=Jc['[object ArrayBuffer]']=Jc['[object Boolean]']=Jc['[object DataView]']=Jc['[object Date]']=Jc['[object Error]']=Jc['[object Function]']=Jc['[object Map]']=Jc['[object Number]']=Jc['[object Object]']=Jc['[object RegExp]']=Jc['[object Set]']=Jc['[object String]']=Jc['[object WeakMap]']=!1;var Gc='object'==typeof exports&&exports&&!exports.nodeType&&exports,Kc=Gc&&'object'==typeof module&&module&&!module.nodeType&&module,Qc=Kc&&Kc.exports===Gc,ed=Qc&&qo.process,td=function(){try{return ed&&ed.binding&&ed.binding('util')}catch(t){}}(),ad=td&&td.isTypedArray,nd=ad?wa(ad):function(e){return Ua(e)&&Ca(e.length)&&!!Jc[Kt(e)]},id=Object.prototype,rd=id.hasOwnProperty,od=Object.prototype,cd=Ra(Object.keys,Object),dd=Object.prototype,ld=dd.hasOwnProperty,sd=Object.prototype,fd=sd.hasOwnProperty,pd='object'==typeof exports&&exports&&!exports.nodeType&&exports,bd=pd&&'object'==typeof module&&module&&!module.nodeType&&module,ud=bd&&bd.exports===pd,gd=ud?Vo.Buffer:void 0,hd=gd?gd.allocUnsafe:void 0,yd=Object.prototype,md=yd.propertyIsEnumerable,_d=Object.getOwnPropertySymbols,wd=_d?function(e){return null==e?[]:(e=Object(e),en(_d(e),function(t){return md.call(e,t)}))}:tn,xd=Ra(Object.getPrototypeOf,Object),vd=Object.getOwnPropertySymbols,jd=vd?function(e){for(var t=[];e;)nn(t,wd(e)),e=xd(e);return t}:tn,kd=ra(Vo,'DataView'),Td=ra(Vo,'Promise'),Sd=ra(Vo,'Set'),Cd=ra(Vo,'WeakMap'),Ad='[object Map]',Ud='[object Promise]',Md='[object Set]',Fd='[object WeakMap]',Od='[object DataView]',Dd=aa(kd),Id=aa(kc),Pd=aa(Td),Ed=aa(Sd),Ld=aa(Cd),zd=Kt;/** Detect free variable `module`. *//** Detect the popular CommonJS extension `module.exports`. *//** Detect free variable `process` from Node.js. *//** Used to access faster Node.js helpers. *//**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 *//** Used to check objects for own properties. *//** Used to check objects for own properties. *//** Used to check objects for own properties. *//** Detect free variable `module`. *//** Detect the popular CommonJS extension `module.exports`. *//** Built-in value references. *//** Built-in value references. *//* Built-in method references for those with the same name as other `lodash` methods. *//**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 *//**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 *//** Used to detect maps, sets, and weakmaps. *//**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
(kd&&zd(new kd(new ArrayBuffer(1)))!=Od||kc&&zd(new kc)!=Ad||Td&&zd(Td.resolve())!=Ud||Sd&&zd(new Sd)!=Md||Cd&&zd(new Cd)!=Fd)&&(zd=function(e){var t=Kt(e),a=t=='[object Object]'?e.constructor:void 0,n=a?aa(a):'';if(n)switch(n){case Dd:return Od;case Id:return Ad;case Pd:return Ud;case Ed:return Md;case Ld:return Fd;}return t});var Hd=zd,Yd=Object.prototype,Nd=Yd.hasOwnProperty,Bd=Vo.Uint8Array,qd=1,Rd=/\w*$/,Vd=1,Wd=Wo?Wo.prototype:void 0,$d=Wd?Wd.valueOf:void 0,Zd='[object Boolean]',Xd='[object Date]',Jd='[object Map]',Gd='[object Number]',Kd='[object RegExp]',Qd='[object Set]',el='[object String]',tl='[object Symbol]',al='[object ArrayBuffer]',nl='[object DataView]',il='[object Float32Array]',rl='[object Float64Array]',ol='[object Int8Array]',cl='[object Int16Array]',dl='[object Int32Array]',ll='[object Uint8Array]',sl='[object Uint8ClampedArray]',fl='[object Uint16Array]',pl='[object Uint32Array]',bl=Object.create,ul=function(){function e(){}return function(t){if(!Qt(t))return{};if(bl)return bl(t);e.prototype=t;var a=new e;return e.prototype=void 0,a}}(),gl=1,hl=2,yl=4,ml='[object Arguments]',_l='[object Function]',wl='[object GeneratorFunction]',xl='[object Object]',vl={};/** Used for built-in method references. *//** Used to check objects for own properties. *//**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 *//** `Object#toString` result references. *//** Used to identify `toStringTag` values supported by `_.clone`. */vl[ml]=vl['[object Array]']=vl['[object ArrayBuffer]']=vl['[object DataView]']=vl['[object Boolean]']=vl['[object Date]']=vl['[object Float32Array]']=vl['[object Float64Array]']=vl['[object Int8Array]']=vl['[object Int16Array]']=vl['[object Int32Array]']=vl['[object Map]']=vl['[object Number]']=vl[xl]=vl['[object RegExp]']=vl['[object Set]']=vl['[object String]']=vl['[object Symbol]']=vl['[object Uint8Array]']=vl['[object Uint8ClampedArray]']=vl['[object Uint16Array]']=vl['[object Uint32Array]']=!0,vl['[object Error]']=vl[_l]=vl['[object WeakMap]']=!1;var jl=4,kl=function(){function e(e){this.value=e}function t(t){function a(i,r){try{var o=t[i](r),c=o.value;c instanceof e?Promise.resolve(c.value).then(function(e){a('next',e)},function(e){a('throw',e)}):n(o.done?'return':'normal',o.value)}catch(e){n('throw',e)}}function n(e,t){'return'===e?i.resolve({value:t,done:!0}):'throw'===e?i.reject(t):i.resolve({value:t,done:!1});i=i.next,i?a(i.key,i.arg):r=null}var i,r;this._invoke=function(e,t){return new Promise(function(n,o){var c={key:e,arg:t,resolve:n,reject:o,next:null};r?r=r.next=c:(i=r=c,a(e,t))})},'function'!=typeof t.return&&(this.return=void 0)}return'function'==typeof Symbol&&Symbol.asyncIterator&&(t.prototype[Symbol.asyncIterator]=function(){return this}),t.prototype.next=function(e){return this._invoke('next',e)},t.prototype.throw=function(e){return this._invoke('throw',e)},t.prototype.return=function(e){return this._invoke('return',e)},{wrap:function(e){return function(){return new t(e.apply(this,arguments))}},await:function(t){return new e(t)}}}(),Tl=function(e,t){if(!(e instanceof t))throw new TypeError('Cannot call a class as a function')},Sl=function(){function e(e,t){for(var a,n=0;n<t.length;n++)a=t[n],a.enumerable=a.enumerable||!1,a.configurable=!0,'value'in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),Cl=function(e,t){if('function'!=typeof t&&null!==t)throw new TypeError('Super expression must either be null or a function, not '+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)},Al=function(e,t){if(!e)throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');return t&&('object'==typeof t||'function'==typeof t)?t:e},Ul=function(){function e(e,t){var a,n=[],i=!0,r=!1;try{for(var o,c=e[Symbol.iterator]();!(i=(o=c.next()).done)&&(n.push(o.value),!(t&&n.length===t));i=!0);}catch(e){r=!0,a=e}finally{try{!i&&c['return']&&c['return']()}finally{if(r)throw a}}return n}return function(t,a){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,a);throw new TypeError('Invalid attempt to destructure non-iterable instance')}}(),Ml=[],Fl={};(function(e,t){if('undefined'==typeof document)return t;e=e||'';var a=document.head||document.getElementsByTagName('head')[0],n=document.createElement('style');return n.type='text/css',a.appendChild(n),n.styleSheet?n.styleSheet.cssText=e:n.appendChild(document.createTextNode(e)),t})('@charset "UTF-8";interaction-viewer{position:relative}interaction-viewer text{font-family:Open Sans,sans-serif;fill:#000;opacity:.75;font-size:12px}interaction-viewer .active text{opacity:1}interaction-viewer .active-row{stroke:#4a90e2}interaction-viewer .interaction-tooltip{z-index:2;position:absolute;background:#fff;padding:.5em 1em;border:1px solid #979797;box-shadow:2px 2px 2px #333;transition:all .25s;min-width:36em}interaction-viewer .interaction-tooltip .close-interaction-tooltip{cursor:pointer;float:right;margin-bottom:.8em}interaction-viewer .interaction-tooltip .tooltip-content{clear:both}interaction-viewer .interaction-filter-container{text-align:left}interaction-viewer .interaction-filter-container #filter-display .filter-selected{margin:.2em .5em;padding:.3em .1em;background-color:#f2f2f2;border:1px solid #e8e8e8;cursor:pointer;white-space:nowrap;display:inline-block}interaction-viewer .interaction-filter-container #filter-display .filter-selected:after{content:"\u2716";margin:0 .3em}interaction-viewer .interaction-filter-container .interaction-filter{vertical-align:top;margin-bottom:.5em;display:inline-block}interaction-viewer .interaction-filter-container .interaction-filter ul{border:1px solid #e8e8e8;max-height:15em;overflow-y:auto;list-style:none;padding:0;margin:0}interaction-viewer .interaction-filter-container .interaction-filter ul li{cursor:pointer;padding:.5em;border-bottom:1px solid #e8e8e8}interaction-viewer .interaction-filter-container .interaction-filter ul li:hover{background-color:#f2f2f2}interaction-viewer .interaction-filter-container .interaction-filter ul li.active{font-weight:700}interaction-viewer .interaction-viewer .cell{fill:#4a90e2}interaction-viewer .interaction-viewer .cell.active-cell{r:.8em;transition:all .5s}interaction-viewer .interaction-viewer .hidden-side{fill:#e8e8e8}interaction-viewer .interaction-viewer .main-accession{font-weight:700}interaction-viewer .interaction-viewer .text-highlight{fill:#fff;opacity:0;transition:all .5s}interaction-viewer .interaction-viewer-table tr:nth-child(2n){background:#f2f2f2}interaction-viewer .interaction-viewer-table td,interaction-viewer .interaction-viewer-table th{padding:.5em;text-align:center}interaction-viewer .interaction-viewer-table th{background-color:#e8e8e8;white-space:nowrap}interaction-viewer .interaction-viewer-table .interaction-viewer-table_row-header{font-weight:700;text-align:right}interaction-viewer .button{display:inline-block;vertical-align:middle;margin:0 1em 0 0;padding:.85em 1em;-webkit-appearance:none;border:1px solid transparent;border-radius:0;transition:background-color .25s ease-out,color .25s ease-out;line-height:1;text-align:center;cursor:pointer;background-color:#f2f2f2!important;color:#3a343a;border:1px solid #e8e8e8}interaction-viewer .iv_reset{display:block}interaction-viewer .button:hover{color:#3a343a}interaction-viewer .button.dropdown:after{display:block;width:0;height:0;border:.4em inset;content:"";border-bottom-width:0;border-top-style:solid;border-color:#3a343a transparent transparent;position:relative;top:.4em;display:inline-block;float:right;margin-left:1em}interaction-viewer .dropdown-pane{position:absolute;z-index:1;display:block;width:300px;padding:1rem;visibility:hidden;border:1px solid #cacaca;border-radius:0;background-color:#fefefe}interaction-viewer .tree-list{text-align:left;list-style:none}interaction-viewer .tree-list li{margin:.5em 0}.loader,.loader:after,.loader:before{background:#cbcbcb;-webkit-animation:a 1s infinite ease-in-out;animation:a 1s infinite ease-in-out;width:1em;height:4em}.loader{color:#cbcbcb;text-indent:-9999em;margin:88px auto;position:relative;font-size:11px;-webkit-transform:translateZ(0);transform:translateZ(0);-webkit-animation-delay:-.16s;animation-delay:-.16s}.loader:after,.loader:before{position:absolute;top:0;content:""}.loader:before{left:-1.5em;-webkit-animation-delay:-.32s;animation-delay:-.32s}.loader:after{left:1.5em}@-webkit-keyframes a{0%,80%,to{box-shadow:0 0;height:4em}40%{box-shadow:0 -2em;height:5em}}@keyframes a{0%,80%,to{box-shadow:0 0;height:4em}40%{box-shadow:0 -2em;height:5em}}',void 0);var Ol,Dl=[],Il=function(){var e=function(e){function t(){Tl(this,t);var e=Al(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return e._accession=e.getAttribute('accession'),e}return Cl(t,e),Sl(t,[{key:'connectedCallback',value:function(){this._render()}},{key:'attributeChangedCallback',value:function(e,t,a){'accession'===e&&null!=t&&t!=a&&(this._accession=a,this._render())}},{key:'_render',value:function(){Fn({el:this,accession:this._accession})}},{key:'accession',set:function(e){this._accession=e},get:function(){return this._accession}}],[{key:'observedAttributes',get:function(){return['accession']}}]),t}(HTMLElement);customElements.define('interaction-viewer',e)};// Conditional loading of polyfill
window.customElements?Il():document.addEventListener('WebComponentsReady',function(){console.log('Loaded with polyfill.'),Il()})})();
//# sourceMappingURL=interaction-viewer.js.map

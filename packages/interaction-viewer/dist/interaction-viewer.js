(function(){'use strict';function e(e){return function(){var t=this.ownerDocument,a=this.namespaceURI;return a===gi&&t.documentElement.namespaceURI===gi?t.createElement(e):t.createElementNS(a,e)}}function t(e){return function(){return this.ownerDocument.createElementNS(e.space,e.local)}}function a(e,t,a){return e=n(e,t,a),function(t){var a=t.relatedTarget;a&&(a===this||8&a.compareDocumentPosition(this))||e.call(this,t)}}function n(e,t,a){return function(n){var i=ki;// Events can be reentrant (e.g., focus).
ki=n;try{e.call(this,this.__data__,t,a)}finally{ki=i}}}function r(e){return e.trim().split(/^|\s+/).map(function(e){var a='',n=e.indexOf('.');return 0<=n&&(a=e.slice(n+1),e=e.slice(0,n)),{type:e,name:a}})}function o(e){return function(){var t=this.__on;if(t){for(var a,n=0,r=-1,i=t.length;n<i;++n)(a=t[n],(!e.type||a.type===e.type)&&a.name===e.name)?this.removeEventListener(a.type,a.listener,a.capture):t[++r]=a;++r?t.length=r:delete this.__on}}}function c(e,t,r){var c=ji.hasOwnProperty(e.type)?a:n;return function(a,n,i){var d,o=this.__on,l=c(t,n,i);if(o)for(var s=0,f=o.length;s<f;++s)if((d=o[s]).type===e.type&&d.name===e.name)return this.removeEventListener(d.type,d.listener,d.capture),this.addEventListener(d.type,d.listener=l,d.capture=r),void(d.value=t);this.addEventListener(e.type,l,r),d={type:e.type,name:e.name,value:t,listener:l,capture:r},o?o.push(d):this.__on=[d]}}function i(){}function d(){return[]}function l(e,t){this.ownerDocument=e.ownerDocument,this.namespaceURI=e.namespaceURI,this._next=null,this._parent=e,this.__data__=t}// Protect against keys like “__proto__”.
function s(e,t,a,n,r,o){// Put any non-null nodes that fit into update.
// Put any null nodes into enter.
// Put any remaining data into enter.
for(var c,d=0,i=t.length,s=o.length;d<s;++d)(c=t[d])?(c.__data__=o[d],n[d]=c):a[d]=new l(e,o[d]);// Put any non-null nodes that don’t fit into exit.
for(;d<i;++d)(c=t[d])&&(r[d]=c)}function f(e,t,a,n,r,o,c){var d,i,s,f={},p=t.length,b=o.length,u=Array(p);// Compute the key for each node.
// If multiple nodes have the same key, the duplicates are added to exit.
for(d=0;d<p;++d)(i=t[d])&&(u[d]=s=Di+c.call(i,i.__data__,d,t),s in f?r[d]=i:f[s]=i);// Compute the key for each datum.
// If there a node associated with this key, join and add it to update.
// If there is not (or the key is a duplicate), add it to enter.
for(d=0;d<b;++d)s=Di+c.call(e,o[d],d,o),(i=f[s])?(n[d]=i,i.__data__=o[d],f[s]=null):a[d]=new l(e,o[d]);// Add any remaining nodes that were not bound to data to exit.
for(d=0;d<p;++d)(i=t[d])&&f[u[d]]===i&&(r[d]=i)}function p(e,t){return e<t?-1:e>t?1:e>=t?0:NaN}function b(e){return function(){this.removeAttribute(e)}}function u(e){return function(){this.removeAttributeNS(e.space,e.local)}}function g(e,t){return function(){this.setAttribute(e,t)}}function h(e,t){return function(){this.setAttributeNS(e.space,e.local,t)}}function y(e,t){return function(){var a=t.apply(this,arguments);null==a?this.removeAttribute(e):this.setAttribute(e,a)}}function m(e,t){return function(){var a=t.apply(this,arguments);null==a?this.removeAttributeNS(e.space,e.local):this.setAttributeNS(e.space,e.local,a)}}function _(e){return function(){this.style.removeProperty(e)}}function w(e,t,a){return function(){this.style.setProperty(e,t,a)}}function x(e,t,a){return function(){var n=t.apply(this,arguments);null==n?this.style.removeProperty(e):this.style.setProperty(e,n,a)}}function v(e,t){return e.style.getPropertyValue(t)||Ii(e).getComputedStyle(e,null).getPropertyValue(t)}function j(e){return function(){delete this[e]}}function k(e,t){return function(){this[e]=t}}function T(e,t){return function(){var a=t.apply(this,arguments);null==a?delete this[e]:this[e]=a}}function S(e){return e.trim().split(/^|\s+/)}function U(e){return e.classList||new M(e)}function M(e){this._node=e,this._names=S(e.getAttribute('class')||'')}function F(e,t){for(var a=U(e),r=-1,i=t.length;++r<i;)a.add(t[r])}function O(e,t){for(var a=U(e),r=-1,i=t.length;++r<i;)a.remove(t[r])}function I(e){return function(){F(this,e)}}function P(e){return function(){O(this,e)}}function L(e,t){return function(){(t.apply(this,arguments)?F:O)(this,e)}}function z(){this.textContent=''}function H(e){return function(){this.textContent=e}}function Y(e){return function(){var t=e.apply(this,arguments);this.textContent=null==t?'':t}}function N(){this.innerHTML=''}function q(e){return function(){this.innerHTML=e}}function R(e){return function(){var t=e.apply(this,arguments);this.innerHTML=null==t?'':t}}function $(){this.nextSibling&&this.parentNode.appendChild(this)}function V(){this.previousSibling&&this.parentNode.insertBefore(this,this.parentNode.firstChild)}function W(){return null}function Z(){var e=this.parentNode;e&&e.removeChild(this)}function X(e,t,a){var n=Ii(e),i=n.CustomEvent;'function'==typeof i?i=new i(t,a):(i=n.document.createEvent('Event'),a?(i.initEvent(t,a.bubbles,a.cancelable),i.detail=a.detail):i.initEvent(t,!1,!1)),e.dispatchEvent(i)}function J(e,t){return function(){return X(this,e,t)}}function G(e,t){return function(){return X(this,e,t.apply(this,arguments))}}function K(e,t){this._groups=e,this._parents=t}function Q(e){return function(t,a){return zi(e(t),a)}}function ee(e,t,a){var n=(t-e)/pi(0,a),i=fi(si(n)/li),r=n/di(10,i);return 0<=i?(r>=Bi?10:r>=qi?5:r>=Ri?2:1)*di(10,i):-di(10,-i)/(r>=Bi?10:r>=qi?5:r>=Ri?2:1)}function te(e,t,a){var n=ci(t-e)/pi(0,a),i=di(10,fi(si(n)/li)),r=n/i;return r>=Bi?i*=10:r>=qi?i*=5:r>=Ri&&(i*=2),t<e?-i:i}function ae(){}function ne(e,t){var a=new ae;// Copy constructor.
if(e instanceof ae)e.each(function(e,t){a.set(t,e)});// Index array by numeric index or specified key function.
else if(Array.isArray(e)){var r,o=-1,i=e.length;if(null==t)for(;++o<i;)a.set(o,e[o]);else for(;++o<i;)a.set(t(r=e[o],o,e),r)}// Convert object to map.
else if(e)for(var n in e)a.set(n,e[n]);return a}function ie(e){function t(t){var o=t+'',c=a.get(o);if(!c){if(n!==Ji)return n;a.set(o,c=r.push(t))}return e[(c-1)%e.length]}var a=ne(),r=[],n=Ji;return e=null==e?[]:Xi.call(e),t.domain=function(e){if(!arguments.length)return r.slice();r=[],a=ne();for(var o,c,d=-1,i=e.length;++d<i;)a.has(c=(o=e[d])+'')||a.set(c,r.push(o));return t},t.range=function(a){return arguments.length?(e=Xi.call(a),t):e.slice()},t.unknown=function(e){return arguments.length?(n=e,t):n},t.copy=function(){return ie().domain(r).range(e).unknown(n)},t}function oe(){function e(){var e=i().length,n=o[1]<o[0],f=o[n-0],p=o[1-n];t=(p-f)/pi(1,e-d+2*l),c&&(t=fi(t)),f+=(p-f-t*(e-d))*s,a=t*(1-d),c&&(f=oi(f),a=oi(a));var b=Ni(e).map(function(e){return f+t*e});return r(n?b.reverse():b)}var t,a,n=ie().unknown(void 0),i=n.domain,r=n.range,o=[0,1],c=!1,d=0,l=0,s=0.5;return delete n.unknown,n.domain=function(t){return arguments.length?(i(t),e()):i()},n.range=function(t){return arguments.length?(o=[+t[0],+t[1]],e()):o.slice()},n.rangeRound=function(t){return o=[+t[0],+t[1]],c=!0,e()},n.bandwidth=function(){return a},n.step=function(){return t},n.round=function(t){return arguments.length?(c=!!t,e()):c},n.padding=function(t){return arguments.length?(d=l=pi(0,ui(1,t)),e()):d},n.paddingInner=function(t){return arguments.length?(d=pi(0,ui(1,t)),e()):d},n.paddingOuter=function(t){return arguments.length?(l=pi(0,ui(1,t)),e()):l},n.align=function(t){return arguments.length?(s=pi(0,ui(1,t)),e()):s},n.copy=function(){return oe().domain(i()).range(o).round(c).paddingInner(d).paddingOuter(l).align(s)},e()}function ce(e,t){var a=Object.create(e.prototype);for(var n in t)a[n]=t[n];return a}function de(){}function le(e){var t;return e=(e+'').trim().toLowerCase(),(t=er.exec(e))?(t=parseInt(t[1],16),new ue(15&t>>8|240&t>>4,15&t>>4|240&t,(15&t)<<4|15&t,1)// #f00
):(t=tr.exec(e))?se(parseInt(t[1],16))// #ff0000
:(t=ar.exec(e))?new ue(t[1],t[2],t[3],1)// rgb(255, 0, 0)
:(t=nr.exec(e))?new ue(255*t[1]/100,255*t[2]/100,255*t[3]/100,1)// rgb(100%, 0%, 0%)
:(t=ir.exec(e))?fe(t[1],t[2],t[3],t[4])// rgba(255, 0, 0, 1)
:(t=rr.exec(e))?fe(255*t[1]/100,255*t[2]/100,255*t[3]/100,t[4])// rgb(100%, 0%, 0%, 1)
:(t=or.exec(e))?ge(t[1],t[2]/100,t[3]/100,1)// hsl(120, 50%, 50%)
:(t=cr.exec(e))?ge(t[1],t[2]/100,t[3]/100,t[4])// hsla(120, 50%, 50%, 1)
:dr.hasOwnProperty(e)?se(dr[e]):'transparent'===e?new ue(NaN,NaN,NaN,0):null}function se(e){return new ue(255&e>>16,255&e>>8,255&e,1)}function fe(e,t,n,i){return 0>=i&&(e=t=n=NaN),new ue(e,t,n,i)}function pe(e){return(e instanceof de||(e=le(e)),!e)?new ue:(e=e.rgb(),new ue(e.r,e.g,e.b,e.opacity))}function be(e,t,a,n){return 1===arguments.length?pe(e):new ue(e,t,a,null==n?1:n)}function ue(e,t,a,n){this.r=+e,this.g=+t,this.b=+a,this.opacity=+n}function ge(e,t,n,i){return 0>=i?e=t=n=NaN:0>=n||1<=n?e=t=NaN:0>=t&&(e=NaN),new ye(e,t,n,i)}function he(e){if(e instanceof ye)return new ye(e.h,e.s,e.l,e.opacity);if(e instanceof de||(e=le(e)),!e)return new ye;if(e instanceof ye)return e;e=e.rgb();var t=e.r/255,a=e.g/255,n=e.b/255,i=ui(t,a,n),r=pi(t,a,n),c=NaN,d=r-i,s=(r+i)/2;return d?(c=t===r?(a-n)/d+6*(a<n):a===r?(n-t)/d+2:(t-a)/d+4,d/=0.5>s?r+i:2-r-i,c*=60):d=0<s&&1>s?0:c,new ye(c,d,s,e.opacity)}function ye(e,t,a,n){this.h=+e,this.s=+t,this.l=+a,this.opacity=+n}/* From FvD 13.37, CSS Color Module Level 3 */function me(e,t,a){return 255*(60>e?t+(a-t)*e/60:180>e?a:240>e?t+(a-t)*(240-e)/60:t)}function _e(e){if(e instanceof we)return new we(e.l,e.a,e.b,e.opacity);if(e instanceof Se){var t=e.h*lr;return new we(e.l,ii(t)*e.c,ni(t)*e.c,e.opacity)}e instanceof ue||(e=pe(e));var n=ke(e.r),i=ke(e.g),a=ke(e.b),r=xe((0.4124564*n+0.3575761*i+0.1804375*a)/Kn),o=xe((0.2126729*n+0.7151522*i+0.072175*a)/Xn),c=xe((0.0193339*n+0.119192*i+0.9503041*a)/Yn);return new we(116*o-16,500*(r-o),200*(o-c),e.opacity)}function we(e,t,n,i){this.l=+e,this.a=+t,this.b=+n,this.opacity=+i}function xe(e){return e>ur?di(e,1/3):e/br+Zn}function ve(e){return e>pr?e*e*e:br*(e-Zn)}function je(e){return 255*(0.0031308>=e?12.92*e:1.055*di(e,1/2.4)-0.055)}function ke(e){return 0.04045>=(e/=255)?e/12.92:di((e+0.055)/1.055,2.4)}function Te(e){if(e instanceof Se)return new Se(e.h,e.c,e.l,e.opacity);e instanceof we||(e=_e(e));var t=ai(e.b,e.a)*sr;return new Se(0>t?t+360:t,ti(e.a*e.a+e.b*e.b),e.l,e.opacity)}function Se(e,t,a,n){this.h=+e,this.c=+t,this.l=+a,this.opacity=+n}function Ce(e){if(e instanceof Ue)return new Ue(e.h,e.s,e.l,e.opacity);e instanceof ue||(e=pe(e));var t=e.r/255,a=e.g/255,n=e.b/255,i=(yr*n+E*t-hr*a)/(yr+E-hr),r=n-i,o=(D*(a-i)-B*r)/C,c=ti(o*o+r*r)/(D*i*(1-i)),// NaN if l=0 or l=1
d=c?ai(o,r)*sr-120:NaN;return new Ue(0>d?d+360:d,c,i,e.opacity)}function Ae(e,t,a,n){return 1===arguments.length?Ce(e):new Ue(e,t,a,null==n?1:n)}function Ue(e,t,a,n){this.h=+e,this.s=+t,this.l=+a,this.opacity=+n}function Me(e,a){return function(n){return e+n*a}}function Fe(e,a,n){return e=di(e,n),a=di(a,n)-e,n=1/n,function(i){return di(e+i*a,n)}}function Oe(e){return 1==(e=+e)?De:function(t,a){return a-t?Fe(t,a,e):mr(isNaN(t)?a:t)}}function De(e,t){var a=t-e;return a?Me(e,a):mr(isNaN(e)?t:e)}function Ie(e){return function(){return e}}function Pe(e){return function(a){return e(a)+''}}function Ee(e){return function t(a){function n(n,t){var i=e((n=Ae(n)).h,(t=Ae(t)).h),r=De(n.s,t.s),o=De(n.l,t.l),c=De(n.opacity,t.opacity);return function(e){return n.h=i(e),n.s=r(e),n.l=o(di(e,a)),n.opacity=c(e),n+''}}return a=+a,n.gamma=t,n}(1)}function Le(e,t){return(t-=e=+e)?function(a){return(a-e)/t}:Fr(t)}function ze(e){return function(t,n){var i=e(t=+t,n=+n);return function(e){return e<=t?0:e>=n?1:i(e)}}}function He(e){return function(n,i){var o=e(n=+n,i=+i);return function(e){return 0>=e?n:1<=e?i:o(e)}}}function Ye(e,t,a,n){var i=e[0],r=e[1],o=t[0],c=t[1];return r<i?(i=a(r,i),o=n(c,o)):(i=a(i,r),o=n(o,c)),function(e){return o(i(e))}}function Ne(e,t,a,n){var o=ui(e.length,t.length)-1,c=Array(o),d=Array(o),r=-1;// Reverse descending domains.
for(e[o]<e[0]&&(e=e.slice().reverse(),t=t.slice().reverse());++r<o;)c[r]=a(e[r],e[r+1]),d[r]=n(t[r],t[r+1]);return function(t){var a=Yi(e,t,1,o)-1;return d[a](c[a](t))}}function Be(e,t){return t.domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp())}// deinterpolate(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
// reinterpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding domain value x in [a,b].
function qe(e,t){function a(){return i=2<ui(c.length,d.length)?Ne:Ye,r=o=null,n}function n(t){return(r||(r=i(c,d,s?ze(e):e,l)))(+t)}var i,r,o,c=Dr,d=Dr,l=Cr,s=!1;return n.invert=function(e){return(o||(o=i(d,c,Le,s?He(t):t)))(+e)},n.domain=function(e){return arguments.length?(c=Zi.call(e,Or),a()):c.slice()},n.range=function(e){return arguments.length?(d=Xi.call(e),a()):d.slice()},n.rangeRound=function(e){return d=Xi.call(e),l=Ar,a()},n.clamp=function(e){return arguments.length?(s=!!e,a()):s},n.interpolate=function(e){return arguments.length?(l=e,a()):l},a()}// Computes the decimal coefficient and exponent of the specified number x with
// significant digits p, where x is positive and p is in [1, 21] or undefined.
// For example, formatDecimal(1.23) returns ["123", 0].
function Re(e){return new $e(e)}// instanceof
function $e(e){if(!(t=Yr.exec(e)))throw new Error('invalid format: '+e);var t,a=t[1]||' ',n=t[2]||'>',i=t[3]||'-',r=t[4]||'',o=!!t[5],c=t[6]&&+t[6],d=!!t[7],l=t[8]&&+t[8].slice(1),s=t[9]||'';// The "n" type is an alias for ",g".
'n'===s?(d=!0,s='g'):!Hr[s]&&(s=''),(o||'0'===a&&'='===n)&&(o=!0,a='0',n='='),this.fill=a,this.align=n,this.sign=i,this.symbol=r,this.zero=o,this.width=c,this.comma=d,this.precision=l,this.type=s}function Ve(e){var t=e.domain;return e.ticks=function(e){var a=t();return $i(a[0],a[a.length-1],null==e?10:e)},e.tickFormat=function(e,a){return Xr(t(),e,a)},e.nice=function(a){null==a&&(a=10);var n,i=t(),r=0,o=i.length-1,c=i[r],d=i[o];return d<c&&(n=c,c=d,d=n,n=r,r=o,o=n),n=ee(c,d,a),0<n?(c=fi(c/n)*n,d=bi(d/n)*n,n=ee(c,d,a)):0>n&&(c=bi(c*n)/n,d=fi(d*n)/n,n=ee(c,d,a)),0<n?(i[r]=fi(c/n)*n,i[o]=bi(d/n)*n,t(i)):0>n&&(i[r]=bi(c*n)/n,i[o]=fi(d*n)/n,t(i)),e},e}function We(){var e=qe(Le,vr);return e.copy=function(){return Be(e,We())},Ve(e)}function Ze(e,t,a,n){function i(t){return e(t=new Date(+t)),t}return i.floor=i,i.ceil=function(a){return e(a=new Date(a-1)),t(a,1),e(a),a},i.round=function(e){var t=i(e),a=i.ceil(e);return e-t<a-e?t:a},i.offset=function(e,a){return t(e=new Date(+e),null==a?1:fi(a)),e},i.range=function(a,n,r){var o=[];if(a=i.ceil(a),r=null==r?1:fi(r),!(a<n)||!(0<r))return o;// also handles Invalid Date
do o.push(new Date(+a));while((t(a,r),e(a),a<n));return o},i.filter=function(a){return Ze(function(t){if(t>=t)for(;e(t),!a(t);)t.setTime(t-1)},function(e,n){if(e>=e)if(0>n)for(;0>=++n;)for(;t(e,-1),!a(e););// eslint-disable-line no-empty
else for(;0<=--n;)for(;t(e,1),!a(e););// eslint-disable-line no-empty
})},a&&(i.count=function(t,n){return Jr.setTime(+t),Gr.setTime(+n),e(Jr),e(Gr),fi(a(Jr,Gr))},i.every=function(e){return e=fi(e),isFinite(e)&&0<e?1<e?i.filter(n?function(t){return 0==n(t)%e}:function(t){return 0==i.count(0,t)%e}):i:null}),i}function Xe(e){return Ze(function(t){t.setDate(t.getDate()-(t.getDay()+7-e)%7),t.setHours(0,0,0,0)},function(e,t){e.setDate(e.getDate()+7*t)},function(e,t){return(t-e-(t.getTimezoneOffset()-e.getTimezoneOffset())*eo)/no})}function Je(e){return Ze(function(t){t.setUTCDate(t.getUTCDate()-(t.getUTCDay()+7-e)%7),t.setUTCHours(0,0,0,0)},function(e,t){e.setUTCDate(e.getUTCDate()+7*t)},function(e,t){return(t-e)/no})}function Ge(e){if(0<=e.y&&100>e.y){var t=new Date(-1,e.m,e.d,e.H,e.M,e.S,e.L);return t.setFullYear(e.y),t}return new Date(e.y,e.m,e.d,e.H,e.M,e.S,e.L)}function Ke(e){if(0<=e.y&&100>e.y){var t=new Date(Date.UTC(-1,e.m,e.d,e.H,e.M,e.S,e.L));return t.setUTCFullYear(e.y),t}return new Date(Date.UTC(e.y,e.m,e.d,e.H,e.M,e.S,e.L))}function Qe(e){return{y:e,m:0,d:1,H:0,M:0,S:0,L:0}}function et(e){function t(e,t){return function(a){var r,o,c,d=[],l=-1,i=0,s=e.length;for(a instanceof Date||(a=new Date(+a));++l<s;)37===e.charCodeAt(l)&&(d.push(e.slice(i,l)),null==(o=Do[r=e.charAt(++l)])?o='e'===r?' ':'0':r=e.charAt(++l),(c=t[r])&&(r=c(a,o)),d.push(r),i=l+1);return d.push(e.slice(i,l)),d.join('')}}function a(e,t){return function(a){var r=Qe(1900),o=n(r,e,a+='',0);if(o!=a.length)return null;// The am-pm flag is 0 for AM, and 1 for PM.
// Convert day-of-week and week-of-year to day-of-year.
if('p'in r&&(r.H=r.H%12+12*r.p),'W'in r||'U'in r){'w'in r||(r.w='W'in r?1:0);var i='Z'in r?Ke(Qe(r.y)).getUTCDay():t(Qe(r.y)).getDay();r.m=0,r.d='W'in r?(r.w+6)%7+7*r.W-(i+5)%7:r.w+7*r.U-(i+6)%7}// If a time zone is specified, all fields are interpreted as UTC and then
// offset according to the specified time zone.
return'Z'in r?(r.H+=0|r.Z/100,r.M+=r.Z%100,Ke(r)):t(r);// Otherwise, all fields are in local time.
}}function n(e,t,a,r){for(var o,c,d=0,i=t.length,n=a.length;d<i;){if(r>=n)return-1;if(o=t.charCodeAt(d++),37===o){if(o=t.charAt(d++),c=k[o in Do?t.charAt(d++):o],!c||0>(r=c(e,a,r)))return-1;}else if(o!=a.charCodeAt(r++))return-1}return r}var r=e.dateTime,o=e.date,c=e.time,i=e.periods,l=e.days,s=e.shortDays,f=e.months,p=e.shortMonths,b=nt(i),u=it(i),g=nt(l),h=it(l),y=nt(s),m=it(s),_=nt(f),w=it(f),x=nt(p),v=it(p),d={a:function(e){return s[e.getDay()]},A:function(e){return l[e.getDay()]},b:function(e){return p[e.getMonth()]},B:function(e){return f[e.getMonth()]},c:null,d:_t,e:_t,H:wt,I:xt,j:vt,L:jt,m:kt,M:Tt,p:function(e){return i[+(12<=e.getHours())]},S:St,U:Ct,w:At,W:Ut,x:null,X:null,y:Mt,Y:Ft,Z:Ot,"%":Wt},j={a:function(e){return s[e.getUTCDay()]},A:function(e){return l[e.getUTCDay()]},b:function(e){return p[e.getUTCMonth()]},B:function(e){return f[e.getUTCMonth()]},c:null,d:Dt,e:Dt,H:It,I:Pt,j:Et,L:Lt,m:zt,M:Ht,p:function(e){return i[+(12<=e.getUTCHours())]},S:Yt,U:Nt,w:Bt,W:qt,x:null,X:null,y:Rt,Y:$t,Z:Vt,"%":Wt},k={a:function(e,t,a){var i=y.exec(t.slice(a));return i?(e.w=m[i[0].toLowerCase()],a+i[0].length):-1},A:function(e,t,a){var i=g.exec(t.slice(a));return i?(e.w=h[i[0].toLowerCase()],a+i[0].length):-1},b:function(e,t,a){var i=x.exec(t.slice(a));return i?(e.m=v[i[0].toLowerCase()],a+i[0].length):-1},B:function(e,t,a){var i=_.exec(t.slice(a));return i?(e.m=w[i[0].toLowerCase()],a+i[0].length):-1},c:function(e,t,a){return n(e,r,t,a)},d:pt,e:pt,H:ut,I:ut,j:bt,L:yt,m:ft,M:gt,p:function(e,t,a){var i=b.exec(t.slice(a));return i?(e.p=u[i[0].toLowerCase()],a+i[0].length):-1},S:ht,U:ot,w:rt,W:ct,x:function(e,t,a){return n(e,o,t,a)},X:function(e,t,a){return n(e,c,t,a)},y:lt,Y:dt,Z:st,"%":mt};// These recursive directive definitions must be deferred.
return d.x=t(o,d),d.X=t(c,d),d.c=t(r,d),j.x=t(o,j),j.X=t(c,j),j.c=t(r,j),{format:function(e){var a=t(e+='',d);return a.toString=function(){return e},a},parse:function(e){var t=a(e+='',Ge);return t.toString=function(){return e},t},utcFormat:function(e){var a=t(e+='',j);return a.toString=function(){return e},a},utcParse:function(e){var t=a(e,Ke);return t.toString=function(){return e},t}}}function tt(e,t,a){var n=0>e?'-':'',i=(n?-e:e)+'',r=i.length;return n+(r<a?Array(a-r+1).join(t)+i:i)}function at(e){return e.replace(Eo,'\\$&')}function nt(e){return new RegExp('^(?:'+e.map(at).join('|')+')','i')}function it(e){for(var t={},a=-1,i=e.length;++a<i;)t[e[a].toLowerCase()]=a;return t}function rt(e,t,a){var i=Io.exec(t.slice(a,a+1));return i?(e.w=+i[0],a+i[0].length):-1}function ot(e,t,a){var i=Io.exec(t.slice(a));return i?(e.U=+i[0],a+i[0].length):-1}function ct(e,t,a){var i=Io.exec(t.slice(a));return i?(e.W=+i[0],a+i[0].length):-1}function dt(e,t,a){var i=Io.exec(t.slice(a,a+4));return i?(e.y=+i[0],a+i[0].length):-1}function lt(e,t,a){var i=Io.exec(t.slice(a,a+2));return i?(e.y=+i[0]+(68<+i[0]?1900:2e3),a+i[0].length):-1}function st(e,t,a){var i=/^(Z)|([+-]\d\d)(?:\:?(\d\d))?/.exec(t.slice(a,a+6));return i?(e.Z=i[1]?0:-(i[2]+(i[3]||'00')),a+i[0].length):-1}function ft(e,t,a){var i=Io.exec(t.slice(a,a+2));return i?(e.m=i[0]-1,a+i[0].length):-1}function pt(e,t,a){var i=Io.exec(t.slice(a,a+2));return i?(e.d=+i[0],a+i[0].length):-1}function bt(e,t,a){var i=Io.exec(t.slice(a,a+3));return i?(e.m=0,e.d=+i[0],a+i[0].length):-1}function ut(e,t,a){var i=Io.exec(t.slice(a,a+2));return i?(e.H=+i[0],a+i[0].length):-1}function gt(e,t,a){var i=Io.exec(t.slice(a,a+2));return i?(e.M=+i[0],a+i[0].length):-1}function ht(e,t,a){var i=Io.exec(t.slice(a,a+2));return i?(e.S=+i[0],a+i[0].length):-1}function yt(e,t,a){var i=Io.exec(t.slice(a,a+3));return i?(e.L=+i[0],a+i[0].length):-1}function mt(e,t,a){var i=Po.exec(t.slice(a,a+1));return i?a+i[0].length:-1}function _t(e,t){return tt(e.getDate(),t,2)}function wt(e,t){return tt(e.getHours(),t,2)}function xt(e,t){return tt(e.getHours()%12||12,t,2)}function vt(e,t){return tt(1+co.count(yo(e),e),t,3)}function jt(e,t){return tt(e.getMilliseconds(),t,3)}function kt(e,t){return tt(e.getMonth()+1,t,2)}function Tt(e,t){return tt(e.getMinutes(),t,2)}function St(e,t){return tt(e.getSeconds(),t,2)}function Ct(e,t){return tt(lo.count(yo(e),e),t,2)}function At(e){return e.getDay()}function Ut(e,t){return tt(so.count(yo(e),e),t,2)}function Mt(e,t){return tt(e.getFullYear()%100,t,2)}function Ft(e,t){return tt(e.getFullYear()%1e4,t,4)}function Ot(e){var t=e.getTimezoneOffset();return(0<t?'-':(t*=-1,'+'))+tt(0|t/60,'0',2)+tt(t%60,'0',2)}function Dt(e,t){return tt(e.getUTCDate(),t,2)}function It(e,t){return tt(e.getUTCHours(),t,2)}function Pt(e,t){return tt(e.getUTCHours()%12||12,t,2)}function Et(e,t){return tt(1+wo.count(Uo(e),e),t,3)}function Lt(e,t){return tt(e.getUTCMilliseconds(),t,3)}function zt(e,t){return tt(e.getUTCMonth()+1,t,2)}function Ht(e,t){return tt(e.getUTCMinutes(),t,2)}function Yt(e,t){return tt(e.getUTCSeconds(),t,2)}function Nt(e,t){return tt(xo.count(Uo(e),e),t,2)}function Bt(e){return e.getUTCDay()}function qt(e,t){return tt(vo.count(Uo(e),e),t,2)}function Rt(e,t){return tt(e.getUTCFullYear()%100,t,2)}function $t(e,t){return tt(e.getUTCFullYear()%1e4,t,4)}function Vt(){return'+0000'}function Wt(){return'%'}function Zt(e){var a=e.length;return function(n){return e[pi(0,ui(a-1,fi(n*a)))]}}/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */function Xt(e,t){for(var a=-1,n=t.length,i=e.length;++a<n;)e[i+a]=t[a];return e}/** Detect free variable `global` from Node.js. *//**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */function Jt(e){var t=Ko.call(e,ec),a=e[ec];try{e[ec]=void 0}catch(t){}var n=Qo.call(e);return t?e[ec]=a:delete e[ec],n}/** Used for built-in method references. *//**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */function Gt(e){return ac.call(e)}/** `Object#toString` result references. *//**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */function Kt(e){return null==e?void 0===e?ic:nc:rc&&rc in Object(e)?Jt(e):Gt(e)}/**
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
 */function Qt(e){return null!=e&&'object'==typeof e}/** `Object#toString` result references. *//**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */function ea(e){return Qt(e)&&Kt(e)==oc}/** Used for built-in method references. *//**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */function ta(e){return fc(e)||sc(e)||!!(pc&&e&&e[pc])}/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */function aa(e,t,a,n,i){var r=-1,o=e.length;for(a||(a=ta),i||(i=[]);++r<o;){var c=e[r];0<t&&a(c)?1<t?aa(c,t-1,a,n,i):Xt(i,c):!n&&(i[i.length]=c)}return i}/**
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
 */function na(e){return e}/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */function ia(e,t,a){switch(a.length){case 0:return e.call(t);case 1:return e.call(t,a[0]);case 2:return e.call(t,a[0],a[1]);case 3:return e.call(t,a[0],a[1],a[2]);}return e.apply(t,a)}/* Built-in method references for those with the same name as other `lodash` methods. *//**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */function ra(e,t,a){return t=bc(void 0===t?e.length-1:t,0),function(){for(var n=arguments,i=-1,r=bc(n.length-t,0),o=Array(r);++i<r;)o[i]=n[t+i];i=-1;for(var c=Array(t+1);++i<t;)c[i]=n[i];return c[t]=a(o),ia(e,this,c)}}/**
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
 */function oa(e){return function(){return e}}/**
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
 */function ca(e){var t=typeof e;return null!=e&&('object'==t||'function'==t)}/** `Object#toString` result references. *//**
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
 */function da(e){if(!ca(e))return!1;// The use of `Object#toString` avoids issues with the `typeof` operator
// in Safari 9 which returns 'object' for typed arrays and other constructors.
var t=Kt(e);return t==gc||t==hc||t==uc||t==yc}/** Used to detect overreaching core-js shims. *//**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */function la(e){return!!_c&&_c in e}/** Used for built-in method references. *//**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */function sa(e){if(null!=e){try{return xc.call(e)}catch(t){}try{return e+''}catch(t){}}return''}/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 *//**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */function fa(e){if(!ca(e)||la(e))return!1;var t=da(e)?Ac:jc;return t.test(sa(e))}/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */function pa(e,t){return null==e?void 0:e[t]}/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */function ba(e,t){var a=pa(e,t);return fa(a)?a:void 0}/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 *//**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 *//**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */function ua(e,t){return Oc(ra(e,t,na),e+'')}/* Built-in method references that are verified to be native. *//**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 *//**
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
 *//** Used to stand-in for `undefined` hash values. *//**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 *//** Used for built-in method references. *//**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 *//** Used to stand-in for `undefined` hash values. *//**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */function ga(e){var t=-1,a=null==e?0:e.length;for(this.clear();++t<a;){var n=e[t];this.set(n[0],n[1])}}// Add methods to `Hash`.
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
 */function ha(e,t){return e===t||e!==e&&t!==t}/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */function ya(e,t){for(var a=e.length;a--;)if(ha(e[a][0],t))return a;return-1}/** Used for built-in method references. *//**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 *//**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 *//**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 *//**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 *//**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */function ma(e){var t=-1,a=null==e?0:e.length;for(this.clear();++t<a;){var n=e[t];this.set(n[0],n[1])}}// Add methods to `ListCache`.
/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 *//**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */function _a(e){var t=typeof e;return'string'==t||'number'==t||'symbol'==t||'boolean'==t?'__proto__'!==e:null===e}/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */function wa(e,t){var a=e.__data__;return _a(t)?a['string'==typeof t?'string':'hash']:a.map}/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 *//**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 *//**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 *//**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 *//**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */function xa(e){var t=-1,a=null==e?0:e.length;for(this.clear();++t<a;){var n=e[t];this.set(n[0],n[1])}}// Add methods to `MapCache`.
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
 *//**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */function va(e){var t=-1,a=null==e?0:e.length;for(this.__data__=new xa;++t<a;)this.add(e[t])}// Add methods to `SetCache`.
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
 */function ja(e,t,a,n){for(var i=e.length,r=a+(n?1:-1);n?r--:++r<i;)if(t(e[r],r,e))return r;return-1}/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */function ka(e){return e!==e}/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */function Ta(e,t,a){for(var n=a-1,i=e.length;++n<i;)if(e[n]===t)return n;return-1}/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */function Sa(e,t,a){return t===t?Ta(e,t,a):ja(e,ka,a)}/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */function Ca(e,t){var a=null==e?0:e.length;return!!a&&-1<Sa(e,t,0)}/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */function Aa(e,t,a){for(var n=-1,i=null==e?0:e.length;++n<i;)if(a(t,e[n]))return!0;return!1}/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */function Ua(e,t){return e.has(t)}/* Built-in method references that are verified to be native. *//**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 *//**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */function Ma(e){var t=-1,a=Array(e.size);return e.forEach(function(e){a[++t]=e}),a}/** Used as references for various `Number` constants. *//**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */function Fa(e,t,a){var n=-1,i=Ca,r=e.length,o=!0,c=[],d=c;if(a)o=!1,i=Aa;else if(r>=qc){var l=t?null:Bc(e);if(l)return Ma(l);o=!1,i=Ua,d=new va}else d=t?[]:c;outer:for(;++n<r;){var s=e[n],f=t?t(s):s;if(s=a||0!==s?s:0,o&&f===f){for(var p=d.length;p--;)if(d[p]===f)continue outer;t&&d.push(f),c.push(s)}else i(d,f,a)||(d!==c&&d.push(f),c.push(s))}return c}/** Used as references for various `Number` constants. *//**
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
 */function Oa(e){return'number'==typeof e&&-1<e&&0==e%1&&e<=Rc}/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */function Da(e){return null!=e&&Oa(e.length)&&!da(e)}/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */function Ia(e){return Qt(e)&&Da(e)}/**
 * Creates an array of unique values, in order, from all given arrays using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of combined values.
 * @example
 *
 * _.union([2], [1, 2]);
 * // => [2, 1]
 *//**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */function Pa(e,t){for(var a=-1,n=null==e?0:e.length,i=Array(n);++a<n;)i[a]=t(e[a],a,e);return i}/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */function Ea(e){return function(t){return e(t)}}/* Built-in method references for those with the same name as other `lodash` methods. *//**
 * The base implementation of methods like `_.intersection`, without support
 * for iteratee shorthands, that accepts an array of arrays to inspect.
 *
 * @private
 * @param {Array} arrays The arrays to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of shared values.
 */function La(e,t,a){for(var n=a?Aa:Ca,i=e[0].length,r=e.length,o=r,c=Array(r),d=Infinity,l=[];o--;){var s=e[o];o&&t&&(s=Pa(s,Ea(t))),d=Vc(s.length,d),c[o]=!a&&(t||120<=i&&120<=s.length)?new va(o&&s):void 0}s=e[0];var f=-1,p=c[0];outer:for(;++f<i&&l.length<d;){var b=s[f],u=t?t(b):b;if(b=a||0!==b?b:0,p?!Ua(p,u):!n(l,u,a)){for(o=r;--o;){var g=c[o];if(g?!Ua(g,u):!n(e[o],u,a))continue outer}p&&p.push(u),l.push(b)}}return l}/**
 * Casts `value` to an empty array if it's not an array like object.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array|Object} Returns the cast array-like object.
 */function za(e){return Ia(e)?e:[]}/**
 * Creates an array of unique values that are included in all given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order and references of result values are
 * determined by the first array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of intersecting values.
 * @example
 *
 * _.intersection([2, 1], [2, 3]);
 * // => [2]
 */function Ha(e,t){var a=e.split(', ');Zc(t,a)}function Ya(e,t,a){'number'==typeof a?a++:a=1;var n,i=!0,r=!1;try{for(var o,c,d=e[Symbol.iterator]();!(i=(o=d.next()).done);i=!0)c=o.value,c.depth=a,t(c),0<c.children.length&&Ya(c.children,t,a)}catch(e){r=!0,n=e}finally{try{!i&&d.return&&d.return()}finally{if(r)throw n}}}/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 *//**
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
 *//** Used as the size to enable large array optimizations. *//**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */function Na(e){var t=this.__data__=new ma(e);this.size=t.size}// Add methods to `Stack`.
/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */function Ba(e,t){for(var a=-1,n=null==e?0:e.length;++a<n&&!(!1===t(e[a],a,e)););return e}/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */function qa(e,t,a){'__proto__'==t&&Uc?Uc(e,t,{configurable:!0,enumerable:!0,value:a,writable:!0}):e[t]=a}/** Used for built-in method references. *//**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */function Ra(e,t,a){var n=e[t];Jc.call(e,t)&&ha(n,a)&&(a!==void 0||t in e)||qa(e,t,a)}/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */function $a(e,t,a,n){var i=!a;a||(a={});for(var r=-1,o=t.length;++r<o;){var c=t[r],d=n?n(a[c],e[c],c,a,e):void 0;d===void 0&&(d=e[c]),i?qa(a,c,d):Ra(a,c,d)}return a}/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */function Va(e,t){for(var a=-1,n=Array(e);++a<e;)n[a]=t(a);return n}/**
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
 *//** Detect free variable `exports`. */function Wa(e,t){return t=null==t?nd:t,!!t&&('number'==typeof e||id.test(e))&&-1<e&&0==e%1&&e<t}/** `Object#toString` result references. *//**
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
 *//** Detect free variable `exports`. */function Za(e,t){var a=fc(e),n=!a&&sc(e),i=!a&&!n&&ad(e),r=!a&&!n&&!i&&pd(e),o=a||n||i||r,c=o?Va(e.length,String):[],d=c.length;for(var l in e)(t||ud.call(e,l))&&!(o&&(// Safari 9 has enumerable `arguments.length` in strict mode.
'length'==l||// Node.js 0.10 has enumerable non-index properties on buffers.
i&&('offset'==l||'parent'==l)||// PhantomJS 2 has enumerable non-index properties on typed arrays.
r&&('buffer'==l||'byteLength'==l||'byteOffset'==l)||// Skip index properties.
Wa(l,d)))&&c.push(l);return c}/** Used for built-in method references. *//**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */function Xa(e){var t=e&&e.constructor,a='function'==typeof t&&t.prototype||gd;return e===a}/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */function Ja(e,t){return function(a){return e(t(a))}}/* Built-in method references for those with the same name as other `lodash` methods. *//**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */function Ga(e){if(!Xa(e))return hd(e);var t=[];for(var a in Object(e))md.call(e,a)&&'constructor'!=a&&t.push(a);return t}/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */function Ka(e){return Da(e)?Za(e):Ga(e)}/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */function Qa(e,t){return e&&$a(t,Ka(t),e)}/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */function en(e){var t=[];if(null!=e)for(var a in Object(e))t.push(a);return t}/** Used for built-in method references. *//**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */function tn(e){if(!ca(e))return en(e);var t=Xa(e),a=[];for(var n in e)('constructor'!=n||!t&&wd.call(e,n))&&a.push(n);return a}/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */function an(e){return Da(e)?Za(e,!0):tn(e)}/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */function nn(e,t){return e&&$a(t,an(t),e)}/** Detect free variable `exports`. *//**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */function rn(e,t){if(t)return e.slice();var a=e.length,n=Td?Td(a):new e.constructor(a);return e.copy(n),n}/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */function on(e,t){var a=-1,n=e.length;for(t||(t=Array(n));++a<n;)t[a]=e[a];return t}/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */function cn(e,t){for(var a=-1,n=null==e?0:e.length,i=0,r=[];++a<n;){var o=e[a];t(o,a,e)&&(r[i++]=o)}return r}/**
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
 */function dn(){return[]}/** Used for built-in method references. *//**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */function ln(e,t){return $a(e,Ud(e),t)}/** Built-in value references. *//**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */function sn(e,t){return $a(e,Od(e),t)}/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */function fn(e,t,a){var n=t(e);return fc(e)?n:Xt(n,a(e))}/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */function pn(e){return fn(e,Ka,Ud)}/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */function bn(e){return fn(e,an,Od)}/* Built-in method references that are verified to be native. *//**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */function un(e){var t=e.length,a=e.constructor(t);// Add properties assigned by `RegExp#exec`.
return t&&'string'==typeof e[0]&&Xd.call(e,'index')&&(a.index=e.index,a.input=e.input),a}/** Built-in value references. *//**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */function gn(e){var t=new e.constructor(e.byteLength);return new Jd(t).set(new Jd(e)),t}/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */function hn(e,t){var a=t?gn(e.buffer):e.buffer;return new e.constructor(a,e.byteOffset,e.byteLength)}/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */function yn(e,t){return e.set(t[0],t[1]),e}/**
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
 */function mn(e,t,a,n){var i=-1,r=null==e?0:e.length;for(n&&r&&(a=e[++i]);++i<r;)a=t(a,e[i],i,e);return a}/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */function _n(e){var t=-1,a=Array(e.size);return e.forEach(function(e,n){a[++t]=[n,e]}),a}/** Used to compose bitmasks for cloning. *//**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */function wn(e,t,a){var n=t?a(_n(e),Gd):_n(e);return mn(n,yn,new e.constructor)}/** Used to match `RegExp` flags from their coerced string values. *//**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */function xn(e){var t=new e.constructor(e.source,Kd.exec(e));return t.lastIndex=e.lastIndex,t}/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */function vn(e,t){return e.add(t),e}/** Used to compose bitmasks for cloning. *//**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */function jn(e,t,a){var n=t?a(Ma(e),Qd):Ma(e);return mn(n,vn,new e.constructor)}/** Used to convert symbols to primitives and strings. *//**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */function kn(e){return tl?Object(tl.call(e)):{}}/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */function Tn(e,t){var a=t?gn(e.buffer):e.buffer;return new e.constructor(a,e.byteOffset,e.length)}/** `Object#toString` result references. *//**
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
 */function Sn(e,t,a,n){var i=e.constructor;return t===sl?gn(e):t===al||t===nl?new i(+e):t===fl?hn(e,n):t===pl||t===bl||t===ul||t===gl||t===hl||t===yl||t===ml||t===_l||t===wl?Tn(e,n):t===il?wn(e,n,a):t===rl||t===dl?new i(e):t===ol?xn(e):t===cl?jn(e,n,a):t===ll?kn(e):void 0}/** Built-in value references. *//**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */function Cn(e){return'function'!=typeof e.constructor||Xa(e)?{}:vl(Md(e))}/** Used to compose bitmasks for cloning. *//**
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
 */function An(e,t,a,n,i,r){var o,c=t&jl,d=t&kl;if(a&&(o=i?a(e,n,i,r):a(e)),void 0!==o)return o;if(!ca(e))return e;var l=fc(e);if(!l){var s=Wd(e),f=s==Cl||s==Al;if(ad(e))return rn(e,c);if(s!=Ul&&s!=Sl&&(!f||i)){if(!Ml[s])return i?e:{};o=Sn(e,s,An,c)}else if(o=d||f?{}:Cn(e),!c)return d?sn(e,nn(o,e)):ln(e,Qa(o,e))}else if(o=un(e),!c)return on(e,o);// Check for circular references and return its corresponding clone.
r||(r=new Na);var p=r.get(e);if(p)return p;r.set(e,o);var b=t&Tl?d?bn:pn:d?keysIn:Ka,u=l?void 0:b(e);return Ba(u||e,function(n,i){u&&(i=n,n=e[i]),Ra(o,i,An(n,t,a,i,e,r))}),o}/** Used to compose bitmasks for cloning. *//**
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
 */function Un(e){return An(e,Dl)}function Mn(e){return Fl=[],Ol={},fetch('https://www.ebi.ac.uk/proteins/api/proteins/interaction/'+e+'.json').then(function(e){return e.json().then(function(e){return Fn(e)})})}function Fn(e){e=e.map(function(e){return e.interactions||(e.interactions=[]),e});// Add symmetry if required
var t,a=function(t){var a,n=function(a){var n=e.find(function(e){return e.accession===a.id});if(n&&!n.interactions.find(function(e){return e.id===t.accession})){var i=Un(a);i.id=t.accession,n.interactions.push(i)}},i=!0,r=!1;try{for(var o,c,d=t.interactions[Symbol.iterator]();!(i=(o=d.next()).done);i=!0)c=o.value,n(c)}catch(e){r=!0,a=e}finally{try{!i&&d.return&&d.return()}finally{if(r)throw a}}},n=!0,i=!1;try{for(var r,o,c=e[Symbol.iterator]();!(n=(r=c.next()).done);n=!0)o=r.value,a(o);// remove interactions which are not part of current set
}catch(e){i=!0,t=e}finally{try{!n&&c.return&&c.return()}finally{if(i)throw t}}var d,l=!0,s=!1;try{for(var f,o,p=e[Symbol.iterator]();!(l=(f=p.next()).done);l=!0){o=f.value,o.filterTerms=[];var b=[],u=function(t){'SELF'===t.interactionType?(t.source=o.accession,t.id=o.accession,On(t,b)):e.some(function(e){//Check that interactor is in the data
return e.accession===t.id})&&(t.source=o.accession,On(t,b))},g=!0,h=!1,y=void 0;//isoforms
// if (element.accession.includes('-')) {
//     element.isoform = element.accession;
//     element.accession = element
//         .accession
//         .split('-')[0];
// }
// Add source  to the nodes
try{for(var m,_,w=o.interactions[Symbol.iterator]();!(g=(m=w.next()).done);g=!0)_=m.value,u(_)}catch(e){h=!0,y=e}finally{try{!g&&w.return&&w.return()}finally{if(h)throw y}}if(o.interactions=b,o.subcellularLocations){var x=!0,v=!1,j=void 0;try{for(var k,T,S=o.subcellularLocations[Symbol.iterator]();!(x=(k=S.next()).done);x=!0)if(T=k.value,!!T.locations){var C=!0,A=!1,U=void 0;try{for(var M,F,O=T.locations[Symbol.iterator]();!(C=(M=O.next()).done);C=!0){F=M.value,Ha(F.location.value,Fl);var D=F.location.value.split(', ');o.filterTerms=o.filterTerms.concat(D)}}catch(e){A=!0,U=e}finally{try{!C&&O.return&&O.return()}finally{if(A)throw U}}}}catch(e){v=!0,j=e}finally{try{!x&&S.return&&S.return()}finally{if(v)throw j}}}if(o.diseases){var I=!0,P=!1,E=void 0;try{for(var L,z,H=o.diseases[Symbol.iterator]();!(I=(L=H.next()).done);I=!0)z=L.value,z.diseaseId&&(Ol[z.diseaseId]={name:z.diseaseId,selected:!1},o.filterTerms.push(z.diseaseId))}catch(e){P=!0,E=e}finally{try{!I&&H.return&&H.return()}finally{if(P)throw E}}}}}catch(e){s=!0,d=e}finally{try{!l&&p.return&&p.return()}finally{if(s)throw d}}return e}function On(e,t){var a=t.find(function(t){return e.id===t.id});a?e.isoform&&(a.isoform=e.isoform):t.push(e)}function Dn(e){var t,a=[],n=!0,i=!1;try{for(var r,o=Object.entries(e)[Symbol.iterator]();!(n=(r=o.next()).done);n=!0){var c=r.value,d=Hl(c,2),l=d[1];a.push(l)}}catch(e){i=!0,t=e}finally{try{!n&&o.return&&o.return()}finally{if(i)throw t}}return a}function In(){return[{name:'subcellularLocations',label:'Subcellular location',type:'tree',items:Fl},{name:'diseases',label:'Diseases',items:Dn(Ol)}]}function Pn(e){var t=e.el,a=t===void 0?ei('el'):t,n=e.accession,i=n===void 0?'P05067':n;a.style.display='block',a.style.minHeight='6em',Ei(a).select('.interaction-title').remove(),Ei(a).select('svg').remove(),Ei(a).select('.interaction-tooltip').remove(),Ei(a).append('div').attr('class','loader'),Mn(i).then(function(e){zn(a,i,e)})}function En(e,t){if(e){var a,n='',i=!0,r=!1;try{for(var o,c,d=e[Symbol.iterator]();!(i=(o=d.next()).done);i=!0)c=o.value,c.dbReference&&(n+='<p><a href="//www.uniprot.org/uniprot/'+t+'#'+c.acronym+'" target="_blank">'+c.diseaseId+'</a></p>')}catch(e){r=!0,a=e}finally{try{!i&&d.return&&d.return()}finally{if(r)throw a}}return n}return'N/A'}function Ln(e){if(e){var t,a='<ul class="tree-list">',n=[],i=!0,r=!1;try{for(var o,c,d=e[Symbol.iterator]();!(i=(o=d.next()).done);i=!0)if(c=o.value,!!c.locations){var l=!0,s=!1,f=void 0;try{for(var p,b,u=c.locations[Symbol.iterator]();!(l=(p=u.next()).done);l=!0)b=p.value,Ha(b.location.value,n)}catch(e){s=!0,f=e}finally{try{!l&&u.return&&u.return()}finally{if(s)throw f}}}}catch(e){r=!0,t=e}finally{try{!i&&d.return&&d.return()}finally{if(r)throw t}}return Ya(n,function(e){return a+='<li style="margin-left:'+e.depth+'em">'+e.name+'</li>'}),a+'</ul>'}return'N/A'}function zn(e,t,a){function n(e){Ei(this).classed('active-cell',!0),Li('.interaction-row').classed('active',function(t){return t.accession===e.id}),Li('.interaction-viewer-group').append('line').attr('class','active-row').attr('style','opacity:0').attr('x1',0).attr('y1',f(e.source)+f.bandwidth()/2).attr('x2',f(e.id)).attr('y2',f(e.source)+f.bandwidth()/2),Li('.interaction-viewer-group').append('line').attr('class','active-row').attr('style','opacity:0').attr('x1',f(e.id)+f.bandwidth()/2).attr('y1',0).attr('x2',f(e.id)+f.bandwidth()/2).attr('y2',f(e.source))}function i(t){r(Li('.tooltip-content'),t),d.style('opacity',0.9).style('display','inline').style('left',Ai(e)[0]+10+'px').style('top',Ai(e)[1]-15+'px')}function r(e,t){e.html('');var a=Yl.find(function(e){return e.accession===t.source}),n=Yl.find(function(e){return e.accession===t.id});e.append('h3').text('Interaction'),e.append('p').append('a').attr('href',o(t.interactor1,t.interactor2)).attr('target','_blank').text('Confirmed by '+t.experiments+' experiment(s)');var i=e.append('table').attr('class','interaction-viewer-table'),r=i.append('tr');r.append('th'),r.append('th').text('Interactor 1'),r.append('th').text('Interactor 2');var c=i.append('tr');c.append('td').text('Name').attr('class','interaction-viewer-table_row-header'),c.append('td').text(''+a.name),c.append('td').text(''+n.name);var d=i.append('tr');d.append('td').text('UniProtKB').attr('class','interaction-viewer-table_row-header'),d.append('td').append('a').attr('href','//uniprot.org/uniprot/'+a.accession).text(''+a.accession),d.append('td').append('a').attr('href','//uniprot.org/uniprot/'+n.accession).text(''+n.accession);var l=i.append('tr');l.append('td').text('Pathology').attr('class','interaction-viewer-table_row-header'),l.append('td').html(En(a.diseases,a.accession)),l.append('td').html(En(n.diseases,n.accession));var s=i.append('tr');s.append('td').text('Subcellular location').attr('class','interaction-viewer-table_row-header'),s.append('td').html(Ln(a.subcellularLocations)),s.append('td').html(Ln(n.subcellularLocations));var f=i.append('tr');f.append('td').text('IntAct').attr('class','interaction-viewer-table_row-header'),f.append('td').attr('colspan',2).append('a').attr('href',o(t.interactor1,t.interactor2)).attr('target','_blank').text(t.interactor1+';'+t.interactor2)}function o(e,t){return'//www.ebi.ac.uk/intact/query/id:'+e+' AND id:'+t}function c(){Li('g').classed('active',!1),Li('circle').classed('active-cell',!1),Li('.active-row').remove()}Ei(e).select('.loader').remove(),Yl=a;var d=Ei(e).append('div').attr('class','interaction-tooltip').style('display','none').style('opacity',0);d.append('span').attr('class','close-interaction-tooltip').text('Close \u2716').on('click',function(){Li('.interaction-tooltip').style('opacity',0).style('display','none')}),d.append('div').attr('class','tooltip-content'),Ei(e).append('p').attr('class','interaction-title').text(t+' has binary interactions with '+(Yl.length-1)+' proteins'),Qn(e,In());var l={top:100,right:0,bottom:10,left:100},s=18*Yl.length,f=oe().rangeRound([0,s]),p=We().range([0.2,1]),b=Ei(e).append('svg').attr('width',s+l.left+l.right).attr('height',s+l.top+l.bottom).attr('class','interaction-viewer').append('g').attr('class','interaction-viewer-group').attr('transform','translate('+l.left+','+l.top+')');f.domain(Yl.map(function(e){return e.accession})),p.domain([0,10]);// x.domain(nodes.map(entry => entry.accession)); intensity.domain([0,
// d3.max(nodes.map(link => link.experiments))]);
var u=b.selectAll('.interaction-row').data(Yl).enter().append('g').attr('class','interaction-row').attr('transform',function(e){return'translate(0,'+f(e.accession)+')'}).each(function(e){if(e.interactions){var t=Ei(this).selectAll('.cell').data(e.interactions),a=t.enter().append('circle');a.attr('class','cell').attr('cx',function(e){return f(e.id)+f.bandwidth()/2}).attr('cy',function(){return f.bandwidth()/2}).attr('r',f.bandwidth()/3).style('fill-opacity',function(e){return p(e.experiments)}).style('display',function(t){//Only show left half of graph
return f(e.accession)<f(t.id)?'none':''}).on('click',i).on('mouseover',n).on('mouseout',c),t.exit().remove()}});u.append('rect').attr('x',-l.left).attr('width',l.left).attr('height',f.bandwidth()).attr('class','text-highlight'),u.append('text').attr('y',f.bandwidth()/2).attr('dy','.32em').attr('text-anchor','end').text(function(e,t){return Yl[t].name}).attr('class',function(e,a){return Yl[a].accession===t?'main-accession':''});var g=b.selectAll('.column').data(Yl).enter().append('g').attr('class','column').attr('transform',function(e){return'translate('+f(e.accession)+', 0)rotate(-90)'});g.append('rect').attr('x',6).attr('width',l.top).attr('height',f.bandwidth()).attr('class','text-highlight'),g.append('text').attr('x',6).attr('y',f.bandwidth()/2).attr('dy','.32em').attr('text-anchor','start').text(function(e,t){return Yl[t].name}).attr('class',function(e,a){return Yl[a].accession===t?'main-accession':''});var h=f(Yl[1].accession)+' 0,'+f(Yl[Yl.length-1].accession)+' 0,'+f(Yl[Yl.length-1].accession)+' '+f(Yl[Yl.length-1].accession)+','+f(Yl[0].accession)+' 0';b.append('polyline').attr('points',h).attr('class','hidden-side').attr('transform',function(){return'translate('+f(Yl[1].accession)+', 0)'})}function Hn(e){return Yl.find(function(t){return t.accession===e})}// Check if either the source or the target contain one of the specified
// filters. returns true if no filters selected
function Nn(e,t,a){if(0>=a.length)return!0;var n=$c(e.filterTerms,t.filterTerms);return Wc(n,a.map(function(e){return e.name})).length===a.length}// Hide nodes and labels which don't belong to a visible filter
function Bn(){var e=Nl.filter(function(e){return e.selected}),t=[];Li('.cell').attr('opacity',function(a){var n=Hn(a.source),i=Hn(a.id),r=Nn(n,i,e);return r&&(t.push(n.accession),t.push(i.accession)),r?1:0.1}),Li('.interaction-viewer text').attr('fill-opacity',function(e){return t.includes(e.accession)?1:0.1})}function qn(){var e,t=!0,a=!1;try{for(var n,i=Nl[Symbol.iterator]();!(t=(n=i.next()).done);t=!0){var r=n.value,o=Ei('#'+Rn(r.name));o.classed('active',r.selected)}}catch(t){a=!0,e=t}finally{try{!t&&i.return&&i.return()}finally{if(a)throw e}}Bn()}function Rn(e){return e.toLowerCase().replace(/\s|,|^\d/g,'_')}function $n(e){var t=25;return e.length>t?e.substr(0,t-1)+'...':e}function Vn(e,t){Li('.dropdown-pane').style('visibility','hidden'),Nl.filter(function(e){return e.type===t}).forEach(function(e){return e.selected=!1}),e.selected=!e.selected,Ei('[data-toggle=iv_'+t+']').text($n(e.name)),qn()}function Wn(e,t){Li('.dropdown-pane').style('visibility','hidden'),Nl.filter(function(t){return t.type===e}).forEach(function(e){return e.selected=!1}),Ei('[data-toggle=iv_'+e+']').text(t),qn()}function Jn(){Nl.filter(function(e){return e.selected}).forEach(function(e){return e.selected=!1}),In().forEach(function(e){Ei('[data-toggle=iv_'+e.name+']').text(e.label)}),qn()}function Gn(){var e='#'+Ei(this).attr('data-toggle'),t=Ei(e).style('visibility');Ei('.dropdown-pane').style('visibility','hidden'),Ei(e).style('visibility','hidden'===t?'visible':'hidden')}// Add a filter to the interface
function Qn(e,t){Ei(e).selectAll('.interaction-filter-container').remove();var a,n=Ei(e).append('div').attr('class','interaction-filter-container'),i=function(e){if(0<e.items.length)if(l=n.append('div').attr('class','interaction-filter'),l.append('a').text(e.label).attr('class','button dropdown').attr('data-toggle','iv_'+e.name).on('click',Gn),s=l.append('ul').attr('id','iv_'+e.name).attr('class','dropdown-pane'),s.append('li').text('None').on('click',function(){return Wn(e.name,e.label)}),'tree'===e.type)Ya(e.items,function(t){t.type=e.name,Nl.push(t),s.datum(t).append('li').style('padding-left',t.depth+'em').attr('id',function(e){return Rn(e.name)}).text(function(e){return e.name}).on('click',function(t){return Vn(t,e.name)})});else{var t,a=!0,i=!1;try{for(var r,o,c=e.items[Symbol.iterator]();!(a=(r=c.next()).done);a=!0)o=r.value,o.type=e.name,Nl.push(o)}catch(e){i=!0,t=e}finally{try{!a&&c.return&&c.return()}finally{if(i)throw t}}s.selectAll('li').data(e.items).enter().append('li').attr('id',function(e){return Rn(e.name)}).text(function(e){return e.name.toLowerCase()}).on('click',function(t){Vn(t,e.name)})}},r=!0,o=!1;// container.append("div").text('Show only interactions where one or both
// interactors have:');
try{for(var c,d=t[Symbol.iterator]();!(r=(c=d.next()).done);r=!0){var l,s,f=c.value;i(f)}}catch(e){o=!0,a=e}finally{try{!r&&d.return&&d.return()}finally{if(o)throw a}}n.append('button').attr('class','iv_reset').text('Reset filters').on('click',function(){return Jn(),!1})}function ei(e){throw Error('missing option: '+e)}var ti=Math.sqrt,ai=Math.atan2,ni=Math.sin,ii=Math.cos,ri=Math.PI,oi=Math.round,ci=Math.abs,di=Math.pow,li=Math.LN10,si=Math.log,fi=Math.floor,pi=Math.max,bi=Math.ceil,ui=Math.min,gi='http://www.w3.org/1999/xhtml',hi={svg:'http://www.w3.org/2000/svg',xhtml:gi,xlink:'http://www.w3.org/1999/xlink',xml:'http://www.w3.org/XML/1998/namespace',xmlns:'http://www.w3.org/2000/xmlns/'},yi=function(e){var t=e+='',a=t.indexOf(':');return 0<=a&&'xmlns'!==(t=e.slice(0,a))&&(e=e.slice(a+1)),hi.hasOwnProperty(t)?{space:hi[t],local:e}:e},mi=function(a){var n=yi(a);return(n.local?t:e)(n)},_i=function(e){return function(){return this.matches(e)}};if('undefined'!=typeof document){var wi=document.documentElement;if(!wi.matches){var xi=wi.webkitMatchesSelector||wi.msMatchesSelector||wi.mozMatchesSelector||wi.oMatchesSelector;_i=function(e){return function(){return xi.call(this,e)}}}}var vi=_i,ji={},ki=null;if('undefined'!=typeof document){var Ti=document.documentElement;'onmouseenter'in Ti||(ji={mouseenter:'mouseover',mouseleave:'mouseout'})}var Si=function(){for(var e,t=ki;e=t.sourceEvent;)t=e;return t},Ci=function(e,t){var a=e.ownerSVGElement||e;if(a.createSVGPoint){var n=a.createSVGPoint();return n.x=t.clientX,n.y=t.clientY,n=n.matrixTransform(e.getScreenCTM().inverse()),[n.x,n.y]}var i=e.getBoundingClientRect();return[t.clientX-i.left-e.clientLeft,t.clientY-i.top-e.clientTop]},Ai=function(e){var t=Si();return t.changedTouches&&(t=t.changedTouches[0]),Ci(e,t)},Ui=function(e){return null==e?i:function(){return this.querySelector(e)}},Mi=function(e){return null==e?d:function(){return this.querySelectorAll(e)}},Fi=function(e){return Array(e.length)};l.prototype={constructor:l,appendChild:function(e){return this._parent.insertBefore(e,this._next)},insertBefore:function(e,t){return this._parent.insertBefore(e,t)},querySelector:function(e){return this._parent.querySelector(e)},querySelectorAll:function(e){return this._parent.querySelectorAll(e)}};var Oi=function(e){return function(){return e}},Di='$',Ii=function(e){return e.ownerDocument&&e.ownerDocument.defaultView||// node is a Node
e.document&&e// node is a Window
||e.defaultView;// node is a Document
};M.prototype={add:function(e){var t=this._names.indexOf(e);0>t&&(this._names.push(e),this._node.setAttribute('class',this._names.join(' ')))},remove:function(e){var t=this._names.indexOf(e);0<=t&&(this._names.splice(t,1),this._node.setAttribute('class',this._names.join(' ')))},contains:function(e){return 0<=this._names.indexOf(e)}};var Pi=[null];K.prototype=function(){return new K([[document.documentElement]],Pi)}.prototype={constructor:K,select:function(e){'function'!=typeof e&&(e=Ui(e));for(var t=this._groups,a=t.length,r=Array(a),o=0;o<a;++o)for(var c,d,l=t[o],s=l.length,n=r[o]=Array(s),f=0;f<s;++f)(c=l[f])&&(d=e.call(c,c.__data__,f,l))&&('__data__'in c&&(d.__data__=c.__data__),n[f]=d);return new K(r,this._parents)},selectAll:function(e){'function'!=typeof e&&(e=Mi(e));for(var t=this._groups,a=t.length,r=[],o=[],c=0;c<a;++c)for(var d,l=t[c],s=l.length,n=0;n<s;++n)(d=l[n])&&(r.push(e.call(d,d.__data__,n,l)),o.push(d));return new K(r,o)},filter:function(e){'function'!=typeof e&&(e=vi(e));for(var t=this._groups,a=t.length,r=Array(a),o=0;o<a;++o)for(var c,d=t[o],l=d.length,n=r[o]=[],s=0;s<l;++s)(c=d[s])&&e.call(c,c.__data__,s,d)&&n.push(c);return new K(r,this._parents)},data:function(e,t){if(!e)return g=Array(this.size()),l=-1,this.each(function(e){g[++l]=e}),g;var a=t?f:s,n=this._parents,i=this._groups;'function'!=typeof e&&(e=Oi(e));for(var r=i.length,o=Array(r),c=Array(r),d=Array(r),l=0;l<r;++l){var p=n[l],b=i[l],u=b.length,g=e.call(p,p&&p.__data__,l,n),h=g.length,y=c[l]=Array(h),m=o[l]=Array(h),_=d[l]=Array(u);a(p,b,y,m,_,g,t);// Now connect the enter nodes to their following update node, such that
// appendChild can insert the materialized enter node before this node,
// rather than at the end of the parent node.
for(var w,x,v=0,j=0;v<h;++v)if(w=y[v]){for(v>=j&&(j=v+1);!(x=m[j])&&++j<h;);w._next=x||null}}return o=new K(o,n),o._enter=c,o._exit=d,o},enter:function(){return new K(this._enter||this._groups.map(Fi),this._parents)},exit:function(){return new K(this._exit||this._groups.map(Fi),this._parents)},merge:function(e){for(var t=this._groups,a=e._groups,r=t.length,o=a.length,c=ui(r,o),d=Array(r),l=0;l<c;++l)for(var s,f=t[l],p=a[l],b=f.length,n=d[l]=Array(b),u=0;u<b;++u)(s=f[u]||p[u])&&(n[u]=s);for(;l<r;++l)d[l]=t[l];return new K(d,this._parents)},order:function(){for(var e=this._groups,t=-1,a=e.length;++t<a;)for(var n,r=e[t],o=r.length-1,i=r[o];0<=--o;)(n=r[o])&&(i&&i!==n.nextSibling&&i.parentNode.insertBefore(n,i),i=n);return this},sort:function(e){function t(t,n){return t&&n?e(t.__data__,n.__data__):!t-!n}e||(e=p);for(var a=this._groups,r=a.length,o=Array(r),c=0;c<r;++c){for(var d,l=a[c],s=l.length,n=o[c]=Array(s),f=0;f<s;++f)(d=l[f])&&(n[f]=d);n.sort(t)}return new K(o,this._parents).order()},call:function(){var e=arguments[0];return arguments[0]=this,e.apply(null,arguments),this},nodes:function(){var e=Array(this.size()),t=-1;return this.each(function(){e[++t]=this}),e},node:function(){for(var e=this._groups,t=0,a=e.length;t<a;++t)for(var r,o=e[t],c=0,i=o.length;c<i;++c)if(r=o[c],r)return r;return null},size:function(){var e=0;return this.each(function(){++e}),e},empty:function(){return!this.node()},each:function(e){for(var t=this._groups,a=0,r=t.length;a<r;++a)for(var o,c=t[a],d=0,i=c.length;d<i;++d)(o=c[d])&&e.call(o,o.__data__,d,c);return this},attr:function(e,t){var a=yi(e);if(2>arguments.length){var n=this.node();return a.local?n.getAttributeNS(a.space,a.local):n.getAttribute(a)}return this.each((null==t?a.local?u:b:'function'==typeof t?a.local?m:y:a.local?h:g)(a,t))},style:function(e,t,a){return 1<arguments.length?this.each((null==t?_:'function'==typeof t?x:w)(e,t,null==a?'':a)):v(this.node(),e)},property:function(e,t){return 1<arguments.length?this.each((null==t?j:'function'==typeof t?T:k)(e,t)):this.node()[e]},classed:function(e,t){var a=S(e+'');if(2>arguments.length){for(var r=U(this.node()),o=-1,i=a.length;++o<i;)if(!r.contains(a[o]))return!1;return!0}return this.each(('function'==typeof t?L:t?I:P)(a,t))},text:function(e){return arguments.length?this.each(null==e?z:('function'==typeof e?Y:H)(e)):this.node().textContent},html:function(e){return arguments.length?this.each(null==e?N:('function'==typeof e?R:q)(e)):this.node().innerHTML},raise:function(){return this.each($)},lower:function(){return this.each(V)},append:function(e){var t='function'==typeof e?e:mi(e);return this.select(function(){return this.appendChild(t.apply(this,arguments))})},insert:function(e,t){var a='function'==typeof e?e:mi(e),n=null==t?W:'function'==typeof t?t:Ui(t);return this.select(function(){return this.insertBefore(a.apply(this,arguments),n.apply(this,arguments)||null)})},remove:function(){return this.each(Z)},datum:function(e){return arguments.length?this.property('__data__',e):this.node().__data__},on:function(e,a,d){var l,i,t=r(e+''),s=t.length;if(2>arguments.length){var n=this.node().__on;if(n)for(var f,p=0,b=n.length;p<b;++p)for(l=0,f=n[p];l<s;++l)if((i=t[l]).type===f.type&&i.name===f.name)return f.value;return}for(n=a?c:o,null==d&&(d=!1),l=0;l<s;++l)this.each(n(t[l],a,d));return this},dispatch:function(e,t){return this.each(('function'==typeof t?G:J)(e,t))}};var Ei=function(e){return'string'==typeof e?new K([[document.querySelector(e)]],[document.documentElement]):new K([[e]],Pi)},Li=function(e){return'string'==typeof e?new K([document.querySelectorAll(e)],[document.documentElement]):new K([null==e?[]:e],Pi)},zi=function(e,t){return e<t?-1:e>t?1:e>=t?0:NaN},Hi=function(e){return 1===e.length&&(e=Q(e)),{left:function(t,a,n,i){for(null==n&&(n=0),null==i&&(i=t.length);n<i;){var r=n+i>>>1;0>e(t[r],a)?n=r+1:i=r}return n},right:function(t,a,n,i){for(null==n&&(n=0),null==i&&(i=t.length);n<i;){var r=n+i>>>1;0<e(t[r],a)?i=r:n=r+1}return n}}}(zi),Yi=Hi.right,Ni=function(e,t,a){e=+e,t=+t,a=2>(i=arguments.length)?(t=e,e=0,1):3>i?1:+a;for(var r=-1,i=0|pi(0,bi((t-e)/a)),n=Array(i);++r<i;)n[r]=e+r*a;return n},Bi=7.0710678118654755,qi=3.1622776601683795,Ri=1.4142135623730951,$i=function(e,t,a){var r,o,n,c,d=-1;if(t=+t,e=+e,a=+a,e===t&&0<a)return[e];if((r=t<e)&&(o=e,e=t,t=o),0===(c=ee(e,t,a))||!isFinite(c))return[];if(0<c)for(e=bi(e/c),t=fi(t/c),n=Array(o=bi(t-e+1));++d<o;)n[d]=(e+d)*c;else for(e=fi(e*c),t=bi(t*c),n=Array(o=bi(e-t+1));++d<o;)n[d]=(e-d)/c;return r&&n.reverse(),n},Vi='$';ae.prototype=ne.prototype={constructor:ae,has:function(e){return Vi+e in this},get:function(e){return this[Vi+e]},set:function(e,t){return this[Vi+e]=t,this},remove:function(e){var t=Vi+e;return t in this&&delete this[t]},clear:function(){for(var e in this)e[0]===Vi&&delete this[e]},keys:function(){var e=[];for(var t in this)t[0]===Vi&&e.push(t.slice(1));return e},values:function(){var e=[];for(var t in this)t[0]===Vi&&e.push(this[t]);return e},entries:function(){var e=[];for(var t in this)t[0]===Vi&&e.push({key:t.slice(1),value:this[t]});return e},size:function(){var e=0;for(var t in this)t[0]===Vi&&++e;return e},empty:function(){for(var e in this)if(e[0]===Vi)return!1;return!0},each:function(e){for(var t in this)t[0]===Vi&&e(this[t],t.slice(1),this)}};var Wi=Array.prototype,Zi=Wi.map,Xi=Wi.slice,Ji={name:'implicit'},Gi=function(e,t,a){e.prototype=t.prototype=a,a.constructor=e},Ki=0.7,Qi=1/Ki,er=/^#([0-9a-f]{3})$/,tr=/^#([0-9a-f]{6})$/,ar=/^rgb\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*\)$/,nr=/^rgb\(\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)%\s*,\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)%\s*,\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)%\s*\)$/,ir=/^rgba\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)\s*\)$/,rr=/^rgba\(\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)%\s*,\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)%\s*,\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)%\s*,\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)\s*\)$/,or=/^hsl\(\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)\s*,\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)%\s*,\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)%\s*\)$/,cr=/^hsla\(\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)\s*,\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)%\s*,\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)%\s*,\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)\s*\)$/,dr={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};Gi(de,le,{displayable:function(){return this.rgb().displayable()},toString:function(){return this.rgb()+''}}),Gi(ue,be,ce(de,{brighter:function(e){return e=null==e?Qi:di(Qi,e),new ue(this.r*e,this.g*e,this.b*e,this.opacity)},darker:function(e){return e=null==e?Ki:di(Ki,e),new ue(this.r*e,this.g*e,this.b*e,this.opacity)},rgb:function(){return this},displayable:function(){return 0<=this.r&&255>=this.r&&0<=this.g&&255>=this.g&&0<=this.b&&255>=this.b&&0<=this.opacity&&1>=this.opacity},toString:function(){var e=this.opacity;return e=isNaN(e)?1:pi(0,ui(1,e)),(1===e?'rgb(':'rgba(')+pi(0,ui(255,oi(this.r)||0))+', '+pi(0,ui(255,oi(this.g)||0))+', '+pi(0,ui(255,oi(this.b)||0))+(1===e?')':', '+e+')')}})),Gi(ye,function(e,t,a,n){return 1===arguments.length?he(e):new ye(e,t,a,null==n?1:n)},ce(de,{brighter:function(e){return e=null==e?Qi:di(Qi,e),new ye(this.h,this.s,this.l*e,this.opacity)},darker:function(e){return e=null==e?Ki:di(Ki,e),new ye(this.h,this.s,this.l*e,this.opacity)},rgb:function(){var e=this.h%360+360*(0>this.h),t=isNaN(e)||isNaN(this.s)?0:this.s,a=this.l,n=a+(0.5>a?a:1-a)*t,i=2*a-n;return new ue(me(240<=e?e-240:e+120,i,n),me(e,i,n),me(120>e?e+240:e-120,i,n),this.opacity)},displayable:function(){return(0<=this.s&&1>=this.s||isNaN(this.s))&&0<=this.l&&1>=this.l&&0<=this.opacity&&1>=this.opacity}}));var lr=ri/180,sr=180/ri,fr=18,Kn=0.95047,Xn=1,Yn=1.08883,Zn=4/29,pr=6/29,br=3*pr*pr,ur=pr*pr*pr;Gi(we,function(e,t,a,n){return 1===arguments.length?_e(e):new we(e,t,a,null==n?1:n)},ce(de,{brighter:function(e){return new we(this.l+fr*(null==e?1:e),this.a,this.b,this.opacity)},darker:function(e){return new we(this.l-fr*(null==e?1:e),this.a,this.b,this.opacity)},rgb:function(){var e=(this.l+16)/116,t=isNaN(this.a)?e:e+this.a/500,a=isNaN(this.b)?e:e-this.b/200;return e=Xn*ve(e),t=Kn*ve(t),a=Yn*ve(a),new ue(je(3.2404542*t-1.5371385*e-0.4985314*a),// D65 -> sRGB
je(-0.969266*t+1.8760108*e+0.041556*a),je(0.0556434*t-0.2040259*e+1.0572252*a),this.opacity)}})),Gi(Se,function(e,t,a,n){return 1===arguments.length?Te(e):new Se(e,t,a,null==n?1:n)},ce(de,{brighter:function(e){return new Se(this.h,this.c,this.l+fr*(null==e?1:e),this.opacity)},darker:function(e){return new Se(this.h,this.c,this.l-fr*(null==e?1:e),this.opacity)},rgb:function(){return _e(this).rgb()}}));var gr=-0.14861,A=+1.78277,B=-0.29227,C=-0.90649,D=+1.97294,E=D*C,hr=D*A,yr=A*B-C*gr;Gi(Ue,Ae,ce(de,{brighter:function(e){return e=null==e?Qi:di(Qi,e),new Ue(this.h,this.s,this.l*e,this.opacity)},darker:function(e){return e=null==e?Ki:di(Ki,e),new Ue(this.h,this.s,this.l*e,this.opacity)},rgb:function(){var e=isNaN(this.h)?0:(this.h+120)*lr,t=+this.l,n=isNaN(this.s)?0:this.s*t*(1-t),a=ii(e),i=ni(e);return new ue(255*(t+n*(gr*a+A*i)),255*(t+n*(B*a+C*i)),255*(t+n*(D*a)),this.opacity)}}));var mr=function(e){return function(){return e}},_r=function e(t){function a(e,t){var a=n((e=be(e)).r,(t=be(t)).r),i=n(e.g,t.g),r=n(e.b,t.b),o=De(e.opacity,t.opacity);return function(n){return e.r=a(n),e.g=i(n),e.b=r(n),e.opacity=o(n),e+''}}var n=Oe(t);return a.gamma=e,a}(1),wr=function(e,t){var a,n=t?t.length:0,i=e?ui(n,e.length):0,r=Array(n),o=Array(n);for(a=0;a<i;++a)r[a]=Cr(e[a],t[a]);for(;a<n;++a)o[a]=t[a];return function(e){for(a=0;a<i;++a)o[a]=r[a](e);return o}},xr=function(e,n){var i=new Date;return e=+e,n-=e,function(a){return i.setTime(e+n*a),i}},vr=function(e,n){return e=+e,n-=e,function(a){return e+n*a}},jr=function(e,t){var n,r={},i={};for(n in(null===e||'object'!=typeof e)&&(e={}),(null===t||'object'!=typeof t)&&(t={}),t)n in e?r[n]=Cr(e[n],t[n]):i[n]=t[n];return function(e){for(n in r)i[n]=r[n](e);return i}},kr=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,Tr=new RegExp(kr.source,'g'),Sr=function(e,a){var// scan index for next number in b
t,// current match in a
n,// current match in b
r,o=kr.lastIndex=Tr.lastIndex=0,// string preceding current number in b, if any
c=-1,// index in s
d=[],// string constants and placeholders
l=[];// number interpolators
// Coerce inputs to strings.
// Interpolate pairs of numbers in a & b.
for(e+='',a+='';(t=kr.exec(e))&&(n=Tr.exec(a));)(r=n.index)>o&&(r=a.slice(o,r),d[c]?d[c]+=r:d[++c]=r),(t=t[0])===(n=n[0])?d[c]?d[c]+=n:d[++c]=n:(d[++c]=null,l.push({i:c,x:vr(t,n)})),o=Tr.lastIndex;// Add remains of b.
// Special optimization for only a single match.
// Otherwise, interpolate each of the numbers and rejoin the string.
return o<a.length&&(r=a.slice(o),d[c]?d[c]+=r:d[++c]=r),2>d.length?l[0]?Pe(l[0].x):Ie(a):(a=l.length,function(e){for(var t,n=0;n<a;++n)d[(t=l[n]).i]=t.x(e);return d.join('')})},Cr=function(e,a){var n,i=typeof a;return null==a||'boolean'==i?mr(a):('number'==i?vr:'string'==i?(n=le(a))?(a=n,_r):Sr:a instanceof le?_r:a instanceof Date?xr:Array.isArray(a)?wr:'function'!=typeof a.valueOf&&'function'!=typeof a.toString||isNaN(a)?jr:vr)(e,a)},Ar=function(e,n){return e=+e,n-=e,function(a){return oi(e+n*a)}};Ee(function(e,t){var a=t-e;return a?Me(e,180<a||-180>a?a-360*oi(a/360):a):mr(isNaN(e)?t:e)});var Ur,Mr=Ee(De),Fr=function(e){return function(){return e}},Or=function(e){return+e},Dr=[0,1],Ir=function(e,t){if(0>(a=(e=t?e.toExponential(t-1):e.toExponential()).indexOf('e')))return null;// NaN, ±Infinity
var a,n=e.slice(0,a);// The string returned by toExponential either has the form \d\.\d+e[-+]\d+
// (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
return[1<n.length?n[0]+n.slice(2):n,+e.slice(a+1)]},Pr=function(e){return e=Ir(ci(e)),e?e[1]:NaN},Er=function(e,a){return function(n,r){for(var o=n.length,i=[],t=0,c=e[0],d=0;0<o&&0<c&&(d+c+1>r&&(c=pi(1,r-d)),i.push(n.substring(o-=c,o+c)),!((d+=c+1)>r));)c=e[t=(t+1)%e.length];return i.reverse().join(a)}},Lr=function(e){return function(t){return t.replace(/[0-9]/g,function(t){return e[+t]})}},zr=function(e,t){var a=Ir(e,t);if(!a)return e+'';var n=a[0],i=a[1];return 0>i?'0.'+Array(-i).join('0')+n:n.length>i+1?n.slice(0,i+1)+'.'+n.slice(i+1):n+Array(i-n.length+2).join('0')},Hr={"":function(e,t){e=e.toPrecision(t);out:for(var a,r=e.length,n=1,i=-1;n<r;++n)switch(e[n]){case'.':i=a=n;break;case'0':0===i&&(i=n),a=n;break;case'e':break out;default:0<i&&(i=0);}return 0<i?e.slice(0,i)+e.slice(a+1):e},"%":function(e,t){return(100*e).toFixed(t)},b:function(e){return oi(e).toString(2)},c:function(e){return e+''},d:function(e){return oi(e).toString(10)},e:function(e,t){return e.toExponential(t)},f:function(e,t){return e.toFixed(t)},g:function(e,t){return e.toPrecision(t)},o:function(e){return oi(e).toString(8)},p:function(e,t){return zr(100*e,t)},r:zr,s:function(e,t){var a=Ir(e,t);if(!a)return e+'';var r=a[0],o=a[1],c=o-(Ur=3*pi(-8,ui(8,fi(o/3))))+1,i=r.length;return c===i?r:c>i?r+Array(c-i+1).join('0'):0<c?r.slice(0,c)+'.'+r.slice(c):'0.'+Array(1-c).join('0')+Ir(e,pi(0,t+c-1))[0];// less than 1y!
},X:function(e){return oi(e).toString(16).toUpperCase()},x:function(e){return oi(e).toString(16)}},Yr=/^(?:(.)?([<>=^]))?([+\-\( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?([a-z%])?$/i;// [[fill]align][sign][symbol][0][width][,][.precision][type]
Re.prototype=$e.prototype,$e.prototype.toString=function(){return this.fill+this.align+this.sign+this.symbol+(this.zero?'0':'')+(null==this.width?'':pi(1,0|this.width))+(this.comma?',':'')+(null==this.precision?'':'.'+pi(0,0|this.precision))+this.type};var re,Nr,Br,qr=function(e){return e},Rr=['y','z','a','f','p','n','\xB5','m','','k','M','G','T','P','E','Z','Y'],$r=function(e){function t(e){function t(e){var t,i,n,s=h,w=y;if('c'===g)w=m(e)+w,e='';else{e=+e;// Perform the initial formatting.
var x=0>e;// Break the formatted value into the integer “value” part that can be
// grouped, and fractional or exponential “suffix” part that is not.
if(e=m(ci(e),u),x&&0==+e&&(x=!1),s=(x?'('===l?l:'-':'-'===l||'('===l?'':l)+s,w=w+('s'===g?Rr[8+Ur/3]:'')+(x&&'('===l?')':''),_)for(t=-1,i=e.length;++t<i;)if(n=e.charCodeAt(t),48>n||57<n){w=(46===n?r+e.slice(t+1):e.slice(t))+w,e=e.slice(0,t);break}}// If the fill character is not "0", grouping is applied before padding.
b&&!f&&(e=a(e,Infinity));// Compute the padding.
var v=s.length+e.length+w.length,j=v<p?Array(p-v+1).join(d):'';// If the fill character is "0", grouping is applied after padding.
// Reconstruct the final output based on the desired alignment.
switch(b&&f&&(e=a(j+e,j.length?p-w.length:Infinity),j=''),c){case'<':e=s+e+w+j;break;case'=':e=s+j+e+w;break;case'^':e=j.slice(0,v=j.length>>1)+s+e+w+j.slice(v);break;default:e=j+s+e+w;}return o(e)}e=Re(e);var d=e.fill,c=e.align,l=e.sign,s=e.symbol,f=e.zero,p=e.width,b=e.comma,u=e.precision,g=e.type,h='$'===s?n[0]:'#'===s&&/[boxX]/.test(g)?'0'+g.toLowerCase():'',y='$'===s?n[1]:/[%p]/.test(g)?i:'',m=Hr[g],_=!g||/[defgprs%]/.test(g);// Compute the prefix and suffix.
// For SI-prefix, the suffix is lazily computed.
// What format function should we use?
// Is this an integer type?
// Can this type generate exponential notation?
// Set the default precision if not specified,
// or clamp the specified precision to the supported range.
// For significant precision, it must be in [1, 21].
// For fixed precision, it must be in [0, 20].
return u=null==u?g?6:12:/[gprs]/.test(g)?pi(1,ui(21,u)):pi(0,ui(20,u)),t.toString=function(){return e+''},t}var a=e.grouping&&e.thousands?Er(e.grouping,e.thousands):qr,n=e.currency,r=e.decimal,o=e.numerals?Lr(e.numerals):qr,i=e.percent||'%';return{format:t,formatPrefix:function(a,n){var i=t((a=Re(a),a.type='f',a)),r=3*pi(-8,ui(8,fi(Pr(n)/3))),o=di(10,-r),c=Rr[8+r/3];return function(e){return i(o*e)+c}}}};(function(e){return re=$r(e),Nr=re.format,Br=re.formatPrefix,re})({decimal:'.',thousands:',',grouping:[3],currency:['$','']});var Vr=function(e){return pi(0,-Pr(ci(e)))},Wr=function(e,t){return pi(0,3*pi(-8,ui(8,fi(Pr(t)/3)))-Pr(ci(e)))},Zr=function(e,t){return e=ci(e),t=ci(t)-e,pi(0,Pr(t)-Pr(e))+1},Xr=function(e,t,a){var n,i=e[0],r=e[e.length-1],o=te(i,r,null==t?10:t);switch(a=Re(null==a?',f':a),a.type){case's':{var c=pi(ci(i),ci(r));return null!=a.precision||isNaN(n=Wr(o,c))||(a.precision=n),Br(a,c)}case'':case'e':case'g':case'p':case'r':{null!=a.precision||isNaN(n=Zr(o,pi(ci(i),ci(r))))||(a.precision=n-('e'===a.type));break}case'f':case'%':{null!=a.precision||isNaN(n=Vr(o))||(a.precision=n-2*('%'===a.type));break}}return Nr(a)},Jr=new Date,Gr=new Date,Kr=Ze(function(){// noop
},function(e,t){e.setTime(+e+t)},function(e,t){return t-e});// An optimized implementation for this simple case.
Kr.every=function(e){return e=fi(e),isFinite(e)&&0<e?1<e?Ze(function(t){t.setTime(fi(t/e)*e)},function(t,a){t.setTime(+t+a*e)},function(t,a){return(a-t)/e}):Kr:null};var Qr=1e3,eo=6e4,to=36e5,ao=864e5,no=6048e5,io=Ze(function(e){e.setTime(fi(e/Qr)*Qr)},function(e,t){e.setTime(+e+t*Qr)},function(e,t){return(t-e)/Qr},function(e){return e.getUTCSeconds()}),ro=Ze(function(e){e.setTime(fi(e/eo)*eo)},function(e,t){e.setTime(+e+t*eo)},function(e,t){return(t-e)/eo},function(e){return e.getMinutes()}),oo=Ze(function(e){var t=e.getTimezoneOffset()*eo%to;0>t&&(t+=to),e.setTime(fi((+e-t)/to)*to+t)},function(e,t){e.setTime(+e+t*to)},function(e,t){return(t-e)/to},function(e){return e.getHours()}),co=Ze(function(e){e.setHours(0,0,0,0)},function(e,t){e.setDate(e.getDate()+t)},function(e,t){return(t-e-(t.getTimezoneOffset()-e.getTimezoneOffset())*eo)/ao},function(e){return e.getDate()-1}),lo=Xe(0),so=Xe(1),fo=Xe(2),po=Xe(3),bo=Xe(4),uo=Xe(5),go=Xe(6),ho=Ze(function(e){e.setDate(1),e.setHours(0,0,0,0)},function(e,t){e.setMonth(e.getMonth()+t)},function(e,t){return t.getMonth()-e.getMonth()+12*(t.getFullYear()-e.getFullYear())},function(e){return e.getMonth()}),yo=Ze(function(e){e.setMonth(0,1),e.setHours(0,0,0,0)},function(e,t){e.setFullYear(e.getFullYear()+t)},function(e,t){return t.getFullYear()-e.getFullYear()},function(e){return e.getFullYear()});// An optimized implementation for this simple case.
yo.every=function(e){return isFinite(e=fi(e))&&0<e?Ze(function(t){t.setFullYear(fi(t.getFullYear()/e)*e),t.setMonth(0,1),t.setHours(0,0,0,0)},function(t,a){t.setFullYear(t.getFullYear()+a*e)}):null};var mo=Ze(function(e){e.setUTCSeconds(0,0)},function(e,t){e.setTime(+e+t*eo)},function(e,t){return(t-e)/eo},function(e){return e.getUTCMinutes()}),_o=Ze(function(e){e.setUTCMinutes(0,0,0)},function(e,t){e.setTime(+e+t*to)},function(e,t){return(t-e)/to},function(e){return e.getUTCHours()}),wo=Ze(function(e){e.setUTCHours(0,0,0,0)},function(e,t){e.setUTCDate(e.getUTCDate()+t)},function(e,t){return(t-e)/ao},function(e){return e.getUTCDate()-1}),xo=Je(0),vo=Je(1),jo=Je(2),ko=Je(3),To=Je(4),So=Je(5),Co=Je(6),Ao=Ze(function(e){e.setUTCDate(1),e.setUTCHours(0,0,0,0)},function(e,t){e.setUTCMonth(e.getUTCMonth()+t)},function(e,t){return t.getUTCMonth()-e.getUTCMonth()+12*(t.getUTCFullYear()-e.getUTCFullYear())},function(e){return e.getUTCMonth()}),Uo=Ze(function(e){e.setUTCMonth(0,1),e.setUTCHours(0,0,0,0)},function(e,t){e.setUTCFullYear(e.getUTCFullYear()+t)},function(e,t){return t.getUTCFullYear()-e.getUTCFullYear()},function(e){return e.getUTCFullYear()});// An optimized implementation for this simple case.
Uo.every=function(e){return isFinite(e=fi(e))&&0<e?Ze(function(t){t.setUTCFullYear(fi(t.getUTCFullYear()/e)*e),t.setUTCMonth(0,1),t.setUTCHours(0,0,0,0)},function(t,a){t.setUTCFullYear(t.getUTCFullYear()+a*e)}):null};var Mo,Fo,Oo,Do={0:'0',"-":'',_:' '},Io=/^\s*\d+/,Po=/^%/,Eo=/[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;(function(e){return Mo=et(e),Fo=Mo.utcFormat,Oo=Mo.utcParse,Mo})({dateTime:'%x, %X',date:'%-m/%-d/%Y',time:'%-I:%M:%S %p',periods:['AM','PM'],days:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],shortDays:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],months:['January','February','March','April','May','June','July','August','September','October','November','December'],shortMonths:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']});var Lo='%Y-%m-%dT%H:%M:%S.%LZ',zo=Date.prototype.toISOString?function(e){return e.toISOString()}:Fo(Lo),Ho=+new Date('2000-01-01T00:00:00.000Z')?function(e){var t=new Date(e);return isNaN(t)?null:t}:Oo(Lo),Yo=function(e){return e.match(/.{6}/g).map(function(e){return'#'+e})};Yo('1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf'),Yo('393b795254a36b6ecf9c9ede6379398ca252b5cf6bcedb9c8c6d31bd9e39e7ba52e7cb94843c39ad494ad6616be7969c7b4173a55194ce6dbdde9ed6'),Yo('3182bd6baed69ecae1c6dbefe6550dfd8d3cfdae6bfdd0a231a35474c476a1d99bc7e9c0756bb19e9ac8bcbddcdadaeb636363969696bdbdbdd9d9d9'),Yo('1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5'),Mr(Ae(300,0.5,0),Ae(-240,0.5,1));var No=Mr(Ae(-100,0.75,0.35),Ae(80,1.5,0.8)),Bo=Mr(Ae(260,0.75,0.35),Ae(80,1.5,0.8)),qo=Ae();Zt(Yo('44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725'));var Ro=Zt(Yo('00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf')),$o=Zt(Yo('00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4')),Vo=Zt(Yo('0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921')),Wo='object'==typeof global&&global&&global.Object===Object&&global,Zo='object'==typeof self&&self&&self.Object===Object&&self,Xo=Wo||Zo||Function('return this')(),Jo=Xo.Symbol,Go=Object.prototype,Ko=Go.hasOwnProperty,Qo=Go.toString,ec=Jo?Jo.toStringTag:void 0,tc=Object.prototype,ac=tc.toString,nc='[object Null]',ic='[object Undefined]',rc=Jo?Jo.toStringTag:void 0,oc='[object Arguments]',cc=Object.prototype,dc=cc.hasOwnProperty,lc=cc.propertyIsEnumerable,sc=ea(function(){return arguments}())?ea:function(e){return Qt(e)&&dc.call(e,'callee')&&!lc.call(e,'callee')},fc=Array.isArray,pc=Jo?Jo.isConcatSpreadable:void 0,bc=pi,uc='[object AsyncFunction]',gc='[object Function]',hc='[object GeneratorFunction]',yc='[object Proxy]',mc=Xo['__core-js_shared__'],_c=function(){var e=/[^.]+$/.exec(mc&&mc.keys&&mc.keys.IE_PROTO||'');return e?'Symbol(src)_1.'+e:''}(),wc=Function.prototype,xc=wc.toString,vc=/[\\^$.*+?()[\]{}|]/g,jc=/^\[object .+?Constructor\]$/,kc=Function.prototype,Tc=Object.prototype,Sc=kc.toString,Cc=Tc.hasOwnProperty,Ac=RegExp('^'+Sc.call(Cc).replace(vc,'\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,'$1.*?')+'$'),Uc=function(){try{var e=ba(Object,'defineProperty');return e({},'',{}),e}catch(t){}}(),Mc=Uc?function(e,t){return Uc(e,'toString',{configurable:!0,enumerable:!1,value:oa(t),writable:!0})}:na,Fc=Date.now,Oc=function(e){var t=0,a=0;return function(){var n=Fc(),i=16-(n-a);if(a=n,!(0<i))t=0;else if(++t>=800)return arguments[0];return e.apply(void 0,arguments)}}(Mc),Dc=ba(Object,'create'),Ic=Object.prototype,Pc=Ic.hasOwnProperty,Ec=Object.prototype,Lc=Ec.hasOwnProperty;/** Detect free variable `self`. *//** Used as a reference to the global object. *//** Built-in value references. *//** Used for built-in method references. *//** Used to check objects for own properties. *//**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 *//** Built-in value references. *//**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 *//** Built-in value references. *//** Used to check objects for own properties. *//** Built-in value references. *//**
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
 *//** Built-in value references. *//** Used to detect methods masquerading as native. *//** Used to resolve the decompiled source of functions. *//** Used to detect host constructors (Safari). *//** Used for built-in method references. *//** Used to resolve the decompiled source of functions. *//** Used to check objects for own properties. *//** Used to detect if a method is native. *//**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 *//** Used to detect hot functions by number of calls within a span of milliseconds. *//* Built-in method references for those with the same name as other `lodash` methods. *//** Used for built-in method references. *//** Used to check objects for own properties. *//** Used to check objects for own properties. */ga.prototype.clear=function(){this.__data__=Dc?Dc(null):{},this.size=0},ga.prototype['delete']=function(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t},ga.prototype.get=function(e){var t=this.__data__;if(Dc){var a=t[e];return a==='__lodash_hash_undefined__'?void 0:a}return Pc.call(t,e)?t[e]:void 0},ga.prototype.has=function(e){var t=this.__data__;return Dc?t[e]!==void 0:Lc.call(t,e)},ga.prototype.set=function(e,t){var a=this.__data__;return this.size+=this.has(e)?0:1,a[e]=Dc&&void 0===t?'__lodash_hash_undefined__':t,this};var zc=Array.prototype,Hc=zc.splice;/** Built-in value references. */ma.prototype.clear=function(){this.__data__=[],this.size=0},ma.prototype['delete']=function(e){var t=this.__data__,a=ya(t,e);if(0>a)return!1;var n=t.length-1;return a==n?t.pop():Hc.call(t,a,1),--this.size,!0},ma.prototype.get=function(e){var t=this.__data__,a=ya(t,e);return 0>a?void 0:t[a][1]},ma.prototype.has=function(e){return-1<ya(this.__data__,e)},ma.prototype.set=function(e,t){var a=this.__data__,n=ya(a,e);return 0>n?(++this.size,a.push([e,t])):a[n][1]=t,this};/* Built-in method references that are verified to be native. */var Yc=ba(Xo,'Map');xa.prototype.clear=function(){this.size=0,this.__data__={hash:new ga,map:new(Yc||ma),string:new ga}},xa.prototype['delete']=function(e){var t=wa(this,e)['delete'](e);return this.size-=t?1:0,t},xa.prototype.get=function(e){return wa(this,e).get(e)},xa.prototype.has=function(e){return wa(this,e).has(e)},xa.prototype.set=function(e,t){var a=wa(this,e),n=a.size;return a.set(e,t),this.size+=a.size==n?0:1,this};/** Used to stand-in for `undefined` hash values. */va.prototype.add=va.prototype.push=function(e){return this.__data__.set(e,'__lodash_hash_undefined__'),this},va.prototype.has=function(e){return this.__data__.has(e)};var Nc=ba(Xo,'Set'),Bc=Nc&&1/Ma(new Nc([,-0]))[1]==1/0?function(e){return new Nc(e)}:function(){}// No operation performed.
,qc=200,Rc=9007199254740991,$c=ua(function(e){return Fa(aa(e,1,Ia,!0))}),Vc=ui,Wc=ua(function(e){var t=Pa(e,za);return t.length&&t[0]===e[0]?La(t):[]}),Zc=function e(t,a,n){if(!(0>=a.length)){var i,r=!0,o=!1;try{for(var c,d,l=t[Symbol.iterator]();!(r=(c=l.next()).done);r=!0)if(d=c.value,d.name===a[0])return void e(d.children,a.slice(1),d)}catch(e){o=!0,i=e}finally{try{!r&&l.return&&l.return()}finally{if(o)throw i}}var s={name:a[0],selected:!1,parent:n,children:[]};t.push(s),e(s.children,a.slice(1),s)}};/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 *//** Used as the size to enable large array optimizations. */Na.prototype.clear=function(){this.__data__=new ma,this.size=0},Na.prototype['delete']=function(e){var t=this.__data__,a=t['delete'](e);return this.size=t.size,a},Na.prototype.get=function(e){return this.__data__.get(e)},Na.prototype.has=function(e){return this.__data__.has(e)},Na.prototype.set=function(e,t){var a=this.__data__;if(a instanceof ma){var n=a.__data__;if(!Yc||n.length<200-1)return n.push([e,t]),this.size=++a.size,this;a=this.__data__=new xa(n)}return a.set(e,t),this.size=a.size,this};var Xc=Object.prototype,Jc=Xc.hasOwnProperty,Gc='object'==typeof exports&&exports&&!exports.nodeType&&exports,Kc=Gc&&'object'==typeof module&&module&&!module.nodeType&&module,Qc=Kc&&Kc.exports===Gc,ed=Qc?Xo.Buffer:void 0,td=ed?ed.isBuffer:void 0,ad=td||function(){return!1},nd=9007199254740991,id=/^(?:0|[1-9]\d*)$/,rd={};/** Used to check objects for own properties. *//** Detect free variable `module`. *//** Detect the popular CommonJS extension `module.exports`. *//** Built-in value references. *//* Built-in method references for those with the same name as other `lodash` methods. *//**
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
 *//** Used as references for various `Number` constants. *//** Used to detect unsigned integer values. *//** Used to identify `toStringTag` values of typed arrays. */rd['[object Float32Array]']=rd['[object Float64Array]']=rd['[object Int8Array]']=rd['[object Int16Array]']=rd['[object Int32Array]']=rd['[object Uint8Array]']=rd['[object Uint8ClampedArray]']=rd['[object Uint16Array]']=rd['[object Uint32Array]']=!0,rd['[object Arguments]']=rd['[object Array]']=rd['[object ArrayBuffer]']=rd['[object Boolean]']=rd['[object DataView]']=rd['[object Date]']=rd['[object Error]']=rd['[object Function]']=rd['[object Map]']=rd['[object Number]']=rd['[object Object]']=rd['[object RegExp]']=rd['[object Set]']=rd['[object String]']=rd['[object WeakMap]']=!1;var od='object'==typeof exports&&exports&&!exports.nodeType&&exports,cd=od&&'object'==typeof module&&module&&!module.nodeType&&module,dd=cd&&cd.exports===od,ld=dd&&Wo.process,sd=function(){try{return ld&&ld.binding&&ld.binding('util')}catch(t){}}(),fd=sd&&sd.isTypedArray,pd=fd?Ea(fd):function(e){return Qt(e)&&Oa(e.length)&&!!rd[Kt(e)]},bd=Object.prototype,ud=bd.hasOwnProperty,gd=Object.prototype,hd=Ja(Object.keys,Object),yd=Object.prototype,md=yd.hasOwnProperty,_d=Object.prototype,wd=_d.hasOwnProperty,xd='object'==typeof exports&&exports&&!exports.nodeType&&exports,vd=xd&&'object'==typeof module&&module&&!module.nodeType&&module,jd=vd&&vd.exports===xd,kd=jd?Xo.Buffer:void 0,Td=kd?kd.allocUnsafe:void 0,Sd=Object.prototype,Cd=Sd.propertyIsEnumerable,Ad=Object.getOwnPropertySymbols,Ud=Ad?function(e){return null==e?[]:(e=Object(e),cn(Ad(e),function(t){return Cd.call(e,t)}))}:dn,Md=Ja(Object.getPrototypeOf,Object),Fd=Object.getOwnPropertySymbols,Od=Fd?function(e){for(var t=[];e;)Xt(t,Ud(e)),e=Md(e);return t}:dn,Dd=ba(Xo,'DataView'),Id=ba(Xo,'Promise'),Pd=ba(Xo,'WeakMap'),Ed='[object Map]',Ld='[object Promise]',zd='[object Set]',Hd='[object WeakMap]',Yd='[object DataView]',Nd=sa(Dd),Bd=sa(Yc),qd=sa(Id),Rd=sa(Nc),$d=sa(Pd),Vd=Kt;/** Detect free variable `module`. *//** Detect the popular CommonJS extension `module.exports`. *//** Detect free variable `process` from Node.js. *//** Used to access faster Node.js helpers. *//* Node.js helper references. *//**
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
 *//** Used for built-in method references. *//** Used to check objects for own properties. *//** Used for built-in method references. *//** Used to check objects for own properties. *//** Used to check objects for own properties. *//** Detect free variable `module`. *//** Detect the popular CommonJS extension `module.exports`. *//** Built-in value references. *//** Built-in value references. *//* Built-in method references for those with the same name as other `lodash` methods. *//**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 *//* Built-in method references for those with the same name as other `lodash` methods. *//**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 *//* Built-in method references that are verified to be native. *//* Built-in method references that are verified to be native. *//** `Object#toString` result references. *//** Used to detect maps, sets, and weakmaps. *//**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
(Dd&&Vd(new Dd(new ArrayBuffer(1)))!=Yd||Yc&&Vd(new Yc)!=Ed||Id&&Vd(Id.resolve())!=Ld||Nc&&Vd(new Nc)!=zd||Pd&&Vd(new Pd)!=Hd)&&(Vd=function(e){var t=Kt(e),a=t=='[object Object]'?e.constructor:void 0,n=a?sa(a):'';if(n)switch(n){case Nd:return Yd;case Bd:return Ed;case qd:return Ld;case Rd:return zd;case $d:return Hd;}return t});var Wd=Vd,Zd=Object.prototype,Xd=Zd.hasOwnProperty,Jd=Xo.Uint8Array,Gd=1,Kd=/\w*$/,Qd=1,el=Jo?Jo.prototype:void 0,tl=el?el.valueOf:void 0,al='[object Boolean]',nl='[object Date]',il='[object Map]',rl='[object Number]',ol='[object RegExp]',cl='[object Set]',dl='[object String]',ll='[object Symbol]',sl='[object ArrayBuffer]',fl='[object DataView]',pl='[object Float32Array]',bl='[object Float64Array]',ul='[object Int8Array]',gl='[object Int16Array]',hl='[object Int32Array]',yl='[object Uint8Array]',ml='[object Uint8ClampedArray]',_l='[object Uint16Array]',wl='[object Uint32Array]',xl=Object.create,vl=function(){function e(){}return function(t){if(!ca(t))return{};if(xl)return xl(t);e.prototype=t;var a=new e;return e.prototype=void 0,a}}(),jl=1,kl=2,Tl=4,Sl='[object Arguments]',Cl='[object Function]',Al='[object GeneratorFunction]',Ul='[object Object]',Ml={};/** Used for built-in method references. *//** Used to check objects for own properties. *//**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 *//** `Object#toString` result references. *//** Used to identify `toStringTag` values supported by `_.clone`. */Ml[Sl]=Ml['[object Array]']=Ml['[object ArrayBuffer]']=Ml['[object DataView]']=Ml['[object Boolean]']=Ml['[object Date]']=Ml['[object Float32Array]']=Ml['[object Float64Array]']=Ml['[object Int8Array]']=Ml['[object Int16Array]']=Ml['[object Int32Array]']=Ml['[object Map]']=Ml['[object Number]']=Ml[Ul]=Ml['[object RegExp]']=Ml['[object Set]']=Ml['[object String]']=Ml['[object Symbol]']=Ml['[object Uint8Array]']=Ml['[object Uint8ClampedArray]']=Ml['[object Uint16Array]']=Ml['[object Uint32Array]']=!0,Ml['[object Error]']=Ml[Cl]=Ml['[object WeakMap]']=!1;var Fl,Ol,Dl=4,Il=function(){function e(e){this.value=e}function t(t){function a(i,r){try{var o=t[i](r),c=o.value;c instanceof e?Promise.resolve(c.value).then(function(e){a('next',e)},function(e){a('throw',e)}):n(o.done?'return':'normal',o.value)}catch(e){n('throw',e)}}function n(e,t){'return'===e?i.resolve({value:t,done:!0}):'throw'===e?i.reject(t):i.resolve({value:t,done:!1});i=i.next,i?a(i.key,i.arg):r=null}var i,r;this._invoke=function(e,t){return new Promise(function(n,o){var c={key:e,arg:t,resolve:n,reject:o,next:null};r?r=r.next=c:(i=r=c,a(e,t))})},'function'!=typeof t.return&&(this.return=void 0)}return'function'==typeof Symbol&&Symbol.asyncIterator&&(t.prototype[Symbol.asyncIterator]=function(){return this}),t.prototype.next=function(e){return this._invoke('next',e)},t.prototype.throw=function(e){return this._invoke('throw',e)},t.prototype.return=function(e){return this._invoke('return',e)},{wrap:function(e){return function(){return new t(e.apply(this,arguments))}},await:function(t){return new e(t)}}}(),Pl=function(e,t){if(!(e instanceof t))throw new TypeError('Cannot call a class as a function')},El=function(){function e(e,t){for(var a,n=0;n<t.length;n++)a=t[n],a.enumerable=a.enumerable||!1,a.configurable=!0,'value'in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),Ll=function(e,t){if('function'!=typeof t&&null!==t)throw new TypeError('Super expression must either be null or a function, not '+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)},zl=function(e,t){if(!e)throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');return t&&('object'==typeof t||'function'==typeof t)?t:e},Hl=function(){function e(e,t){var a,n=[],i=!0,r=!1;try{for(var o,c=e[Symbol.iterator]();!(i=(o=c.next()).done)&&(n.push(o.value),!(t&&n.length===t));i=!0);}catch(e){r=!0,a=e}finally{try{!i&&c['return']&&c['return']()}finally{if(r)throw a}}return n}return function(t,a){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,a);throw new TypeError('Invalid attempt to destructure non-iterable instance')}}();(function(e,t){if('undefined'==typeof document)return t;e=e||'';var a=document.head||document.getElementsByTagName('head')[0],n=document.createElement('style');return n.type='text/css',a.appendChild(n),n.styleSheet?n.styleSheet.cssText=e:n.appendChild(document.createTextNode(e)),t})('@charset "UTF-8";interaction-viewer{position:relative}interaction-viewer text{font-family:Open Sans,sans-serif;fill:#000;opacity:.75;font-size:12px}interaction-viewer .active text{opacity:1}interaction-viewer .active-row{stroke:#4a90e2}interaction-viewer .interaction-tooltip{z-index:2;position:absolute;background:#fff;padding:.5em 1em;border:1px solid #979797;box-shadow:2px 2px 2px #333;transition:all .25s;min-width:36em}interaction-viewer .interaction-tooltip .close-interaction-tooltip{cursor:pointer;float:right;margin-bottom:.8em}interaction-viewer .interaction-tooltip .tooltip-content{clear:both}interaction-viewer .interaction-filter-container{text-align:left}interaction-viewer .interaction-filter-container #filter-display .filter-selected{margin:.2em .5em;padding:.3em .1em;background-color:#f2f2f2;border:1px solid #e8e8e8;cursor:pointer;white-space:nowrap;display:inline-block}interaction-viewer .interaction-filter-container #filter-display .filter-selected:after{content:"\u2716";margin:0 .3em}interaction-viewer .interaction-filter-container .interaction-filter{vertical-align:top;margin-bottom:.5em;display:inline-block}interaction-viewer .interaction-filter-container .interaction-filter ul{border:1px solid #e8e8e8;max-height:15em;overflow-y:auto;list-style:none;padding:0;margin:0}interaction-viewer .interaction-filter-container .interaction-filter ul li{cursor:pointer;padding:.5em;border-bottom:1px solid #e8e8e8}interaction-viewer .interaction-filter-container .interaction-filter ul li:hover{background-color:#f2f2f2}interaction-viewer .interaction-filter-container .interaction-filter ul li.active{font-weight:700}interaction-viewer .interaction-viewer .cell{fill:#4a90e2}interaction-viewer .interaction-viewer .cell.active-cell{r:.8em;transition:all .5s}interaction-viewer .interaction-viewer .hidden-side{fill:#e8e8e8}interaction-viewer .interaction-viewer .main-accession{font-weight:700}interaction-viewer .interaction-viewer .text-highlight{fill:#fff;opacity:0;transition:all .5s}interaction-viewer .interaction-viewer-table tr:nth-child(2n){background:#f2f2f2}interaction-viewer .interaction-viewer-table td,interaction-viewer .interaction-viewer-table th{padding:.5em;text-align:center}interaction-viewer .interaction-viewer-table th{background-color:#e8e8e8;white-space:nowrap}interaction-viewer .interaction-viewer-table .interaction-viewer-table_row-header{font-weight:700;text-align:right}interaction-viewer .button{display:inline-block;vertical-align:middle;margin:0 1em 0 0;padding:.85em 1em;-webkit-appearance:none;border:1px solid transparent;border-radius:0;transition:background-color .25s ease-out,color .25s ease-out;line-height:1;text-align:center;cursor:pointer;background-color:#f2f2f2!important;color:#3a343a;border:1px solid #e8e8e8}interaction-viewer .iv_reset{display:block}interaction-viewer .button:hover{color:#3a343a}interaction-viewer .button.dropdown:after{display:block;width:0;height:0;border:.4em inset;content:"";border-bottom-width:0;border-top-style:solid;border-color:#3a343a transparent transparent;position:relative;top:.4em;display:inline-block;float:right;margin-left:1em}interaction-viewer .dropdown-pane{position:absolute;z-index:1;display:block;width:300px;padding:1rem;visibility:hidden;border:1px solid #cacaca;border-radius:0;background-color:#fefefe}interaction-viewer .tree-list{text-align:left;list-style:none}interaction-viewer .tree-list li{margin:.5em 0}.loader,.loader:after,.loader:before{background:#cbcbcb;-webkit-animation:a 1s infinite ease-in-out;animation:a 1s infinite ease-in-out;width:1em;height:4em}.loader{color:#cbcbcb;text-indent:-9999em;margin:88px auto;position:relative;font-size:11px;-webkit-transform:translateZ(0);transform:translateZ(0);-webkit-animation-delay:-.16s;animation-delay:-.16s}.loader:after,.loader:before{position:absolute;top:0;content:""}.loader:before{left:-1.5em;-webkit-animation-delay:-.32s;animation-delay:-.32s}.loader:after{left:1.5em}@-webkit-keyframes a{0%,80%,to{box-shadow:0 0;height:4em}40%{box-shadow:0 -2em;height:5em}}@keyframes a{0%,80%,to{box-shadow:0 0;height:4em}40%{box-shadow:0 -2em;height:5em}}',void 0);var Yl,Nl=[],Bl=function(){var e=function(e){function t(){Pl(this,t);var e=zl(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return e._accession=e.getAttribute('accession'),e}return Ll(t,e),El(t,[{key:'connectedCallback',value:function(){this._render()}},{key:'attributeChangedCallback',value:function(e,t,a){'accession'===e&&null!=t&&t!=a&&(this._accession=a,this._render())}},{key:'_render',value:function(){Pn({el:this,accession:this._accession})}},{key:'accession',set:function(e){this._accession=e},get:function(){return this._accession}}],[{key:'observedAttributes',get:function(){return['accession']}}]),t}(HTMLElement);customElements.define('interaction-viewer',e)};// Conditional loading of polyfill
window.customElements?Bl():document.addEventListener('WebComponentsReady',function(){console.log('Loaded with polyfill.'),Bl()})})();
//# sourceMappingURL=interaction-viewer.js.map

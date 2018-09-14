(function () {
  'use strict';

  function styleInject(css, ref) {
    if (ref === void 0) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') {
      return;
    }

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

  var css = "protvista-tooltip {\n    z-index: 50000;\n    position: absolute;\n    min-width: 220px;\n    margin-top: 20px;\n    margin-left: -20px;\n    -webkit-box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);\n    -moz-box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);\n    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);\n    opacity: .9;\n}\n\nprotvista-tooltip[mirror=\"H\"] {\n    margin-left: 0;\n    margin-right: 20px;\n}\n\nprotvista-tooltip .tooltip-header .tooltip-header-title,\nprotvista-tooltip .tooltip-body,\nprotvista-tooltip a,\nprotvista-tooltip a:link,\nprotvista-tooltip a:hover,\nprotvista-tooltip a:active,\nprotvista-tooltip a:visited {\n    color: #ffffff;\n}\n\nprotvista-tooltip .tooltip-header {\n    background-color: #000000;\n    line-height: 3em;\n}\n\nprotvista-tooltip .tooltip-header::before {\n    content: \" \";\n    position: absolute;\n    bottom: 100%;\n    left: 20px;\n    margin-left: -10px;\n    border-width: 10px;\n    border-style: solid;\n    border-color: transparent transparent black transparent;\n}\n\nprotvista-tooltip[mirror=\"H\"] .tooltip-header::before {\n    left: initial;\n    right: 20px;\n}\n\nprotvista-tooltip .tooltip-header .tooltip-header-title {\n    background-color: #000000;\n    font-weight: 700;\n    line-height: 1em;\n    display: inline-block;\n    vertical-align: middle;\n    padding-left: .4em;\n}\n\nprotvista-tooltip .tooltip-body {\n    padding: 1em;\n    background: #616161;\n    font-weight: normal;\n}\n\nprotvista-tooltip .tooltip-close {\n    height: 3em;\n    width: 3em;\n    display: inline-block;\n    background-repeat: no-repeat;\n    background-position: center;\n    background-image: url(\"data:image/svg+xml;charset=utf-8,%3C?xml version='1.0' encoding='UTF-8'?%3E %3Csvg width='17px' height='17px' viewBox='0 0 17 17' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill='%23fff'%3E %3C!-- Generator: Sketch 48.2 (47327) - http://www.bohemiancoding.com/sketch --%3E %3Ctitle%3EArtboard%3C/title%3E %3Cdesc%3ECreated with Sketch.%3C/desc%3E %3Cdefs/%3E %3Cg id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' stroke-linecap='square'%3E %3Cg id='Artboard' stroke='%23FFFFFF' stroke-width='2'%3E %3Cg id='Group' transform='translate(2.000000, 2.000000)'%3E %3Cpath d='M0.431818182,0.431818182 L12.5103534,12.5103534' id='Line'/%3E %3Cpath d='M0.431818182,0.431818182 L12.5103534,12.5103534' id='Line-Copy' transform='translate(6.500000, 6.500000) scale(-1, 1) translate(-6.500000, -6.500000) '/%3E %3C/g%3E %3C/g%3E %3C/g%3E %3C/svg%3E\");\n    cursor: pointer;\n    vertical-align: middle;\n}\n\nprotvista-tooltip .tooltip-close:hover {\n    background-color: #1a1a1a;\n}\n\nprotvista-tooltip table td {\n    padding: .5em .5em;\n    vertical-align: top;\n}\n\nprotvista-tooltip table td:first-child {\n    font-weight: 600;\n    text-align: right\n}\n\nprotvista-tooltip table td p {\n    margin-top: 0;\n}";
  styleInject(css);

  class ProtvistaTooltip extends HTMLElement {
    constructor() {
      super();
      this._top = parseInt(this.getAttribute("top"));
      this._left = parseInt(this.getAttribute("left"));
      this._content = this.getAttribute("content");
      this._title = this.getAttribute("title");
      this._mirror = undefined;
    }

    set top(top) {
      this._top = top;
    }

    get top() {
      return this._top;
    }

    set left(left) {
      this._left = left;
    }

    get left() {
      return this._left;
    }

    set content(content) {
      this._content = content;
    }

    get content() {
      return this._content;
    }

    set title(title) {
      this._title = title;
    }

    get title() {
      return this._title;
    }

    set closeable(isCloseable) {
      if (isCloseable) {
        this.setAttribute('closeable', '');
      } else {
        this.removeAttribute('closeable');
      }
    }

    get closeable() {
      return this.hasAttribute('closeable');
    }

    get mirror() {
      return this._mirror;
    }

    set mirror(orientation) {
      this.setAttribute('mirror', orientation);
    }

    static get observedAttributes() {
      return ['top', 'left', 'mirror'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue != newValue) {
        if (name === 'top' || name === 'left') {
          this[`_${name}`] = this.getAttribute(name);

          this._updatePosition();
        } else {
          this.render();
        }
      }
    }

    connectedCallback() {
      this.render();
      document.getElementsByTagName('body')[0].addEventListener('click', e => {
        // TODO if another tooltip-trigger than the one for that feature is selected, remove the other tooltip(s)
        if (this.hasTooltipParent(e.target) && !e.target.classList.contains('tooltip-close') || e.target.getAttribute('tooltip-trigger') !== null) {
          return;
        }

        this.remove();
      });
    }

    hasTooltipParent(el) {
      if (!el.parentElement || el.parentElement.tagName === 'body') {
        return false;
      } else if (el.parentElement.tagName === 'PROTVISTA-TOOLTIP') return true;else {
        return this.hasTooltipParent(el.parentElement);
      }
    }

    _updatePosition() {
      this.style.top = `${this._top}px`;
      this.style.left = `${this._left}px`;
    }

    render() {
      this._updatePosition();

      if ('undefined' !== typeof this.mirror) {
        this.mirror = this.mirror;
      }

      let html = `<div class="tooltip-header">`;

      if (this.closeable) {
        html = `${html}<span class="tooltip-close"></span>`;
      }

      html = `${html}<span class="tooltip-header-title">${this._title}</span></div>
        <div class="tooltip-body">${this._content}</div>`;
      this.innerHTML = html;
    }

  }

  const loadComponent = function () {
    customElements.define('protvista-tooltip', ProtvistaTooltip);
  }; // Conditional loading of polyfill


  if (window.customElements) {
    loadComponent();
  } else {
    document.addEventListener('WebComponentsReady', function () {
      loadComponent();
    });
  }

}());
//# sourceMappingURL=index.js.map

import '../style/protvista-tooltip.css';

class ProtvistaTooltip extends HTMLElement {
    constructor() {
        super();
        this._top = parseInt(this.getAttribute("top"));
        this._left = parseInt(this.getAttribute("left"));
        this._content = this.getAttribute("content");
        this._title = this.getAttribute("title");
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
        if(isCloseable) {
            this.setAttribute('closeable', '');
        } else {
            this.removeAttribute('closeable');
        }
    }

    get closeable() {
        return this.hasAttribute('closeable');
    }

    static get observedAttributes() {
        return ['top', 'left'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if(oldValue != newValue) {
            if(name === 'top' || name === 'left' ) {
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
            if((this.hasTooltipParent(e.target) && !e.target.classList.contains('tooltip-close'))
                || e.target.getAttribute('tooltip-trigger') !== null) {
                return;
            }
            this.remove();
        });
    }

    hasTooltipParent(el) {
        if(!el.parentElement || el.parentElement.tagName === 'body') {
            return false;
        } else if(el.parentElement.tagName === 'PROTVISTA-TOOLTIP')
            return true;
        else {
            return this.hasTooltipParent(el.parentElement);
        }
    }

    _updatePosition() {
        this.style.top = `${this._top}px`;
        this.style.left = `${this._left}px`;
    }

    render() {
        this._updatePosition();
        let html = `<div class="tooltip-header">`;
        if(this.closeable) {
            html = `${html}<span class="tooltip-close"></span>`
        }
        html = `${html}<span class="tooltip-header-title">${this._title}</span></div>
        <div class="tooltip-body">${this._content}</div>`;
        this.innerHTML = html;
    }

}

export default ProtvistaTooltip;

import '../style/protvista-tooltip.css';

class ProtvistaTooltip extends HTMLElement {
    constructor() {
        super();
        this._top = this.getAttribute("top");
        this._left = this.getAttribute("left");
        this._content = this.getAttribute("content");
        this._type = this.getAttribute("type");
        this._start = this.getAttribute("start");
        this._end = this.getAttribute("end");
    }

    static get observedAttributes() {
        return ['top', 'left'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if(oldValue != newValue) {
            if(name === 'top' || name === 'left' ) {
                this[`_${name}`] = this.getAttribute(name);                
            }
            this._updatePosition();
        }
    }

    connectedCallback() {
        this._createContainer();
        this._updatePosition();
        document.getElementsByTagName('body')[0].addEventListener('click', e => {
            // TODO check e.target and its parents to see if it's part of protvista-tooltip, return if true
            if(e.target.getAttribute('tooltip-trigger') !== null) {
                return;
            }
            this.remove();
        });
    }

    _updatePosition() {
        this.style.top = `${this._top}px`;
        this.style.left = `${this._left}px`;
    }

    _createContainer() {
        this.innerHTML = `
            <div class="tooltip-header">${this._type} ${this._start}-${this._end}</div>
            <div class="tooltip-body">${this._content}</div>
        `
    }

    _createTooltip() {
        this._container.innerHTML = '';

        this._container.appendChild(this._createCloseButton());
        this._container.appendChild(this._createTooltipContent());

        this._container.style.opacity = 1;
        this._container.style.display = 'block';
    }

    _createCloseButton() {
        const closeSpan = document.createElement('span');
        closeSpan.innerText = 'X';
        closeSpan.className = 'protvista-tooltip-close';
        closeSpan.addEventListener('click', () => {
            this._container.style = 'transition: 20; opacity: 0; display: none';
            this.dispatchEvent(new CustomEvent("close", {
                detail: this._data, bubbles:true, cancelable: true
            }));
            this.parentElement.removeChild(this);
        });
        return closeSpan;
    }

    _createTooltipContent() {
        const table = document.createElement('table');

        const row = document.createElement('tr');

        const header = document.createElement('th');
        header.colSpan = 2;
        header.innerText = this._data.title;

        row.appendChild(header);

        table.appendChild(row);

        this._processSection(this._data.elements, table, 1);
        return table;
    }

}

export default ProtvistaTooltip;

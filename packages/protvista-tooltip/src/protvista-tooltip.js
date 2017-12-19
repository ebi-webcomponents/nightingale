import _keys from 'lodash-es/keys';
import '../style/protvista-tooltip.css';

class ProtvistaTooltip extends HTMLElement {
    constructor() {
        super();
        this.className = 'protvista-tooltip';
        this._left = parseInt(this.getAttribute('left')) || 0;
        this._top = parseInt(this.getAttribute('top')) || 0;
        // get properties here
        this._shadowRoot = this.attachShadow({mode: 'open'});
        this._shadowRoot.innerHTML = '';
        this._createContainer();
    }

    static get observedAttributes() {
        return [
            'left', 'top'
        ];
    }

    connectedCallback() {
        if (this._data) {
            this._createTooltip();
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue){
            const intValue = parseFloat(newValue);
            this[`_${name}`] = isNaN(intValue) ? newValue : intValue;
            this._updateTooltipPosition();
        }
    }

    get left() {
        return this._left;
    }

    set left(left) {
        this.setAttribute('left', left);
    }

    get top() {
        return this._top;
    }

    set top(top) {
        this.setAttribute('top', top);
    }

    set data(data) {
        this._data = data;
        this._createTooltip();
    }

    _createContainer() {
        this._container = document.createElement('div');
        this._container.className = 'protvista-tooltip-container';
        this._shadowRoot.appendChild(this._container);
    }

    _createTooltip() {
        this._container.innerText = '';
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

    _processSection(root, table, level) {
        for (let elem of root) {
            if (typeof elem === 'string') {
                const row = document.createElement('tr');

                let col = document.createElement('td');
                row.appendChild(col);

                col = document.createElement('td');
                col.innerHTML = elem;
                row.appendChild(col);

                table.appendChild(row);
            } else {
                const keys = _keys(elem);
                if (keys.length === 1) {
                    const row = document.createElement('tr');

                    let col = document.createElement('td');
                    col.innerText = keys[0];
                    row.appendChild(col);

                    col = document.createElement('td');
                    col.innerHTML = elem[keys[0]];
                    row.appendChild(col);

                    table.appendChild(row);
                } else {
                    const row = document.createElement('tr');
                    row.className = 'protvista-tooltip-level' + level;

                    let col = document.createElement('td');
                    col.colSpan = 2;
                    col.innerText = elem.title;
                    row.appendChild(col);
                    table.appendChild(row);

                    this._processSection(elem.elements, table, ++level);
                }
            }
        }
    }

    _updateTooltipPosition() {
        if (this._container) {
            this._container.style.left = this._left + 'px';
            this._container.style.top = this._top + 'px';
        }
    }
}

export default ProtvistaTooltip;

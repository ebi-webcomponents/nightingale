/* eslint-disable no-console */
class ProtvistaTooltip extends HTMLElement {
    constructor() {
        super();
        this._left = 0;
        this._top = 0;

        // get properties here
        this._shadowRoot = this.attachShadow({mode: 'open'});
        this._shadowRoot.innerHTML = '';
    }

    static get observedAttributes() {
        return [
            'left', 'top' //relative to parent
        ];
    }

    connectedCallback() {
        if (this._data)
            this._createTooltip();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue){
            const intValue = parseFloat(newValue);
            this[`_${name}`] = isNaN(intValue) ? oldValue : intValue;
            this._updateTooltip();
        }
    }

    set data(data) {
        this._data = data;
        this._createTooltip();
    }

    _createTooltip() {
        this._shadowRoot.innerHTML = '';
        const container = this._createContainer();
        const ttTable = this._populateTooltip();
        container.appendChild(ttTable);
        this._shadowRoot.appendChild(container);
    }

    _createContainer() {
        const container = document.createElement('div');
        container.className = 'tooltip-container';

        const closeSpan = document.createElement('span');
        container.appendChild(closeSpan);
        closeSpan.innerText = 'X';
        closeSpan.className = 'tooltip-close';
        closeSpan.addEventListener('click', () => {
            container.style = 'transition: 20; opacity: 0; display: none';
            this._shadowRoot.innerHTML = '';
        });

        return container;
    }

    _populateTooltip() {
        const ttTable = document.createElement('table');
        const ttRow = document.createElement('tr');
        const ttHeader = document.createElement('th');
        ttHeader.colSpan = 2;
        ttHeader.innerText = this._data.title;
        ttRow.appendChild(ttHeader);
        ttTable.appendChild(ttRow);
        for (let elem of this._data.elements) {
            console.log(elem);
        }
        return ttTable;
    }

    _updateTooltip() {

    }
}

export default ProtvistaTooltip;

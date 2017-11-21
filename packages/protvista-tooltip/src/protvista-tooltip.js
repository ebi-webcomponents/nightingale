/* eslint-disable no-console */
class ProtvistaTooltip extends HTMLElement {
    constructor() {
        super();
        // get properties here
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
            <style>
            :host {
                // Style your component
            }
            </style>
            `;
  }

  connectedCallback() {
      console.log('callback');
  }

  attributeChangedCallback(name, oldValue, newValue) {}
}

export default ProtvistaTooltip;

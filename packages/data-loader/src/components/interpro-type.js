const supportedTypes = new Map([
  ['family', {full: 'Family', small: 'F', color: '#EC1D25'}],
  ['domain', {full: 'Domain', small: 'D', color: '#45B41A'}],
  ['repeat', {full: 'Repeat', small: 'R', color: '#FF830A'}],
  ['site', {full: 'Site', small: 'S', color: '#A336C6'}],
  ['active site', {full: 'Active Site', small: 'S', color: '#A336C6'}],
  ['binding site', {full: 'Binding Site', small: 'S', color: '#A336C6'}],
  ['conserved site', {full: 'Conserved Site', small: 'S', color: '#A336C6'}],
  ['ptm', {full: 'PTM', small: 'S', color: '#A336C6'}],
  ['undefined', {full: 'Undefined', small: 'U', color: '#D3C5BC'}],
]);

const undef = supportedTypes.get('undefined');

const template = document.createElement('template');
template.innerHTML = `
  <style>
    span {
      display: inline-block;
    }
    #root {
      font-family: "Helvetica Neue", Verdana, sans-serif;
      margin: 0.1rem;
      user-select: none;
      color: ${undef.color};
    }
    #small {
      margin: 0.1rem;
      padding: 0.2rem 0.4rem;
      border: 1px gray solid;
      border-radius: 0.2rem;
      background: currentColor;
    }
    #small > span {
      color: white;
    }
    #full {
      background: none;
    }
  </style>
  <span id="root">
    <span id="small">
      <span>${undef.small}</span>
    </span>
    <span id="full">${undef.full}</span>
  </span>
`.trim();

class InterproType extends HTMLElement {
  static get observedAttributes () {
    return ['type', 'expanded'];
  }

  _handleLoadEvent (event) {
    try {
      this.type = event.detail.metadata.type;
    } catch (err) {
      console.error(err);
    }
  }

  _render () {
    // console.log('actual rendering');
    // If first render
    if (!this.shadowRoot) {
      this.attachShadow({mode: 'open'});
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    this.shadowRoot.getElementById('small').firstElementChild.textContent = (
      this._type.small
    );
    const full = this.shadowRoot.getElementById('full');
    full.textContent = this._type.full;
    full.style.display = this.expanded ? '' : 'none';
    this.shadowRoot.getElementById('root').style.color = this._type.color;
  }

  render () {
    // console.log('planning rendering');
    // If rendering is already planned, skip the rest
    if (this._plannedRendering || !this.isConnected) return;
    // Set a flag and render at the next frame
    this._plannedRendering = true;
    requestAnimationFrame(() => {
      // Removes the planned rendering flag
      this._plannedRendering = false;
      this._render();
    });
  }

  // Getters/Setters
  // type
  get type () {
    return this._type.type;
  }

  set type (value) {
    const _value = value.trim().toLowerCase();
    const descriptor = supportedTypes.get(_value);
    if (!descriptor) throw new Error(`${value} is not a supported type`);
    this._type = Object.assign({type: _value}, descriptor);
    this.setAttribute('type', _value);
    this.render();
  }

  // expanded
  get expanded () {
    return this._expanded;
  }

  set expanded (value) {
    this._expanded = value !== null;
    if (this._expanded) {
      this.setAttribute('expanded', '');
    } else {
      this.removeAttribute('expanded');
    }
    this.render();
  }

  // Custom element reactions
  constructor () {
    super();
    // set defaults
    this._type = undef;
    this._expanded = false;
  }

  connectedCallback () {
    this.render();
    this.addEventListener('load', this._handleLoadEvent);
  }

  disconnectedCallback () {
    this.removeEventListener('load', this._handleLoadEvent);
  }

  attributeChangedCallback (attributeName, oldValue, newValue) {
    /* console.log(
      `${attributeName}, ${oldValue}, ${newValue || '“empty string”'}`
    ); */
    if (oldValue === newValue) return;
    this[attributeName] = newValue;
  }
}

export default InterproType;

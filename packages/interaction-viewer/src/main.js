const interactionVis = require('./interaction-viewer');

class InteractionViewer extends HTMLElement {

  createdCallback() {
    this._accession = this.getAttribute('accession');
  }

  attachedCallback() {
    this._render();
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if(attrName === 'accession') {
      this._accession = newVal;
      this._render();
    }
  }

  set accession(accession) {
    this._accession = accession;
  }

  get accession() {
    return this._accession;
  }

  _render() {
    interactionVis.render({
      el: this,
      accession: this._accession
    });
  }
}

document.registerElement('interaction-viewer', InteractionViewer);

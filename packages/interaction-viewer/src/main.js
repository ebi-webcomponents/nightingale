(function() {
  const interactionVis = require('./interaction-viewer');

  var loadComponent = function() {
    class InteractionViewer extends HTMLElement {

      createdCallback() {
        this._accession = this.getAttribute('accession');
      }

      attachedCallback() {
        this._render();
      }

      attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'accession') {
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
  }

// Conditional loading of polyfill
  if ('registerElement' in document &&
    'import' in document.createElement('link') &&
    'content' in document.createElement('template')) {
    loadComponent();
  } else {
    // polyfill the platform!
    var e = document.createElement('script');
    e.src = '/micro.js';
    document.body.appendChild(e);
    document.addEventListener('WebComponentsReady', function() {
      loadComponent();
    });
  }
})()

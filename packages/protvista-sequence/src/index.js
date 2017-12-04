import ProtVistaSequence from './protvista-sequence';

const loadComponent = function() {
  customElements.define('protvista-sequence', ProtVistaSequence);
};

// Conditional loading of polyfill
if (window.customElements) {
    loadComponent();
} else {
    document.addEventListener('WebComponentsReady', function() {
        loadComponent();
    });
}

export default ProtVistaSequence;

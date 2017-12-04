import ProtVistaManager from './protvista-manager';

const loadComponent = function() {
  customElements.define('protvista-manager', ProtVistaManager);
};

// Conditional loading of polyfill
if (window.customElements) {
    loadComponent();
} else {
    document.addEventListener('WebComponentsReady', function() {
        loadComponent();
    });
}

export default ProtVistaManager;

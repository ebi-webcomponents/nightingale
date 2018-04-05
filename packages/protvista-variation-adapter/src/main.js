import ProtvistaVariationAdapter from './protvista-variation-adapter';

const loadComponent = function() {
    customElements.define('protvista-variation-adapter', ProtvistaVariationAdapter);
};

// Conditional loading of polyfill
if (window.customElements) {
    loadComponent();
} else {
    document.addEventListener('WebComponentsReady', function() {
        loadComponent();
    });
}

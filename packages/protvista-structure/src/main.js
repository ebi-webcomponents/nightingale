import ProtvistaStructure from './protvista-structure';

const loadComponent = function () {
    customElements.define('protvista-structure', ProtvistaStructure);
}

// Conditional loading of polyfill
if (window.customElements) {
    loadComponent();
} else {
    document
        .addEventListener('WebComponentsReady', function () {
            loadComponent();
        });
}
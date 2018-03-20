import ProtvistaUniprot from './protvista-uniprot';

const loadComponent = function () {
    customElements.define('protvista-uniprot', ProtvistaUniprot);
};


// Conditional loading of polyfill
if (window.customElements) {
    loadComponent();
} else {
    document.addEventListener('WebComponentsReady', function () {
        loadComponent();
    });
}

export default ProtvistaUniprot;
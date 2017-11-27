import ProtvistaVariation from './protvista-variation';
import ProtvistaVariationFilters from './filters';

var loadComponent = function () {
    customElements.define('protvista-variation', ProtvistaVariation);
    customElements.define('protvista-variation-filters', ProtvistaVariationFilters)
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
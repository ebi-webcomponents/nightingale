import ProtvistaFilter from './protvista-filter';

var loadComponent = function () {
  customElements.define('protvista-filter', ProtvistaFilter);
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

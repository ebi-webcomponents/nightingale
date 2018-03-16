import UuwLitemolComponent from './uuw-litemol-component';

const loadComponent = function () {
    customElements.define('uuw-litemol-component', UuwLitemolComponent);
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
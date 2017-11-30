import ProtVistaTrack from './protvista-track';
import DataLoader from 'data-loader';

const loadComponent = function() {
    customElements.define('protvista-track', ProtVistaTrack);
    customElements.define('protvista-config-data-loader', DataLoader);
};
console.log("ProtVistaTrack");
// Conditional loading of polyfill
if (window.customElements) {
    loadComponent();
} else {
    document.addEventListener('WebComponentsReady', function() {
        loadComponent();
    });
}

export default ProtVistaTrack;

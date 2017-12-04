import ProtVistaInterproTrack from './protvista-interpro-track';

const loadComponent = function() {
    customElements.define('protvista-interpro-track', ProtVistaInterproTrack);
};

// Conditional loading of polyfill
if (window.customElements) {
    loadComponent();
} else {
    document.addEventListener('WebComponentsReady', function() {
        loadComponent();
    });
}

export default ProtVistaInterproTrack;

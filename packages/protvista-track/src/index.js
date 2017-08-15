import ProtVistaTrack from './protvista-track';
import DataLoader from 'data-loader';

if (window.customElements) {
  customElements.define('protvista-track', ProtVistaTrack);
  customElements.define('protvista-config-data-loader', DataLoader);
}

export default ProtVistaTrack;

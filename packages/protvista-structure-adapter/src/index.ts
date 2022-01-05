import ProtVistaStructureAdapter from "./protvista-structure-adapter";

if (window.customElements) {
  customElements.define(
    ProtVistaStructureAdapter.is,
    ProtVistaStructureAdapter
  );
}

export default ProtVistaStructureAdapter;

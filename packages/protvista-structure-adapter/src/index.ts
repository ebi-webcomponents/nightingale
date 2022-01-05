import ProtVistaStructureAdapter from "./ProtVistaStructureAdapter";

if (window.customElements) {
  customElements.define(
    ProtVistaStructureAdapter.is,
    ProtVistaStructureAdapter
  );
}

export default ProtVistaStructureAdapter;

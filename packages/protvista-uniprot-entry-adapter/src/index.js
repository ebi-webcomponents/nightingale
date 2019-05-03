import ProtvistaUniprotEntryAdapter from "./ProtVistaUniProtEntryAdapter";

if (window.customElements) {
  customElements.define(
    "protvista-uniprot-entry-adapter",
    ProtvistaUniprotEntryAdapter
  );
}

export default ProtvistaUniprotEntryAdapter;

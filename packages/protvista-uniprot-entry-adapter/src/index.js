import ProtvistaUniprotEntryAdapter from "./ProtvistaUniprotEntryAdapter";

if (window.customElements) {
  customElements.define(
    "protvista-uniprot-entry-adapter",
    ProtvistaUniprotEntryAdapter
  );
}

export default ProtvistaUniprotEntryAdapter;

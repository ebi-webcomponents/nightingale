export const transformData = (data) => {
  try {
    return data.results.map(({ metadata, proteins }) => ({
      ...metadata,
      locations: proteins[0].entry_protein_locations,
      start: Math.min(
        ...proteins[0].entry_protein_locations.map((location) =>
          Math.min(...location.fragments.map((fragment) => fragment.start))
        )
      ),
      end: Math.max(
        ...proteins[0].entry_protein_locations.map((location) =>
          Math.max(...location.fragments.map((fragment) => fragment.end))
        )
      ),
      tooltipContent: `
        <h5>Accession</h5>
        <a
          target="_blank"
          rel="noopener"
          href="https://www.ebi.ac.uk/interpro/entry/InterPro/${metadata.accession}/"
        >
        ${metadata.accession}
        </a>
        <h5>Name</h5>
        <p>${metadata.name}</p>
      `,
      length: proteins[0].protein_length,
    }));
  } catch (error) {
    throw new Error("Failed transforming the data");
  }
};

class NightingaleInterproAdapter extends HTMLElement {
  static is = "nightingale-interpro-adapter";

  set data(data) {
    this._data = transformData(data);
    this._emitEvent(data);
  }

  _emitEvent() {
    this.dispatchEvent(
      new CustomEvent("load", {
        detail: {
          payload: this._data,
        },
        bubbles: true,
        cancelable: true,
      })
    );
  }

  connectedCallback() {
    this.addEventListener("load", (e) => {
      if (e.target !== this) {
        e.stopPropagation();
        try {
          if (e.detail.payload.errorMessage) {
            throw e.detail.payload.errorMessage;
          }
          this.data = e.detail.payload;
        } catch (error) {
          this.dispatchEvent(
            new CustomEvent("error", {
              detail: error,
              bubbles: true,
              cancelable: true,
            })
          );
        }
      }
    });
  }
}

export default NightingaleInterproAdapter;

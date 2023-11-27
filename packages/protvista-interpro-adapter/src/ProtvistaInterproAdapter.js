import ColorHash from "color-hash";

// Copied from InterPro to replicate the same colours for the representative domains
/* eslint-disable no-magic-numbers */
const colorHash = new ColorHash({
  hash: "bkdr",
  saturation: [0.65, 0.35, 0.5],
  lightness: [0.65, 0.35, 0.5],
});
/* eslint-enable no-magic-numbers */

export const transformData = (data) => {
  try {
    return data?.results?.map(({ metadata, proteins }) => ({
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
      color: colorHash.hex(
        metadata.accession.toLowerCase().split("").reverse().join("")
      ),
      tooltipContent: `
        <h5>Accession</h5>
        <p>
        <a
          target="_blank"
          rel="noopener"
          href="https://www.ebi.ac.uk/interpro/entry/${
            metadata.source_database
          }/${metadata.accession}/"
        >
        ${metadata.accession}
        </a>
        </p>
        <h5>Name</h5>
        <p>${metadata.name}</p>
        ${
          metadata.integrated
            ? `<h5>Integrated into </h5>
        <p>
        <a
          target="_blank"
          rel="noopener"
          href="https://www.ebi.ac.uk/interpro/entry/InterPro/${metadata.integrated}/"
        >
          ${metadata.integrated}
        </a>
        </p>`
            : ""
        }
      `,
      length: proteins[0].protein_length,
    }));
  } catch (error) {
    throw new Error("Failed transforming the data");
  }
};

class ProtvistaInterproAdapter extends HTMLElement {
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

export default ProtvistaInterproAdapter;

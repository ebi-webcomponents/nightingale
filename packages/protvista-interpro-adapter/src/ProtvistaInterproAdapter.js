export const transformData = data => {
  try {
    return data.results.map(({ metadata, proteins }) => ({
      ...metadata,
      locations: proteins[0].entry_protein_locations,
      length: proteins[0].protein_length
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
          payload: this._data
        },
        bubbles: true,
        cancelable: true
      })
    );
  }

  connectedCallback() {
    this.addEventListener("load", e => {
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
              cancelable: true
            })
          );
        }
      }
    });
  }
}

export default ProtvistaInterproAdapter;

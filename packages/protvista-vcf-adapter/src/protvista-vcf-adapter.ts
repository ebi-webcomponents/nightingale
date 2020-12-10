import { html, render as litRender } from "lit-html";
import ProtvistaFeatureAdapter from "protvista-feature-adapter";
import { NightingaleElement } from "data-loader";
import { vcfToJSON } from "vcftojson";

import transformData from "./dataTransformer";

class VCFAdapter extends ProtvistaFeatureAdapter implements NightingaleElement {
  private accession: string;

  private sequence: string;

  private isLoading = false;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.onChange = this.onChange.bind(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.accession = this.getAttribute("accession");
    this.sequence = this.getAttribute("sequence");
    if (this.closest("protvista-manager")) {
      this.manager = this.closest("protvista-manager");
      this.manager.register(this);
    }
    this.render();
  }

  disconnectedCallback(): void {
    if (this.manager) {
      this.manager.unregister(this);
    }
  }

  _emitEvent(data?: { sequence: string }): void {
    if (data) {
      this.sequence = data.sequence;
    }
    // TODO handle lack of sequence better here, could be race condition
    if (this.sequence && this._adaptedData && this._adaptedData.length) {
      this.dispatchEvent(
        new CustomEvent("load", {
          detail: {
            type: VCFAdapter.is,
            payload: {
              sequence: this.sequence,
              variants: this._adaptedData,
            },
          },
          bubbles: true,
          cancelable: true,
        })
      );
    }
  }

  async parseEntry(data: string): Promise<void> {
    this.isLoading = true;
    this.render();
    const vcfJson = await vcfToJSON(data, { runVEP: true });
    this._adaptedData = transformData(vcfJson, this.accession);
    this.isLoading = false;
    this.render();
    this._emitEvent();
  }

  static get is(): string {
    return "vcf-adapter";
  }

  onChange(fileSelect: Event): void {
    if (!(fileSelect.target instanceof HTMLInputElement)) return;
    const target = fileSelect.target as HTMLInputElement;
    const reader = new FileReader();
    reader.onload = () => {
      this.parseEntry(reader.result as string);
    };
    if (target.files[0]) {
      const file = target.files[0];
      if (file.name.endsWith(".vcf") && file.type.startsWith("text/")) {
        reader.readAsText(target.files[0]);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  render() {
    litRender(
      html`<input type="file" id="input" @change=${this.onChange} />${this
          .isLoading
          ? html`<small>Loading...</small>`
          : ""}`,
      this.shadowRoot
    );
  }
}

export { transformData };
export default VCFAdapter;

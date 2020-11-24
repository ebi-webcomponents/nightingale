import { html, render as litRender } from "lit-html";
import ProtvistaFeatureAdapter from "protvista-feature-adapter";
import { ProtvistaVariationData } from "protvista-variation";
import { NightingaleElement } from "data-loader";
import { vcfToJSON } from "vcftojson";

import transformData from "./dataTransformer";

class VCFAdapter extends ProtvistaFeatureAdapter implements NightingaleElement {
  private accession: string;

  private sequence: string;

  connectedCallback(): void {
    super.connectedCallback();
    this.render();
  }

  parseEntry(data: string): ProtvistaVariationData {
    vcfToJSON(data, { runVEP: true }).then((vcfJson) => {
      return (this._adaptedData = transformData(
        vcfJson,
        this.accession,
        this.sequence
      ));
    });
    return null;
  }

  static get is(): string {
    return "vcf-adapter";
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  render() {
    console.log("ran");
    litRender(html`<input type="file" id="input" />`, this);
  }
}

export { transformData };
export default VCFAdapter;

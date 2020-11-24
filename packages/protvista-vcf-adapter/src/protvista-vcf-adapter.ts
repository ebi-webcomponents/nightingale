import { html, render as litRender } from "lit-html";
import ProtvistaFeatureAdapter from "protvista-feature-adapter";
import { NightingaleElement } from "data-loader";
import { vcfToJSON } from "vcftojson";

import transformData from "./dataTransformer";

class VCFAdapter extends ProtvistaFeatureAdapter implements NightingaleElement {
  private accession = "P01008";

  private sequence =
    "MYSNVIGTVTSGKRKVYLLSLLLIGFWDCVTCHGSPVDICTAKPRDIPMNPMCIYRSPEKKATEDEGSEQKIPEATNRRVWELSKANSRFATTFYQHLADSKNDNDNIFLSPLSISTAFAMTKLGACNDTLQQLMEVFKFDTISEKTSDQIHFFFAKLNCRLYRKANKSSKLVSANRLFGDKSLTFNETYQDISELVYGAKLQPLDFKENAEQSRAAINKWVSNKTEGRITDVIPSEAINELTVLVLVNTIYFKGLWKSKFSPENTRKELFYKADGESCSASMMYQEGKFRYRRVAEGTQVLELPFKGDDITMVLILPKPEKSLAKVEKELTPEVLQEWLDELEEMMLVVHMPRFRIEDGFSLKEQLQDMGLVDLFSPEKSKLPGIVAEGRDDLYVSDAFHKAFLEVNEEGSEAAASTAVVIAGRSLNPNRVTFKANRPFLVFIREVPLNTIIFMGRVANPCVK";

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.onChange = this.onChange.bind(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.render();
  }

  _emitEvent(): void {
    this.dispatchEvent(
      new CustomEvent("load", {
        detail: {
          payload: this._adaptedData,
        },
        bubbles: true,
        cancelable: true,
      })
    );
  }

  async parseEntry(data: string): Promise<void> {
    const vcfJson = await vcfToJSON(data, { runVEP: true });
    this._adaptedData = transformData(vcfJson, this.accession, this.sequence);
    this._emitEvent();
    console.log(this._adaptedData);
  }

  static get is(): string {
    return "vcf-adapter";
  }

  onChange(fileSelect: Event): void {
    const target = (fileSelect.target as unknown) as HTMLInputElement;
    const reader = new FileReader();
    reader.onload = () => {
      this.parseEntry(reader.result as string);
    };
    reader.readAsText(target.files[0]);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  render() {
    litRender(
      html`<input type="file" id="input" @change=${this.onChange} />`,
      this.shadowRoot
    );
  }
}

export { transformData };
export default VCFAdapter;

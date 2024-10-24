import NightingaleElement from "@nightingale-elements/nightingale-new-core";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ScrollboxManager } from "./scrollbox-manager";
import { NightingaleScrollbox } from "./nightingale-scrollbox";


@customElement("nightingale-scrollbox-item")
export class NightingaleScrollboxItem<TCustomData> extends NightingaleElement {
  private scrollbox?: NightingaleScrollbox<TCustomData>;

  data?: TCustomData;

  override connectedCallback() {
    super.connectedCallback();
    if (this.closest("nightingale-scrollbox")) {
      customElements.whenDefined("nightingale-scrollbox").then(() => {
        this.scrollbox = this.closest<NightingaleScrollbox<TCustomData>>("nightingale-scrollbox") ?? undefined;
        this.scrollbox?.register(this);
      });
    }
  }
  override disconnectedCallback() {
    this.scrollbox?.unregister(this);
    this.scrollbox = undefined;
    super.disconnectedCallback();
  }
}

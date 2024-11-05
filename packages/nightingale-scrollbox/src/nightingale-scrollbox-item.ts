import NightingaleElement from "@nightingale-elements/nightingale-new-core";
import { customElement, property } from "lit/decorators.js";
import { NightingaleScrollbox } from "./nightingale-scrollbox";


@customElement("nightingale-scrollbox-item")
export class NightingaleScrollboxItem<TCustomData> extends NightingaleElement {
  @property({ type: String })
  "content-visible"?: string;

  @property({ type: String })
  "content-hidden"?: string;

  private scrollbox?: NightingaleScrollbox<TCustomData>;

  data?: TCustomData;

  override connectedCallback() {
    super.connectedCallback();
    this.style.width = "100%";
    this.style.height = "100%";
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

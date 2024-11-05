import NightingaleElement from "@nightingale-elements/nightingale-new-core";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { NightingaleScrollboxItem } from "./nightingale-scrollbox-item";
import { ScrollboxManager } from "./scrollbox-manager";


@customElement("nightingale-scrollbox")
export class NightingaleScrollbox<TCustomData> extends NightingaleElement {
  @property({ type: Number })
  "root-margin"?: number;

  @property({ type: String })
  "haze-color"?: string;

  private manager?: ScrollboxManager<TCustomData>;

  onRegister(callback: ((target: NightingaleScrollboxItem<TCustomData>) => void | Promise<void>) | null | undefined) {
    this.manager?.onRegister(callback);
  }
  onEnter(callback: ((target: NightingaleScrollboxItem<TCustomData>) => void | Promise<void>) | null | undefined) {
    this.manager?.onEnter(callback);
  }
  onExit(callback: ((target: NightingaleScrollboxItem<TCustomData>) => void | Promise<void>) | null | undefined) {
    this.manager?.onExit(callback);
  }
  onUnregister(callback: ((target: NightingaleScrollboxItem<TCustomData>) => void | Promise<void>) | null | undefined) {
    this.manager?.onUnregister(callback);
  }


  override connectedCallback() {
    super.connectedCallback();
    this.manager = new ScrollboxManager(this.getRoot()!, {
      rootMargin: this["root-margin"], // TODO recreate manager when attr changes
    });
  }
  override disconnectedCallback() {
    this.manager?.dispose();
    this.manager = undefined;
    super.disconnectedCallback();
  }
  override render() {
    return html`<div class="nightingale-scrollbox"></div>`;
  }

  register(item: NightingaleScrollboxItem<TCustomData>) {
    this.manager?.register(item);
  }
  unregister(item: NightingaleScrollboxItem<TCustomData>) {
    this.manager?.unregister(item);
  }

  getRoot(): HTMLDivElement | undefined {
    return this.getElementsByTagName('div')[0];
  }
}
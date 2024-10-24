import NightingaleElement from "@nightingale-elements/nightingale-new-core";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ScrollboxManager } from "./scrollbox-manager";
import { NightingaleScrollboxItem } from "./nightingale-scrollbox-item";


@customElement("nightingale-scrollbox")
export class NightingaleScrollbox<TCustomData> extends NightingaleElement {
  @property({ type: Number })
  "root-margin"?: number;

  @property({ type: String })
  "haze-color"?: string;

  private manager?: ScrollboxManager<NightingaleScrollboxItem<TCustomData>, TCustomData | undefined>;

  // TODO these might require setters to apply to already registered targets?
  onRegister?: (target: NightingaleScrollboxItem<TCustomData>, customData?: TCustomData) => void | Promise<void>;
  onEnter?: (target: NightingaleScrollboxItem<TCustomData>, customData?: TCustomData) => void | Promise<void>;
  onExit?: (target: NightingaleScrollboxItem<TCustomData>, customData?: TCustomData) => void | Promise<void>;
  onUnregister?: (target: NightingaleScrollboxItem<TCustomData>, customData?: TCustomData) => void | Promise<void>;

  override connectedCallback() {
    super.connectedCallback();
    this.manager = new ScrollboxManager(this.getRoot()!, {
      onRegister: (target, data) => {
        console.log('register', target.id, data, 'onRegister =', this.onRegister)
        this.onRegister?.(target, data);
      },
      onEnter: (target, data) => this.onEnter?.(target, data),
      onExit: (target, data) => this.onExit?.(target, data),
      onUnregister: (target, data) => this.onUnregister?.(target, data),
    }, {
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
    this.manager?.register(item, item.data); // TODO solve issue of when data are set
  }
  unregister(item: NightingaleScrollboxItem<TCustomData>) {
    this.manager?.unregister(item);
  }

  getRoot(): HTMLDivElement | undefined {
    return this.getElementsByTagName('div')[0];
  }
}
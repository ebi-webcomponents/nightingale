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

  private manager?: ScrollboxManager<NightingaleScrollboxItem<TCustomData>>;

  // TODO these might require setters to apply to already registered targets?
  // _onRegister?: (target: NightingaleScrollboxItem<TCustomData>) => void | Promise<void>;
  // _onEnter?: (target: NightingaleScrollboxItem<TCustomData>) => void | Promise<void>;
  // _onExit?: (target: NightingaleScrollboxItem<TCustomData>) => void | Promise<void>;
  // _onUnregister?: (target: NightingaleScrollboxItem<TCustomData>) => void | Promise<void>;

  // TODO run new onRegister on already registered targets (same for enter, exit) - in ScrollboxManager!
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
  // onEnter(callback: ((target: NightingaleScrollboxItem<TCustomData>) => void | Promise<void>) | null | undefined) {
  //   this._onEnter = callback ?? undefined;
  //   if (this.manager) {
  //     if (this.manager && callback) {
  //       for (const target of this.manager.targets) {
  //         // this.manager.
  //         callback(target, target.data);
  //       }
  //     }
  //   }
  //   // TODO run on already registered targets (same for enter, exit)
  // }


  override connectedCallback() {
    super.connectedCallback();
    this.manager = new ScrollboxManager(this.getRoot()!, {
      // onRegister: target => {
      //   this._onRegister?.(target);
      // },
      // onEnter: target => this._onEnter?.(target),
      // onExit: target => this._onExit?.(target),
      // onUnregister: target => this._onUnregister?.(target),
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
    this.manager?.register(item); // TODO solve issue of when data are set
  }
  unregister(item: NightingaleScrollboxItem<TCustomData>) {
    this.manager?.unregister(item);
  }

  getRoot(): HTMLDivElement | undefined {
    return this.getElementsByTagName('div')[0];
  }
}
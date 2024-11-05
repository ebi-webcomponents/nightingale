import NightingaleElement from "@nightingale-elements/nightingale-new-core";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { NightingaleScrollboxItem } from "./nightingale-scrollbox-item";


@customElement("nightingale-scrollbox")
export class NightingaleScrollbox<TCustomData> extends NightingaleElement {
  @property({ type: String })
  "root-margin"?: string;

  @property({ type: String })
  "haze-color"?: string;

  override connectedCallback() {
    super.connectedCallback();
    this.initObserver();
    //  TODO recreate observer when attr changes
  }
  override disconnectedCallback() {
    this.dispose();
    super.disconnectedCallback();
  }
  override render() {
    return html`<div class="nightingale-scrollbox"></div>`;
  }

  private readonly _targets = new Set<NightingaleScrollboxItem<TCustomData>>;
  private _observer?: IntersectionObserver;

  get targets() {
    return this._targets as ReadonlySet<NightingaleScrollboxItem<TCustomData>>;
  }
  private readonly callbacks: {
    onRegister?: (target: NightingaleScrollboxItem<TCustomData>) => void | Promise<void>,
    onEnter?: (target: NightingaleScrollboxItem<TCustomData>) => void | Promise<void>,
    onExit?: (target: NightingaleScrollboxItem<TCustomData>) => void | Promise<void>,
    onUnregister?: (target: NightingaleScrollboxItem<TCustomData>) => void | Promise<void>,
  } = {};

  initObserver() {
    const margin = normalizeCssLength(this["root-margin"]);
    this._observer = new IntersectionObserver(entries => this.observerCallback(entries), { root: this, rootMargin: `${margin} 0px ${margin} 0px` });
    const targets = Array.from(this.targets);
    for (const target of targets) {
      this._observer.observe(target);
    }
  }
  disposeObserver() {
    this._observer?.disconnect();
    this._observer = undefined;
  }

  private observerCallback(entries: IntersectionObserverEntry[]) {
    for (const entry of entries) {
      const target = entry.target as NightingaleScrollboxItem<TCustomData>;
      if (entry.isIntersecting) {
        target.enter();
      } else {
        target.exit();
      }
    }
  }

  register(target: NightingaleScrollboxItem<TCustomData>): Registration {
    if (this._targets.has(target)) throw new Error(`Cannot register target ${target} because it is already registered.`)
    this._targets.add(target);
    target.onRegister(this.callbacks.onRegister);
    target.onEnter(this.callbacks.onEnter);
    target.onExit(this.callbacks.onExit);
    target.onUnregister(this.callbacks.onUnregister);
    target.register();
    this._observer?.observe(target);
    return {
      unregister: () => this.unregister(target),
    };
  }
  unregister(target: NightingaleScrollboxItem<TCustomData>) {
    if (!this._targets.has(target)) throw new Error(`Cannot unregister target ${target} because it is not registered.`)
    this._targets.delete(target);
    this._observer?.unobserve(target);
    target.unregister();
  }

  onRegister(callback: ((target: NightingaleScrollboxItem<TCustomData>) => void | Promise<void>) | null | undefined) {
    this.callbacks.onRegister = callback ?? undefined;
    for (const target of this.targets) {
      target.onRegister(callback);
    }
  }
  onEnter(callback: ((target: NightingaleScrollboxItem<TCustomData>) => void | Promise<void>) | null | undefined) {
    this.callbacks.onEnter = callback ?? undefined;
    for (const target of this.targets) {
      target.onEnter(callback);
    }
  }
  onExit(callback: ((target: NightingaleScrollboxItem<TCustomData>) => void | Promise<void>) | null | undefined) {
    this.callbacks.onExit = callback ?? undefined;
    for (const target of this.targets) {
      target.onExit(callback);
    }
  }
  onUnregister(callback: ((target: NightingaleScrollboxItem<TCustomData>) => void | Promise<void>) | null | undefined) {
    this.callbacks.onUnregister = callback ?? undefined;
    for (const target of this.targets) {
      target.onUnregister(callback);
    }
  }

  dispose() {
    const targets = Array.from(this.targets);
    for (const target of targets) {
      this.unregister(target);
    }
    this.disposeObserver();
  }
}


/** Convert string|number length into valid CSS length (42, "42", "42px" -> "42px"; undefined, null, "" -> "0px") */
function normalizeCssLength(cssLength: string | number | undefined | null): string {
  if (cssLength === undefined || cssLength === null) return "0px";
  if (!isNaN(Number(cssLength))) return `${Number(cssLength)}px`;
  return cssLength as string;
}

export interface Registration {
  unregister: () => void,
}

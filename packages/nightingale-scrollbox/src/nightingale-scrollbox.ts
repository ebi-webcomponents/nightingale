import NightingaleElement from "@nightingale-elements/nightingale-new-core";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { NightingaleScrollboxItem } from "./nightingale-scrollbox-item";


@customElement("nightingale-scrollbox")
export class NightingaleScrollbox<TCustomData> extends NightingaleElement {
  /** Amount added to the top and bottom side of the bounding box before the intersection test is performed.
   * Can be a number or CSS length.
   * This lets you adjust the bounds outward so that the target element is considered visible even if it is still hidden but is close to the visible area. */
  @property({ type: String })
  "root-margin"?: string;

  /** If this attribute is set, wheel scrolling will be disabled whenever Ctrl (or Meta/Command) key is pressed.
   * This helps to prevent bad user experience when some elements in the scrollbox have special Ctrl+Wheel behavior but gaps between elements still have default scrolling behavior. */
  @property({ type: Boolean })
  "disable-scroll-with-ctrl"?: boolean;

  override connectedCallback() {
    super.connectedCallback();
    this.initObserver();
    this.disableScrollWithCtrl(this["disable-scroll-with-ctrl"]);
  }
  override disconnectedCallback() {
    this.dispose();
    super.disconnectedCallback();
  }
  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (this.isConnected && newValue !== oldValue) {
      if (name === "root-margin") {
        this.disposeObserver();
        this.initObserver();
      }
      if (name === "disable-scroll-with-ctrl") {
        this.disableScrollWithCtrl(this["disable-scroll-with-ctrl"]);
      }
    }
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

  private initObserver() {
    const margin = normalizeCssLength(this["root-margin"]);
    this._observer = new IntersectionObserver(entries => this.observerCallback(entries), { root: this, rootMargin: `${margin} 0px ${margin} 0px` });
    const targets = Array.from(this.targets);
    for (const target of targets) {
      this._observer.observe(target);
    }
  }
  private disposeObserver() {
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

  /** Disable or enable scrolling behavior with Ctrl or Meta/Command key pressed. */
  private disableScrollWithCtrl(disable: boolean | undefined) {
    if (disable) this.addEventListener('wheel', preventScrollIfCtrl);
    else this.removeEventListener('wheel', preventScrollIfCtrl);
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

/** Event handler for WheelEvent which prevents default scrolling behavior when Ctrl or Meta/Command key if pressed. */
function preventScrollIfCtrl(event: WheelEvent) {
  if (event.ctrlKey || event.metaKey) {
    event.preventDefault();
  }
}

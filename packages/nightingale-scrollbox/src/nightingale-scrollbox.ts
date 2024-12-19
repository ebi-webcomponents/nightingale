import NightingaleElement from "@nightingale-elements/nightingale-new-core";
import { customElement, property } from "lit/decorators.js";
import { NightingaleScrollboxItem } from "./nightingale-scrollbox-item";


@customElement("nightingale-scrollbox")
export class NightingaleScrollbox<TData> extends NightingaleElement {
  /** Amount added to the top and bottom side of the bounding box before the intersection test is performed.
   * Can be a number or CSS length.
   * This lets you adjust the bounds outward so that an item is considered visible even if it is still hidden but is close to the visible area.
   * Negative values will adjust the bound inward so that an item is considered hidden even if it is visible but is close to the edge of the visible area. */
  @property({ type: String })
  "root-margin"?: string;

  /** If this attribute is set, wheel scrolling will be disabled whenever Ctrl (or Meta/Command) key is pressed.
   * This helps to prevent bad user experience when some elements in the scrollbox have special Ctrl+Wheel behavior (e.g. zoom) but the gaps between elements still have default scrolling behavior. */
  @property({ type: Boolean })
  "disable-scroll-with-ctrl"?: boolean;

  private readonly _items = new Set<NightingaleScrollboxItem<TData>>;
  /** Set of currently registered items */
  get items() { return this._items as ReadonlySet<NightingaleScrollboxItem<TData>>; }
  
  private observer?: IntersectionObserver;

  private readonly callbacks: {
    onRegister?: (item: NightingaleScrollboxItem<TData>) => void | Promise<void>,
    onEnter?: (item: NightingaleScrollboxItem<TData>) => void | Promise<void>,
    onExit?: (item: NightingaleScrollboxItem<TData>) => void | Promise<void>,
    onUnregister?: (item: NightingaleScrollboxItem<TData>) => void | Promise<void>,
  } = {};

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

  private initObserver() {
    const margin = normalizeCssLength(this["root-margin"]);
    this.observer = new IntersectionObserver(entries => this.observerCallback(entries), { root: this, rootMargin: `${margin} 0px ${margin} 0px` });
    for (const item of this.items) {
      this.observer.observe(item);
    }
  }
  private disposeObserver() {
    this.observer?.disconnect();
    this.observer = undefined;
  }
  private observerCallback(entries: IntersectionObserverEntry[]) {
    for (const entry of entries) {
      const item = entry.target as NightingaleScrollboxItem<TData>;
      if (entry.isIntersecting) {
        item.enter();
      } else {
        item.exit();
      }
    }
  }

  /** Add a new scrollbox item and run "onRegister" callback on it. This method is called automatically for all `nightingale-scrollbox-item` elements within the `nightingale-scrollbox` element. */
  register(item: NightingaleScrollboxItem<TData>) {
    if (this._items.has(item)) throw new Error(`Cannot register item ${item} because it is already registered.`)
    this._items.add(item);
    item.onRegister(this.callbacks.onRegister);
    item.onEnter(this.callbacks.onEnter);
    item.onExit(this.callbacks.onExit);
    item.onUnregister(this.callbacks.onUnregister);
    item.register();
    this.observer?.observe(item);
    return {
      unregister: () => this.unregister(item),
    };
  }
  /** Remove a scrollbox item and run "onUnregister" callback on it. This method is called automatically when a `nightingale-scrollbox-item` element is removed from the `nightingale-scrollbox` element. */
  unregister(item: NightingaleScrollboxItem<TData>) {
    if (!this._items.has(item)) throw new Error(`Cannot unregister item ${item} because it is not registered.`)
    this._items.delete(item);
    this.observer?.unobserve(item);
    item.unregister();
  }
  /** Unregister all items and release resources. */
  dispose() {
    const items = Array.from(this.items);
    for (const item of items) {
      this.unregister(item);
    }
    this.disposeObserver();
  }

  /** Set or remove "onRegister" callback function, which will be run on any newly registered items. Also run this callback function on all already registered items. */
  onRegister(callback: ((item: NightingaleScrollboxItem<TData>) => void | Promise<void>) | null | undefined) {
    this.callbacks.onRegister = callback ?? undefined;
    for (const item of this.items) {
      item.onRegister(callback);
    }
  }
  /** Set or remove "onEnter" callback function, which will be run on items when they become visible. Also run this callback function on all currently visible items. */
  onEnter(callback: ((item: NightingaleScrollboxItem<TData>) => void | Promise<void>) | null | undefined) {
    this.callbacks.onEnter = callback ?? undefined;
    for (const item of this.items) {
      item.onEnter(callback);
    }
  }
  /** Set or remove "onExit" callback function, which will be run on items when they become hidden. Also run this callback function on all currently hidden items. */
  onExit(callback: ((item: NightingaleScrollboxItem<TData>) => void | Promise<void>) | null | undefined) {
    this.callbacks.onExit = callback ?? undefined;
    for (const item of this.items) {
      item.onExit(callback);
    }
  }
  /** Set or remove "onUnregister" callback function, which will be run on items when they are unregistered. */
  onUnregister(callback: ((item: NightingaleScrollboxItem<TData>) => void | Promise<void>) | null | undefined) {
    this.callbacks.onUnregister = callback ?? undefined;
    for (const item of this.items) {
      item.onUnregister(callback);
    }
  }

  /** Disable or enable scrolling behavior with Ctrl or Meta/Command key pressed. */
  private disableScrollWithCtrl(disable: boolean | undefined) {
    if (disable) this.addEventListener("wheel", preventScrollIfCtrl);
    else this.removeEventListener("wheel", preventScrollIfCtrl);
  }
}


/** Convert string|number length into valid CSS length (42, "42", "42px" -> "42px"; undefined, null, "" -> "0px") */
function normalizeCssLength(cssLength: string | number | undefined | null): string {
  if (cssLength === undefined || cssLength === null) return "0px";
  if (!isNaN(Number(cssLength))) return `${Number(cssLength)}px`;
  return cssLength as string;
}

/** Event handler for WheelEvent which prevents default scrolling behavior when Ctrl or Meta/Command key if pressed. */
function preventScrollIfCtrl(event: WheelEvent) {
  if (event.ctrlKey || event.metaKey) {
    event.preventDefault();
  }
}

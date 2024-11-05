import { NightingaleScrollboxItem } from "./nightingale-scrollbox-item";

export interface Registration {
  unregister: () => void,
}

export class ScrollboxManager<TCustomData> {
  private readonly _targets = new Set<NightingaleScrollboxItem<TCustomData>>;
  private readonly _observer: IntersectionObserver;

  get targets() {
    return this._targets as ReadonlySet<NightingaleScrollboxItem<TCustomData>>;
  }
  private readonly callbacks: {
    onRegister?: (target: NightingaleScrollboxItem<TCustomData>) => void | Promise<void>,
    onEnter?: (target: NightingaleScrollboxItem<TCustomData>) => void | Promise<void>,
    onExit?: (target: NightingaleScrollboxItem<TCustomData>) => void | Promise<void>,
    onUnregister?: (target: NightingaleScrollboxItem<TCustomData>) => void | Promise<void>,
  } = {};

  constructor(
    private readonly _root: HTMLDivElement,
    options?: {
      rootMargin?: string | number,
    }
  ) {
    const margin = normalizeCssLength(options?.rootMargin);
    this._observer = new IntersectionObserver(entries => this.observerCallback(entries), { root: _root, rootMargin: `${margin} 0px ${margin} 0px` });
  }
  get root() { return this._root; }

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
    this._observer.observe(target);
    return {
      unregister: () => this.unregister(target),
    };
  }
  unregister(target: NightingaleScrollboxItem<TCustomData>) {
    if (!this._targets.has(target)) throw new Error(`Cannot unregister target ${target} because it is not registered.`)
    this._targets.delete(target);
    this._observer.unobserve(target);
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
    this._observer.disconnect();
  }
}


/** Convert string|number length into valid CSS length (42, "42", "42px" -> "42px"; undefined, null, "" -> "0px") */
function normalizeCssLength(cssLength: string | number | undefined | null): string {
  if (cssLength === undefined || cssLength === null) return "0px";
  if (!isNaN(Number(cssLength))) return `${Number(cssLength)}px`;
  return cssLength as string;
}

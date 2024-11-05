import { ScrollboxItem } from "./scrollbox-item";

export interface Registration {
  unregister: () => void,
}

export class ScrollboxManager<TTarget extends Element> {
  private readonly _targets = new Set<TTarget>;
  private readonly _scrollboxTargets = new Map<TTarget, ScrollboxItem<TTarget>>;
  private readonly _observer: IntersectionObserver;

  get targets() {
    return this._targets as ReadonlySet<TTarget>;
  }
  private readonly callbacks: {
    onRegister?: (target: TTarget) => void | Promise<void>,
    onEnter?: (target: TTarget) => void | Promise<void>,
    onExit?: (target: TTarget) => void | Promise<void>,
    onUnregister?: (target: TTarget) => void | Promise<void>,
  } = {};

  constructor(
    private readonly _root: HTMLDivElement,
    options?: {
      rootMargin?: string | number,
    }
  ) {
    const margin = normalizeCssLength(options?.rootMargin);
    this._observer = new IntersectionObserver(entries => this.observerCallback(entries), { root: _root, rootMargin: `${margin} 0px ${margin} 0px` });
    console.log('obs', this._observer)
  }
  get root() { return this._root; }

  private observerCallback(entries: IntersectionObserverEntry[]) {
    for (const entry of entries) {
      const target = entry.target as TTarget;
      if (entry.isIntersecting) {
        this._scrollboxTargets.get(target)!.enter();
      } else {
        this._scrollboxTargets.get(target)!.exit();
      }
    }
  }

  register(target: TTarget): Registration {
    if (this._targets.has(target)) throw new Error(`Cannot register target ${target} because it is already registered.`)
    this._targets.add(target);
    const item = new ScrollboxItem(target);
    item.onRegister(this.callbacks.onRegister);
    item.onEnter(this.callbacks.onEnter);
    item.onExit(this.callbacks.onExit);
    item.onUnregister(this.callbacks.onUnregister);
    item.register();
    this._scrollboxTargets.set(target, item);
    this._observer.observe(target);
    return {
      unregister: () => this.unregister(target),
    };
  }
  unregister(target: TTarget) {
    if (!this._targets.has(target)) throw new Error(`Cannot unregister target ${target} because it is not registered.`)
    this._targets.delete(target);
    this._observer.unobserve(target);
    this._scrollboxTargets.get(target)!.unregister();
    this._scrollboxTargets.delete(target);
  }

  onRegister(callback: ((target: TTarget) => void | Promise<void>) | null | undefined) {
    this.callbacks.onRegister = callback ?? undefined;
    for (const target of this.targets) {
      this._scrollboxTargets.get(target)!.onRegister(callback);
    }
  }
  onEnter(callback: ((target: TTarget) => void | Promise<void>) | null | undefined) {
    this.callbacks.onEnter = callback ?? undefined;
    for (const target of this.targets) {
      this._scrollboxTargets.get(target)!.onEnter(callback);
    }
  }
  onExit(callback: ((target: TTarget) => void | Promise<void>) | null | undefined) {
    this.callbacks.onExit = callback ?? undefined;
    for (const target of this.targets) {
      this._scrollboxTargets.get(target)!.onExit(callback);
    }
  }
  onUnregister(callback: ((target: TTarget) => void | Promise<void>) | null | undefined) {
    this.callbacks.onUnregister = callback ?? undefined;
    for (const target of this.targets) {
      this._scrollboxTargets.get(target)!.onUnregister(callback);
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

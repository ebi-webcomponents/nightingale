
/** State of a target element. Target element lifecycle:
 * - undefined -> "hidden" (run `onRegister`);
 * - "hidden" -> "visible" (run `onEnter`);
 * - "visible" -> "hidden" (run `onExit`);
 * - "visible" -> undefined (run `onUnregister`);
 * - "hidden" -> undefined (run `onUnregister`);
 * 
 * undefined -> hidden <-> visible -> undefined
 *                 \----------------> undefined
 * 
 * undefined ---\----------\
 *             hidden <-> visible 
 *                \----------\-----> undefined
 * 
 * undefined ---> new ---\----------\
 *                      hidden <-> visible 
 *                         \----------\-----> undefined
 */
type State = undefined | "hidden" | "visible";

export interface Registration {
  unregister: () => void,
}

export class ScrollboxManager<TTarget extends Element, TCustomData> {
  private readonly _customData = new Map<TTarget, TCustomData>();
  private readonly _currentState = new Map<TTarget, State>();
  private readonly _requiredState = new Map<TTarget, State>();
  /** Set of targets for which an update loop is currently running. */
  private readonly _observer: IntersectionObserver;
  private readonly _queues = new Map<TTarget, AsyncQueue>;

  constructor(
    private readonly _root: HTMLDivElement,
    private readonly callbacks: {
      onRegister?: (target: TTarget, customData: TCustomData) => void | Promise<void>,
      onEnter?: (target: TTarget, customData: TCustomData) => void | Promise<void>,
      onExit?: (target: TTarget, customData: TCustomData) => void | Promise<void>,
      onUnregister?: (target: TTarget, customData: TCustomData) => void | Promise<void>,
    },
    options?: {
      rootMargin?: string | number,
    }
  ) {
    const margin = normalizeCssLength(options?.rootMargin);
    this._observer = new IntersectionObserver(entries => this._handle(entries), { root: _root, rootMargin: `${margin} 0px ${margin} 0px` });
  }
  get root() { return this._root; }

  private _handle(entries: IntersectionObserverEntry[]) {
    for (const entry of entries) {
      this._updateState(entry.target as TTarget, entry.isIntersecting ? "visible" : "hidden");
    }
  }
  register(target: TTarget, customData: TCustomData): Registration {
    this._customData.set(target, customData);
    this._queues.set(target, new AsyncQueue());
    this._updateState(target, "hidden");
    this._observer.observe(target);
    return {
      unregister: () => this.unregister(target),
    };
  }
  unregister(target: TTarget) {
    this._observer.unobserve(target);
    this._updateState(target, undefined);
  }
  dispose() {
    const targets = Array.from(this._requiredState.keys());
    for (const target of targets) {
      this.unregister(target);
    }
    this._observer.disconnect();
  }
  private _updateState(target: TTarget, state: State) {
    if (state === undefined) this._requiredState.delete(target);
    else this._requiredState.set(target, state);
    this._queues.get(target)?.enqueue(() => this.enterState(target, state));
  }
  private async enterState(target: TTarget, state: State): Promise<void> {
    if (this._requiredState.get(target) !== state) return;

    const current = this._currentState.get(target);
    if (current === state) return;

    if (!this._customData.has(target)) throw new Error(`AssertionError: customData missing for element ${target.id}`);
    const customData = this._customData.get(target) as TCustomData;

    if (state === undefined) {
      // Target has been unregistered ("hidden"/"visible" -> undefined)
      this._customData.delete(target);
      this._queues.delete(target);
      await this.callbacks.onUnregister?.(target, customData);
    } else if (state === "hidden") {
      if (current === undefined) {
        // Target has been registered (undefined -> "hidden")
        await this.callbacks.onRegister?.(target, customData);
      } else if (current === "visible") {
        // Target was visible, not anymore ("visible" -> "hidden")
        await this.callbacks.onExit?.(target, customData);
      }
    } else if (state === "visible") {
      // Target has become visible ("hidden" -> "visible")
      await this.callbacks.onEnter?.(target, customData);
    } else {
      throw new Error("AssertionError");
    }

    if (state === undefined) this._currentState.delete(target);
    else this._currentState.set(target, state);
  }
}

/** Convert string|number length into valid CSS length (42, "42", "42px" -> "42px"; undefined, null, "" -> "0px") */
function normalizeCssLength(cssLength: string | number | undefined | null): string {
  if (cssLength === undefined || cssLength === null) return "0px";
  if (!isNaN(Number(cssLength))) return `${Number(cssLength)}px`;
  return cssLength as string;
}


class AsyncQueue {
  private jobQueue: (() => void | Promise<void>)[] = [];
  private busy: boolean = false;

  enqueue(job: () => void | Promise<void>): void {
    this.jobQueue.push(job);
    if (!this.busy) {
      this.startLoop();
    }
  }

  private async startLoop(): Promise<void> {
    this.busy = true;
    while (this.jobQueue.length > 0) { // eslint-disable-line no-constant-condition
      const job = this.jobQueue.shift()!;
      await job();
    }
    this.busy = false;
  }
}

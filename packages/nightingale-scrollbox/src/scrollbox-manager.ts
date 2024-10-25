
/** State of a target element. Target element lifecycle:
 * - undefined -> "new" (run `onRegister`);
 * - "new" -> "visible" (run `onEnter`);
 * - "new" -> "hidden" (run `onExit`);
 * - "hidden" -> "visible" (run `onEnter`);
 * - "visible" -> "hidden" (run `onExit`);
 * - "hidden" -> undefined (run `onUnregister`);
 * - "visible" -> undefined (run `onUnregister`);
 */
type State = undefined | "new" | "hidden" | "visible";

export interface Registration {
  unregister: () => void,
}

export class ScrollboxManager<TTarget extends Element, TCustomData> {
  private readonly _customData = new Map<TTarget, TCustomData>();
  private readonly _observer: IntersectionObserver;
  private readonly _queues = new Map<TTarget, AsyncQueue>;

  private readonly _currentState = new Map<TTarget, State>();
  private readonly _requiredState = new Map<TTarget, State>();

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
    this._observer = new IntersectionObserver(entries => this.observerCallback(entries), { root: _root, rootMargin: `${margin} 0px ${margin} 0px` });
  }
  get root() { return this._root; }

  private observerCallback(entries: IntersectionObserverEntry[]) {
    for (const entry of entries) {
      const target = entry.target as TTarget;
      if (entry.isIntersecting) {
        this.enter(target);
      } else {
        this.exit(target);
      }
    }
  }

  register(target: TTarget, customData: TCustomData): Registration {
    this._customData.set(target, customData);
    const queue = new AsyncQueue();
    this._queues.set(target, queue);
    this._requiredState.set(target, "new");
    queue.enqueue(async () => {
      await this.callbacks.onRegister?.(target, customData);
      this._currentState.set(target, "new");
    });
    this._observer.observe(target);
    return {
      unregister: () => this.unregister(target),
    };
  }
  unregister(target: TTarget) {
    this._observer.unobserve(target);
    const queue = this._queues.get(target);
    this._queues.delete(target);
    this._requiredState.delete(target);
    queue?.enqueue(async () => {
      await this.callbacks.onUnregister?.(target, this._customData.get(target)!);
      this._customData.delete(target);
      this._currentState.delete(target);
    });
  }
  private enter(target: TTarget) {
    this._requiredState.set(target, "visible");
    this._queues.get(target)?.enqueue(async () => {
      if (this._requiredState.get(target) !== "visible") return; // skip if required state changed in the meantime
      if (this._currentState.get(target) === "visible") return; // skip if already in required state
      await this.callbacks.onEnter?.(target, this._customData.get(target)!);
      this._currentState.set(target, "visible");
    });
  }
  private exit(target: TTarget) {
    this._requiredState.set(target, "hidden");
    this._queues.get(target)?.enqueue(async () => {
      if (this._requiredState.get(target) !== "hidden") return; // skip if required state changed in the meantime
      if (this._currentState.get(target) === "hidden") return; // skip if already in required state
      await this.callbacks.onExit?.(target, this._customData.get(target)!);
      this._currentState.set(target, "hidden");
    });
  }

  dispose() {
    const targets = Array.from(this._queues.keys());
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

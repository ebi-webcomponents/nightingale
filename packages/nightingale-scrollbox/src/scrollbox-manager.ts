
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

export class ScrollboxManager<TTarget extends Element> {
  private readonly _targets = new Set<TTarget>;
  private readonly _observer: IntersectionObserver;
  private readonly _queues = new Map<TTarget, AsyncQueue>;

  private readonly _currentState = new Map<TTarget, State>();
  private readonly _requiredState = new Map<TTarget, State>();

  get targets() {
    return this._targets as ReadonlySet<TTarget>;
  }

  constructor(
    private readonly _root: HTMLDivElement,
    private readonly callbacks: {
      onRegister?: (target: TTarget) => void | Promise<void>,
      onEnter?: (target: TTarget) => void | Promise<void>,
      onExit?: (target: TTarget) => void | Promise<void>,
      onUnregister?: (target: TTarget) => void | Promise<void>,
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

  register(target: TTarget): Registration {
    if (this._targets.has(target)) throw new Error(`Cannot register target ${target} because it is already registered.`)
    this._targets.add(target);
    const queue = new AsyncQueue();
    this._queues.set(target, queue);
    this._requiredState.set(target, "new");
    queue.enqueue(async () => {
      console.log('registering', target.id)
      await this.callbacks.onRegister?.(target);
      this._currentState.set(target, "new");
      console.log('registered', target.id)
    });
    this._observer.observe(target);
    return {
      unregister: () => this.unregister(target),
    };
  }
  unregister(target: TTarget) {
    if (!this._targets.has(target)) throw new Error(`Cannot unregister target ${target} because it is not registered.`)
    this._targets.delete(target);
    this._observer.unobserve(target);
    const queue = this._queues.get(target);
    this._queues.delete(target);
    this._requiredState.delete(target);
    queue?.enqueue(async () => {
      console.log('unregistering', target.id)
      await this.callbacks.onUnregister?.(target);
      this._currentState.delete(target);
      console.log('unregistered', target.id)
    });
  }
  private enter(target: TTarget) {
    this._requiredState.set(target, "visible");
    this._queues.get(target)?.enqueue(async () => {
      if (this._requiredState.get(target) !== "visible") return; // skip if required state changed in the meantime
      if (this._currentState.get(target) === "visible") return; // skip if already in required state
      console.log('entering', target.id)
      await this.callbacks.onEnter?.(target);
      this._currentState.set(target, "visible");
      console.log('entered', target.id)
    });
  }
  private exit(target: TTarget) {
    this._requiredState.set(target, "hidden");
    this._queues.get(target)?.enqueue(async () => {
      if (this._requiredState.get(target) !== "hidden") return; // skip if required state changed in the meantime
      if (this._currentState.get(target) === "hidden") return; // skip if already in required state
      console.log('exiting', target.id)
      await this.callbacks.onExit?.(target);
      this._currentState.set(target, "hidden");
      console.log('exited', target.id)
    });
  }

  onRegister(callback: ((target: TTarget) => void | Promise<void>) | null | undefined) {
    // TODO encapsulate callback with queue and state per target, set callback in a queue job (avoid double run)
    this.callbacks.onRegister = callback ?? undefined;
    for (const target of this.targets) {
      this._queues.get(target)?.enqueue(async () => {
        console.log('additional onRegister', target.id)
        await callback?.(target);
      });
    }
  }
  onEnter(callback: ((target: TTarget) => void | Promise<void>) | null | undefined) {
    // TODO encapsulate callback with queue and state per target, set callback in a queue job (avoid double run)
    this.callbacks.onEnter = callback ?? undefined;
    for (const target of this.targets) {
      this._queues.get(target)?.enqueue(async () => {
        console.log('additional onEnter', target.id)
        if (this._currentState.get(target) === 'visible') {
          await callback?.(target);
        }
      });
    }
  }
  onExit(callback: ((target: TTarget) => void | Promise<void>) | null | undefined) {
    // TODO encapsulate callback with queue and state per target, set callback in a queue job (avoid double run)
    this.callbacks.onExit = callback ?? undefined;
    for (const target of this.targets) {
      this._queues.get(target)?.enqueue(async () => {
        console.log('additional onExit', target.id)
        if (this._currentState.get(target) === 'hidden') {
          await callback?.(target);
        }
      });
    }
  }
  onUnregister(callback: ((target: TTarget) => void | Promise<void>) | null | undefined) {
    this.callbacks.onUnregister = callback ?? undefined;
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

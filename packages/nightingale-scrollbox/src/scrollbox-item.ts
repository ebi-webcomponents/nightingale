
/** State of a target element. Target element lifecycle:
 * - undefined -> "new" (run `onRegister`);
 * - "new" -> "visible" (run `onEnter`);
 * - "new" -> "hidden" (run `onExit`);
 * - "hidden" -> "visible" (run `onEnter`);
 * - "visible" -> "hidden" (run `onExit`);
 * - "hidden" -> undefined (run `onUnregister`);
 * - "visible" -> undefined (run `onUnregister`);
 */
type ScrollboxItemState = undefined | "new" | "hidden" | "visible";


export class ScrollboxItem<TTarget extends Element> {
    private _currentState: ScrollboxItemState = undefined;
    private _requiredState: ScrollboxItemState = undefined;
    private readonly _queue = new AsyncQueue();
    private readonly callbacks: {
        onRegister?: (target: TTarget) => void | Promise<void>,
        onEnter?: (target: TTarget) => void | Promise<void>,
        onExit?: (target: TTarget) => void | Promise<void>,
        onUnregister?: (target: TTarget) => void | Promise<void>,
    } = {};

    constructor(public readonly target: TTarget) { }

    register() {
        this._requiredState = "new";
        this._queue.enqueue(async () => {
            await this.callbacks.onRegister?.(this.target);
            this._currentState = "new";
        });
    }
    unregister() {
        this._requiredState = undefined;
        this._queue.enqueue(async () => {
            await this.callbacks.onUnregister?.(this.target);
            this._currentState = undefined;
        });
    }
    enter() {
        this._requiredState = "visible";
        this._queue.enqueue(async () => {
            if (this._requiredState !== "visible") return; // skip if required state changed in the meantime
            if (this._currentState === "visible") return; // skip if already in required state
            await this.callbacks.onEnter?.(this.target);
            this._currentState = "visible";
        });
    }
    exit() {
        this._requiredState = "hidden";
        this._queue.enqueue(async () => {
            if (this._requiredState !== "hidden") return; // skip if required state changed in the meantime
            if (this._currentState === "hidden") return; // skip if already in required state
            await this.callbacks.onExit?.(this.target);
            this._currentState = "hidden";
        });
    }

    onRegister(callback: ((target: TTarget) => void | Promise<void>) | null | undefined) {
        this._queue.enqueue(async () => {
            if (this._currentState !== undefined) {
                await callback?.(this.target);
            }
            this.callbacks.onRegister = callback ?? undefined;
        });
    }
    onEnter(callback: ((target: TTarget) => void | Promise<void>) | null | undefined) {
        this._queue.enqueue(async () => {
            if (this._currentState === 'visible') {
                await callback?.(this.target);
            }
            this.callbacks.onEnter = callback ?? undefined;
        });
    }
    onExit(callback: ((target: TTarget) => void | Promise<void>) | null | undefined) {
        this._queue.enqueue(async () => {
            if (this._currentState === 'hidden') {
                await callback?.(this.target);
            }
            this.callbacks.onExit = callback ?? undefined;
        });
    }
    onUnregister(callback: ((target: TTarget) => void | Promise<void>) | null | undefined) {
        this._queue.enqueue(async () => {
            this.callbacks.onUnregister = callback ?? undefined;
        });
    }
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

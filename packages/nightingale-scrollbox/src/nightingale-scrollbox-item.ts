import NightingaleElement from "@nightingale-elements/nightingale-new-core";
import { customElement, property } from "lit/decorators.js";
import { NightingaleScrollbox } from "./nightingale-scrollbox";


@customElement("nightingale-scrollbox-item")
export class NightingaleScrollboxItem<TCustomData> extends NightingaleElement {
  @property({ type: String })
  "content-visible"?: string;

  @property({ type: String })
  "content-hidden"?: string;

  private scrollbox?: NightingaleScrollbox<TCustomData>;

  data?: TCustomData;

  override connectedCallback() {
    super.connectedCallback();
    this.style.width = "100%";
    this.style.height = "100%";
    if (this.closest("nightingale-scrollbox")) {
      customElements.whenDefined("nightingale-scrollbox").then(() => {
        this.scrollbox = this.closest<NightingaleScrollbox<TCustomData>>("nightingale-scrollbox") ?? undefined;
        this.scrollbox?.register(this);
      });
    }
  }
  override disconnectedCallback() {
    this.scrollbox?.unregister(this);
    this.scrollbox = undefined;
    super.disconnectedCallback();
  }

  private _currentState: ScrollboxItemState = undefined;
  private _requiredState: ScrollboxItemState = undefined;
  private readonly _queue = new AsyncQueue();
  private readonly callbacks: {
    onRegister?: (target: NightingaleScrollboxItem<TCustomData>) => void | Promise<void>,
    onEnter?: (target: NightingaleScrollboxItem<TCustomData>) => void | Promise<void>,
    onExit?: (target: NightingaleScrollboxItem<TCustomData>) => void | Promise<void>,
    onUnregister?: (target: NightingaleScrollboxItem<TCustomData>) => void | Promise<void>,
  } = {};

  register() {
    this._requiredState = "new";
    this._queue.enqueue(async () => {
      await this.callbacks.onRegister?.(this);
      this._currentState = "new";
    });
  }
  unregister() {
    this._requiredState = undefined;
    this._queue.enqueue(async () => {
      await this.callbacks.onUnregister?.(this);
      this._currentState = undefined;
    });
  }
  enter() {
    this._requiredState = "visible";
    this._queue.enqueue(async () => {
      if (this._requiredState !== "visible") return; // skip if required state changed in the meantime
      if (this._currentState === "visible") return; // skip if already in required state
      this.setContent(this["content-visible"]);
      await this.callbacks.onEnter?.(this);
      this._currentState = "visible";
    });
  }
  exit() {
    this._requiredState = "hidden";
    this._queue.enqueue(async () => {
      if (this._requiredState !== "hidden") return; // skip if required state changed in the meantime
      if (this._currentState === "hidden") return; // skip if already in required state
      this.setContent(this["content-hidden"]);
      await this.callbacks.onExit?.(this);
      this._currentState = "hidden";
    });
  }
  private setContent(content: string | null | undefined) {
    if (content === undefined || content === null) return;
    this.innerHTML = content;
  }

  onRegister(callback: ((target: NightingaleScrollboxItem<TCustomData>) => void | Promise<void>) | null | undefined) {
    this._queue.enqueue(async () => {
      if (this._currentState !== undefined) {
        await callback?.(this);
      }
      this.callbacks.onRegister = callback ?? undefined;
    });
  }
  onEnter(callback: ((target: NightingaleScrollboxItem<TCustomData>) => void | Promise<void>) | null | undefined) {
    this._queue.enqueue(async () => {
      if (this._currentState === 'visible') {
        await callback?.(this);
      }
      this.callbacks.onEnter = callback ?? undefined;
    });
  }
  onExit(callback: ((target: NightingaleScrollboxItem<TCustomData>) => void | Promise<void>) | null | undefined) {
    this._queue.enqueue(async () => {
      if (this._currentState === 'hidden') {
        await callback?.(this);
      }
      this.callbacks.onExit = callback ?? undefined;
    });
  }
  onUnregister(callback: ((target: NightingaleScrollboxItem<TCustomData>) => void | Promise<void>) | null | undefined) {
    this._queue.enqueue(async () => {
      this.callbacks.onUnregister = callback ?? undefined;
    });
  }
}

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

import NightingaleElement from "@nightingale-elements/nightingale-new-core";
import { customElement, property } from "lit/decorators.js";
import { NightingaleScrollbox } from "./nightingale-scrollbox";


@customElement("nightingale-scrollbox-item")
export class NightingaleScrollboxItem<TData> extends NightingaleElement {
  /** HTML content to be rendered when this item becomes visible (before running "onEnter" callback). Leave unset to keep existing content. */
  @property({ type: String })
  "content-visible"?: string;

  /** HTML content to be rendered when this item becomes hidden (before running "onExit" callback). Leave unset to keep existing content. */
  @property({ type: String })
  "content-hidden"?: string;

  /** Custom data associated with this item. */
  data?: TData;

  private scrollbox?: NightingaleScrollbox<TData>;
  private currentState: ScrollboxItemState = undefined;
  private requiredState: ScrollboxItemState = undefined;
  private readonly queue = new AsyncQueue();
  private readonly callbacks: {
    onRegister?: (item: NightingaleScrollboxItem<TData>) => void | Promise<void>,
    onEnter?: (item: NightingaleScrollboxItem<TData>) => void | Promise<void>,
    onExit?: (item: NightingaleScrollboxItem<TData>) => void | Promise<void>,
    onUnregister?: (item: NightingaleScrollboxItem<TData>) => void | Promise<void>,
  } = {};

  override connectedCallback() {
    super.connectedCallback();
    this.style.width = "100%";
    this.style.height = "100%";
    if (this.closest("nightingale-scrollbox")) {
      customElements.whenDefined("nightingale-scrollbox").then(() => {
        this.scrollbox = this.closest<NightingaleScrollbox<TData>>("nightingale-scrollbox") ?? undefined;
        this.scrollbox?.register(this);
      });
    }
  }
  override disconnectedCallback() {
    this.scrollbox?.unregister(this);
    this.scrollbox = undefined;
    super.disconnectedCallback();
  }

  /** Request changing item state to "new" and running "onRegister" callback. */
  register() {
    this.requiredState = "new";
    this.queue.enqueue(async () => {
      await this.callbacks.onRegister?.(this);
      this.currentState = "new";
    });
  }
  /** Request changing item state to undefined and running "onUnregister" callback. This item should not be used anymore. */
  unregister() {
    this.requiredState = undefined;
    this.queue.enqueue(async () => {
      await this.callbacks.onUnregister?.(this);
      this.currentState = undefined;
    });
  }
  /** Request changing item state to "visible" and running "onEnter" callback. */
  enter() {
    this.requiredState = "visible";
    this.queue.enqueue(async () => {
      if (this.requiredState !== "visible") return; // skip if required state changed in the meantime
      if (this.currentState === "visible") return; // skip if already in required state
      this.setContent(this["content-visible"]);
      await this.callbacks.onEnter?.(this);
      this.currentState = "visible";
    });
  }
  /** Request changing item state to "hidden" and running "onExit" callback. */
  exit() {
    this.requiredState = "hidden";
    this.queue.enqueue(async () => {
      if (this.requiredState !== "hidden") return; // skip if required state changed in the meantime
      if (this.currentState === "hidden") return; // skip if already in required state
      this.setContent(this["content-hidden"]);
      await this.callbacks.onExit?.(this);
      this.currentState = "hidden";
    });
  }

  private setContent(content: string | null | undefined) {
    if (content === undefined || content === null) return;
    this.innerHTML = content;
  }

  /** Set or remove "onRegister" callback function. Also run this callback function if the item is already registered (i.e. in "new", "visible", or "hidden" state). */
  onRegister(callback: ((item: NightingaleScrollboxItem<TData>) => void | Promise<void>) | null | undefined) {
    this.queue.enqueue(async () => {
      if (this.currentState !== undefined) {
        await callback?.(this);
      }
      this.callbacks.onRegister = callback ?? undefined;
    });
  }
  /** Set or remove "onEnter" callback function. Also run this callback function if the item is in "visible" state. */
  onEnter(callback: ((item: NightingaleScrollboxItem<TData>) => void | Promise<void>) | null | undefined) {
    this.queue.enqueue(async () => {
      if (this.currentState === "visible") {
        await callback?.(this);
      }
      this.callbacks.onEnter = callback ?? undefined;
    });
  }
  /** Set or remove "onExit" callback function. Also run this callback function if the item is in "hidden" state. */
  onExit(callback: ((item: NightingaleScrollboxItem<TData>) => void | Promise<void>) | null | undefined) {
    this.queue.enqueue(async () => {
      if (this.currentState === "hidden") {
        await callback?.(this);
      }
      this.callbacks.onExit = callback ?? undefined;
    });
  }
  /** Set or remove "onUnregister" callback function. */
  onUnregister(callback: ((item: NightingaleScrollboxItem<TData>) => void | Promise<void>) | null | undefined) {
    this.queue.enqueue(async () => {
      this.callbacks.onUnregister = callback ?? undefined;
    });
  }
}

/** State of a scrollbox item. Scrollbox item lifecycle:
 * - undefined -> "new" (run `onRegister`);
 * - "new" -> "visible" (run `onEnter`);
 * - "new" -> "hidden" (run `onExit`);
 * - "hidden" -> "visible" (run `onEnter`);
 * - "visible" -> "hidden" (run `onExit`);
 * - "hidden" -> undefined (run `onUnregister`);
 * - "visible" -> undefined (run `onUnregister`);
 */
type ScrollboxItemState = undefined | "new" | "hidden" | "visible";

/** Helper for executing async jobs sequentially. */
class AsyncQueue {
  private readonly jobQueue: (() => void | Promise<void>)[] = [];
  private busy: boolean = false;

  /** Add a new job to the queue (will be executed once all previous jobs have finished) */
  enqueue(job: () => void | Promise<void>): void {
    this.jobQueue.push(job);
    if (!this.busy) {
      this.runLoop();
    }
  }

  private async runLoop(): Promise<void> {
    this.busy = true;
    while (this.jobQueue.length > 0) {
      const job = this.jobQueue.shift()!;
      await job();
    }
    this.busy = false;
  }
}

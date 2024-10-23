
/** State of a target element. Target element lifecycle:
 * - undefined -> "hidden" (run `onRegister`);
 * - "hidden" -> "visible" (run `onEnter`);
 * - "visible" -> "hidden" (run `onExit`);
 * - "visible" -> undefined (run `onUnregister`);
 * - "hidden" -> undefined (run `onUnregister`);
 *  */
type State = undefined | "hidden" | "visible";

export interface Registration {
    unregister: () => void,
}

export class ScrollboxManager<TCustomData> {
    private readonly _customData = new Map<Element, TCustomData>();
    private readonly _currentState = new Map<Element, State>();
    private readonly _requiredState = new Map<Element, State>();
    /** Set of targets for which an update loop is currently running. */
    private readonly _busy = new Set<Element>();
    private readonly _observer: IntersectionObserver;

    constructor(
        private readonly _root: HTMLDivElement,
        private readonly callbacks: {
            onRegister?: (target: Element, customData: TCustomData) => void | Promise<void>,
            onEnter?: (target: Element, customData: TCustomData) => void | Promise<void>,
            onExit?: (target: Element, customData: TCustomData) => void | Promise<void>,
            onUnregister?: (target: Element, customData: TCustomData) => void | Promise<void>,
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
            this._updateState(entry.target, entry.isIntersecting ? "visible" : "hidden");
        }
    }
    register(target: Element, customData: TCustomData): Registration {
        this._customData.set(target, customData);
        this._updateState(target, "hidden");
        this._observer.observe(target);
        return {
            unregister: () => this.unregister(target),
        };
    }
    unregister(target: Element) {
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
    private _updateState(target: Element, state: State) {
        if (state === undefined) this._requiredState.delete(target);
        else this._requiredState.set(target, state);
        if (!this._busy.has(target)) {
            this._startUpdateLoop(target);
        }
    }
    private async _startUpdateLoop(target: Element) {
        this._busy.add(target);
        while (true) { // eslint-disable-line no-constant-condition
            const current = this._currentState.get(target);
            const required = this._requiredState.get(target);
            if (current === required) break;

            if (!this._customData.has(target)) throw new Error(`AssertionError: customData missing for element ${target.id}`);
            const customData = this._customData.get(target) as TCustomData;

            if (required === undefined) {
                // Target has been unregistered ("hidden"/"visible" -> undefined)
                this._customData.delete(target);
                await this.callbacks.onUnregister?.(target, customData);
            } else if (required === "hidden") {
                if (current === undefined) {
                    // Target has been registered (undefined -> "hidden")
                    await this.callbacks.onRegister?.(target, customData);
                } else if (current === "visible") {
                    // Target was visible, not anymore ("visible" -> "hidden")
                    await this.callbacks.onExit?.(target, customData);
                }
            } else if (required === "visible") {
                // Target has become visible ("hidden" -> "visible")
                await this.callbacks.onEnter?.(target, customData);
            } else {
                throw new Error("AssertionError");
            }

            if (required === undefined) this._currentState.delete(target);
            else this._currentState.set(target, required);
        }
        this._busy.delete(target);
    }
}

/** Convert string|number length into valid CSS length (42, "42", "42px" -> "42px"; undefined, null, "" -> "0px") */
function normalizeCssLength(cssLength: string | number | undefined | null): string {
    if (cssLength === undefined || cssLength === null) return "0px";
    if (!isNaN(Number(cssLength))) return `${Number(cssLength)}px`;
    return cssLength as string;
}

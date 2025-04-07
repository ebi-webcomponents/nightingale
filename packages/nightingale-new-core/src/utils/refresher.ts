
/** Helper for running potentially time-consuming "refresh" actions (e.g. canvas draw) in a non-blocking way.
 * If the caller calls `requestRefresh()`, this call returns immediately but it is guaranteed
 * that `refresh` will be run asynchronously in the future.
 * If the caller calls `requestRefresh()` multiple times, it is NOT guaranteed
 * that `refresh` will be run the same number of times, only that it will be run
 * at least once after the last call to `requestRefresh()`. */
export interface Refresher {
    requestRefresh: () => void,
}

export function Refresher(refresh: () => void): Refresher {
    let requested = false;
    let running = false;
    function requestRefresh(): void {
        requested = true;
        if (!running) {
            handleRequests(); // do not await
        }
    }
    async function handleRequests(): Promise<void> {
        while (requested) {
            requested = false;
            running = true;
            await sleep(0); // let other things happen (this pushes the rest of the function to the end of the queue)
            try {
                refresh();
            } catch (err) {
                console.error(err);
            }
            running = false;
        }
    }
    return { requestRefresh };
}

/** Sleep for `ms` milliseconds. */
function sleep(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(() => {
        resolve();
    }, ms));
}

/** Helper for deciding when to skip potentially time-consuming actions (e.g. canvas draw).
 * Assumes that we can skip if the "stamp" value has not changed.
 * Example usage:
 * ```
 * const stamp = new Stamp(() => {
 *     // Compute current stamp value
 * });
 * ...
 * if (stamp.update().changed){
 *     // Run stuff
 * } else {
 *     // Skip stuff
 * }
 * ``` */
export class Stamp {
    constructor(
        /** Function that returns current stamp value. */
        public readonly stampFunction: () => Record<string, unknown>,
    ) { }

    private currentStampValue: Record<string, unknown> = {};

    /** Update the current stamp value (using the return value of `stampFunction`).
     * Return `true` if the stamp value has changed since the last `update`, `false` otherwise.
     * (Stamp value comparison is performed by shallow object comparison.) */
    update() {
        const oldValue = this.currentStampValue;
        this.currentStampValue = this.stampFunction();
        return {
            oldValue,
            newValue: this.currentStampValue,
            changed: !objectShallowEquals(oldValue, this.currentStampValue),
        };
    }
}

/** Shallow object comparison */
function objectShallowEquals(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
    for (const key in a) {
        if (a[key] !== b[key]) return false;
    }
    for (const key in b) {
        if (a[key] !== b[key]) return false;
    }
    return true;
}

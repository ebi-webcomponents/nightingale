
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
    return {
        requestRefresh,
    };
}


/** Sleep for `ms` milliseconds. */
export function sleep(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(() => {
        resolve();
    }, ms));
}


/** Return the last element of `array`, or `undefined` if there are no elements.
 * If `predicate` is provided, return the last element where `predicate` returns true,
 * or `undefined` if there is no such element. */
export function last<T>(array: T[], predicate?: (value: T, index: number, obj: T[]) => boolean): T | undefined {
    if (!predicate) return array.length > 0 ? array[array.length - 1] : undefined;
    for (let i = array.length - 1; i >= 0; i--) {
        const element = array[i];
        if (predicate(element, i, array)) return element;
    }
    return undefined;
}


/** Return index of the first element of `sortedArray` for which `key(element) >= query`.
 * Return length of `sortedArray` if `key(element) < query` for all elements.
 * (aka Return the first index where `query` could be inserted while keeping the array sorted.) */
export function firstGteqIndex<T>(sortedArray: ArrayLike<T>, query: number, key: (element: T) => number) {
    return firstGteqIndexInRange(sortedArray, query, 0, sortedArray.length, key);
}

/** Return index of the first element within range [start, end) for which `key(element) >= query`.
 * Return `end` if for all elements in the range `key(element) < query`. */
function firstGteqIndexInRange<T>(sortedArray: ArrayLike<T>, query: number, start: number, end: number, key: (element: T) => number) {
    if (start === end) return start;
    // Invariants:
    // key(sortedArray[i]) < query for each i < start
    // key(sortedArray[i]) >= query for each i >= end
    while (end - start > 4) {
        const mid = (start + end) >> 1;
        if (key(sortedArray[mid]) >= query) {
            end = mid;
        } else {
            start = mid + 1;
        }
    }
    // Linear search remaining 4 or fewer elements:
    for (let i = start; i < end; i++) {
        if (key(sortedArray[i]) >= query) {
            return i;
        }
    }
    return end;
}


/** Data structure for storing integer intervals (ranges) and efficiently retrieving a subset of ranges which overlap with another (query) interval.
 * Not suited for storing float intervals, but query interval can be float. */
export class RangeCollection<T> {
    protected readonly items: T[];
    protected readonly starts: number[];
    protected readonly stops: number[];

    /** Keys to `this.bins`, sorted in ascending order */
    protected readonly binSpans: number[];
    /** `this.bins[span]` contains indices of all items whose length is `<= span` but `> span/Q`, in ascending order */
    protected readonly bins: Record<number, number[]>;
    /** Ratio of spans of neighboring bins */
    protected readonly Q = 2;
    /** Reusable arrays (one for each bin), to avoid repeated array allocation */
    private readonly _tmpArrays: Record<number, number[]> = {};

    /** Create a new collection of ranges. `start` must return range start (inclusive), `stop` must return range end (exclusive) */
    constructor(items: T[], accessors: { start: (item: T) => number, stop: (item: T) => number }) {
        const { start, stop } = accessors;
        this.items = items;
        this.starts = items.map(start);
        this.stops = items.map(stop);

        this.bins = {};
        for (let i = 0; i < items.length; i++) {
            const length = this.stops[i] - this.starts[i];
            let binSpans = 1;
            while (binSpans < length) binSpans *= this.Q;
            (this.bins[binSpans] ??= []).push(i);
        }
        this.binSpans = sortNumeric(Object.keys(this.bins).map(Number));
        for (const binSpan of this.binSpans) {
            this.bins[binSpan].sort(this.compareFn);
        }
    }

    /** Return number of items. */
    size(): number {
        return this.items.length;
    }

    /** Get all ranges that overlap with interval [start, stop).
     * Does not preserve original order of the ranges!
     * Instead sorts the ranges by their start (ranges with the same start are sorted by decreasing length). */
    overlappingItems(start: number, stop: number): T[] {
        return this.overlappingItemIndices(start, stop).map(i => this.items[i]);
    }

    /** Get indices of all ranges that overlap with interval [start, stop).
     * Does not preserve original order of the ranges!
     * Instead sorts the ranges by their start (ranges with the same start are sorted by decreasing length). */
    overlappingItemIndices(start: number, stop: number): number[] {
        const partialOuts = this.binSpans.map(binSpan => this.overlappingItemIndicesInBin(binSpan, start, stop, this._tmpArrays[binSpan] ??= []));
        return mergeSortedArrays(partialOuts, this.compareFn);
    }

    private overlappingItemIndicesInBin(binSpan: number, start: number, stop: number, out: number[]): number[] {
        out.length = 0;
        const bin = this.bins[binSpan];
        const from = firstGteqIndex(bin, Math.floor(start) - binSpan + 1, i => this.starts[i]);
        const to = firstGteqIndex(bin, Math.ceil(stop), i => this.starts[i]);
        for (let j = from; j < to; j++) {
            const i = bin[j];
            if (this.stops[i] > start) {
                out.push(i);
            }
        }
        return out;
    }

    /** Console.log info about this RangeCollection */
    print(): void {
        for (const binSpan of this.binSpans) {
            console.log(`Bin ${binSpan}:`, this.bins[binSpan].map(r => `${this.starts[r]}-${this.stops[r]}(${this.stops[r] - this.starts[r]})`).join("  "));
        }
    }

    /** Compare function used to sort ranges. Sorts by start, if start equal longer range goes first. */
    private readonly compareFn = (i: number, j: number) => this.starts[i] - this.starts[j] || this.stops[j] - this.stops[i];
}

function mergeSortedArrays<T>(arrays: T[][], compareFn: (a: T, b: T) => number): T[] {
    const queue = arrays.map((arr, i) => i).filter(i => arrays[i].length > 0);
    queue.sort((a, b) => compareFn(arrays[a][0], arrays[b][0]));
    const heads = arrays.map(() => 0);
    const out: T[] = [];
    while (queue.length > 0) {
        const iHeadArr = queue[0];
        const headArr = arrays[iHeadArr];
        // Take one element from head array
        out.push(headArr[heads[iHeadArr]++]);
        // Restore queue ordering
        if (heads[iHeadArr] === headArr.length) {
            // Discard depleted head array
            queue.shift();
        } else {
            // Insert head array to correct position
            const headValue = headArr[heads[iHeadArr]];
            let i = 1;
            for (; i < queue.length; i++) {
                const iOtherArr = queue[i];
                const otherHeadValue = arrays[iOtherArr][heads[iOtherArr]];
                if (compareFn(otherHeadValue, headValue) < 0) {
                    queue[i - 1] = iOtherArr;
                } else {
                    break;
                }
            }
            queue[i - 1] = iHeadArr;
        }
    }
    return out;
}

function sortNumeric(array: number[]): number[] {
    return array.sort((a, b) => a - b);
}


/** Return index of the first element of `sortedArray` for which `key(element) >= query`.
 * Return length of `sortedArray` if `key(element) < query` for all elements.
 * (aka Return the first index where `query` could be inserted while keeping the array sorted.) */
export function firstGteqIndex<T>(sortedArray: ArrayLike<T>, query: number, key: (element: T) => number): number {
    return firstGteqIndexInRange(sortedArray, query, 0, sortedArray.length, key);
}

/** Return index of the first element of `sortedArray` for which `key(element) === query`.
 * Return `undefined` if `key(element) !== query` for all elements. */
export function firstEqIndex<T>(sortedArray: ArrayLike<T>, query: number, key: (element: T) => number): number | undefined {
    const index = firstGteqIndex(sortedArray, query, key);
    if (index < sortedArray.length && key(sortedArray[index]) === query) return index;
    else return undefined;
}

/** Return index of the first element within range [start, end) for which `key(element) >= query`.
 * Return `end` if for all elements in the range `key(element) < query`. */
function firstGteqIndexInRange<T>(sortedArray: ArrayLike<T>, query: number, start: number, end: number, key: (element: T) => number) {
    if (start === end) return start;
    // Invariants:
    // key(sortedArray[i]) < query for each i < start
    // key(sortedArray[i]) >= query for each i >= end
    while (end - start > 4) { // Threshold 4 will use the lowest number of comparisons on average (though this optimization is not super critical)
        const mid = (start + end) >> 1; // Floored mean of start and end
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

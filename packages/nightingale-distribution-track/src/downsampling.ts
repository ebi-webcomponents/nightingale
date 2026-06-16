type PoolingFunction = (...values: number[]) => number;


/** Helper object for downsampling 1D number arrays, with caching */
export type Downsampler = {
    /** Column count of the original data */
    nColumns: number,
    /** Downsampled version of the original data (index {nColumn}x{nRows} holds the original data) */
    downsampled: { [resolution: number]: Float32Array },
    /** Function used to compute downsampled value from multiple source values */
    poolingFunction: PoolingFunction,
}

export const Downsampler = {
    /** Create a new downsampler for a 2D number array */
    fromNumbers(data: Float32Array, poolingFunction: PoolingFunction): Downsampler {
        const result: Downsampler = { nColumns: data.length, downsampled: {}, poolingFunction };
        set(result, data.length, data);
        return result;
    },

    /** Return the original (full-size) data */
    getOriginal(downsampler: Downsampler): Float32Array {
        return get(downsampler, downsampler.nColumns)!;
    },

    /** Get data downsampled approximately to `minResolution`.
     * The returned resolution will be at least `minResolution` but less then double that, in each dimension.
     * The returned data will be equal to the original data if `minResolution` is big enough. */
    getDownsampled(downsampler: Downsampler, minResolution: number): Float32Array {
        const targetResolution = downsamplingTarget(downsampler.nColumns, minResolution);
        // console.log('minResolution', minResolution, 'downsamplingTarget', targetResolution)
        return getOrCompute(downsampler, targetResolution);
    },
};


/** Return `m`, a power of 2 or equal to `nDatapoints`, such that:
 * `nPixels <= m < 2*nPixels`  or  `m === nDatapoints < nPixels` */
function downsamplingTarget(nDatapoints: number, nPixels: number): number {
    let result = 1;
    while (result < nPixels && result < nDatapoints) {
        result = Math.min(2 * result, nDatapoints);
    }
    return result;
}

/** Get data downsampled to `resolution` (exactly) if already computed. Do not compute anything. */
function get(downsampler: Downsampler, resolution: number): Float32Array | undefined {
    return downsampler.downsampled[resolution];
}

/** Save data downsampled to `resolution`. */
function set(downsampler: Downsampler, resolution: number, value: Float32Array): void {
    downsampler.downsampled[resolution] = value;
}

/** Get data downsampled to `resolution` (exactly), with caching.  */
function getOrCompute(downsampler: Downsampler, resolution: number): Float32Array {
    const cached = get(downsampler, resolution);
    if (cached) {
        return cached;
    } else {
        const srcResolution = downsamplingSource(resolution, downsampler.nColumns);
        if (!srcResolution || srcResolution > downsampler.nColumns) throw new Error('AssertionError');
        // console.log('getOrCompute', srcResolution, '->', resolution)
        const srcData = getOrCompute(downsampler, srcResolution);
        console.time(`downsampleNumbers ${srcData.length}->${resolution}`)
        const result = downsampleNumbers(srcData, resolution, downsampler.poolingFunction);
        console.timeEnd(`downsampleNumbers ${srcData.length}->${resolution}`)
        set(downsampler, resolution, result);
        return result;
    }
}

/** Return resolution from which `wanted` resolution should be obtained by downsampling.
 * This will have either X length or Y length doubled relative to `wanted` (or same as in `original` if doubled would be more that original)
 * and the other length kept the same.
 * Return `undefined` if `wanted` is already equal to `original`. */
function downsamplingSource(wanted: number, original: number): number | undefined {
    if (wanted > original) {
        throw new Error('ArgumentError: Cannot downsample to higher resolution than original');
    }
    if (wanted === original) {
        // We already have it
        return undefined;
    }
    return Math.min(2 * wanted, original);
}


/** Downsample 2D array of numbers to a new size. */
function downsampleNumbers(input: Float32Array, newSize: number, poolingFunction: PoolingFunction): Float32Array {
    // console.log('downsampleNumbers', input.length, '->', newSize)

    if (input.length === 2 * newSize) {
        return downsampleNumbers_halveX(input, poolingFunction);
    }
    return downsampleNumbers_general(input, newSize, poolingFunction);
}

/** Downsample 2D array of numbers to a new size - implementation for general sizes. */
function downsampleNumbers_general(input: Float32Array, newSize: number, poolingFunction: PoolingFunction): Float32Array {
    const w0 = input.length;
    const w1 = newSize;
    const { from, to } = resamplingCoefficients(w0, w1);
    const out = input.slice(0, w1).fill(NaN) as Float32Array;
    const n = from.length;
    for (let j = 0; j < n; j++) { // column index
        const oldValue = out[to[j]];
        const inputValue = input[from[j]];
        if (isNaN(oldValue)) {
            out[to[j]] = inputValue;
        } else {
            out[to[j]] = poolingFunction(oldValue, inputValue);
        }
    }
    return out;
}

/** Downsample 2D array of numbers to a new size - simplified implementation for special cases when newX===oldX/2, newY===oldY. */
function downsampleNumbers_halveX(input: Float32Array, poolingFunction: PoolingFunction): Float32Array {
    const w0 = input.length;
    const w1 = Math.floor(w0 / 2);
    const out = input.slice(0, w1).fill(NaN) as Float32Array;
    for (let j = 0; j < w1; j++) { // column index
        const old1 = input[2 * j];
        const old2 = input[2 * j + 1];
        out[j] = poolingFunction(old1, old2);
    }
    return out;
}

/** Calculate the weights of how much each pixel in the old image contributes to pixels in the new image, for 1D images
 * (pixel `from[i]` contributes to pixel `to[i]` with weight `weight[i]`).
 * Typically one old pixel will contribute to more new pixels and vice versa.
 * Sum of weights contributed to each new pixel must be equal to 1.
 * To use for 2D images, calculate row-wise and column-wise weights and multiply them. */
function resamplingCoefficients(nOld: number, nNew: number): { from: number[], to: number[], weight: number[] } {
    const scale = nNew / nOld;
    let i = 0; // Current pixel in the old image
    let j = 0; // Current pixel in the new image
    let p = 0; // Current continuous position in the new image
    const from = [];
    const to = [];
    const weight = [];
    while (p < nNew) {
        const nextINotch = scale * (i + 1);
        const nextJNotch = j + 1;
        if (nextINotch <= nextJNotch) {
            from.push(i);
            to.push(j);
            weight.push(nextINotch - p);
            p = nextINotch;
            i += 1;
            if (nextINotch === nextJNotch) {
                j += 1;
            }
        } else {
            from.push(i);
            to.push(j);
            weight.push(nextJNotch - p);
            p = nextJNotch;
            j += 1;
        }
    }
    return {
        /** Index of a pixel in the old image */
        from,
        /** Index of a pixel in the new image */
        to,
        /** How much the `from` pixel's value contributes to the `to` pixel */
        weight,
    };
}

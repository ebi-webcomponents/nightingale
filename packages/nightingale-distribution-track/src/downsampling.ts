type PoolingFunction = (...values: number[]) => number;


/** Helper object for downsampling 1D number arrays, with caching */
export type Downsampler = {
    /** Column count of the original data */
    originalLength: number,
    /** Downsampled versions of the original data (index `1` holds the original data) */
    downsampled: { [scale: number]: Float32Array | undefined },
    /** Function used to compute downsampled value from multiple source values */
    poolingFunction: PoolingFunction,
}

export const Downsampler = {
    /** Create a new downsampler for a 2D number array */
    fromNumbers(data: Float32Array, poolingFunction: PoolingFunction): Downsampler {
        return {
            originalLength: data.length,
            poolingFunction,
            downsampled: { 1: data },
        };
    },

    /** Return the original (full-size) data */
    getOriginal(downsampler: Downsampler): Float32Array {
        return downsampler.downsampled[1]!;
    },

    /** Get data downsampled approximately to `minLength`.
     * The returned data length will be at least `minLength` but less then double that.
     * Exception: The returned data will be equal to the original data if `minLength > originalData.length`. */
    getDownsampled(downsampler: Downsampler, minLength: number): Float32Array {
        const targetScale = downsamplingTargetScale(downsampler.originalLength, minLength);
        return getOrCompute(downsampler, targetScale);
    },
};

/** Return `scale`, a power of 2, such that:
 * `nPixels <= nDatapoints/scale < 2*nPixels`  or  `scale === 1 && nDatapoints < 2*nPixels` */
function downsamplingTargetScale(nDatapoints: number, nPixels: number): number {
    nDatapoints = Math.max(1, nDatapoints);
    nPixels = Math.max(1, nPixels);
    const log2scaleExact = Math.log2(nDatapoints / nPixels);
    const log2scale = Math.max(0, Math.floor(log2scaleExact));
    return 2 ** log2scale;
}

/** Get data downsampled by `scale`, with caching. `scale` must be a power of 2. Resulting data length will be `Math.ceil(original.length / scale)` */
function getOrCompute(downsampler: Downsampler, scale: number): Float32Array {
    const cached = downsampler.downsampled[scale];
    if (cached) {
        return cached;
    } else {
        if (scale <= 1) throw new Error('AssertionError: getOrCompute');
        const srcData = getOrCompute(downsampler, scale / 2);
        const result = downsampleNumbers_halve(srcData, downsampler.poolingFunction);
        downsampler.downsampled[scale] = result;
        return result;
    }
}

/** Downsample array of numbers to a new size `ceil(input.length / 2)`. */
function downsampleNumbers_halve(input: Float32Array, poolingFunction: PoolingFunction): Float32Array {
    const w0 = input.length;
    const w1Paired = Math.floor(w0 / 2);
    const w1 = Math.ceil(w0 / 2);
    const out = new Float32Array(w1).fill(NaN);
    for (let j = 0; j < w1Paired; j++) { // column index
        const old1 = input[2 * j];
        const old2 = input[2 * j + 1];
        out[j] = poolingFunction(old1, old2);
    }
    if (w0 % 2) {
        // Odd length of input array -> just copy last element
        out[w1 - 1] = input[w0 - 1];
    }
    return out;
}

// TODO: solve pooling NaNs
// TODO: convert to class

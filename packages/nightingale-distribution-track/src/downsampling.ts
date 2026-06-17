type PoolingFunction = (...values: number[]) => number;


/** Helper object for downsampling 1D number arrays, with caching */
export class Downsampler {
    /** Downsampled versions of the original data (index 1 holds the original data; indices 2, 4, 8 etc. hold increasingly downsampled data) */
    private readonly downsampled: { [scale: number]: Float32Array | undefined } = {};

    /** Create a new downsampler for a 1D number array */
    constructor(data: Float32Array, private readonly poolingFunction: PoolingFunction) {
        this.downsampled[1] = data;
    }

    /** Return the original full-size data */
    getOriginal(): Float32Array {
        return this.downsampled[1]!;
    }

    /** Get data downsampled approximately to `minLength`.
     * The returned data length will be at least `minLength` but less then double that.
     * Exception: The returned data will be equal to the original data if `minLength > originalData.length`. */
    getDownsampled(minLength: number): Float32Array {
        const targetScale = downsamplingTargetScale(this.getOriginal().length, minLength);
        return this.getOrCompute(targetScale);
    }

    /** Get data downsampled by `scale`, with caching. `scale` must be a power of 2. Resulting data length will be `Math.ceil(original.length / scale)` */
    private getOrCompute(scale: number): Float32Array {
        const cached = this.downsampled[scale];
        if (cached) {
            return cached;
        } else {
            if (scale <= 1) throw new Error('AssertionError: Downsampler.getOrCompute');
            const srcData = this.getOrCompute(scale / 2);
            const result = downsampleNumbers_halve(srcData, this.poolingFunction);
            this.downsampled[scale] = result;
            return result;
        }
    }

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

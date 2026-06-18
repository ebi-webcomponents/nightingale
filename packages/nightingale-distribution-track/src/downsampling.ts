type PoolingFunction = (a: number, b: number) => number;

const PoolingFunctions = {
    /** Like `Math.max` but handles `NaN` (`max(1, 2) -> 2`, `max(1, NaN) -> 1`, `max(NaN, 2) -> 2`, `max(NaN, NaN) -> NaN`) */
    max(a: number, b: number): number {
        if (isNaN(a) || a < b) return b;
        else return a;
    },
    /** Like `Math.min` but handles `NaN` (`min(1, 2) -> 1`, `min(1, NaN) -> 1`, `min(NaN, 2) -> 2`, `min(NaN, NaN) -> NaN`) */
    min(a: number, b: number): number {
        if (isNaN(a) || a > b) return b;
        else return a;
    },
} satisfies Record<string, PoolingFunction>;

type PoolingMethod = keyof typeof PoolingFunctions;


/** Helper object for downsampling 1D number arrays, with caching */
export class Downsampler {
    /** Downsampled versions of the original data (index 1 holds the original data; indices 2, 4, 8 etc. hold increasingly downsampled data) */
    private readonly downsampled: { [scale: number]: Float32Array | undefined } = {};

    /** Function used to compute downsampled value from multiple source values */
    private readonly poolingFunction: PoolingFunction;

    /** Create a new downsampler for a 1D number array */
    constructor(data: Float32Array, public readonly poolingMethod: PoolingMethod) {
        this.downsampled[1] = data;
        this.poolingFunction = PoolingFunctions[poolingMethod];
    }

    /** Return the original full-size data */
    getOriginal(): Float32Array {
        return this.downsampled[1]!;
    }

    /** Get data downsampled so that `downsampledColumnWidth ~ originalColumnWidth * originalData.length / downsampledData.length ~ 1`.
     * Return original data if `originalColumnWidth > 1`. */
    getDownsampledForColumnWidth(originalColumnWidth: number): Float32Array {
        const targetScale = Downsampler.targetDownsamplingScale(originalColumnWidth);
        return this.getDownsampledByScale(targetScale);
    }

    /** Get data downsampled by `scale`, with caching. `scale` must be a power of 2, greater or equal to 1 (i.e. 1, 2, 4, 8, 16...).
     * Length of the resulting data will be `Math.ceil(originalData.length / scale)` */
    getDownsampledByScale(scale: number): Float32Array {
        if (scale < 1) throw new Error(`Downsampler.getDownsampledByScale: invalid scale ${scale}, scale must be a power of 2, greater or equal to 1`);
        if (Math.log2(scale) % 1) throw new Error(`Downsampler.getDownsampledByScale: invalid scale ${scale}, scale must be a power of 2, greater or equal to 1`);
        const cached = this.downsampled[scale];
        if (cached) {
            return cached;
        } else {
            const srcData = this.getDownsampledByScale(scale / 2);
            const result = downsampleNumbers_halve(srcData, this.poolingFunction);
            this.downsampled[scale] = result;
            return result;
        }
    }

    /** Return `scale`, a power of 2, such that
     * `0.5 < originalColumnWidth*scale <= 1`  (or  `scale === 1` if `originalColumnWidth > 1`) */
    static targetDownsamplingScale(originalColumnWidth: number): number {
        if (originalColumnWidth > 1) {
            return 1;
        }
        const log2scale = -Math.log2(originalColumnWidth);
        const log2scaleFloor = Math.floor(log2scale);
        return 2 ** log2scaleFloor;
    }

    /** Return one or two scales, each being a power of 2, such that:
     * - in case of two scales: `1 < originalColumnWidth*scale1 < 2` and `0.5 < originalColumnWidth*scale2 < 1`, `scale1 = 2 * scale2`
     * - in case of one scale: `originalColumnWidth*scale === 1` (or `scale === 1` if `originalColumnWidth > 1`)
     * 
     * Weights of the scales sum up to 1 (the closer `originalColumnWidth*scale` is to 1, the higher its weight).
     */
    static targetDownsamplingScalesForTransition(originalColumnWidth: number) {
        if (originalColumnWidth > 1) {
            return [{ scale: 1, weight: 1 }];
        }
        const log2scale = -Math.log2(originalColumnWidth);
        const log2scaleFloor = Math.floor(log2scale);
        const wNext = log2scale - log2scaleFloor;
        if (wNext === 0) {
            return [{ scale: 2 ** log2scaleFloor, weight: 1 }];
        } else {
            return [
                { scale: 2 ** (log2scaleFloor + 1), weight: wNext },
                { scale: 2 ** log2scaleFloor, weight: 1 - wNext },
            ];
        }
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

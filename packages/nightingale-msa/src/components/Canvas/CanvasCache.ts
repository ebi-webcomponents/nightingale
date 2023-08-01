import { minBy, isEqual } from "lodash-es";
import { ResidueTileOptions, TileOptions } from "../../types/types";

// type TileOptions = Record<string, string | number | object>;
/**
 * A simple, in-memory cache for Canvas tiles outside of the DOM.
 * Gets automatically invalidated when called with different widths.
 * If `maxElements` are exceed, the oldest element (by insertion time) will be
 * removed from the cache.
 *
 * @param {Number} maxElements Maximal elements to keep in the cache (default: 200)
 */
class CanvasCache {
  private maxElements: number;
  private cache: Record<
    string,
    {
      value: HTMLCanvasElement;
      insertionTime: number;
    }
  > = {};
  private spec: ResidueTileOptions | TileOptions | {} = {};
  private cachedElements = 0;

  constructor({ maxElements }: { maxElements?: number } = {}) {
    this.maxElements = maxElements || 200;
    this.invalidate();
  }

  /**
   * Creates a canvas element outside of the DOM that can be used for caching.
   * @param {string} key Unique cache key of the element
   * @param {Number} tileWidth Width of the to be created canvas
   * @param {Number} tileWidth Width of the to be created canvas
   * @param {function} create Callback to be called if for the given `key` to canvas exists in the cache
   */
  createTile({
    key,
    tileWidth,
    tileHeight,
    create,
  }: {
    key: string;
    tileWidth: number;
    tileHeight: number;
    create: ({ ctx }: { ctx: CanvasRenderingContext2D }) => void;
  }): HTMLCanvasElement {
    // check if cache needs to be regenerated
    if (key in this.cache) {
      return this.cache[key].value;
    }
    if (this.cachedElements >= this.maxElements) {
      // purge oldest key from cache if maxSize is reached
      const oldestKey = minBy(
        Object.keys(this.cache),
        (k) => this.cache[k].insertionTime,
      );
      if (oldestKey) delete this.cache[oldestKey];
    }
    const canvas = document.createElement("canvas");
    this.cache[key] = {
      value: canvas,
      insertionTime: Date.now(),
    };
    canvas.width = tileWidth;
    canvas.height = tileHeight;
    const ctx = canvas.getContext("2d");
    this.cachedElements++;

    if (ctx) create({ ctx });
    return canvas;
  }

  /**
   * Checks whether the tile specification has changed and the cache needs
   * to be refreshed.
   * Pass in an object of all the properties that would result in the cache to be refreshed
   * Like React.PureComponents the passed-in properties are compared by their
   * shallow equality.
   *
   * @param {object} spec Object of all parameters that depend on this cache
   * Returns: `true` when the cache has been invalidated
   */
  updateTileSpecs(spec: ResidueTileOptions) {
    if (!isEqual(this.spec, spec)) {
      this.invalidate();
      this.spec = spec;
      return true;
    }
    return false;
  }

  /**
   * Invalidates the entire cache and removed all elements.
   */
  invalidate() {
    this.cache = {};
    this.spec = {};
    this.cachedElements = 0;
  }
}

export default CanvasCache;

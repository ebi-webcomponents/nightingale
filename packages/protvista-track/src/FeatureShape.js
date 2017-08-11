/*jslint node: true */
"use strict";

import * as d3 from "d3";

const symbolSize = 10;

export default class FeatureShape {
    getFeatureShape(aaWidth, ftHeight, ftWidth, shape) {
        shape = shape || 'rectangle';
        this._height = ftHeight;
        this._width = aaWidth * ftWidth;
        //0,0 is in the middle, so we first move to the starting of the aa at gapShape,0.
        this._gapShape = length === 1 ? 0 : this._width/ftWidth/2;
        //again a gap is needed for regions
        this._gapRegion = aaWidth/2;
        // if the constructor doesn't exist, rectangle is used by default
        if (typeof this['_' + shape] !== 'function') {
            shape = 'rectangle';
        }
        let feature = this['_' + shape]();

        return feature;
    }

    _rectangle() {
        return 'M' + -(this._gapRegion) + ',0'
            + 'L' + (this._width - this._gapRegion) + ',0'
            + 'L' + (this._width - this._gapRegion) + ',' + this._height
            + 'L' + -(this._gapRegion) + ',' + this._height
            + 'Z';
    }

    _isContinuous(shape) {
        shape = type.toLowerCase();
        if ((shape === 'bridge')) {
            return false;
        }
        return true;
    }
}
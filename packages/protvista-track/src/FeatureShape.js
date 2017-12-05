/*jslint node: true */
"use strict";

const symbolSize = 10;

export default class FeatureShape {
    getFeatureShape(aaWidth, ftHeight, ftLength, shape) {
        shape = shape || 'rectangle';
        this._ftLength = ftLength;
        this._ftHeight = ftHeight;
        this._ftWidth = aaWidth * ftLength;
        //0,0 is in the top middle, so we first move to the starting of the aa at gapShape,0.
        this._gapShape = ftLength === 1 ? 0 : this._ftWidth/ftLength/2;
        //again a gap is needed for regions
        this._gapRegion = aaWidth/2;
        // if the constructor doesn't exist, rectangle is used by default
        if (typeof this['_' + shape] !== 'function') {
            shape = 'rectangle';
        }
        let feature = this['_' + shape]();

        return feature;
    }

    static isContinuous(shape) {//TODO, do we still need it?
        shape = type.toLowerCase();
        if ((shape === 'bridge')) {
            return false;
        }
        return true;
    }

    _rectangle() {
        return 'M' + -(this._gapRegion) + ',0'
            + 'L' + (this._ftWidth - this._gapRegion) + ',0'
            + 'L' + (this._ftWidth - this._gapRegion) + ',' + this._ftHeight
            + 'L' + -(this._gapRegion) + ',' + this._ftHeight
            + 'Z';
    }

    _bridge() {
        if (this._ftLength !== 1) {
            return 'M' + -(this._gapRegion) + ',' + this._ftHeight
                + 'L' + -(this._gapRegion) + ',0'
                + 'L' + (this._ftWidth-this._gapRegion) + ',0'
                + 'L' + (this._ftWidth-this._gapRegion) + ',' + this._ftHeight
                + 'L' + (this._ftWidth-this._gapRegion) + ',2'
                + 'L' + -(this._gapRegion) + ',2Z';
        } else {
            return 'M' + -(this._gapRegion) + ',' + this._ftHeight
                + 'L' + -(this._gapRegion) + ',' + (this._ftHeight/2)
                + 'L0,' + (this._ftHeight/2)
                + 'L0,0'
                + 'L0,' + (this._ftHeight/2)
                + 'L' + (this._ftWidth-this._gapRegion) + ',' + (this._ftHeight/2)
                + 'L' + (this._ftWidth-this._gapRegion) + ',' + this._ftHeight
                + 'Z';
        }
    };

    _getMiddleLine(centerx) {
        return 'M' + (centerx + this._gapShape) + ',' + centerx
        + 'L' + (this._ftWidth/2 + this._gapShape) + ',' + centerx
        + 'M' + (-centerx + this._gapShape) + ',' + centerx
        + 'L' + (-this._ftWidth/2 + this._gapShape) + ',' + centerx;
    };

    _diamond() {
        var centerx = symbolSize/2;
        var shape = 'M' + this._gapShape + ',0'
            + 'L' + (centerx+this._gapShape) + ',' + centerx
            + 'L' + this._gapShape + ',' + symbolSize
            + 'L' + (-centerx+this._gapShape) + ',' + centerx;
        return this._ftLength !== 1
            ? shape + 'L' + this._gapShape + ',0Z' + this._getMiddleLine(centerx, this._ftWidth)
            : shape + 'Z';
    };

    _chevron() {
        var centerx = symbolSize/2;
        var shape = 'M' + this._gapShape + ',' + centerx
            + 'L' + (centerx+this._gapShape) + ',0'
            + 'L' + (centerx+this._gapShape) +',' + centerx
            + 'L' + this._gapShape + ',' + symbolSize
            + 'L' + (-centerx+this._gapShape) + ',' + centerx
            + 'L' + (-centerx+this._gapShape) + ',0';
        return this._ftLength !== 1
            ? shape + 'L' + this._gapShape + ',' + centerx + this._getMiddleLine(centerx, this._ftWidth) + 'Z'
            : shape + 'Z';
    };

    _catFace() {
        var centerx = symbolSize/2;
        var step = symbolSize/10;
        var shape = 'M' + (-centerx+this._gapShape) + ',0'
            + 'L' + (-centerx+this._gapShape) + ',' + (6*step)
            + 'L' + (-2*step+this._gapShape) + ',' + symbolSize
            + 'L' + (2*step+this._gapShape) + ',' + symbolSize
            + 'L' + (centerx+this._gapShape) + ',' + (6*step)
            + 'L' + (centerx+this._gapShape) + ',0'
            + 'L' + (2*step+this._gapShape) + ',' + (4*step)
            + 'L' + (-2*step+this._gapShape) + ',' + (4*step);
        return this._ftLength !== 1
            ? shape + 'M' + (-centerx+this._gapShape) + ',0' + this._getMiddleLine(centerx, this._ftWidth) + 'Z'
            : shape + 'Z';
    };

    _triangle() {
        var centerx = symbolSize/2;
        var shape = 'M' + this._gapShape + ',0'
            + 'L' + (centerx+this._gapShape) + ',' + symbolSize
            + 'L' + (-centerx+this._gapShape) + ',' + symbolSize;
        return this._ftLength !== 1
            ? shape + 'L' + this._gapShape + ',0' + this._getMiddleLine(centerx, this._ftWidth) + 'Z'
            : shape + 'Z';
    };

    _wave() {
        var rx = symbolSize/4;
        var ry = symbolSize/2;
        var shape = 'M' + (-symbolSize/2+this._gapShape) + ',' + ry
            + "A" + rx + "," + ry + " 0 1,1 " + this._gapShape + "," + ry
            + "A" + rx + "," + ry + " 0 1,0 " + (symbolSize/2+this._gapShape) + ',' + ry;
        return this._ftLength !== 1
            ? shape + this._getMiddleLine(ry, this._ftWidth) + 'Z'
            : shape + 'Z';
    };

    _getPolygon(sidesNumber){
        var r = symbolSize/2;
        var polygon = 'M ';
        for(var i=0; i < sidesNumber; i++) {
            polygon += (r * Math.cos(2*Math.PI*i/sidesNumber) + this._gapShape) + ',' +
                (r * Math.sin(2*Math.PI*i/sidesNumber)+r)  + ' ';
        }
        return this._ftLength !== 1
            ? polygon + ' ' + (r * Math.cos(0) + this._gapShape) + ',' + (r * Math.sin(0)+r)  + ' ' +
            this._getMiddleLine(r, this._ftWidth) + 'Z'
            : polygon + 'Z';
    };

    _hexagon() {
        return this._getPolygon(6);
    };

    _pentagon() {
        return this._getPolygon(5);
    };

    _circle() {
        var r = Math.sqrt(symbolSize / Math.PI);
        var shape = "M" + this._gapShape + ",0"
            + "A" + r + "," + r + " 0 1,1 " + this._gapShape + "," + symbolSize
            + "A" + r + "," + r + " 0 1,1 " + this._gapShape + ",0";
        return this._ftLength !== 1
            ? shape + this._getMiddleLine(symbolSize/2, this._ftWidth) + 'Z'
            : shape + 'Z';
    };

    _arrow() {
        var step = symbolSize/10;
        var shape = 'M' + this._gapShape + ',0'
            + 'L' + (-step+this._gapShape) + ',0'
            + 'L' + (-5*step+this._gapShape) + ',' + (4*step)
            + 'L' + (-step+this._gapShape) + ',' + this._ftHeight
            + 'L' + this._gapShape + ',' + this._ftHeight
            + 'L' + (4*step+this._gapShape) + ',' + (4*step);
        return this._ftLength !== 1
            ? shape + 'L' + this._gapShape + ',0' + this._getMiddleLine(symbolSize/2, this._ftWidth) + 'Z'
            : shape + 'Z';
    };

    _doubleBar() {
        var centerx = symbolSize/2;
        var shape = 'M' + this._gapShape + ',0'
            + 'L' + (-centerx+this._gapShape) + ',' + symbolSize
            + 'L' + this._gapShape + ',' + symbolSize
            + 'L' + (centerx+this._gapShape) + ',0';
        return this._ftLength !== 1
            ? shape + 'L' + this._gapShape + ',0' + this._getMiddleLine(symbolSize/2, this._ftWidth) + 'Z'
            : shape + 'Z';
    };
}

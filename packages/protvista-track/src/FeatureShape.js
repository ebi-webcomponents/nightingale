/*jslint node: true */
"use strict";

const symbolSize = 10;

export default class FeatureShape {
    getFeatureShape(aaWidth, ftHeight, ftLength, shape) {
        shape = shape || 'rectangle';
        this._ftLength = ftLength;
        this._ftHeight = ftHeight;
        this._ftWidth = aaWidth * ftLength;
        if (typeof this['_' + shape] !== 'function') {
            shape = 'rectangle';
        }
        const feature = this['_' + shape]();

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
        return 'M0,0'
            + 'L' + (this._ftWidth) + ',0'
            + 'L' + (this._ftWidth) + ',' + this._ftHeight
            + 'L0,' + this._ftHeight
            + 'Z';
    }
    _roundRectangle() {
        const radius = 6;
        return 'M' + (radius) + ',0'
            + 'h' + (this._ftWidth - 2 * radius) + ',0'
            + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
            + "v" + (this._ftHeight - 2 * radius)
            + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + radius
            + "h" + (2 * radius - this._ftWidth)
            + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + -radius
            + "v" + (2 * radius - this._ftHeight)
            + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + -radius
            + 'Z';
    }

    _bridge() {
        if (this._ftLength !== 1) {
            return 'M0,' + this._ftHeight
                + 'L0,0'
                + 'L' + this._ftWidth + ',0'
                + 'L' + this._ftWidth + ',' + this._ftHeight
                + 'L' + this._ftWidth + ',2'
                + 'L0,2Z';
        } else {
            return 'M0,' + this._ftHeight
                + 'L0,' + (this._ftHeight/2)
                + 'L' + (this._ftWidth/2) + ',' + (this._ftHeight/2)
                + 'L' + (this._ftWidth/2) + ',0'
                + 'L' + (this._ftWidth/2) + ',' + (this._ftHeight/2)
                + 'L' + this._ftWidth + ',' + (this._ftHeight/2)
                + 'L' + this._ftWidth + ',' + this._ftHeight
                + 'Z';
        }
    };

    _getMiddleLine(centerx) {
        return 'M0,' + centerx
        + 'L' + this._ftWidth + ',' + centerx
        + 'Z'
    };

    _diamond() {
        const centerx = symbolSize/2;
        const m = this._ftWidth/2;
        const shape = 'M' + m + ',0'
            + 'L' + (m+centerx) + ',' + centerx
            + 'L' + m + ',' + symbolSize
            + 'L' + (m-centerx) + ',' + centerx;
        return this._ftLength !== 1
            ? shape + this._getMiddleLine(centerx, this._ftWidth)
            : shape + 'Z';
    };

    _chevron() {
        const m = this._ftWidth/2;
        const centerx = symbolSize/2;
        const shape = 'M' + m + ',' + centerx
            + 'L' + (centerx+m) + ',0'
            + 'L' + (centerx+m) +',' + centerx
            + 'L' + m + ',' + symbolSize
            + 'L' + (-centerx+m) + ',' + centerx
            + 'L' + (-centerx+m) + ',0';
        return this._ftLength !== 1
            ? shape + 'L' + m + ',' + centerx + this._getMiddleLine(centerx, this._ftWidth) + 'Z'
            : shape + 'Z';
    };

    _catFace() {
        var centerx = symbolSize/2;
        var step = symbolSize/10;
        const m = this._ftWidth/2;
        var shape = 'M' + (-centerx+m) + ',0'
            + 'L' + (-centerx+m) + ',' + (6*step)
            + 'L' + (-2*step+m) + ',' + symbolSize
            + 'L' + (2*step+m) + ',' + symbolSize
            + 'L' + (centerx+m) + ',' + (6*step)
            + 'L' + (centerx+m) + ',0'
            + 'L' + (2*step+m) + ',' + (4*step)
            + 'L' + (-2*step+m) + ',' + (4*step);
        return this._ftLength !== 1
            ? shape + 'M' + m + ',0' + this._getMiddleLine(centerx, this._ftWidth) + 'Z'
            : shape + 'Z';
    };

    _triangle() {
        var centerx = symbolSize/2;
        const m = this._ftWidth/2;
        var shape = 'M' + m + ',0'
            + 'L' + (centerx+m) + ',' + symbolSize
            + 'L' + (-centerx+m) + ',' + symbolSize;
        return this._ftLength !== 1
            ? shape + 'L' + m + ',0' + this._getMiddleLine(centerx, this._ftWidth) + 'Z'
            : shape + 'Z';
    };

    _wave() {
        var rx = symbolSize/4;
        var ry = symbolSize/2;
        const m = this._ftWidth/2;
        var shape = 'M' + (-symbolSize/2+m) + ',' + ry
            + "A" + rx + "," + ry + " 0 1,1 " + m + "," + ry
            + "A" + rx + "," + ry + " 0 1,0 " + (symbolSize/2+m) + ',' + ry;
        return this._ftLength !== 1
            ? shape + this._getMiddleLine(ry, this._ftWidth) + 'Z'
            : shape + 'Z';
    };

    _getPolygon(sidesNumber){
        const r = symbolSize/2;
        let polygon = 'M ';
        const m = this._ftWidth/2;
        for(var i=0; i < sidesNumber; i++) {
            polygon += (r * Math.cos(2*Math.PI*i/sidesNumber) + m) + ',' +
                (r * Math.sin(2*Math.PI*i/sidesNumber)+r)  + ' ';
        }
        return this._ftLength !== 1
            ? polygon + ' ' + (r * Math.cos(0) + m) + ',' + (r * Math.sin(0)+r)  + ' ' +
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
        const m = this._ftWidth/2;
        const r = Math.sqrt(symbolSize / Math.PI);
        const shape = "M" + m + ",0"
            + "A" + r + "," + r + " 0 1,1 " + m + "," + symbolSize
            + "A" + r + "," + r + " 0 1,1 " + m + ",0";
        return this._ftLength !== 1
            ? shape + this._getMiddleLine(symbolSize/2, this._ftWidth) + 'Z'
            : shape + 'Z';
    };

    _arrow() {
        const step = symbolSize/10;
        const m = this._ftWidth/2;
        const shape = 'M' + m + ',0'
            + 'L' + (-step+m) + ',0'
            + 'L' + (-5*step+m) + ',' + (4*step)
            + 'L' + (-step+m) + ',' + this._ftHeight
            + 'L' + m + ',' + this._ftHeight
            + 'L' + (4*step+m) + ',' + (4*step);
        return this._ftLength !== 1
            ? shape + 'L' + m + ',0' + this._getMiddleLine(symbolSize/2, this._ftWidth) + 'Z'
            : shape + 'Z';
    };

    _doubleBar() {
        const m = this._ftWidth/2;
        const centerx = symbolSize/2;
        const shape = 'M' + m + ',0'
            + 'L' + (-centerx+m) + ',' + symbolSize
            + 'L' + m + ',' + symbolSize
            + 'L' + (centerx+m) + ',0';
        return this._ftLength !== 1
            ? shape + 'L' + m + ',0' + this._getMiddleLine(symbolSize/2, this._ftWidth) + 'Z'
            : shape + 'Z';
    };
}

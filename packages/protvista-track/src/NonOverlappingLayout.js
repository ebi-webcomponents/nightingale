/*jslint node: true */
"use strict";

import _each from 'lodash-es/each';
import _some from 'lodash-es/some';

class Row {
    constructor() {
        this._rowFeatures = [];
    }

    _featureOverlap (feature, d, ftEnd, dEnd) {
        const featureBeginOverlap = (Number(feature.start) >= Number(d.start)) &&
            (Number(feature.start) <= Number(dEnd));
        const featureEndOverlap = (Number(ftEnd) >= Number(d.start)) && (Number(ftEnd) <= Number(dEnd));
        return featureBeginOverlap || featureEndOverlap;
    };

    _dOverlap(feature, d, ftEnd, dEnd) {
        const dBeginOverlap = (Number(d.start) >= Number(feature.start)) && (Number(d.start) <= Number(ftEnd));
        const dEndOverlap = (Number(dEnd) >= Number(feature.start)) && (Number(dEnd) <= Number(ftEnd));
        return dBeginOverlap || dEndOverlap;
    };

    containsOverlap(feature) {
        let self = this;  //this will not work inside the _some loop
        return _some(self._rowFeatures, function(d) {
            const ftEnd = (feature.end) ? feature.end : feature.start;
            const dEnd = (d.end) ? d.end : d.start;
            return self._featureOverlap(feature, d, ftEnd, dEnd) || self._dOverlap(feature, d, ftEnd, dEnd);
        });
    };

    addFeature(feature) {
        this._rowFeatures.push(feature);
    };
}

export default class NonOverlappingLayout {
    constructor(features, layoutHeight) {
        this._padding = 1;
        this._minHeight = 15;
        this._rowHeight = 0;
        this._rows = [];
        this._features = features;
        this._layoutHeight = layoutHeight;
        this._init();

    }

    _init() {
        let self = this; //this will not work inside the _some loop
        _each(self._features, function(feature){
            let added = _some(self._rows, function(row){
                if(!row.containsOverlap(feature)) {
                    row.addFeature(feature);
                    return true;
                }
            });
            if(!added) {
                let row = new Row();
                row.addFeature(feature);
                self._rows.push(row);
            }
        });

        this._rowHeight = (
                (this._layoutHeight / this._rows.length < this._minHeight)
                    ? this._layoutHeight /this._rows.length : this._minHeight )
            - 2 * this._padding;
    }

    getFeatureYPos(feature) {
        let yPos, self = this;  //this will not work inside the _each loop
        const yOffset = (this._layoutHeight /this._rows.length > this._minHeight)
                ? (this._layoutHeight - (this._rows.length * this._minHeight))/2
                : 0;
        _each(self._rows, function(row, i) {
            _each(row._rowFeatures, function(currFeature){
                if(currFeature === feature) {
                    yPos = (i * (self._rowHeight + 2 * self._padding) + yOffset);
                }
            });
        });
        return yPos;
    };

    getFeatureHeight() {
        return this._rowHeight;
    };
}
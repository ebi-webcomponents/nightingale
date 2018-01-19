/*jslint node: true */
"use strict";

import _each from 'lodash-es/each';
import _some from 'lodash-es/some';
import DefaultLayout from './DefaultLayout';

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
    _addAbsoluteLimits(feature){
      const limits = feature.locations.reduce((acc,e)=>acc.concat(e.fragments),[]).reduce((acc,e)=>({start:Math.min(e.start,acc.start),end:Math.max(e.end,acc.end)}),{start:Number.POSITIVE_INFINITY, end:Number.NEGATIVE_INFINITY})
      feature.start = limits.start;
      feature.end = limits.end;
    }

    containsOverlap(feature) {
        this._addAbsoluteLimits(Object.assign(feature));
        return _some(this._rowFeatures, d => {
            this._addAbsoluteLimits(Object.assign(d));
            const ftEnd = (feature.end) ? feature.end : feature.start;
            const dEnd = (d.end) ? d.end : d.start;
            return this._featureOverlap(feature, d, ftEnd, dEnd) || this._dOverlap(feature, d, ftEnd, dEnd);
        });
    };

    addFeature(feature) {
        this._rowFeatures.push(feature);
    };
}

export default class NonOverlappingLayout extends DefaultLayout{
    constructor(options){
      super(options);
      this._rowHeight = 0;
      this._rows = [];
      this._minHeight = 15;
    }

    init(features){
        this._features = features;
        _each(this._features, (feature) => {
            const added = _some(this._rows, (row) => {
                if(!row.containsOverlap(feature)) {
                    row.addFeature(feature);
                    return true;
                }
            });
            if(!added) {
                let row = new Row();
                row.addFeature(feature);
                this._rows.push(row);
            }
        });

        this._rowHeight =
          Math.min(this._layoutHeight / this._rows.length, this._minHeight)
          - 2 * this._padding;
    }

    getFeatureYPos(feature) {
        let yPos;
        const yOffset = (this._layoutHeight /this._rows.length > this._minHeight)
                ? (this._layoutHeight - (this._rows.length * this._minHeight))/2
                : 0;
        _each(this._rows, (row, i) => {
            _each(row._rowFeatures, (currFeature) => {
                if(currFeature === feature) {
                    yPos = (i * (this._rowHeight + 2 * this._padding) + yOffset);
                }
            });
        });
        return yPos;
    };

    getFeatureHeight() {
        return this._rowHeight;
    };
}

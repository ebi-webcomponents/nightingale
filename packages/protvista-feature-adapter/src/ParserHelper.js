/*jslint node: true */
"use strict";

import _each from 'lodash-es/each';

let _evidenceGrouping = function(ftEvidences) {
    var evidences = {};
    _each(ftEvidences, function(ev) {
        if (evidences[ev.code]) {
            evidences[ev.code].push(ev.source);
        } else {
            evidences[ev.code] = [ev.source];
        }
    });
    return evidences;
};

export default class ParserHelper {
    static groupEvidencesByCode (features) {
        _each(features, function(ft) {
            if (ft.evidences) {
                ft.evidences = _evidenceGrouping(ft.evidences);
            }
            if (ft.association) {
                _each(ft.association, function(disease) {
                    if (disease.evidences) {
                        disease.evidences = this._evidenceGrouping(disease.evidences);
                    }
                });
            }
        });
        return features;
    };
}
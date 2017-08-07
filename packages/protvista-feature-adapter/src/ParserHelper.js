/*jslint node: true */
"use strict";

import _each from 'lodash-es/each';

let _evidenceGrouping = function(ftEvidences) {
    var evidences = {};
    _each(ftEvidences, (ev) => {
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
        _each(features, (ft) => {
            if (ft.evidences) {
                ft.evidences = _evidenceGrouping(ft.evidences);
            }
            if (ft.association) {
                _each(ft.association, (disease) => {
                    if (disease.evidences) {
                        disease.evidences = this._evidenceGrouping(disease.evidences);
                    }
                });
            }
        });
        return features;
    };

    static renameProperties (features) {
        _each(features, (ft) => {
            if (ft.begin) {
                ft.start = ft.begin;
                delete ft.begin;
            }
        });
        return features;
    };
}
/*jslint node: true */
"use strict";

import _each from 'lodash-es/each';
import {ecoMap} from './evidences';

// let _evidenceGrouping = function(ftEvidences) {
//     var evidences = [];
//     _each(ftEvidences, (ev) => {
//         if (evidences[ev.code]) {
//             evidences[ev.code].push(ev.source);
//         } else {
//             evidences[ev.code] = [ev.source];
//         }
//     });
//     return evidences;
// };

export default class ParserHelper {
    // static groupEvidencesByCode (features) {
    //     _each(features, (ft) => {
    //         if (ft.evidences) {
    //             ft.evidences = _evidenceGrouping(ft.evidences);
    //         }
    //         if (ft.association) {
    //             _each(ft.association, (disease) => {
    //                 if (disease.evidences) {
    //                     disease.evidences = this._evidenceGrouping(disease.evidences);
    //                 }
    //             });
    //         }
    //     });
    //     return features;
    // };

    static renameProperties (features) {
        _each(features, (ft) => {
            if (ft.begin) {
                ft.start = ft.begin;
                delete ft.begin;
            }
        });
        return features;
    };

    static getEvidenceFromCodes(evidenceList) {
        if(!evidenceList)
            return;
        let html = '';
        evidenceList.map(ev => {
            const ecoMatch = ecoMap.find(eco => eco.name === ev.code);
            // return `<a href="${evidence.source.url}" target="_blank">${evidence.source.id}</a>(${evidence.source.name}) `;
            if(!ecoMatch)
                return;
            html = `${html}<p title="${ecoMatch.description}">${ecoMatch.shortDescription}`;
            if(ev.source) {
                html = `${html} <a href="${ev.source.url}" target="_blank">${ev.source.id}</a> (${ev.source.name})`;
            }
            html = `${html}</p>`
        });
        return html;
    }

    static formatTooltip (feature) {
        const evidenceHTML = ParserHelper.getEvidenceFromCodes(feature.evidences);
        return `
            <table>
                ${feature.description ? `<tr><td>Description</td><td>${feature.description}</td></tr>` : ``}
                ${evidenceHTML ? `<tr><td>Evidence</td><td>${evidenceHTML}</td></tr>` : ``}
                <!--<tr><td>Tools</td><td></td></tr>-->
            </table>
        `;
    }
}
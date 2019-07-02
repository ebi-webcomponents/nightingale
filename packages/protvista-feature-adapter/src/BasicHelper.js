/*jslint node: true */
"use strict";

import _each from "lodash-es/each";
import { ecoMap } from "./evidences";

export default class BasicHelper {
  static renameProperties(features) {
    _each(features, ft => {
      if (ft.begin) {
        ft.start = ft.begin;
        delete ft.begin;
      }
    });
    return features;
  }

  static getEvidenceFromCodes(evidenceList) {
    if (!evidenceList) return;
    let html = "";
    evidenceList.map(ev => {
      const ecoMatch = ecoMap.find(eco => eco.name === ev.code);
      if (!ecoMatch) return;
      html = `${html}<p title='${ecoMatch.description}'>${
        ecoMatch.shortDescription
      }`;
      if (ev.source) {
        html = `${html} <a href='${ev.source.url}' target='_blank'>${
          ev.source.id
        }</a> (${ev.source.name})`;
      }
      html = `${html}</p>`;
    });
    return html;
  }

  static formatTooltip(feature) {
    const evidenceHTML = BasicHelper.getEvidenceFromCodes(feature.evidences);
    return ` 
            <table>                        
                ${
                  feature.description
                    ? `<tr><td>Description</td><td>${
                        feature.description
                      }</td></tr>`
                    : ``
                } 
                ${
                  evidenceHTML
                    ? `<tr><td>Evidence</td><td>${evidenceHTML}</td></tr>`
                    : ``
                }
            </table> 
        `;
  }
}

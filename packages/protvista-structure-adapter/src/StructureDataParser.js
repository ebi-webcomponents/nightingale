/*jslint node: true */
"use strict";

import ldFilter from 'lodash-es/filter';
import ldMap from 'lodash-es/map';
import ldForEach from 'lodash-es/foreach';
import ldRemove from 'lodash-es/remove';
import ParserHelper from './ParserHelper';

const featureType = 'PDBE_COV';
const featureCategory = 'STRUCTURAL';

export default class StructureDataParser {
    constructor() {
        this._pdbFeatures = [];
    }

    parseEntry(data) {
        this._validateEntry(data);
        this._parseValidEntry(data);
        return this._pdbFeatures;
    }

    get pdbFeatures() {
        return this._pdbFeatures;
    }

    _validateEntry(data) {
        if (!data.sequence && ! data.sequence.sequence) {
            throw 'No sequence retrieved';
        }
        if (!data.dbReferences || (data.dbReferences.length === 0)) {
            throw 'No references retrieved'
        }
        const structures = ldFilter(data.dbReferences, (reference) => {
            return reference.type === 'PDB';
        });
        if (structures.length === 0) {
            throw 'No structural references reported for this accession';
        }
    }

    _getAllFeatureStructures(data) {
        let allFeatureStructures = [];
        const structures = ldFilter(data.dbReferences, (reference) => {
            return reference.type === 'PDB';
        });
        allFeatureStructures = ldMap(structures, (structure) => {
            const beginEnd = structure.properties.chains
                ? ParserHelper.getBeginEnd(structure.properties.chains) : {start: 0, end: 0};
            return {
                type: featureType,
                category: featureCategory,
                structures: [
                    {
                        description: ParserHelper.getDescription(structure.properties),
                        start: beginEnd.begin,
                        end: beginEnd.end,
                        source: {
                            id: structure.id,
                            url: 'http://www.ebi.ac.uk/pdbe-srv/view/entry/' + structure.id
                        }
                    }
                ],
                start: beginEnd.begin,
                end: beginEnd.end
            };
        });
        return allFeatureStructures;
    }

    _getOverlapping(ftStructure, startEnd) {
        const overlapping = ldRemove(this._pdbFeatures, (ftCoverage) => {
            if (((ftCoverage.start <= ftStructure.start) && (ftStructure.start <= ftCoverage.end))
                || ((ftCoverage.start <= ftStructure.end) && (ftStructure.end <= ftCoverage.end))
                || ((ftStructure.start <= ftCoverage.end) && (ftCoverage.end <= ftStructure.end))) {
                startEnd.minStart = Math.min(startEnd.minStart, ftStructure.start, ftCoverage.start);
                startEnd.maxEnd = Math.max(startEnd.maxEnd, ftStructure.end, ftCoverage.end);
                return true;
            }
            return false;
        });
        return overlapping;
    }

    _parseValidEntry(data) {
        this._pdbFeatures = [];
        const allFeatureStructures = this._getAllFeatureStructures(data);

        ldForEach(allFeatureStructures, (ftStructure) => {
            const startEnd = {minStart: Number.MAX_SAFE_INTEGER, maxEnd: 1};
            const overlapping = this._getOverlapping(ftStructure, startEnd);
            if (overlapping.length === 0) {
                this._pdbFeatures.push(ftStructure);
            } else {
                ftStructure.start = startEnd.minStart;
                ftStructure.end = startEnd.maxEnd;
                ldForEach(overlapping, (overlap) => {
                    ftStructure.structures = ftStructure.structures.concat(overlap.structures);
                });
                this._pdbFeatures.push(ftStructure);
            }
        });
    }

    _getStructuresHTML(structureList) {
        if(!structureList)
            return;

        let html = '';
        structureList.map(structure => {
            html += `
                <a href='${structure.source.url}' target='_blank'>
                    ${structure.source.id}
                </a> (${structure.start}-${structure.end}) | 
            `;
        });
        return html;
    }

    formatTooltip (feature) {
        const structuresHTML = this._getStructuresHTML(feature.structures);
        return `
            <table>
                ${structuresHTML ? `<tr><td>Structures</td><td>${structuresHTML}</td></tr>` : ``}
            </table>
        `;
    }
}
import groupBy from 'lodash-es/groupBy';
import UniProtEntryDataAdapter from 'uniprot-entry-data-adapter';

class ProtvistaVariationAdapter extends UniProtEntryDataAdapter {
    constructor() {
        super();
    }

    parseEntry(data) {
        const sequence = data.sequence;
        const variants = data.features;
        // ??? if (source && (source !== Constants.getUniProtSource())) {
        // _.each(variants, function(variant) {         delete variant.category;     });
        // } ??? if (!evidenceAlreadyGrouped) {     variants =
        // groupEvidencesByCode(variants); }

        if (!sequence) return;

        const mutationArray = [];
        // ??? mutationArray.push({     'type': 'VARIANT',     'normal': 'del', 'pos':
        // 0,     'variants': [] });

        const seq = sequence.split('');
        for (let i in seq) {
            mutationArray.push({
                type: 'VARIANT',
                normal: seq[i],
                pos: i + 1,
                variants: []
            });
        }
        // ??? mutationArray.push({     'type': 'VARIANT',     'normal': 'del', 'pos':
        // seq.length + 1,     'variants': [] });

        for (let variant of variants) {
            variant.start = +variant.begin;
            variant.end = variant.end ? +variant.end : variant.begin; // single position
            variant.wildType = variant.wildType
                ? variant.wildType
                : sequence.substring(variant.begin, variant.end + 1);
            variant.xrefNames = variant.xrefs
                ? this.getSourceType(variant.xrefs, variant.sourceType)
                : [];

            //expected by tooltip
            variant.feature = {
                type: variant.type,
                tooltipContent: this.formatTooltip(variant)
            };
            variant.sourceType = variant.sourceType
                ? variant.sourceType.toLowerCase()
                : variant.sourceType;
            // if ((1 <= variant.begin) && (variant.begin <= seq.length)) {
            // mutationArray[variant.begin].variants.push(setVariantData(source, variant));
            // } else if ((seq.length + 1) === d.begin) {
            mutationArray[variant.begin - 1].variants.push(variant);
            // } if (variant.consequence) { Constants.addConsequenceType(d.consequence); }
        }
        this._adaptedData = mutationArray;
        return this._adaptedData;
    }

    getSourceType(xrefs, sourceType) {
        const xrefNames = xrefs.map(ref => ref.name);
        if (sourceType === 'uniprot' || sourceType === 'mixed') {
            xrefNames.push('uniprot');
        }
        return xrefNames;
    }

    formatTooltip(variant) {
        // Need to inherit from protvista-feature-adapter
        // const evidenceHTML = ParserHelper.getEvidenceFromCodes(feature.evidences);
        const evidenceHTML = '';
        if (variant.description)
            variant.descriptionArray = this.getDescriptionsAsArray(variant.description);
        return `
            <table>
                <tr><td>Variant</td><td>${variant.wildType} > ${
            variant.alternativeSequence
        }</td></tr>
                ${
                    variant.frequency
                        ? `<tr><td>Frequency (MAF)</td><td>${variant.frequency}</td></tr>`
                        : ``
                }
                ${
                    variant.siftScore
                        ? `<tr><td>SIFT</td><td>${variant.siftPrediction} ${
                              variant.siftScore
                          }</td></tr>`
                        : ``
                }
                ${
                    variant.polyphenScore
                        ? `<tr><td>Polyphen</td><td>${variant.polyphenPrediction} ${
                              variant.polyphenScore
                          }</td></tr>`
                        : ``
                }
                ${
                    variant.consequenceType
                        ? `<tr><td>Consequence</td><td>${variant.consequenceType}</td></tr>`
                        : ``
                }            
                ${
                    variant.somaticStatus
                        ? `<tr><td>Somatic</td><td>${
                              variant.somaticStatus === 0 ? 'No' : 'Yes'
                          }</td></tr>`
                        : ``
                }            
                ${
                    variant.genomicLocation
                        ? `<tr><td>Location</td><td>${variant.genomicLocation}</td></tr>`
                        : ``
                }            
                ${
                    variant.sourceType === 'UniProt' || variant.sourceType === 'mixed'
                        ? this.getUniProtHTML(variant)
                        : ''
                }
                ${
                    variant.sourceType === 'large_scale_study' || variant.sourceType === 'mixed'
                        ? this.getLSSHTML(variant)
                        : ''
                }
            </table>
        `;
    }

    getUniProtHTML(variant) {
        return `<tr><td colspan="2"><h4>UniProt</h4></td></tr>
        ${
            variant.descriptionArray && variant.descriptionArray.UP
                ? `<tr><td>Description</td><td>${variant.descriptionArray.UP.join('; ')}</td></tr>`
                : ``
        }
        ${variant.ftId ? `<tr><td>Feature ID</td><td>${variant.ftId}</td></tr>` : ``}
        ${
            variant.association
                ? `<tr><td colspan="2"><h5>Disease association</h5></td></tr>
            ${this.getDiseaseAssociations(variant.association)}`
                : ''
        }
        `;
    }

    getLSSHTML(variant) {
        return `<tr><td colspan="2"><h4>Large scale studies</h4></td></tr>
        ${
            variant.descriptionArray && variant.descriptionArray.LSS
                ? `<tr><td>Description</td><td>${variant.descriptionArray.LSS}</td></tr>`
                : ``
        }
        ${variant.frequency ? `<tr><td>Frequency (MAF)</td><td>${variant.frequency}</td></tr>` : ``}
        <tr><td>Cross-references</td><td>${this.getXrefs(variant.xrefs)}</td></tr>
        `;
    }

    getXrefs(xrefs) {
        return xrefs.map(d => `<a href="${d.url}">${d.id}</a> (${d.name})`).join('<br>');
    }

    getDiseaseAssociations(associations) {
        return associations.map(
            association => `
            <tr><td>Disease</td><td>${association.name}</td></tr>
            ${
                association.xrefs
                    ? `<tr><td>Cross-references</td><td>${this.getXrefs(
                          association.xrefs
                      )}</td></tr>`
                    : ''
            }
            ${this.getEvidenceFromCodes(association.evidences)}
        `
        );
    }

    //TODO this should be inherited from ParserHelper
    getEvidenceFromCodes(evidences) {
        return evidences && evidences.map(
            evidence => `
            <tr><td>Evidence</td><td>${evidence.code}</td></tr>
            <tr><td>Source</td><td><a href="${evidence.source.url}">${evidence.source.id}</a> (${
                evidence.source.name
            })</td></tr>
        `
        );
    }

    //TODO this is horrible. Jie is looking into changing the API so Xrefs
    //have a description attribute, so we won't have to use concat.
    getDescriptionsAsArray(description) {
        var descriptionArray = description.split(/\[LSS_|\[SWP]: /g);
        descriptionArray = groupBy(descriptionArray, function(desc) {
            return desc.length === 0 ? 'NOTHING' : desc.indexOf(']: ') !== -1 ? 'LSS' : 'UP';
        });
        // descriptionArray.UP = descriptionArray.UP ? descriptionArray.UP.join('; ') : undefined;
        descriptionArray.LSS = descriptionArray.LSS
            ? descriptionArray.LSS.join('; ').replace(/]: /g, ': ')
            : undefined;
        return descriptionArray;
        // if (Evidence.existAssociation(data.association)) {
        //     _.each(data.association, function(association) {
        //         if (association.description) {
        //             var index = association.description.indexOf('Ftid: ');
        //             if (index !== -1) {
        //                 data.ftId = association.description.substr(index + 6, 10);
        //                 association.description = (association.description.slice(0, index) +
        //                     association.description.slice(index + 16)).trim();
        //             }
        //         }
        //     });
        // }
    }
}

export default ProtvistaVariationAdapter;

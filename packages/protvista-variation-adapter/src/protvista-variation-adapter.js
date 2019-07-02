import groupBy from "lodash-es/groupBy";
import flatten from "lodash-es/flatten";
import uniqBy from "lodash-es/uniqBy";
import forOwn from "lodash-es/forOwn";
import intersectionBy from "lodash-es/intersectionBy";

import ProtvistaFeatureAdapter, {
  BasicHelper
} from "protvista-feature-adapter";
import filters, { getFilter, getColor } from "./filters";

const filterVariants = (filterName, variants) =>
  getFilter(filterName).applyFilter(variants);

const _union = (variants, filterNames, key) => {
  return uniqBy(
    flatten(
      filterNames
        .map(name => name.split(":")[1])
        .map(name => filterVariants(name, variants))
    ),
    v => v[key]
  );
};

export default class ProtvistaVariationAdapter extends ProtvistaFeatureAdapter {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["activefilters"];
  }

  get isManaged() {
    return true;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name !== "activefilters") {
        return;
      }
      const { sequence, variants } = this._adaptedData;
      newValue = newValue.trim();
      if (!newValue) {
        this._fireEvent("load", { payload: { sequence, variants } });
        return;
      }
      const filterNames = newValue.split(",");
      const groupByFilterCategory = groupBy(filterNames, name => {
        return name.split(":")[0];
      });

      let filteredVariants = [];
      forOwn(groupByFilterCategory, filterNames => {
        const filteredValuesByCategory = _union(
          variants,
          filterNames,
          "accession"
        );
        filteredVariants.push(filteredValuesByCategory);
      });
      filteredVariants = flatten(
        intersectionBy(...filteredVariants, variant => variant.accession)
      );

      filteredVariants = uniqBy(filteredVariants, "accession");
      this._fireEvent("load", {
        payload: { sequence, variants: filteredVariants }
      });
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._fireEvent("change", {
      type: "filters",
      value: JSON.stringify(filters)
    });
  }

  parseEntry(data) {
    const { sequence, features } = data;
    if (!sequence) return;

    const variants = features.map(variant => {
      return {
        type: "Variant",
        accession: variant.genomicLocation,
        variant: variant.alternativeSequence,
        start: variant.begin,
        end: variant.end,
        tooltipContent: this.formatTooltip(variant),
        color: getColor(variant),
        association: variant.association,
        sourceType: variant.sourceType,
        xrefNames: this.getSourceType(variant.xrefs, variant.sourceType),
        clinicalSignificances: variant.clinicalSignificances,
        polyphenScore: variant.polyphenScore,
        siftScore: variant.siftScore
      };
    });

    this._adaptedData = { sequence, variants };
  }

  getSourceType(xrefs, sourceType) {
    const xrefNames = xrefs.map(ref => ref.name);
    if (sourceType === "uniprot" || sourceType === "mixed") {
      xrefNames.push("uniprot");
    }
    return xrefNames;
  }

  formatTooltip(variant) {
    const evidenceHTML = "";
    if (variant.description)
      variant.descriptionArray = this.getDescriptionsAsArray(
        variant.description
      );
    return `
                <h5>Variant</h5><p>${variant.wildType} > ${
      variant.alternativeSequence
    }</p>
                ${
                  variant.frequency
                    ? `<h5>Frequency (MAF)</h5><p>${variant.frequency}</p>`
                    : ``
                }
                ${
                  variant.siftScore
                    ? `<h5>SIFT</h5><p>${variant.siftPrediction} ${
                        variant.siftScore
                      }</p>`
                    : ``
                }
                ${
                  variant.polyphenScore
                    ? `<h5>Polyphen</h5><p>${variant.polyphenPrediction} ${
                        variant.polyphenScore
                      }</p>`
                    : ``
                }
                ${
                  variant.consequenceType
                    ? `<h5>Consequence</h5><p>${variant.consequenceType}</p>`
                    : ``
                }
                ${
                  variant.somaticStatus
                    ? `<h5>Somatic</h5><p>${
                        variant.somaticStatus === 0 ? "No" : "Yes"
                      }</p>`
                    : ``
                }
                ${
                  variant.genomicLocation
                    ? `<h5>Location</h5><p>${variant.genomicLocation}</p>`
                    : ``
                }
                ${
                  variant.sourceType === "UniProt" ||
                  variant.sourceType === "mixed"
                    ? `<hr/>${this.getUniProtHTML(variant)}`
                    : ""
                }
                ${
                  variant.sourceType === "large_scale_study" ||
                  variant.sourceType === "mixed"
                    ? `<hr/>${this.getLSSHTML(variant)}`
                    : ""
                }
        `;
  }

  getUniProtHTML(variant) {
    return `<h4>UniProt</h4>
        ${
          variant.descriptionArray && variant.descriptionArray.UP
            ? `<h5>Description</h5><p>${variant.descriptionArray.UP.join(
                "; "
              )}</p>`
            : ``
        }
        ${variant.ftId ? `<h5>Feature ID</h5><p>${variant.ftId}</p>` : ``}
        ${
          variant.association
            ? this.getDiseaseAssociations(variant.association)
            : ""
        }
        `;
  }

  getLSSHTML(variant) {
    return `<h4>Large scale studies</h4>
        ${
          variant.descriptionArray && variant.descriptionArray.LSS
            ? `<h5>Description</h5><p>${variant.descriptionArray.LSS}</p>`
            : ``
        }
        ${
          variant.frequency
            ? `<h5>Frequency (MAF)</h5><p>${variant.frequency}</p>`
            : ``
        }
        <h5>Cross-references</h5>${this._basicHelper.formatXrefs(variant.xrefs)}
        `;
  }

  getDiseaseAssociations(associations) {
    return associations
      .map(
        association => `
            <h4>Disease association</h4><p>${association.name}</p>
            ${
              association.xrefs
                ? `<h5>Cross-references</h5>${this._basicHelper.formatXrefs(
                    association.xrefs
                  )}`
                : ""
            }
            ${this._basicHelper.getEvidenceFromCodes(association.evidences)}
        `
      )
      .join("");
  }

  _fireEvent(name, detail) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail: detail,
        bubbles: true,
        cancelable: true
      })
    );
  }

  //TODO this is horrible. Jie is looking into changing the API so Xrefs
  //have a description attribute, so we won't have to use concat.
  getDescriptionsAsArray(description) {
    var descriptionArray = description.split(/\[LSS_|\[SWP]: /g);
    descriptionArray = groupBy(descriptionArray, function(desc) {
      return desc.length === 0
        ? "NOTHING"
        : desc.indexOf("]: ") !== -1
        ? "LSS"
        : "UP";
    });
    descriptionArray.LSS = descriptionArray.LSS
      ? descriptionArray.LSS.join("; ").replace(/]: /g, ": ")
      : undefined;
    return descriptionArray;
  }
}

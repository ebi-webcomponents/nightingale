import ProtvistaFeatureAdapter from "protvista-feature-adapter";
import groupBy from "lodash-es/groupBy";
import flatten from "lodash-es/flatten";
import uniqBy from "lodash-es/uniqBy";
import forOwn from "lodash-es/forOwn";
import intersectionBy from "lodash-es/intersectionBy";

import filterData, { getFilter, getColor } from "./filters";
import formatTooltip from "./tooltipGenerators";

// throw new Error(JSON.stringify(Object.entries(ProtvistaFeatureAdapter)));

const getSourceType = (xrefs, sourceType) => {
  const xrefNames = xrefs.map(ref => ref.name);
  if (sourceType === "uniprot" || sourceType === "mixed") {
    xrefNames.push("uniprot");
  }
  return xrefNames;
};

export const transformData = data => {
  const { sequence, features } = data;
  const variants = features.map(variant => ({
    type: "Variant",
    accession: variant.genomicLocation,
    variant: variant.alternativeSequence,
    start: variant.begin,
    end: variant.end,
    tooltipContent: formatTooltip(variant),
    color: getColor(variant),
    association: variant.association,
    sourceType: variant.sourceType,
    xrefNames: getSourceType(variant.xrefs, variant.sourceType),
    clinicalSignificances: variant.clinicalSignificances,
    polyphenScore: variant.polyphenScore,
    siftScore: variant.siftScore
  }));
  if (!variants) return null;
  return { sequence, variants };
};

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

class ProtvistaVariationAdapter extends ProtvistaFeatureAdapter {
  static get observedAttributes() {
    return ["activefilters"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name !== "activefilters") {
        return;
      }
      const { sequence, variants } = this._adaptedData;
      // eslint-disable-next-line no-param-reassign
      newValue = newValue.trim();
      if (!newValue) {
        this._fireEvent("load", { payload: { sequence, variants } });
        return;
      }
      const filterNames = newValue.split(",");
      const groupByFilterCategory = groupBy(filterNames, groupFilterName => {
        return groupFilterName.split(":")[0];
      });

      let filteredVariants = [];
      forOwn(groupByFilterCategory, groupFilterNames => {
        const filteredValuesByCategory = _union(
          variants,
          groupFilterNames,
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
    if (this.closest("protvista-manager")) {
      this.manager = this.closest("protvista-manager");
      this.manager.register(this);
    }
    this._fireEvent("change", {
      type: "filters",
      value: JSON.stringify(filterData)
    });
  }

  disconnectedCallback() {
    if (this.manager) {
      this.manager.unregister(this);
    }
  }

  parseEntry(data) {
    this._adaptedData = transformData(data);
  }

  _fireEvent(name, detail) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail,
        bubbles: true,
        cancelable: true
      })
    );
  }
}

export default ProtvistaVariationAdapter;

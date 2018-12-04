import {
  scaleLinear
} from "d3-scale";

const UPDiseaseColor = "#990000",
  UPNonDiseaseColor = "#99cc00",
  deleteriousColor = "#002594",
  benignColor = "#8FE3FF",
  othersColor = "#FFCC00";

const predictionScale = scaleLinear()
  .domain([0, 1])
  .range([deleteriousColor, benignColor]);

class VariantColour {
  static getColour(variant) {
    if (variant.alternativeSequence === '*') {
      return othersColor;
    } else if (variant.sourceType === 'uniprot' || variant.sourceType === 'mixed') {
      //|| variant.begin > fv.maxPos
      if (variant.association && variant.association.length > 0) {
        return UPDiseaseColor;
      } else {
        return UPNonDiseaseColor;
      }
    } else if (variant.polyphenScore || variant.siftScore) {
      return this.getPredictionColour(variant.polyphenScore, variant.siftScore);
    }
  }

  static getPredictionColour(polyphenScore, siftScore) {
    return predictionScale(
      (siftScore ? siftScore : 0 + (1 - polyphenScore ? polyphenScore : 1)) /
      (polyphenScore && siftScore ? 2 : 1)
    );
  }
}

export default VariantColour;

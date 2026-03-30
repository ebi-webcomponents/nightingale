import { aaList, VariationDatum } from "./nightingale-variation";

export type ProteinsAPIVariation = {
  accession: string;
  entryName: string;
  proteinName: string;
  geneName: string;
  organismName: string;
  proteinExistence: string;
  sequence: string;
  sequenceChecksum: string;
  sequenceVersion: number;
  taxid: number;
  features: Variant[];
};

export type Variant = {
  type: string;
  // Note: one of the 2 following fields will be deprecated - don't know yet
  alternativeSequence?: AminoAcid;
  mutatedType?: AminoAcid;
  begin: string; // representing a number
  end: string; // representing a number
  xrefs: Xref[];
  cytogeneticBand?: string;
  genomicLocation?: string[];
  locations: Location[];
  codon?: string;
  consequenceType: ConsequenceType;
  wildType: AminoAcid;
  predictions?: Prediction[];
  somaticStatus: number;
  sourceType: SourceType;
  descriptions?: Description[];
  clinicalSignificances?: ClinicalSignificance[];
  association?: Association[];
  populationFrequencies?: PopulationFrequency[];
  evidences?: Evidence[];
  ftId?: string;
};

export type AminoAcid =
  | "A"
  | "C"
  | "D"
  | "E"
  | "*" // Empty
  | "F"
  | "G"
  | "H"
  | "I"
  | "K"
  | "L"
  | "M"
  | "N"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "V"
  | "W"
  | "Y"
  // above a bit useless, as we have some variants that have more than one AA
  | string;

export type Association = {
  name: string;
  dbReferences?: Xref[];
  evidences: Evidence[];
  disease: boolean;
  description?: string;
  clinicalSignificances?: ClinicalSignificance[];
};

export type Xref = {
  name: string;
  id: string;
  url?: string;
  alternativeUrl?: string;
};

/*
 * This has been imported from the backend enums but
 * might be best kept as a string...
 */
export type Source =
  | "ClinVar"
  | "ESP"
  | "ExAC"
  | "1000Genomes"
  | "BovineSNP50"
  | "BovineLD"
  | "BovineHD"
  | "EquineSNP50"
  | "Chicken600K"
  | "1kg_hq"
  | "cosmic curated"
  | "reviewed"
  | "UniProt"
  | "dbSNP"
  | "Ensembl"
  | "EnsemblPlants"
  | "VectorBase"
  | "RefSeq"
  | "dbGaP"
  | "DDD"
  | "PharmGKB"
  | "EnsemblFungi"
  | "EnsemblMetazoa"
  | "gnomAD_v2.0"
  | "gnomAD_v3.0"
  | "NCI-TCGA"
  | "NCI-TCGA Cosmic"
  | "ddG2P"
  | "TOPMed"
  | "gnomAD"
  | "pharmgkb"
  | "SGRP"
  | "SGD"
  | "Jeffares_SNPs"
  | "Jeffares_Indels"
  | "EnsemblViruses";

export type Evidence = {
  code: string;
  source: Xref;
};

export type ClinicalSignificance = {
  type: ClinicalSignificanceType;
  sources: Source[];
  reviewStatus?: string;
};

export type ClinicalSignificanceType =
  | "Benign"
  | "Disease"
  | "Likely benign"
  | "Likely pathogenic"
  | "Pathogenic"
  | "Protective"
  | "Variant of uncertain significance"
  | "Conflicting interpretations of pathogenicity";

export type ConsequenceType =
  | "-"
  | "frameshift"
  | "inframe deletion"
  | "insertion"
  | "missense"
  | "stop gained"
  | "stop lost";

export type Description = {
  value: string;
  sources: Source[];
};

export type Location = {
  loc: string;
  seqId: string;
  source: Source;
};

export type PopulationFrequency = {
  populationName: string;
  frequency: number;
  source: Source;
};

export type Prediction = {
  predictionValType: PredictionValType;
  predictorType: string;
  score: number;
  predAlgorithmNameType: PredAlgorithmNameType;
  sources: Source[];
  version?: string;
};

export type PredAlgorithmNameType = "PolyPhen" | "SIFT";

export type PredictionValType =
  | "benign"
  | "deleterious"
  | "deleterious - low confidence"
  | "possibly damaging"
  | "probably damaging"
  | "tolerated"
  | "tolerated - low confidence"
  | "unknown";

export type SourceType = "large_scale_study" | "mixed" | "uniprot";

// const getSourceType = (xrefs: Xref[], sourceType: SourceType) => {
//   const xrefNames = xrefs ? xrefs.map((ref) => ref.name) : [];
//   if (sourceType === "uniprot" || sourceType === "mixed") {
//     xrefNames.push("uniprot");
//   }
//   return xrefNames;
// };

export const transformData = (
  data: ProteinsAPIVariation
): {
  sequence: string;
  variants: VariationDatum[];
  aaPresence: Set<string>;
} | null => {
  const { sequence, features } = data;
  const aaNotPresent = new Set(aaList);
  const variants = features.map((originalData) => {
    const mutatedType =
      // One will be deprecated at some point, but we don't know which
      // If no alternative sequence: deletion, put lowercase "d"
      originalData.alternativeSequence || originalData.mutatedType || "d";

    aaNotPresent.delete(mutatedType);

    const transformedData = {
      position: +originalData.begin,
      mutatedType,
      wildType: originalData.wildType,
    };

    return {
      originalData,
      transformedData: {
        ...transformedData,
        internalID: `var_${transformedData.wildType}${transformedData.position}${transformedData.mutatedType}`,
      },
      // ...variant,
      // accession:
      //   (variant.genomicLocation || []).length !== 0
      //     ? (variant.genomicLocation || [])[0]
      //     : String(Math.random()),
      // variant: variant.alternativeSequence
      //   ? variant.alternativeSequence
      //   : "*", // Empty
      // start: Number(variant.begin),
      // xrefNames: getSourceType(variant.xrefs, variant.sourceType),
      // hasPredictions: variant.predictions
      //   ? variant.predictions.length > 0
      //   : false,
      // consequenceType: variant.consequenceType,
    } satisfies VariationDatum;
  });

  console.log(variants);

  if (!variants) {
    return null;
  }

  const aaPresence = new Set(
    Array.from(aaList).filter((aa) => !aaNotPresent.has(aa))
  );

  return { sequence, variants, aaPresence };
};

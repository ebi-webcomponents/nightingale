import { VariationDatum } from "./nightingale-variation";

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
  begin: string;
  end: string;
  xrefs: Xref[];
  cytogeneticBand: string;
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

export enum AminoAcid {
  A = "A",
  C = "C",
  D = "D",
  E = "E",
  Empty = "*",
  F = "F",
  G = "G",
  H = "H",
  I = "I",
  K = "K",
  L = "L",
  M = "M",
  N = "N",
  Nl = "NL",
  P = "P",
  Q = "Q",
  R = "R",
  S = "S",
  T = "T",
  V = "V",
  W = "W",
  Y = "Y",
}

export type Association = {
  name: string;
  dbReferences?: Xref[];
  evidences: Evidence[];
  disease: boolean;
  description?: string;
};

export type Xref = {
  name: string;
  id: string;
  url: string;
  alternativeUrl?: string;
};

/*
 * This has been imported from the backend enums but
 * might be best kept as a string...
 */
export enum Source {
  CLINVAR = "ClinVar",
  ESP = "ESP",
  EXAC = "ExAC",
  GENOMES1K = "1000Genomes",
  BOVINE_SNP50 = "BovineSNP50",
  BOVINE_LD = "BovineLD",
  BOVINE_HD = "BovineHD",
  EQUINE_SNP50 = "EquineSNP50",
  CHICKEN_600K = "Chicken600K",
  KG_HQ = "1kg_hq",
  COSMIC = "cosmic curated",
  REVIEWED = "reviewed",
  UNIPROT = "UniProt",
  DBSNP = "dbSNP",
  ENSEMBL = "Ensembl",
  ENSEMBL_PLANTS = "EnsemblPlants",
  VECTORBASE = "VectorBase",
  REFSEQ = "RefSeq",
  DBGAP = "dbGaP",
  DDD = "DDD",
  PHARMCOGKB = "PharmGKB",
  ENSEMBL_FUNGI = "EnsemblFungi",
  ENSEMBL_METAZOA = "EnsemblMetazoa",
  GNOMAD_V2 = "gnomAD_v2.0",
  GNOMAD_V3 = "gnomAD_v3.0",
  TCGA = "NCI-TCGA",
  TCGA_COSMIC = "NCI-TCGA Cosmic",
  DECIPHER = "ddG2P",
  TOPMED = "TOPMed",
  GNOMAD = "gnomAD",
  PHARMGKB = "pharmgkb",
  SGRP = "SGRP",
  SGD = "SGD",
  JEFFARES_SNPS = "Jeffares_SNPs",
  JEFFARES_INDELS = "Jeffares_Indels",
  ENSEMBL_VIRUSES = "EnsemblViruses",
}

export type Evidence = {
  code: string;
  source: Xref;
};

export type ClinicalSignificance = {
  type: ClinicalSignificanceType;
  sources: Source[];
};

export enum ClinicalSignificanceType {
  Benign = "Benign",
  Disease = "Disease",
  LikelyBenign = "Likely benign",
  LikelyPathogenic = "Likely pathogenic",
  Pathogenic = "Pathogenic",
  Protective = "Protective",
  VariantOfUncertainSignificance = "Variant of uncertain significance",
}

export enum ConsequenceType {
  Empty = "-",
  Frameshift = "frameshift",
  InframeDeletion = "inframe deletion",
  Insertion = "insertion",
  Missense = "missense",
  StopGained = "stop gained",
}

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

export enum PredAlgorithmNameType {
  PolyPhen = "PolyPhen",
  Sift = "SIFT",
}

export enum PredictionValType {
  Benign = "benign",
  Deleterious = "deleterious",
  DeleteriousLowConfidence = "deleterious - low confidence",
  PossiblyDamaging = "possibly damaging",
  ProbablyDamaging = "probably damaging",
  Tolerated = "tolerated",
  ToleratedLowConfidence = "tolerated - low confidence",
  Unknown = "unknown",
}

export enum SourceType {
  LargeScaleStudy = "large_scale_study",
  Mixed = "mixed",
  UniProt = "uniprot",
}

const getSourceType = (xrefs: Xref[], sourceType: SourceType) => {
  const xrefNames = xrefs ? xrefs.map((ref) => ref.name) : [];
  if (sourceType === "uniprot" || sourceType === "mixed") {
    xrefNames.push("uniprot");
  }
  return xrefNames;
};

export const transformData = (
  data: ProteinsAPIVariation
): {
  sequence: string;
  variants: VariationDatum[];
} | null => {
  const { sequence, features } = data;
  const variants = features.map(
    (variant) =>
      ({
        ...variant,
        accession:
          (variant.genomicLocation || []).length !== 0
            ? (variant.genomicLocation || [])[0]
            : String(Math.random()),
        variant: variant.alternativeSequence
          ? variant.alternativeSequence
          : AminoAcid.Empty,
        start: Number(variant.begin),
        xrefNames: getSourceType(variant.xrefs, variant.sourceType),
        hasPredictions: variant.predictions && variant.predictions.length > 0,
        //   tooltipContent: formatTooltip(variant),
        consequenceType: variant.consequenceType,
      }) as VariationDatum
  );
  if (!variants) return null;
  return { sequence, variants };
};

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
  features: Feature[];
};

export type Feature = {
  type: FeatureType;
  alternativeSequence?: AminoAcid;
  begin: string;
  end: string;
  xrefs: Xref[];
  cytogeneticBand: CytogeneticBand;
  genomicLocation: string;
  locations: Location[];
  codon?: string;
  consequenceType: ConsequenceType;
  wildType: AminoAcid;
  mutatedType?: AminoAcid;
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
  name: Source;
  id: string;
  url: string;
  alternativeUrl?: string;
};

export enum Source {
  ClinVar = "ClinVar",
  Cosmic = "Cosmic",
  CosmicCurated = "cosmic curated",
  CosmicStudy = "cosmic_study",
  DBSNP = "dbSNP",
  Ensembl = "Ensembl",
  Esp = "ESP",
  ExAC = "ExAC",
  GnomAD = "gnomAD",
  Mim = "MIM",
  NCITCGACosmic = "NCI-TCGA Cosmic",
  NciTcga = "NCI-TCGA",
  Pubmed = "pubmed",
  TOPMed = "TOPMed",
  The1000Genomes = "1000Genomes",
  UniProt = "UniProt",
}

export type Evidence = {
  code: Code;
  source: Xref;
};

export enum Code {
  Eco0000269 = "ECO:0000269",
  Eco0000313 = "ECO:0000313",
}

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

export enum CytogeneticBand {
  The21Q213 = "21q21.3",
}

export type Description = {
  value: string;
  sources: Source[];
};

export type Location = {
  loc: string;
  seqId: SeqID;
  source: Source;
};

export enum SeqID {
  Enst00000346798 = "ENST00000346798",
}

export type PopulationFrequency = {
  populationName: PopulationName;
  frequency: number;
  source: Source;
};

export enum PopulationName {
  Maf = "MAF",
}

export type Prediction = {
  predictionValType: PredictionValType;
  predictorType: PredictorType;
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

export enum PredictorType {
  MultiCoding = "multi coding",
}

export enum SourceType {
  LargeScaleStudy = "large_scale_study",
  Mixed = "mixed",
}

export enum FeatureType {
  Variant = "VARIANT",
}

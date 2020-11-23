/* eslint-disable camelcase */
export interface VCFData {
  input: string;
  colocated_variants?: ColocatedVariant[];
  assembly_name: string;
  end: number;
  seq_region_name: string;
  transcript_consequences: TranscriptConsequence[];
  strand: number;
  id: string;
  most_severe_consequence: string;
  allele_string: string;
  start: number;
}

export interface ColocatedVariant {
  seq_region_name: string;
  strand: number;
  id: string;
  allele_string: string;
  frequencies?: Frequencies;
  end: number;
  start: number;
  phenotype_or_disease?: number;
  clin_sig_allele?: string;
  minor_allele_freq?: number;
  clin_sig?: string[];
  minor_allele?: string;
  pubmed?: number[];
  somatic?: number;
}

export interface Frequencies {
  [key: string]: Gnomad;
}

export interface Gnomad {
  gnomad_afr: number;
  gnomad_sas: number;
  gnomad_fin: number;
  gnomad_amr: number;
  gnomad: number;
  gnomad_oth: number;
  gnomad_asj: number;
  gnomad_eas: number;
  gnomad_nfe: number;
}

export interface TranscriptConsequence {
  gene_id: string;
  canonical?: number;
  variant_allele: string;
  protein_id?: string;
  mane?: string;
  swissprot?: string[];
  gene_symbol_source: string;
  hgvsc?: string;
  consequence_terms: string[];
  hgnc_id: string;
  strand: number;
  gene_symbol: string;
  transcript_id: string;
  impact: Impact;
  flags?: string[];
  trembl?: string[];
  hgvsp?: string;
  cdna_end?: number;
  codons?: string;
  protein_end?: number;
  amino_acids?: string;
  cdna_start?: number;
  cds_start?: number;
  protein_start?: number;
  cds_end?: number;
  distance?: number;
  uniparc?: string[];
}

export enum Impact {
  High = "HIGH",
  Moderate = "MODERATE",
  Modifier = "MODIFIER",
}

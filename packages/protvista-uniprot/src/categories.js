export const categories = [
  {
    name: "DOMAINS_AND_SITES",
    label: "Domains & sites",
    trackType: "protvista-track",
    adapter: "protvista-feature-adapter",
    url: "https://www.ebi.ac.uk/proteins/api/features/",
    tracks: [
      {
        name: "domain",
        label: "Domain",
        filter: "DOMAIN",
        trackType: "protvista-track",
        tooltip:
          "Specific combination of secondary structures organized into a characteristic three-dimensional structure or fold"
      },
      {
        name: "region",
        label: "Region",
        filter: "REGION",
        trackType: "protvista-track",
        tooltip:
          "Regions in multifunctional enzymes or fusion proteins, or characteristics of a region, e.g., protein-protein interactions mediation"
      },
      {
        name: "motif",
        label: "Motif",
        filter: "MOTIF",
        trackType: "protvista-track",
        tooltip: "Short conserved sequence motif of biological significance"
      },
      {
        name: "metal",
        label: "Metal binding",
        filter: "METAL",
        trackType: "protvista-track",
        tooltip: "Binding site for a metal ion"
      },
      {
        name: "site",
        label: "Site",
        filter: "SITE",
        trackType: "protvista-track",
        tooltip: "Any interesting single amino acid site on the sequence"
      },
      {
        name: "repeat",
        label: "Repeat",
        filter: "REPEAT",
        trackType: "protvista-track",
        tooltip:
          "Repeated sequence motifs or repeated domains within the protein"
      },
      {
        name: "ca_bind",
        label: "Calcium binding",
        filter: "CA_BIND",
        trackType: "protvista-track",
        tooltip: "Calcium-binding regions, such as the EF-hand motif"
      },
      {
        name: "dna_bind",
        label: "DNA binding",
        filter: "DNA_BIND",
        trackType: "protvista-track",
        tooltip:
          "DNA-binding domains such as AP2/ERF domain, the ETS domain, the Fork-Head domain, the HMG box and the Myb domain"
      },
      {
        name: "zn_fing",
        label: "Zinc finger",
        filter: "ZN_FING",
        trackType: "protvista-track",
        tooltip:
          "Small, functional, independently folded domain that coordinates one or more zinc ions"
      },
      {
        name: "np_bind",
        label: "Nucleotide binding",
        filter: "NP_BIND",
        trackType: "protvista-track",
        tooltip:
          "(aka flavin-binding). Region in the protein which binds nucleotide phosphates"
      },
      {
        name: "binding",
        label: "Binding site",
        filter: "BINDIND",
        trackType: "protvista-track",
        tooltip:
          "Binding site for any chemical group (co-enzyme, prosthetic group, etc.)"
      },
      {
        name: "act_site",
        label: "Active site",
        filter: "ACT_SITE",
        trackType: "protvista-track",
        tooltip: "Amino acid(s) directly involved in the activity of an enzyme"
      }
    ]
  },
  {
    name: "MOLECULE_PROCESSING",
    label: "Molecule processing",
    trackType: "protvista-track",
    adapter: "protvista-feature-adapter",
    url: "https://www.ebi.ac.uk/proteins/api/features/",
    tracks: [
      {
        name: "signal",
        label: "Signal peptide",
        filter: "SIGNAL",
        trackType: "protvista-track",
        tooltip: "N-terminal signal peptide"
      },
      {
        name: "chain",
        label: "Chain",
        filter: "CHAIN",
        trackType: "protvista-track",
        tooltip:
          "(aka mature region). This describes the extent of a polypeptide chain in the mature protein following processing"
      },
      {
        name: "transit",
        label: "Transit peptide",
        filter: "TRANSIT",
        trackType: "protvista-track",
        tooltip: "This describes the extent of a transit peptide"
      },
      {
        name: "init_met",
        label: "Initiator methionine",
        filter: "INIT_MET",
        trackType: "protvista-track",
        tooltip:
          "This indicates that the initiator methionine is cleaved from the mature protein"
      },
      {
        name: "propep",
        label: "Propeptide",
        filter: "PROPEP",
        trackType: "protvista-track",
        tooltip:
          "Part of a protein that is cleaved during maturation or activation"
      },
      {
        name: "peptide",
        label: "Peptide",
        filter: "PEPTIDE",
        trackType: "protvista-track",
        tooltip:
          "The position and length of an active peptide in the mature protein"
      }
    ]
  },
  {
    name: "PTM",
    label: "PTM",
    trackType: "protvista-track",
    adapter: "protvista-feature-adapter",
    url: "https://www.ebi.ac.uk/proteins/api/features/",
    tracks: [
      {
        name: "mod_res",
        label: "Modified residue",
        filter: "MOD_RES",
        trackType: "protvista-track",
        tooltip:
          "Modified residues such as phosphorylation, acetylation, acylation, methylation"
      },
      {
        name: "carbohyd",
        label: "Glycosylation",
        filter: "CARBOHYD",
        trackType: "protvista-track",
        tooltip: "Covalently attached glycan group(s)"
      },
      {
        name: "disulfid",
        label: "Disulfide bond",
        filter: "DISULFID",
        trackType: "protvista-track",
        tooltip:
          "The positions of cysteine residues participating in disulphide bonds"
      },
      {
        name: "crosslnk",
        label: "Cross-link",
        filter: "CROSSLNK",
        trackType: "protvista-track",
        tooltip:
          "Covalent linkages of various types formed between two proteins or between two parts of the same protein"
      },
      {
        name: "lipid",
        label: "Lipidation",
        filter: "LIPID",
        trackType: "protvista-track",
        tooltip: "Covalently attached lipid group(s)"
      }
    ]
  },
  {
    name: "SEQUENCE_INFORMATION",
    label: "Sequence information",
    trackType: "protvista-track",
    adapter: "protvista-feature-adapter",
    url: "https://www.ebi.ac.uk/proteins/api/features/",
    tracks: [
      {
        name: "compbias",
        label: "Compositional bias",
        filter: "COMPBIAS",
        trackType: "protvista-track",
        tooltip:
          "Position of regions of compositional bias within the protein and the particular amino acids that are over-represented within those regions"
      },
      {
        name: "conflict",
        label: "Sequence conflict",
        filter: "CONFLICT",
        trackType: "protvista-track",
        tooltip: "Sequence discrepancies of unknown origin"
      },
      {
        name: "non_cons",
        filter: "NON_CONS",
        trackType: "protvista-track",
        label: "Non-adjacent residues",
        tooltip:
          "Indicates that two residues in a sequence are not consecutive and that there is an undetermined number of unsequenced residues between them"
      },
      {
        name: "non_ter",
        filter: "NON_TER",
        trackType: "protvista-track",
        label: "Non-terminal residue",
        tooltip:
          "The sequence is incomplete. The residue is not the terminal residue of the complete protein"
      },
      {
        name: "unsure",
        filter: "UNSURE",
        trackType: "protvista-track",
        label: "Sequence uncertainty",
        tooltip:
          "Regions of a sequence for which the authors are unsure about the sequence assignment"
      },
      {
        name: "non_std",
        filter: "NON_STD",
        trackType: "protvista-track",
        label: "Non-standard residue",
        tooltip: "Non-standard amino acids (selenocysteine and pyrrolysine)"
      }
    ]
  },
  {
    name: "STRUCTURAL",
    label: "Structural features",
    trackType: "protvista-track",
    adapter: "protvista-feature-adapter",
    url: "https://www.ebi.ac.uk/proteins/api/features/",
    tracks: [
      {
        name: "helix",
        label: "Helix",
        filter: "HELIX",
        trackType: "protvista-track",
        tooltip: "The positions of experimentally determined helical regions"
      },
      {
        name: "strand",
        label: "Beta strand",
        filter: "STRAND",
        trackType: "protvista-track",
        tooltip: "The positions of experimentally determined beta strands"
      },
      {
        name: "turn",
        label: "Turn",
        filter: "TURN",
        trackType: "protvista-track",
        tooltip:
          "The positions of experimentally determined hydrogen-bonded turns"
      },
      {
        name: "coiled",
        label: "Coiled coil",
        filter: "COILED",
        trackType: "protvista-track",
        tooltip:
          "Coiled coils are built by two or more alpha-helices that wind around each other to form a supercoil"
      }
    ]
  },
  {
    name: "STRUCTURE_COVERAGE",
    label: "PDBe 3D structure coverage",
    trackType: "protvista-track",
    adapter: "protvista-structure-adapter",
    url: "https://www.ebi.ac.uk/proteins/api/proteins/",
    tracks: [
      {
        name: "pdbe_cover",
        label: "PDBe coverage",
        trackType: "protvista-track",
        tooltip: "PDBe 3D structure coverage"
      }
    ]
  },
  {
    name: "TOPOLOGY",
    label: "Topology",
    trackType: "protvista-track",
    adapter: "protvista-feature-adapter",
    url: "https://www.ebi.ac.uk/proteins/api/features/",
    tracks: [
      {
        name: "topo_dom",
        label: "Topological domain",
        filter: "TOPO_DOM",
        trackType: "protvista-track",
        tooltip:
          "Location of non-membrane regions of membrane-spanning proteins"
      },
      {
        name: "transmem",
        label: "Transmembrane",
        filter: "TRANSMEM",
        trackType: "protvista-track",
        tooltip: "Extent of a membrane-spanning region"
      },
      {
        name: "intramem",
        label: "Intramembrane",
        filter: "INTRAMEM",
        trackType: "protvista-track",
        tooltip: "Extent of a region located in a membrane without crossing it"
      }
    ]
  },
  {
    name: "MUTAGENESIS",
    label: "Mutagenesis",
    trackType: "protvista-track",
    adapter: "protvista-feature-adapter",
    url: "https://www.ebi.ac.uk/proteins/api/features/",
    tracks: [
      {
        name: "mutagen",
        label: "Mutagenesis",
        filter: "MUTAGEN",
        trackType: "protvista-track",
        tooltip: "Site which has been experimentally altered by mutagenesis"
      }
    ]
  },
  {
    name: "PROTEOMICS",
    label: "Proteomics",
    trackType: "protvista-track",
    adapter: "protvista-proteomics-adapter",
    url: "https://www.ebi.ac.uk/proteins/api/proteomics/",
    tracks: [
      {
        name: "unique",
        label: "Unique peptide",
        filter: "unique",
        trackType: "protvista-track",
        tooltip: ""
      },
      {
        name: "non_unique",
        label: "Non-unique peptide",
        filter: "non_unique",
        trackType: "protvista-track",
        tooltip: ""
      }
    ]
  },
  {
    name: "ANTIGEN",
    label: "Antigenic sequences",
    trackType: "protvista-track",
    adapter: "protvista-feature-adapter",
    url: "https://www.ebi.ac.uk/proteins/api/antigen/",
    tracks: [
      {
        name: "antigen",
        label: "Antibody binding sequences",
        trackType: "protvista-track",
        tooltip: ""
      }
    ]
  },
  {
    name: "VARIATION",
    label: "Variants",
    adapter: "protvista-variation-adapter",
    trackType: "protvista-variation-graph",
    url: "https://www.ebi.ac.uk/proteins/api/variation/",
    tracks: [
      {
        name: "variation",
        labelComponent: "protvista-filter",
        trackType: "protvista-variation",
        tooltip:
          "Natural variant of the protein, including polymorphisms, variations between strains, isolates or cultivars, disease-associated mutations and RNA editing events"
      }
    ]
  }
];

export const config = {
  "chain": {
    "label": "Chain",
    "tooltip": "(aka mature region). This describes the extent of a polypeptide chain in the mature protein following processing",
    "shape": "rectangle",
    "color": "#CC9933"
  },
  "transit": {
    "label": "Transit peptide",
    "tooltip": "This describes the extent of a transit peptide",
    "shape": "rectangle",
    "color": "#009966"
  },
  "init_met": {
    "label": "Initiator methionine",
    "tooltip": "This indicates that the initiator methionine is cleaved from the mature protein",
    "shape": "arrow",
    "color": "#996633"
  },
  "propep": {
    "label": "Propeptide",
    "tooltip": "Part of a protein that is cleaved during maturation or activation",
    "shape": "rectangle",
    "color": "#99CCCC"
  },
  "peptide": {
    "label": "Peptide",
    "tooltip": "The position and length of an active peptide in the mature protein",
    "shape": "rectangle",
    "color": "#006699"
  },
  "signal": {
    "label": "Signal peptide",
    "tooltip": "N-terminal signal peptide",
    "shape": "rectangle",
    "color": "#CC0033"
  },
  "helix": {
    "label": "Helix",
    "tooltip": "The positions of experimentally determined helical regions",
    "shape": "rectangle",
    "color": "#FF0066"
  },
  "strand": {
    "label": "Beta strand",
    "tooltip": "The positions of experimentally determined beta strands",
    "shape": "rectangle",
    "color": "#FFCC00"
  },
  "turn": {
    "label": "Turn",
    "tooltip": "The positions of experimentally determined hydrogen-bonded turns",
    "shape": "rectangle",
    "color": "#0571AF"
  },
  "disulfid": {
    "label": "Disulfide bond",
    "tooltip": "The positions of cysteine residues participating in disulphide bonds",
    "shape": "bridge",
    "color": "#23B14D"
  },
  "crosslnk": {
    "label": "Cross-link",
    "tooltip": "Covalent linkages of various types formed between two proteins or between two parts of the same protein",
    "shape": "bridge",
    "color": "#FF6600"
  },
  "region": {
    "label": "Region",
    "tooltip": "Regions in multifunctional enzymes or fusion proteins, or characteristics of a region, e.g., protein-protein interactions mediation",
    "shape": "rectangle",
    "color": "#B33E00"
  },
  "coiled": {
    "label": "Coiled coil",
    "tooltip": "Coiled coils are built by two or more alpha-helices that wind around each other to form a supercoil",
    "shape": "rectangle",
    "color": "#006699"
  },
  "motif": {
    "label": "Motif",
    "tooltip": "Short conserved sequence motif of biological significance",
    "shape": "rectangle",
    "color": "#402060"
  },
  "repeat": {
    "label": "Repeat",
    "tooltip": "Repeated sequence motifs or repeated domains within the protein",
    "shape": "rectangle",
    "color": "#9900FF"
  },
  "ca_bind": {
    "label": "Calcium binding",
    "tooltip": "Calcium-binding regions, such as the EF-hand motif",
    "shape": "rectangle",
    "color": "#FF3399"
  },
  "dna_bind": {
    "label": "DNA binding",
    "tooltip": "DNA-binding domains such as AP2/ERF domain, the ETS domain, the Fork-Head domain, the HMG box and the Myb domain",
    "shape": "rectangle",
    "color": "#009933"
  },
  "domain": {
    "label": "Domain",
    "tooltip": "Specific combination of secondary structures organized into a characteristic three-dimensional structure or fold",
    "shape": "rectangle",
    "color": "#9999FF"
  },
  "zn_fing": {
    "label": "Zinc finger",
    "tooltip": "Small, functional, independently folded domain that coordinates one or more zinc ions",
    "shape": "rectangle",
    "color": "#990066"
  },
  "np_bind": {
    "label": "Nucleotide binding",
    "tooltip": "(aka flavin-binding). Region in the protein which binds nucleotide phosphates",
    "shape": "rectangle",
    "color": "#FF9900"
  },
  "metal": {
    "label": "Metal binding",
    "tooltip": "Binding site for a metal ion",
    "shape": "diamond",
    "color": "#009900"
  },
  "site": {
    "label": "Site",
    "tooltip": "Any interesting single amino acid site on the sequence",
    "shape": "chevron",
    "color": "#660033"
  },
  "binding": {
    "label": "Binding site",
    "tooltip": "Binding site for any chemical group (co-enzyme, prosthetic group, etc.)",
    "shape": "rectangle",
    "color": "#catFace"
  },
  "act_site": {
    "label": "Active site",
    "tooltip": "Amino acid(s) directly involved in the activity of an enzyme",
    "shape": "circle",
    "color": "#FF6666"
  },
  "mod_res": {
    "label": "Modified residue",
    "tooltip": "Modified residues such as phosphorylation, acetylation, acylation, methylation",
    "shape": "triangle",
    "color": "#000066"
  },
  "lipid": {
    "label": "Lipidation",
    "tooltip": "Covalently attached lipid group(s)",
    "shape": "wave",
    "color": "#99CC33"
  },
  "carbohyd": {
    "label": "Glycosylation",
    "tooltip": "Covalently attached glycan group(s)",
    "shape": "hexagon",
    "color": "#CC3366"
  },
  "compbias": {
    "label": "Compositional bias",
    "tooltip": "Position of regions of compositional bias within the protein and the particular amino acids that are over-represented within those regions",
    "shape": "rectangle",
    "color": "#FF3366"
  },
  "conflict": {
    "label": "Sequence conflict",
    "tooltip": "Sequence discrepancies of unknown origin",
    "shape": "rectangle",
    "color": "#6633CC"
  },
  "non_cons": {
    "label": "Non-adjacent residues",
    "tooltip": "Indicates that two residues in a sequence are not consecutive and that there is an undetermined number of unsequenced residues between them",
    "shape": "doubleBar",
    "color": "#FF0033"
  },
  "non_ter": {
    "label": "Non-terminal residue",
    "tooltip": "The sequence is incomplete. The residue is not the terminal residue of the complete protein",
    "shape": "doubleBar",
    "color": "#339933"
  },
  "unsure": {
    "label": "Sequence uncertainty",
    "tooltip": "Regions of a sequence for which the authors are unsure about the sequence assignment",
    "shape": "rectangle",
    "color": "#33FF00"
  },
  "non_std": {
    "label": "Non-standard residue",
    "tooltip": "Non-standard amino acids (selenocysteine and pyrrolysine)",
    "shape": "pentagon",
    "color": "#330066"
  },
  "mutagen": {
    "label": "Mutagenesis",
    "tooltip": "Site which has been experimentally altered by mutagenesis",
    "shape": "rectangle",
    "color": "#FF9900"
  },
  "topo_dom": {
    "label": "Topological domain",
    "tooltip": "Location of non-membrane regions of membrane-spanning proteins",
    "shape": "rectangle",
    "color": "#CC0000"
  },
  "transmem": {
    "label": "Transmembrane",
    "tooltip": "Extent of a membrane-spanning region",
    "shape": "rectangle",
    "color": "#CC00CC"
  },
  "intramem": {
    "label": "Intramembrane",
    "tooltip": "Extent of a region located in a membrane without crossing it",
    "shape": "rectangle",
    "color": "#0000CC"
  },
  "variant": {
    "label": "Natural variant",
    "tooltip": "Natural variant of the protein, including polymorphisms, variations between strains, isolates or cultivars, disease-associated mutations and RNA editing events",
    "shape": "circle",
    "color": "black"
  },
  "unique": {
    "label": "Unique peptide",
    "tooltip": "",
    "shape": "rectangle",
    "color": "#fc3133"
  },
  "non_unique": {
    "label": "Non-unique peptide",
    "tooltip": "",
    "shape": "rectangle",
    "color": "#8585fc"
  },
  "antigen": {
    "label": "Antibody binding sequences",
    "tooltip": "",
    "shape": "rectangle",
    "color": "#996699"
  },
  "pdbe_cover": {
    "label": "PDBe 3D structure coverage",
    "tooltip": "",
    "shape": "rectangle",
    "color": "#669966"
  }
};
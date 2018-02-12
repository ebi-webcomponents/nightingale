   export const categories = [{
                "name": "DOMAINS_AND_SITES",
                "label": "Domains & sites",
                "component": "protvista-track",
                "tracks": [{
                        "name": "domain",
                        "label": "Domain",
                        "API" : "DOMAIN",
                        "tooltip": "Specific combination of secondary structures organized into a characteristic three-dimensional structure or fold"
                    }, {
                        "name": "region",
                        "label": "Region",
                        "API" : "REGION",
                        "tooltip": "Regions in multifunctional enzymes or fusion proteins, or characteristics of a region, e.g., protein-protein interactions mediation"
                    }, {
                        "name": "motif",
                        "label": "Motif",
                        "API" : "MOTIF",
                        "tooltip": "Short conserved sequence motif of biological significance"
                    }, {
                        "name": "metal",
                        "label": "Metal binding",
                        "API" : "METAL",
                        "tooltip": "Binding site for a metal ion"
                    }, {
                        "name": "site",
                        "label": "Site",
                        "API" : "SITE",
                        "tooltip": "Any interesting single amino acid site on the sequence"
                    }

                ]
            },
            {
                "name": "MOLECULE_PROCESSING",
                "label": "Molecule processing",
                "component": "protvista-track",
                "tracks": [{
                    "name": "signal",
                    "label": "Signal peptide",
                    "API" : "SIGNAL",
                    "tooltip": "N-terminal signal peptide"
                }, {
                    "name": "chain",
                    "label": "Chain",
                    "API" : "CHAIN",
                    "tooltip": "(aka mature region). This describes the extent of a polypeptide chain in the mature protein following processing"
                }, {
                    "name": "peptide",
                    "label": "Peptide",
                    "API" : "PEPTIDE",
                    "tooltip": "The position and length of an active peptide in the mature protein"
                }]
            },
            {
                "name": "PTM",
                "label": "PTM",
                "component": "protvista-track",
                "tracks": [{
                    "name": "mod_res",
                    "label": "Modified residue",
                    "API" : "MOD_RES",
                    "tooltip": "Modified residues such as phosphorylation, acetylation, acylation, methylation"
                }, {
                    "name": "carbohyd",
                    "label": "Glycosylation",
                    "API" : "CARBOHYD",
                    "tooltip": "Covalently attached glycan group(s)"
                }, {
                    "name": "disulfid",
                    "label": "Disulfide bond",
                    "API" : "DISULFID",
                    "tooltip": "The positions of cysteine residues participating in disulphide bonds"
                }, {
                    "name": "crosslnk",
                    "label": "Cross-link",
                    "API" : "CROSSLNK",
                    "tooltip": "Covalent linkages of various types formed between two proteins or between two parts of the same protein"
                }]
            },
            {
                "name": "SEQUENCE_INFORMATION",
                "label": "Sequence information",
                "component": "protvista-track",
                "tracks": [{
                    "name": "compbias",
                    "label": "Compositional bias",
                    "tooltip": "Position of regions of compositional bias within the protein and the particular amino acids that are over-represented within those regions"
                }, {
                    "name": "conflict",
                    "label": "Sequence conflict",
                    "tooltip": "Sequence discrepancies of unknown origin"
                }]
            },
            {
                "name": "STRUCTURAL",
                "label": "Structural features",
                "component": "protvista-track",
                "tracks": [{
                    "name": "helix",
                    "label": "Helix",
                    "tooltip": "The positions of experimentally determined helical regions"
                }, {
                    "name": "strand",
                    "label": "Beta strand",
                    "tooltip": "The positions of experimentally determined beta strands"
                }, {
                    "name": "turn",
                    "label": "Turn",
                    "tooltip": "The positions of experimentally determined hydrogen-bonded turns"
                }, {
                    "name": "coiled",
                    "label": "Coiled coil",
                    "tooltip": "Coiled coils are built by two or more alpha-helices that wind around each other to form a supercoil"
                }]
            },
            {
                "name": "TOPOLOGY",
                "label": "Topology",
                "component": "protvista-track",
                "tracks": [{
                    "name": "topo_dom",
                    "label": "Topological domain",
                    "tooltip": "Location of non-membrane regions of membrane-spanning proteins"
                }, {
                    "name": "transmem",
                    "label": "Transmembrane",
                    "tooltip": "Extent of a membrane-spanning region"
                }, {
                    "name": "intramem",
                    "label": "Intramembrane",
                    "tooltip": "Extent of a region located in a membrane without crossing it"
                }]
            },
            {
                "name": "MUTAGENESIS",
                "label": "Mutagenesis",
                "component": "protvista-track",
                "tracks": [{
                    "name": "mutagen",
                    "label": "Mutagenesis",
                    "tooltip": "Site which has been experimentally altered by mutagenesis"
                }]
            },
            {
                "name": "PROTEOMICS",
                "label": "Proteomics",
                "component": "protvista-track",
                "tracks": [{
                    "name": "unique",
                    "label": "Unique peptide",
                    "tooltip": ""
                }, {
                    "name": "non_unique",
                    "label": "Non-unique peptide",
                    "tooltip": ""
                }]
            },
            {
                "name": "ANTIGEN",
                "label": "Antigenic sequences",
                "component": "protvista-track",
                "tracks": [{
                    "name": "antigen",
                    "label": "Antibody binding sequences",
                    "tooltip": ""
                }]
            },
            {
                "name": "VARIATION",
                "label": "Variants",
                "component": "protvista-variant",
                "tracks" : []
            }
        ];
        // "trackNames": {
        //     "transit": {
        //         "label": "Transit peptide",
        //         "tooltip": "This describes the extent of a transit peptide"
        //     },
        //     "init_met": {
        //         "label": "Initiator methionine",
        //         "tooltip": "This indicates that the initiator methionine is cleaved from the mature protein"
        //     },
        //     "propep": {
        //         "label": "Propeptide",
        //         "tooltip": "Part of a protein that is cleaved during maturation or activation"
        //     },
        //     "repeat": {
        //         "label": "Repeat",
        //         "tooltip": "Repeated sequence motifs or repeated domains within the protein"
        //     },
        //     "ca_bind": {
        //         "label": "Calcium binding",
        //         "tooltip": "Calcium-binding regions, such as the EF-hand motif"
        //     },
        //     "dna_bind": {
        //         "label": "DNA binding",
        //         "tooltip": "DNA-binding domains such as AP2/ERF domain, the ETS domain, the Fork-Head domain, the HMG box and the Myb domain"
        //     },
        //     "zn_fing": {
        //         "label": "Zinc finger",
        //         "tooltip": "Small, functional, independently folded domain that coordinates one or more zinc ions"
        //     },
        //     "np_bind": {
        //         "label": "Nucleotide binding",
        //         "tooltip": "(aka flavin-binding). Region in the protein which binds nucleotide phosphates"
        //     },
        //     "binding": {
        //         "label": "Binding site",
        //         "tooltip": "Binding site for any chemical group (co-enzyme, prosthetic group, etc.)"
        //     },
        //     "act_site": {
        //         "label": "Active site",
        //         "tooltip": "Amino acid(s) directly involved in the activity of an enzyme"
        //     },
        //     "lipid": {
        //         "label": "Lipidation",
        //         "tooltip": "Covalently attached lipid group(s)"
        //     },
        //     "non_cons": {
        //         "label": "Non-adjacent residues",
        //         "tooltip": "Indicates that two residues in a sequence are not consecutive and that there is an undetermined number of unsequenced residues between them"
        //     },
        //     "non_ter": {
        //         "label": "Non-terminal residue",
        //         "tooltip": "The sequence is incomplete. The residue is not the terminal residue of the complete protein"
        //     },
        //     "unsure": {
        //         "label": "Sequence uncertainty",
        //         "tooltip": "Regions of a sequence for which the authors are unsure about the sequence assignment"
        //     },
        //     "non_std": {
        //         "label": "Non-standard residue",
        //         "tooltip": "Non-standard amino acids (selenocysteine and pyrrolysine)"
        //     },
        //     "variant": {
        //         "label": "Natural variant",
        //         "tooltip": "Natural variant of the protein, including polymorphisms, variations between strains, isolates or cultivars, disease-associated mutations and RNA editing events"
        //     },
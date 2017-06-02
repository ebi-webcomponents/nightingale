const myFeaturesTestData = {
    "accession": "P01234",
    "sequence": "MLPGLALLLLAAWTARALEVPTDGNAGLLAEPQIAMFCGRLNMHMNVQNGKWDSDPSGTKTCIDTKEGILQYCQEVYPELQITNVVEANQPVTIQNWCKRGRKQCKTHPHFVIPYRCLVGEFVSDALLVPDKCKFLHQERMDVCETHLHWHTVAKETCSEKSTNLHDYGMLLPCGIDKFRGVEFVCCPLAEESDNVDSADAEEDDSDVWWGGADTDYADGSEDKVVEVAEEEEVAEVEEEEADDDEDDEDGDEVEEEAEEPYEEATERTTSIATTTTTTTESVEEVVREVCSEQAETGPCRAMISRWYFDVTEGKCAPFFYGGCGGNRNNFDTEEYCMAVCGSAMSQSLLKTTQEPLARDPVKLPTTAASTPDAVDKYLETPGDENEHAHFQKAKERLEAKHRERMSQVMREWEEAERQAKNLPKADKKAVIQHFQEKVESLEQEAANERQQLVETHMARVEAMLNDRRRLALENYITALQAVPPRPRHVFNMLKKYVRAEQKDRQHTLKHFEHVRMVDPKKAAQIRSQVMTHLRVIYERMNQSLSLLYNVPAVAEEIQDEVDELLQKEQNYSDDVLANMISEPRISYGNDALMPSLTETKTTVELLPVNGEFSLDDLQPWHSFGADSVPANTENEVEPVDARPAADRGLTTRPGSGLTNIKTEEISEVKMDAEFRHDSGYEVHHQKLVFFAEDVGSNKGAIIGLMVGGVVIATVIVITLVMLKKKQYTSIHHGVVEVDAAVTPEERHLSKMQQNGYENPTYKFFEQMQN",
    "features": [
        {
            "type": "PDB_STRUCTURE",
            "category": "STRUCTURAL",
            "description": "Method: X-ray. Resolution: 1.50 A. ",
            "begin": 0,
            "end": 0,
            "xrefs": [
                {
                    "name": "PDB",
                    "id": "1AAP",
                    "url": "http://www.ebi.ac.uk/pdbe-srv/view/entry/1AAP"
                }
            ]
        },
        {
            "type": "PDB_STRUCTURE",
            "category": "STRUCTURAL",
            "description": "Method: NMR. Chains: A=672-699. ",
            "begin": 672,
            "end": 699,
            "xrefs": [
                {
                    "name": "PDB",
                    "id": "1AMB",
                    "url": "http://www.ebi.ac.uk/pdbe-srv/view/entry/1AMB"
                }
            ]
        },
        {
            "type": "PDB_STRUCTURE",
            "category": "STRUCTURAL",
            "description": "Method: NMR. Chains: A=672-699. ",
            "begin": 672,
            "end": 699,
            "xrefs": [
                {
                    "name": "PDB",
                    "id": "1AMC",
                    "url": "http://www.ebi.ac.uk/pdbe-srv/view/entry/1AMC"
                }
            ]
        },
        {
            "type": "PDB_STRUCTURE",
            "category": "STRUCTURAL",
            "description": "Method: NMR. Chains: A=672-711. ",
            "begin": 672,
            "end": 711,
            "xrefs": [
                {
                    "name": "PDB",
                    "id": "1AML",
                    "url": "http://www.ebi.ac.uk/pdbe-srv/view/entry/1AML"
                }
            ]
        },
        {
            "type": "PDB_STRUCTURE",
            "category": "STRUCTURAL",
            "description": "Method: NMR. Chains: A=672-711. ",
            "begin": 672,
            "end": 711,
            "xrefs": [
                {
                    "name": "PDB",
                    "id": "1BA4",
                    "url": "http://www.ebi.ac.uk/pdbe-srv/view/entry/1BA4"
                }
            ]
        }
    ]
};

export function getFeaturesTestData() {
    return myFeaturesTestData;
}
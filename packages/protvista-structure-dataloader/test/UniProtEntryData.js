const myTestData = {
   "accession": "P01234",
   "id": "A4_HUMAN_mocked",
   "dbReferences": [
     {
       "type": "UniGene",
       "id": "Hs.434980"
     },
     {
       "type": "PDB",
       "id": "1AAP",
       "properties": {
         "method": "X-ray",
         "chains": "A/B=287-344",
         "resolution": "1.50 A"
       }
     },
     {
       "type": "PDB",
       "id": "1AMB",
       "properties": {
         "method": "NMR",
         "chains": "A=672-699"
       }
     },
     {
       "type": "PDB",
       "id": "1AMC",
       "properties": {
         "method": "NMR",
         "chains": "A=672-699"
       }
     },
     {
       "type": "PDB",
       "id": "1AML",
       "properties": {
         "method": "NMR",
         "chains": "A=672-711"
       }
     },
     {
       "type": "PDB",
       "id": "1BA4",
       "properties": {
         "method": "NMR",
         "chains": "A=672-711"
       }
     },
     {
       "type": "PROSITE",
       "id": "PS00280",
       "properties": {
         "match status": "1",
         "entry name": "BPTI_KUNITZ_1"
       }
     },
     {
       "type": "PROSITE",
       "id": "PS50279",
       "properties": {
         "match status": "1",
         "entry name": "BPTI_KUNITZ_2"
       }
     }
   ],
   "sequence": {
     "version": 3,
     "length": 770,
     "mass": 86943,
     "modified": "1991-11-01",
     "sequence": "MLPGLALLLLAAWTARALEVPTDGNAGLLAEPQIAMFCGRLNMHMNVQNGKWDSDPSGTKTCIDTKEGILQYCQEVYPELQITNVVEANQPVTIQNWCKRGRKQCKTHPHFVIPYRCLVGEFVSDALLVPDKCKFLHQERMDVCETHLHWHTVAKETCSEKSTNLHDYGMLLPCGIDKFRGVEFVCCPLAEESDNVDSADAEEDDSDVWWGGADTDYADGSEDKVVEVAEEEEVAEVEEEEADDDEDDEDGDEVEEEAEEPYEEATERTTSIATTTTTTTESVEEVVREVCSEQAETGPCRAMISRWYFDVTEGKCAPFFYGGCGGNRNNFDTEEYCMAVCGSAMSQSLLKTTQEPLARDPVKLPTTAASTPDAVDKYLETPGDENEHAHFQKAKERLEAKHRERMSQVMREWEEAERQAKNLPKADKKAVIQHFQEKVESLEQEAANERQQLVETHMARVEAMLNDRRRLALENYITALQAVPPRPRHVFNMLKKYVRAEQKDRQHTLKHFEHVRMVDPKKAAQIRSQVMTHLRVIYERMNQSLSLLYNVPAVAEEIQDEVDELLQKEQNYSDDVLANMISEPRISYGNDALMPSLTETKTTVELLPVNGEFSLDDLQPWHSFGADSVPANTENEVEPVDARPAADRGLTTRPGSGLTNIKTEEISEVKMDAEFRHDSGYEVHHQKLVFFAEDVGSNKGAIIGLMVGGVVIATVIVITLVMLKKKQYTSIHHGVVEVDAAVTPEERHLSKMQQNGYENPTYKFFEQMQN"
   }
 };

 var UniProtEntryData = function () {
     return {
         data: myTestData
     };
 }();

 module.exports = UniProtEntryData;
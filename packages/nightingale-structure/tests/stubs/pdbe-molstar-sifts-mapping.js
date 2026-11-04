// Stand-in for `pdbe-molstar/lib/sifts-mapping` (see pdbe-molstar-viewer.js for
// why), mapped in via `moduleNameMapper` in jest.config.js. `isAvailable` is
// the real one's check, minus molstar's `MmcifFormat.is` import.

const SIFTSMapping = {
  isAvailable(model) {
    if (model.sourceData?.kind !== "mmCIF") return false;
    const {
      pdbx_sifts_xref_db_name: dbName,
      pdbx_sifts_xref_db_acc: dbAcc,
      pdbx_sifts_xref_db_num: dbNum,
      pdbx_sifts_xref_db_res: dbRes,
    } = model.sourceData.data.db.atom_site;
    return (
      dbName.isDefined && dbAcc.isDefined && dbNum.isDefined && dbRes.isDefined
    );
  },
};

module.exports = { SIFTSMapping };

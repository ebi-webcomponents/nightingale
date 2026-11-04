// Stand-in for molstar's Model Archive quality-assessment behaviour (pLDDT
// colouring), mapped in via `moduleNameMapper` in jest.config.js: the real
// module imports molstar's React UI, which jest's React can't load. The
// viewer stub records the behaviours added by their transformer's `id`.

const MAQualityAssessment = { id: "ms-plugin.ma-quality-assessment-prop" };

module.exports = { MAQualityAssessment };

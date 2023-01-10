import ecoMap from "./evidences";

export const renameProperties = (features) => {
  return features.map((ft) => {
    const obj = {};
    if (ft.begin) {
      obj.start = ft.begin;
    }
    return {
      ...ft,
      ...obj,
    };
  });
};

const formatSource = (source) => {
  return source.name?.toLowerCase() === "PubMed".toLowerCase()
    ? `${source.id}&nbsp;(<a href='${source.url}' style="color:#FFF" target='_blank'>${source.name}</a>&nbsp;<a href='${source.alternativeUrl}' style="color:#FFF" target='_blank'>EuropePMC</a>)`
    : `&nbsp;<a href='${source.url}' style="color:#FFF" target='_blank'>${
        source.id
      }</a>&nbsp;${source.name ? `(${source.name})` : ""}`;
};

export const getEvidenceFromCodes = (evidenceList) => {
  if (!evidenceList) return ``;
  return `
      <ul>${evidenceList
        .map((ev) => {
          const ecoMatch = ecoMap.find((eco) => eco.name === ev.code);
          if (!ecoMatch) return ``;
          return `<li title='${
            ecoMatch.description
          }' style="padding: .25rem 0">${ecoMatch.shortDescription}:&nbsp;${
            ev.source ? formatSource(ev.source) : ""
          }</li>`;
        })
        .join("")}</ul>
    `;
};

export const formatXrefs = (xrefs) => {
  return `<ul>${xrefs
    .map(
      (xref) =>
        `<li style="padding: .25rem 0">${xref.name} ${
          xref.url
            ? `<a href="${xref.url}" style="color:#FFF" target="_blank">${xref.id}</a>`
            : `${xref.name} ${xref.id}`
        }</li>`
    )
    .join("")}</ul>`;
};

const getPTMEvidence = (ptms) => {
  if (!ptms) return ``;
  let ids = ptms.map((ptm) => ptm.dbReferences.map((ref) => ref.id));
  const uniqueIds = [...new Set(ids.flat())];
  return `
  <ul>${uniqueIds
    .map(
      (id) =>
        `<li title='${id}' style="padding: .25rem 0">${id}&nbsp;(<a href="https://www.ebi.ac.uk/pride/archive/projects/${id}" style="color:#FFF" target="_blank">PRIDE</a>&nbsp;
      <a href="http://www.peptideatlas.org/builds/rice/phospho/" style="color:#FFF" target="_blank">PeptideAtlas</a>)</li>`
    )
    .join("")}</ul>
`;
};

const formatPTMPeptidoform = (peptide, ptms) => {
  if (!ptms) return ``;
  const modificationValues = ptms.map((ptm) => ({
    name: ptm.name,
    position: ptm.position,
  }));
  let peptidoform = "";
  let lastModPosition = 0;
  modificationValues.forEach((p) => {
    peptidoform = `${peptidoform}${peptide.slice(
      lastModPosition,
      p.position
    )}[${p.name}]`;
    lastModPosition = p.position;
  });
  // Add last remaining part of the peptide if any
  peptidoform = `${peptidoform}${peptide.slice(lastModPosition)}`;
  return `<p>${peptidoform}</p>`;
};

// At the moment, there is only phospho data. In future we may have more, the below AA sites have to be updated to accomodate more.
const AAPhosphoSites = {
  A: "alanine",
  S: "serine",
  T: "threonine",
  Y: "tyrosine",
};

const findModifiedResidueName = (feature, ptm) => {
  const { peptide, begin: peptideStart } = feature;
  const proteinLocation = Number(peptideStart) + ptm.position - 1;
  const modifiedResidue = peptide.charAt(ptm.position - 1); // CharAt index starts from 0
  return `${proteinLocation} phospho${AAPhosphoSites[modifiedResidue]}`;
};

export const formatTooltip = (feature) => {
  const evidenceHTML =
    feature.type === "PROTEOMICS_PTM"
      ? getPTMEvidence(feature.ptms)
      : getEvidenceFromCodes(feature.evidences);
  const ptms =
    feature.type === "PROTEOMICS_PTM" &&
    feature.ptms.map((ptm) => findModifiedResidueName(feature, ptm));
  try {
    return `
      ${
        feature.description
          ? `<h5>Description</h5><p>${feature.description}</p>`
          : ``
      }
      ${
        feature.matchScore
          ? `<h5>Match score</h5><p>${feature.matchScore}%</p>`
          : ``
      }
      ${feature.ftId ? `<h5>Feature ID</h5><p>${feature.ftId}</p>` : ``}
      ${
        feature.alternativeSequence
          ? `<h5>Alternative sequence</h5><p>${feature.alternativeSequence}</p>`
          : ``
      }
      ${evidenceHTML ? `<h5>Evidence</h5>${evidenceHTML}` : ``}
      ${
        feature.xrefs
          ? `<h5>Cross-references</h5>${formatXrefs(feature.xrefs)}`
          : ""
      }
      ${
        feature.peptide && feature.type === "PROTEOMICS_PTM"
          ? `<h5>Peptidoform</h5><p>${formatPTMPeptidoform(
              feature.peptide,
              feature.ptms
            )}</p>`
          : `<h5>Peptide</h5><p>${feature.peptide}</p>`
      } 
      ${
        ptms
          ? `<h5>PTMs</h5><ul>${ptms
              .map((item) => `<li>${item}</li>`)
              .join("")}</ul><hr />
            `
          : ""
      }
      ${
        feature.ptms
          ? `<h5>PTM statistical attributes</h5><ul>${feature.ptms
              .map((ptm) =>
                ptm.dbReferences
                  .map(
                    (ref) =>
                      `<li><b>${ref.id}</b></li>
          <li><b>${findModifiedResidueName(feature, ptm)}</b></li>
          ${Object.entries(ref.properties)
            .map(([key, value]) => `<li>${key}: ${value}</li>`)
            .join("")}
        `
                  )
                  .join("")
              )
              .join("")}</ul>`
          : ""
      }
        `;
  } catch (error) {
    console.error(error);
    return "";
  }
};

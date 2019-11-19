import ecoMap from "./evidences";

export const renameProperties = features => {
  return features.map(ft => {
    const obj = {};
    if (ft.begin) {
      obj.start = ft.begin;
    }
    return {
      ...ft,
      ...obj
    };
  });
};

const formatSource = source => {
  return source.name.toLowerCase() === "PubMed".toLowerCase()
    ? `${source.id}&nbsp;(<a href='${source.url}' style="color:#FFF" target='_blank'>${source.name}</a>&nbsp;<a href='${source.alternativeUrl}' style="color:#FFF" target='_blank'>EuropePMC</a>)`
    : `&nbsp;<a href='${source.url}' style="color:#FFF" target='_blank'>${source.id}</a>&nbsp;(${source.name})`;
};

const getEvidenceFromCodes = evidenceList => {
  if (!evidenceList) return ``;
  return `
      <ul>${evidenceList
        .map(ev => {
          const ecoMatch = ecoMap.find(eco => eco.name === ev.code);
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

const formatXrefs = xrefs => {
  return `<ul>${xrefs
    .map(
      xref =>
        `<li style="padding: .25rem 0">${xref.name} ${
          xref.url
            ? `<a href="${xref.url}" style="color:#FFF" target="_blank">${xref.id}</a>`
            : `${xref.name} ${xref.id}`
        }</li>`
    )
    .join("")}</ul>`;
};

export const formatTooltip = feature => {
  const evidenceHTML = getEvidenceFromCodes(feature.evidences);
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
        `;
};

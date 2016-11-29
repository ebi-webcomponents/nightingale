const d3 = require('d3');
const _ = require('underscore');

const sparqlLoader = {
  order: function(accession, nodes) {
    // Always place the query accession at the top
    nodes.splice(0, 0, nodes.splice(_.pluck(nodes, 'accession').lastIndexOf(accession), 1)[0]);
  },
  isDuplicateEdge: function(edges, edge) {
    return _.find(edges, function(d) { return (d.source === edge.source && d.target === edge.target)});
  },
  processData: function(accession, nodeData, edgeData) {

    var json = {
      nodes: [],
      links: []
    };

    for (var element of nodeData.results.bindings) {
      var node = {
        'accession': element.accession.value,
        'entryName': element.entry_name.value,
        'disease': element.has_disease.value == 1,
        'subcell': element.has_subcell.value == 1
      };
      json.nodes.push(node);
    }
    this.order(accession, json.nodes);
    const accessions = _.pluck(json.nodes, 'accession');
    for (element of edgeData.results.bindings) {
      var sourceIndex = _.indexOf(accessions, element.source.value);
      var targetIndex = _.indexOf(accessions, element.target.value);
      if ((sourceIndex >= 0) && (targetIndex >= 0)) {
        var link = {
          'source': (sourceIndex < targetIndex)? element.target.value : element.source.value,
          'target': (sourceIndex < targetIndex)? element.source.value : element.target.value,
          'experiments': element.exp.value,
          'intact': [element.source_intact.value, element.target_intact.value]
        };
        if (!this.isDuplicateEdge(json.links, link)) {
          json.links.push(link);
        }
      }
    }
    return json;
  },
  loadData: function(entry) {
    var promiseNodes = new Promise(function(resolve) {
      var url = `http://sparql.uniprot.org/sparql?query=PREFIX+up%3a%3Chttp%3a%2f%2fpurl.uniprot.org%2fcore%2f%3E+%0d%0aPREFIX+uniprotkb%3a%3Chttp%3a%2f%2fpurl.uniprot.org%2funiprot%2f%3E+%0d%0aPREFIX+rdf%3a%3Chttp%3a%2f%2fwww.w3.org%2f1999%2f02%2f22-rdf-syntax-ns%23%3E+%0d%0aPREFIX+owl%3a%3Chttp%3a%2f%2fwww.w3.org%2f2002%2f07%2fowl%23%3E+%0d%0aSELECT+DISTINCT+(SUBSTR(STR(%3ftarget_participant)%2c+33)+as+%3faccession)+%3fentry_name+(MAX(%3fdisease_type)+as+%3fhas_disease)+(MAX(%3fsubcell_type)+as+%3fhas_subcell)%0d%0aWHERE%0d%0a%7b%0d%0a++BIND(uniprotkb%3a${entry}+as+%3fentry)%0d%0a++%7b%0d%0a++%09%3fentry+up%3ainteraction%2fup%3aparticipant%2f(owl%3asameAs%7crdfs%3aseeAlso)+%3ftarget_participant+.%0d%0a++%7d+UNION+%7b%0d%0a++++%3fentry+up%3ainteraction%2fup%3aparticipant%2f(owl%3asameAs%7crdfs%3aseeAlso)+%3ffirst_level+.+%0d%0a++++%3ffirst_level+up%3ainteraction%2fup%3aparticipant%2f(owl%3asameAs%7crdfs%3aseeAlso)+%3ftarget_participant+.%0d%0a++++FILTER+(%3fsource_participant+!%3d+%3fentry)+.%0d%0a++++FILTER+(%3ftarget_participant+!%3d+%3fentry)%0d%0a++%7d+UNION+%7b%0d%0a+++++BIND(uniprotkb%3a${entry}+as+%3ftarget_participant)%0d%0a++%7d%0d%0a++%3ftarget_participant+up%3amnemonic+%3fentry_name+.%0d%0a++%3ftarget_participant+up%3aannotation%2frdf%3atype+%3ftype++.%0d%0a++BIND+(IF(%3ftype+%3d+up%3aDisease_Annotation%2c+1%2c+0)+AS+%3fdisease_type)%0d%0a++BIND+(IF(%3ftype+%3d+up%3aSubcellular_Location_Annotation%2c+1%2c+0)+AS+%3fsubcell_type)%0d%0a%7d+GROUP+BY+%3ftarget_participant+%3fentry_name+ORDER+BY+%3fentry_name&format=srj`;
      d3.json(url, data => {
        resolve(data);
      });
    });
    var promiseEdges = new Promise(function(resolve) {
      var url = `http://sparql.uniprot.org/sparql?query=PREFIX+%3a%3chttp%3a%2f%2fpurl.uniprot.org%2fcore%2f%3e+SELECT+(STRAFTER(SUBSTR(STR(%3fse)%2c+32)%2c%27%2f%27)AS+%3fsource)(STRAFTER(SUBSTR(STR(%3fte)%2c+32)%2c+%27%2f%27)AS+%3ftarget)(%3fe+AS+%3fexp)(SUBSTR(STR(%3fsp)%2c32)AS+%3fsource_intact)(SUBSTR(STR(%3ftp)%2c+32)AS+%3ftarget_intact)WHERE%7bBIND(%3chttp%3a%2f%2fpurl.uniprot.org%2funiprot%2f${entry}%3eAS+%3fp)BIND(%3ainteraction+AS+%3fui)%7b%3fp+%3fui+%3fi.%3fi+a+%3aSelf_Interaction%3b+%3aexperiments+%3fe.%3fi+%3aparticipant+%3fsp%2c%3ftp.BIND(%3fp+AS+%3fse)BIND(%3fp+AS+%3fte)%7dUNION%7b%3fp+%3fui+%3fi.%3fi+a+%3aNon_Self_Interaction+%7b+%3fi%3aexperiments+%3fe%3b+%3aparticipant+%3fsp%2c%3ftp.%3fsp+(owl%3asameAs%7crdfs%3aseeAlso)+%3fp.%3ftp+(owl%3asameAs%7crdfs%3aseeAlso)+%3fte.FILTER(!sameTerm(%3fp%2c+%3fte))BIND(%3fp+AS+%3fse)%7dUNION+%7b+%3fi+%3aparticipant+%3fsp.%3fsp+(owl%3asameAs%7crdfs%3aseeAlso)+%3fse.%3fse+%3fui+%3fi2+.%3fi2+%3aexperiments+%3fe+.FILTER(!sameTerm(%3fi%2c%3fi2))%7b%3fi2+a+%3aNon_Self_Interaction%3b+%3aparticipant+%3ftp+%2c+%3fsp+.%3ftp+(owl%3asameAs%7crdfs%3aseeAlso)+%3fte.FILTER(!sameTerm(%3fse%2c%3fp)%26%26!sameTerm(%3fse%2c%3fte)%26%26!sameTerm(%3fte%2c%3fp))%7dUNION%7b%3fi2+a+%3aSelf_Interaction%3b+%3aparticipant+%3ftp+.+%3ftp+(owl%3asameAs%7crdfs%3aseeAlso)+%3fse.BIND(%3fse+AS+%3fte)%7d%7d%7d%7dGROUP+BY+%3fse+%3fte+%3fe+%3fsp+%3ftp+ORDER+BY+%3fse+%3fte+%3fe+%3fsp+%3ftp&format=srj`;
      d3.json(url, data => {
        resolve(data);
      });
    });
    return Promise.all([promiseNodes, promiseEdges]).then(function(res) {
      return sparqlLoader.processData(entry, res[0], res[1]);
    });
  }

};
module.exports = sparqlLoader;

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
        'entryName': element.entry_name ? element.entry_name.value : element.accession.value,
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
      var url = `http://sparql.uniprot.org/sparql?query=%23uuw%0APREFIX++uniprotkb%3a+%3Chttp%3a%2f%2fpurl.uniprot.org%2funiprot%2f%3E%0d%0aPREFIX++%3a+++%3Chttp%3a%2f%2fpurl.uniprot.org%2fcore%2f%3E%0d%0a%0d%0aSELECT+DISTINCT++(substr(str(%3fte)%2c+33)+AS+%3faccession)+%3fentry_name+(MAX(%3fdisease_type)+AS+%3fhas_disease)+(MAX(%3fsubcell_type)+AS+%3fhas_subcell)%0d%0aWHERE%0d%0a++%7b+BIND(uniprotkb%3a${entry}+AS+%3fp)%0d%0a++++BIND(%3ainteraction+AS+%3fui)%0d%0a+++%7b%0d%0a+++++BIND(uniprotkb%3a${entry}+AS+%3fte)%0d%0a+++++%7d%0d%0a++++UNION%0d%0a++++++%7b+%3fp++%3fui+++++++++++++++++++%3fi+.%0d%0a++++++++%3fi++a+++++++++++++++++++++%3aNon_Self_Interaction%0d%0a++++++++++%7b+%3fi+++%3aexperiments++%3fe+%3b%0d%0a+++++++++++++++++%3aparticipant++%3fsp+%3b%0d%0a+++++++++++++++++%3aparticipant++%3ftp+.%0d%0a++++++++++++%3fsp++owl%3asameAs++++%3fp+.%0d%0a++++++++++++%3ftp++owl%3asameAs++++%3fte%0d%0a++++++++++++FILTER+(+!+sameTerm(%3fp%2c+%3fte)+)%0d%0a++++++++++++BIND(%3fp+AS+%3fse)%0d%0a++++++++++%7d%0d%0a++++++++UNION%0d%0a++++++++++%7b+%3fi+++%3aparticipant++%3fsp+.%0d%0a++++++++++++%3fsp++owl%3asameAs++++%3fse+.%0d%0a++++++++++++%3fse++%3fui+++++++++++%3fi2+.%0d%0a++++++++++++FILTER+(+!+sameTerm(%3fi%2c+%3fi2)+)%0d%0a++++++++++++++%7b+%3fi2++a+++++++++++++++++++++%3aNon_Self_Interaction+%3b%0d%0a+++++++++++++++++++++%3aparticipant++++++++++%3ftp+%3b%0d%0a+++++++++++++++++++++%3aparticipant++++++++++%3fsp+.%0d%0a++++++++++++++++%3ftp++owl%3asameAs++++++++++++%3fte+.%0d%0a+++++++++++++++%3fte+%3fui+%3foi+.+%0d%0a+++++++++++++++++++++%7b+%3foi+%3aparticipant%2fowl%3asameAs+%3fp+%7d+UNION+%0d%0a+++++++++++++++%7b+%3foi+%3aparticipant%2fowl%3asameAs+%3fiso+.+%3fp+%3asequence+%3fiso+%7d%0d%0a++++++++++++++++FILTER+(+(+(+!+sameTerm(%3fse%2c+%3fp)+)+%26%26+(+!+sameTerm(%3fse%2c+%3fte)+)+)+%26%26+(+!+sameTerm(%3fte%2c+%3fp)+)+)%0d%0a++++++++++++++%7d%0d%0a++++++++++++UNION%0d%0a++++++++++++++%7b+%3fi2++a+++++++++++++++++++++%3aSelf_Interaction+%3b%0d%0a+++++++++++++++++++++%3aparticipant++++++++++%3ftp+.%0d%0a++++++++++++++++%3ftp++owl%3asameAs++++++++++++%3fse%0d%0a++++++++++++++++BIND(%3fse+AS+%3fte)%0d%0a++++++++++++++%7d%0d%0a++++++++++%7d%0d%0a++++++%7d%0d%0a+++OPTIONAL+%7b%0d%0a+++%3fte%0d%0a++++++++++++++%3amnemonic++%3fentry_name+.%0d%0a+++++%7d+%0d%0a+++OPTIONAL+%7b%0d%0a++++%3fte+%3aannotation%2fa+%3ftype%0d%0a+++%7d%0d%0a+++BIND(if((+%3ftype+%3d+%3aDisease_Annotation+)%2c+1%2c+0)+AS+%3fdisease_type)%0d%0a++++BIND(if((+%3ftype+%3d+%3aSubcellular_Location_Annotation+)%2c+1%2c+0)+AS+%3fsubcell_type)%0d%0a++%7d%0d%0aGROUP+BY+%3fte+%3fentry_name%0d%0aORDER+BY+%3fentry_name&format=srj`;
      d3.json(url, data => {
        resolve(data);
      });
    });
    var promiseEdges = new Promise(function(resolve) {
      var url = `http://sparql.uniprot.org/sparql?query=%23uuw%0APREFIX++%3a+++++%3Chttp%3a%2f%2fpurl.uniprot.org%2fcore%2f%3E%0d%0a%0d%0aSELECT++(strafter(substr(str(%3fse)%2c+32)%2c+%22%2f%22)+AS+%3fsource)+(strafter(substr(str(%3fte)%2c+32)%2c+%22%2f%22)+AS+%3ftarget)+(%3fe+AS+%3fexp)+(substr(str(%3fsp)%2c+32)+AS+%3fsource_intact)+(substr(str(%3ftp)%2c+32)+AS+%3ftarget_intact)%0d%0aWHERE%0d%0a++%7b+BIND(%3Chttp%3a%2f%2fpurl.uniprot.org%2funiprot%2f${entry}%3E+AS+%3fp)%0d%0a++++BIND(%3ainteraction+AS+%3fui)%0d%0a++++++%7b+%3fp++%3fui+++++++++++++++++++%3fi+.%0d%0a++++++++%3fi++a+++++++++++++++++++++%3aSelf_Interaction+%3b%0d%0a++++++++++++%3aexperiments++++++++++%3fe+%3b%0d%0a++++++++++++%3aparticipant++++++++++%3fsp+%3b%0d%0a++++++++++++%3aparticipant++++++++++%3ftp%0d%0a++++++++BIND(%3fp+AS+%3fse)%0d%0a++++++++BIND(%3fp+AS+%3fte)%0d%0a++++++%7d%0d%0a++++UNION%0d%0a++++++%7b+%3fp++%3fui+++++++++++++++++++%3fi+.%0d%0a++++++++%3fi++a+++++++++++++++++++++%3aNon_Self_Interaction%0d%0a++++++++++%7b+%3fi+++%3aexperiments++%3fe+%3b%0d%0a+++++++++++++++++%3aparticipant++%3fsp+%3b%0d%0a+++++++++++++++++%3aparticipant++%3ftp+.%0d%0a++++++++++++%3fsp++owl%3asameAs++++%3fp+.%0d%0a++++++++++++%3ftp++owl%3asameAs++++%3fte%0d%0a++++++++++++FILTER+(+!+sameTerm(%3fp%2c+%3fte)+)%0d%0a++++++++++++BIND(%3fp+AS+%3fse)%0d%0a++++++++++%7d%0d%0a++++++++UNION%0d%0a++++++++++%7b+%3fi+++%3aparticipant++%3fsp+.%0d%0a++++++++++++%3fsp++owl%3asameAs++++%3fse+.%0d%0a++++++++++++%3fse++%3fui+++++++++++%3fi2+.%0d%0a++++++++++++%3fi2++%3aexperiments++%3fe%0d%0a++++++++++++FILTER+(+!+sameTerm(%3fi%2c+%3fi2)+)%0d%0a++++++++++++++%7b+%3fi2++a+++++++++++++++++++++%3aNon_Self_Interaction+%3b%0d%0a+++++++++++++++++++++%3aparticipant++++++++++%3ftp+%3b%0d%0a+++++++++++++++++++++%3aparticipant++++++++++%3fsp+.%0d%0a++++++++++++++++%3ftp++owl%3asameAs++++++++++++%3fte+.%0d%0a++++++++++++++++%3fte+%3fui+%3foi+.+%0d%0a+++++++++++++++%7b+%3foi+%3aparticipant%2fowl%3asameAs+%3fp+%7d+UNION+%0d%0a+++++++++++++++%7b+%3foi+%3aparticipant%2fowl%3asameAs+%3fiso+.+%3fp+%3asequence+%3fiso+%7d%0d%0a++++++++++++++++FILTER+(+(+(+!+sameTerm(%3fse%2c+%3fp)+)+%26%26+(+!+sameTerm(%3fse%2c+%3fte)+)+)+%26%26+(+!+sameTerm(%3fte%2c+%3fp)+)+)%0d%0a++++++++++++++%7d%0d%0a++++++++++++UNION%0d%0a++++++++++++++%7b+%3fi2++a+++++++++++++++++++++%3aSelf_Interaction+%3b%0d%0a+++++++++++++++++++++%3aparticipant++++++++++%3ftp+.%0d%0a++++++++++++++++%3ftp++owl%3asameAs++++++++++++%3fse%0d%0a++++++++++++++++BIND(%3fse+AS+%3fte)%0d%0a++++++++++++++%7d%0d%0a++++++++++%7d%0d%0a++++++%7d%0d%0a++%7d%0d%0aGROUP+BY+%3fse+%3fte+%3fe+%3fsp+%3ftp%0d%0aORDER+BY+%3fse+%3fte+%3fe+%3fsp+%3ftp&format=srj`;
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

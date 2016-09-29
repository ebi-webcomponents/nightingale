const d3 = require('d3');

const sparqlLoader = {
  processData: function(nodeData, edgeData) {
    var _ = require('underscore')

    var json = {
      nodes: [],
      links: []
    }

    for (element of nodeData.results.bindings) {
      var node = {
        'accession': element.accession.value,
        'entryName': element.entry_name.value,
        'disease': element.has_disease.value == 1,
        'subcell': element.has_subcell.value == 1
      };
      json.nodes.push(node);
    };

    for (element of edgeData.results.bindings) {
      // Currently required because of missing data
      // if(_.pluck( json.nodes, 'accession').indexOf(element.source.value) < 0) {
      //   json.nodes.push({
      //     'accession': element.source.value,
      //     'entryName': element.source.value
      //   });
      // } else if (_.pluck( json.nodes, 'accession').indexOf(element.target.value) < 0) {
      //   json.nodes.push({
      //     'accession': element.target.value,
      //     'entryName': element.target.value
      //   });
      // }
      // end of Currently required
      if (_.contains(_.pluck(json.nodes,'accession'), element.source.value) &&
        _.contains(_.pluck(json.nodes,'accession'), element.target.value)) {
        var link = {
          'source': element.source.value,
          'target': element.target.value,
          'experiments': element.exp.value
        };
        var reverselink = {
          'source': element.target.value,
          'target': element.source.value,
          'experiments': element.exp.value
        };
        json.links.push(link);
        json.links.push(reverselink);
      }
    };
    return json;
  },
  loadData: function(entry) {
    var promiseNodes = new Promise(function(resolve, reject) {
      var url = `http://sparql.uniprot.org/sparql?query=PREFIX+up%3a%3Chttp%3a%2f%2fpurl.uniprot.org%2fcore%2f%3E+%0d%0aPREFIX+uniprotkb%3a%3Chttp%3a%2f%2fpurl.uniprot.org%2funiprot%2f%3E+%0d%0aPREFIX+rdf%3a%3Chttp%3a%2f%2fwww.w3.org%2f1999%2f02%2f22-rdf-syntax-ns%23%3E+%0d%0aPREFIX+owl%3a%3Chttp%3a%2f%2fwww.w3.org%2f2002%2f07%2fowl%23%3E+%0d%0aSELECT+DISTINCT+(SUBSTR(STR(%3ftarget_participant)%2c+33)+as+%3faccession)+%3fentry_name+(MAX(%3fdisease_type)+as+%3fhas_disease)+(MAX(%3fsubcell_type)+as+%3fhas_subcell)%0d%0aWHERE%0d%0a%7b%0d%0a++BIND(uniprotkb%3a${entry}+as+%3fentry)%0d%0a++%7b%0d%0a++%09%3fentry+up%3ainteraction%2fup%3aparticipant%2fowl%3asameAs+%3ftarget_participant+.%0d%0a++%7d+UNION+%7b%0d%0a++++%3fentry+up%3ainteraction%2fup%3aparticipant%2fowl%3asameAs+%3ffirst_level+.+%0d%0a++++%3ffirst_level+up%3ainteraction%2fup%3aparticipant%2fowl%3asameAs+%3ftarget_participant+.%0d%0a++++FILTER+(%3fsource_participant+!%3d+%3fentry)+.%0d%0a++++FILTER+(%3ftarget_participant+!%3d+%3fentry)%0d%0a++%7d+UNION+%7b%0d%0a+++++BIND(uniprotkb%3a${entry}+as+%3ftarget_participant)%0d%0a++%7d%0d%0a++%3ftarget_participant+up%3amnemonic+%3fentry_name+.%0d%0a++%3ftarget_participant+up%3aannotation%2frdf%3atype+%3ftype++.%0d%0a++BIND+(IF(%3ftype+%3d+up%3aDisease_Annotation%2c+1%2c+0)+AS+%3fdisease_type)%0d%0a++BIND+(IF(%3ftype+%3d+up%3aSubcellular_Location_Annotation%2c+1%2c+0)+AS+%3fsubcell_type)%0d%0a%7d+GROUP+BY+%3ftarget_participant+%3fentry_name+ORDER+BY+%3fentry_name&format=srj`;
      d3.json(url, data => {
        resolve(data);
      });
    });
    var promiseEdges = new Promise(function(resolve, reject) {
      var url = `http://sparql.uniprot.org/sparql?query=PREFIX+up%3a%3Chttp%3a%2f%2fpurl.uniprot.org%2fcore%2f%3E+%0d%0aPREFIX+uniprotkb%3a%3Chttp%3a%2f%2fpurl.uniprot.org%2funiprot%2f%3E+%0d%0aSELECT+%3fsource+%3ftarget+%3fexp%0d%0aWHERE%0d%0a%7b%0d%0a++BIND(uniprotkb%3a${entry}+as+%3fprotein)%0d%0a++%7b+%0d%0a++++%3fprotein+up%3ainteraction+%3finter+.%0d%0a++++%3finter+a+up%3aSelf_Interaction+%3b%0d%0a++++++up%3aexperiments+%3fexp+.%0d%0a++++BIND(%3fprotein+AS+%3fsource_entry)%0d%0a++++BIND(%3fprotein+AS+%3ftarget_entry)%0d%0a++%7d+UNION+%7b%0d%0a++++%3fprotein+up%3ainteraction+%3finter+.%0d%0a++++%3finter+a+up%3aNon_Self_Interaction+%3b%0d%0a++++++up%3aexperiments+%3fexp+%3b%0d%0a++++++up%3aparticipant%2fowl%3asameAs+%3fsource_entry+%2c%3ftarget_entry+.%0d%0a++++FILTER(!sameTerm(%3fraw_source%2c+%3fraw_target))%0d%0a++%7d+UNION+%7b%0d%0a++++%3fprotein+up%3ainteraction+%3finter1+.%0d%0a++++%3finter1+a+up%3aNon_Self_Interaction+%3b%0d%0a++++++up%3aparticipant%2fowl%3asameAs+%3fsource_entry+.%0d%0a++++%3fsource_entry+up%3ainteraction+%3finter2+.%0d%0a++++%3finter2+up%3aexperiments+%3fexp+%3b%0d%0a++++++up%3aparticipant%2fowl%3asameAs+%3fsource_entry%2c+%3ftarget_entry+.%0d%0a++++FILTER(!sameTerm(%3fsource_entry%2c+%3fprotein))%0d%0a++++FILTER(!sameTerm(%3ftarget_entry%2c+%3fprotein))++++%0d%0a++%7d%0d%0a++BIND+(STRAFTER(SUBSTR(STR(%3fsource_entry)%2c+32)%2c%27%2f%27)+as+%3fsource)%0d%0a++BIND+(STRAFTER(SUBSTR(STR(%3ftarget_entry)%2c+32)%2c+%27%2f%27)+as+%3ftarget)%0d%0a%7d+GROUP+BY+%3fsource+%3ftarget+%3fexp+ORDER+BY+%3fsource+%3ftarget+%3fexp&format=srj`;
      d3.json(url, data => {
        resolve(data);
      });
    });
    return Promise.all([promiseNodes, promiseEdges]).then(function(res) {
      return sparqlLoader.processData(res[0], res[1]);
    });
  }

}

module.exports = sparqlLoader;

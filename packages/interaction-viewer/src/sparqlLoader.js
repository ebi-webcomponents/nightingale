const d3 = require('d3');

const sparqlLoader = {
    processData: function(nodeData, edgeData) {
      var _ = require('underscore')

      var json = {
        nodes: [],
        links: []
      }

      for(element of nodeData.results.bindings) {
        var node = {
          'accession': element.accession.value,
          'entryName': element.entry_name.value
        };
        json.nodes.push(node);
      };

      for(element of edgeData.results.bindings) {
        // Currently required because of missing data
        if(_.pluck( json.nodes, 'accession').indexOf(element.source.value) < 0) {
          json.nodes.push({
            'accession': element.source.value,
            'entryName': element.source.value
          });
        } else if (_.pluck( json.nodes, 'accession').indexOf(element.target.value) < 0) {
          json.nodes.push({
            'accession': element.target.value,
            'entryName': element.target.value
          });
        }
        // end of Currently required
        var link = {
          'source': element.source.value,
          'target': element.target.value,
          'experiments': element.experiments.value
        };
        var reverselink = {
          'source': element.target.value,
          'target': element.source.value,
          'experiments': element.experiments.value
        };
        json.links.push(link);
        json.links.push(reverselink);
      };
      return json;
    },
    loadData: function() {
      var promiseNodes = new Promise(function(resolve, reject){
        d3.json('../data/sparql1.json', data => {
          resolve(data);
        });
      });
      var promiseEdges = new Promise(function(resolve, reject){
        d3.json('../data/sparql2.json', data => {
          resolve(data);
        });
      });
      return Promise.all([promiseNodes, promiseEdges]).then(function(res){
        return sparqlLoader.processData(res[0], res[1]);
      });
    }

}

module.exports = sparqlLoader;

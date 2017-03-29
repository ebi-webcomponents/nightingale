const d3 = require('d3');
const _ = require('underscore');
const sparql_uniprot_org="http://sparql.uniprot.org/sparql/"
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
  convertQuery : function(query){
      var q = query.replace(/\s+/g," ").replace(/\?/g,"%3F").replace(/</g,"%3C").replace(/>/g,"%3E").replace("#","%23").replace(/\&/g,"%26");
      return q;
  },
  loadData: function(entry) {
    var promiseNodes = new Promise(function(resolve) {
      var q=sparqlLoader.convertQuery(`PREFIX  uniprotkb: <http://purl.uniprot.org/uniprot/>
PREFIX  :   <http://purl.uniprot.org/core/>
SELECT 
  DISTINCT  
    (strafter(substr(str(?te), 32), "/") AS ?accession) 
    ?entry_name 
    (MAX(?disease_type) AS ?has_disease) 
    (MAX(?subcell_type) AS ?has_subcell)
FROM <http://sparql.uniprot.org/uniprot>
WHERE
{ 
  BIND(uniprotkb:${entry} AS ?p)
  {
    BIND(uniprotkb:${entry} AS ?te)
  }
    UNION
  { ?p  :interaction          ?i .
    ?i  a                     :Non_Self_Interaction ;
        :participant ?sp .
    { ?i   :participant  ?tp .
      ?sp  owl:sameAs    ?p .
      ?tp  owl:sameAs    ?te .
      FILTER ( ! sameTerm(?p, ?te) )
    }
      UNION
    {
      ?sp  owl:sameAs    ?se .
      ?se  :interaction  ?i2 .
      FILTER ( ! sameTerm(?i, ?i2) )
      {
        ?i2  a                     :Non_Self_Interaction ;
             :participant          ?tp , ?sp .
        ?tp  owl:sameAs            ?te .
        ?te  :interaction          ?oi .
        { ?oi :participant/owl:sameAs ?p } 
        FILTER ( ( ( ! sameTerm(?se, ?p) ) && ( ! sameTerm(?se, ?te) ) ) && ( ! sameTerm(?te, ?p) ) )
      }
        UNION
      { 
        ?i2  a                     :Self_Interaction ;
             :participant/owl:sameAs ?se .
        BIND(?se AS ?te)
      }
    }
  }
  OPTIONAL {
    ?te :mnemonic  ?entry_name .
  } 
  OPTIONAL {
    ?te :annotation/a ?type
  }
  BIND(if(( ?type = :Disease_Annotation ), 1, 0) AS ?disease_type)
  BIND(if(( ?type = :Subcellular_Location_Annotation ), 1, 0) AS ?subcell_type)
}
GROUP BY ?te ?entry_name
ORDER BY ?entry_name`);
      var url = sparql_uniprot_org + "?query=%23uuw%0A%0D"+q+"&format=srj";
      d3.json(url, data => {
        resolve(data);
      });
    });
    var promiseEdges = new Promise(function(resolve) {
      var q=sparqlLoader.convertQuery(`PREFIX :<http://purl.uniprot.org/core/>
SELECT
  (strafter(substr(str(?se), 32), "/") AS ?source) 
  (strafter(substr(str(?te), 32), "/") AS ?target) 
  (?e AS ?exp)
  (substr(str(?sp), 32) AS ?source_intact) 
  (substr(str(?tp), 32) AS ?target_intact)
FROM <http://sparql.uniprot.org/uniprot>
WHERE
{ 
  BIND(<http://purl.uniprot.org/uniprot/${entry}> AS ?p)
  BIND(:interaction AS ?ui)
  { ?p  ?ui                   ?i .
    ?i  a                     :Self_Interaction ;
        :experiments          ?e ;
        :participant          ?sp ;
        :participant          ?tp
        BIND(?p AS ?se)
        BIND(?p AS ?te)
  } 
    UNION 
  { 
    ?p  ?ui                   ?i .
    ?i  a                     :Non_Self_Interaction
    { 
        ?i   :experiments  ?e ;
             :participant  ?sp ;
             :participant  ?tp .
        ?sp  owl:sameAs    ?p .
        ?tp  owl:sameAs    ?te
        FILTER ( ! sameTerm(?p, ?te) )
        BIND(?p AS ?se)
    }
      UNION
    { 
        ?i   :participant  ?sp .
        ?sp  owl:sameAs    ?se .
        ?se  ?ui           ?i2 .
        ?i2  :experiments  ?e
        FILTER ( ! sameTerm(?i, ?i2) )
        { 
            ?i2  a                     :Non_Self_Interaction ;
                 :participant          ?tp ;
                 :participant          ?sp .
            ?tp  owl:sameAs            ?te .
            ?te ?ui ?oi . 
            { ?oi :participant/owl:sameAs ?p } 
            FILTER ( ( ( ! sameTerm(?se, ?p) ) && ( ! sameTerm(?se, ?te) ) ) && ( ! sameTerm(?te, ?p) ) )
        }
           UNION
        {
            ?i2  a                     :Self_Interaction ;
                 :participant          ?tp .
            ?tp  owl:sameAs            ?se
            BIND(?se AS ?te)
        }
     }
   }
}
GROUP BY ?se ?te ?e ?sp ?tp
ORDER BY ?se ?te ?e ?sp ?tp`);
      var url = sparql_uniprot_org + "?query=%23uuw%0A%0D"+q+"&format=srj";
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

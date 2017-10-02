const d3 = require('d3');
const _ = require('underscore');
const treeMenu = require('./treeMenu');

const subcellulartreeMenu = [];
const diseases = {};

const apiLoader = {
    load: function(accession) {
        var promise = new Promise(function(resolve) {
            return d3.json(`https://www.ebi.ac.uk/proteins/api/proteins/interaction/${accession}.json`, function(json) {
                var data = apiLoader.process(json);
                resolve(data);
            });
        });
        return promise;
    },
    process: function(data) {
        // remove interactions which are not part of current set
        _.each(data, function(element) {
            let interactors = [];
            element.filterTerms = [];

            // Add source  to the nodes
            _.each(element.interactions, function(interactor) {
                // Add interaction for SELF
                if (interactor.interactionType === 'SELF') {
                    interactor.source = element.accession;
                    interactor.id = element.accession;
                    interactors.push(interactor);
                }
                // TODO review this as it's not nice.
                // TODO also save the reverse??
                else if (_.some(data, function(d) { //Check that interactor is in the data
                        return d.accession === interactor.id;
                    })) {
                    interactor.source = element.accession;
                    interactors.push(interactor);
                } else if (interactor.id.includes('-')) { //handle isoforms
                    // TODO handle isoforms
                    // console.log(interactor.id);
                }
            });
            element.interactions = interactors;

            if (element.subcellularLocations) {
                for (let location of element.subcellularLocations) {
                    for (let actualLocation of location.locations) {
                        treeMenu.addStringItem(actualLocation.location.value, subcellulartreeMenu);
                        let locationSplit = actualLocation.location.value.split(', ');
                        element.filterTerms = element.filterTerms.concat(locationSplit);
                    }
                }
            }
            if (element.diseases) {
                for (let disease of element.diseases) {
                    if (disease.diseaseId) {
                        diseases[disease.diseaseId] = {
                            name: disease.diseaseId,
                            selected: false
                        };
                        element.filterTerms.push(disease.diseaseId);
                    }
                }
            }
        });
        return data;
    },
    getFilters: function() {
        return [{
            name: 'subcellularLocations',
            label: 'Subcellular location',
            type: 'tree',
            items: subcellulartreeMenu
        }, {
            name: 'diseases',
            label: 'Diseases',
            items: _.values(diseases)
        }];
    }
};
module.exports = apiLoader;
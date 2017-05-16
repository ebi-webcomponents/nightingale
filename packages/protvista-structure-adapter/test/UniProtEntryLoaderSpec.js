let chai = require('chai');
chai.expect();

let UniProtEntryLoader = require('../src/UniProtEntryLoader');

const accession = 'P05067';

describe('UniProtEntryLoader', () => {
    it('should construct a UniProtEntryLoader object', () => {
        let aLoader = new UniProtEntryLoader(accession);
        expect(aLoader.accession).to.equal(accession);
        expect(aLoader instanceof UniProtEntryLoader).to.equals(true);
    });

    it('should retrieve an entry', function(done) {
        let aLoader = new UniProtEntryLoader(accession);
        /*aLoader.retrieveEntry().done(function(response) {
            console.log('FLAG!!!');
            done();
        });*/
    });
});
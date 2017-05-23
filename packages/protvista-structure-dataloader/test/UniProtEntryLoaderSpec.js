require('babel-core/register');

let chai = require('chai');
let expect = chai.expect;

let fetch = require('node-fetch');
let UniProtEntryLoader = require('../src/UniProtEntryLoader');

const accession = 'P05067';

describe('UniProtEntryLoader', () => {
    it('should construct a UniProtEntryLoader object', () => {
        let aLoader = new UniProtEntryLoader(accession);
        expect(aLoader.accession).to.equal(accession);
        expect(aLoader instanceof UniProtEntryLoader).to.equals(true);
    });

    it('should get a fetch promise', (done) => {
        let aLoader = new UniProtEntryLoader(accession);
        const promise = aLoader.retrieveEntryPromise();
        expect(promise).to.be.an.instanceof(fetch.Promise);
        done();
    });
});
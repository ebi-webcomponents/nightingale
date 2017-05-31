require('babel-core/register');

const chai = require('chai');
const expect = chai.expect;

const fetch = require('node-fetch');
const UniProtEntryLoader = require('../src/UniProtEntryLoader');

const accession = 'P05067';

describe('UniProtEntryLoader', () => {
    it('should construct a UniProtEntryLoader object', () => {
        const aLoader = new UniProtEntryLoader(accession);
        expect(aLoader.accession).to.equal(accession);
        expect(aLoader instanceof UniProtEntryLoader).to.equals(true);
    });

    it('should get a fetch promise', (done) => {
        const aLoader = new UniProtEntryLoader(accession);
        const promise = aLoader.retrieveEntryPromise();
        expect(promise).to.be.an.instanceof(fetch.Promise);
        done();
    });
});
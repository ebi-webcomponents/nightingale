require('babel-core/register');

let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');

let MockData = require('./UniProtEntryData');
let fetch = require('node-fetch');
let UniProtEntryLoader = require('../src/UniProtEntryLoader');

const accession = 'P05067';

describe('UniProtEntryLoader', () => {
    it('should mock a UniProtEntryLoader object and retrieve an entry', function() {
        let UniProtEntryLoaderStub = sinon.spy(function() {
            return sinon.createStubInstance(UniProtEntryLoader);
        });

        let aLoader = new UniProtEntryLoaderStub(accession);

        aLoader.retrieveEntryPromise.returns(MockData.data);
        let data = aLoader.retrieveEntryPromise();
        expect(data.accession).to.equal(MockData.data.accession);
        expect(data.id).to.equal(MockData.data.id);
    });

    it('should get a fetch promise', (done) => {
        let aLoader = new UniProtEntryLoader(accession);
        const promise = aLoader.retrieveEntryPromise();
        expect(promise).to.be.an.instanceof(fetch.Promise);
        done();
    });
});
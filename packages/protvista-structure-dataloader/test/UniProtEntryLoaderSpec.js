require('babel-core/register');

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const MockedEntry = require('./UniProtEntryData');
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

    it('should get a mocked json object', (done) => {
        const aLoader = new UniProtEntryLoader(accession);

        sinon.stub(aLoader, 'retrieveEntryPromise')
            .callsFake(() => {
                let promise = new Promise((resolve, reject) => {
                    setTimeout(function(){
                        resolve(MockedEntry.data);
                    }, 250);
                });
                return promise;
            });

        aLoader.retrieveEntryPromise()
            .then(function(json) {
                expect(json.accession).to.not.equal(accession);
                expect(json.accession).to.equal(MockedEntry.data.accession);
                aLoader.retrieveEntryPromise.restore();
                done();
            })
    });
});
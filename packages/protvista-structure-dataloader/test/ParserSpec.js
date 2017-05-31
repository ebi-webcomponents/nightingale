require('babel-core/register');

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const MockedEntry = require('./UniProtEntryData');
const MockedFeatures = require('./UniProtFeaturesData');
const UniProtEntryLoader = require('../src/UniProtEntryLoader');
const Parser = require('../src/Parser');

const accession = 'P05067';
const provider = 'uniprot';

describe('Parser', () => {
    it('should construct a Parser object', () => {
        const aParser = new Parser(accession, provider);
        expect(aParser.accession).to.equal(accession);
        expect(aParser.provider).to.equal(provider);
    });

    it('should construct an object with a default provider', () => {
        const aParser = new Parser(accession, 'anything');
        expect(aParser.accession).to.equal(accession);
        expect(aParser.provider).to.equal(provider);
        expect(aParser.loader instanceof UniProtEntryLoader).to.equal(true);
    });

    it('should parse mocked data', () => {
        const aParser = new Parser(accession, provider);

        sinon.stub(UniProtEntryLoader.prototype, 'retrieveEntryPromise')
            .callsFake(() => {
                let promise = new Promise((resolve, reject) => {
                    setTimeout(function(){
                        resolve(MockedEntry.data);
                    }, 250);
                });
                return promise;
            });

        aParser.parse();
        UniProtEntryLoader.prototype.retrieveEntryPromise.restore();
    });
});
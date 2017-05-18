require('babel-core/register');

let chai = require('chai');
let expect = chai.expect;

let Parser = require('../src/Parser');
let UniProtEntryLoader = require('../src/UniProtEntryLoader');

const accession = 'P05067';
const provider = 'uniprot';

describe('Parser', () => {
    it('should construct a Parser object', () => {
        let aParser = new Parser(accession, provider);
        expect(aParser.accession).to.equal(accession);
        expect(aParser.provider).to.equal(provider);
    });

    it('should construct an object with a default provider', () => {
        let aParser = new Parser(accession, 'anything');
        expect(aParser.accession).to.equal(accession);
        expect(aParser.provider).to.equal(provider);
        expect(aParser.loader instanceof UniProtEntryLoader).to.equal(true);
    });
});
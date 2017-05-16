let chai = require('chai');
chai.expect();

let Parser = require('../src/Parser');

const accession = 'P05067';
const provider = 'uniprot';

describe('Parser', () => {
    it('should construct an object', () => {
        let aParser = new Parser(accession, provider);
        expect(aParser.accession).to.equal(accession);
        expect(aParser.provider).to.equal(provider);
    });

    it('should construct an object with a default provider', () => {
        let aParser = new Parser(accession, 'anything');
        expect(aParser.accession).to.equal(accession);
        expect(aParser.provider).to.equal(provider);
    });
});
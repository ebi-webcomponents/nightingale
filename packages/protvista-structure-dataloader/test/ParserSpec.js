let chai = require('chai');
chai.expect();

let Parser = require('../src/Parser');

describe('Parser', () => {
    it('constructor', () => {
        const accession = 'P05067';
        let aParser = new Parser(accession);
        expect(aParser.accession).to.equal(accession);
    });
});
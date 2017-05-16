let chai = require('chai');
chai.expect();

let Parser = require('../src/Parser');

describe('Parser', () => {
    it('constructor', () => {
        const url = 'a url';
        let aParser = new Parser(url);
        expect(aParser.loaderURL).to.equal(url);
    });
});
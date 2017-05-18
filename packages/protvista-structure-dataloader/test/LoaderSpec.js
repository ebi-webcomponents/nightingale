require('babel-core/register');

let chai = require('chai');
let expect = chai.expect;

let Loader = require('../src/Loader');

const accession = 'P05067';

describe('Loader', () => {
    it('should construct a Loader object', () => {
        let aLoader = new Loader(accession);
        expect(aLoader.accession).to.equal(accession);
        expect(aLoader instanceof Loader).to.equals(true);
    });
});
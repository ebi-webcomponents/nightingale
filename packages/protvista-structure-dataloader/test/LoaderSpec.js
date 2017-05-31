require('babel-core/register');

const chai = require('chai');
const expect = chai.expect;

const Loader = require('../src/Loader');

const accession = 'P05067';

describe('Loader', () => {
    it('should construct a Loader object', () => {
        const aLoader = new Loader(accession);
        expect(aLoader.accession).to.equal(accession);
        expect(aLoader instanceof Loader).to.equals(true);
    });
});
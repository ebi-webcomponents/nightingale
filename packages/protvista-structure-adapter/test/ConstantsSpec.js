require('babel-core/register');

let chai = require('chai');
let expect = chai.expect;

let Constants = require('../src/Constants');

const uniprot = 'uniprot';
const uniprotWebService = 'https://www.ebi.ac.uk/proteins/api/proteins/';
const handler = 'UniProtEntryLoader';

describe('Constants', () => {
    it('should get UniProt web service URL', () => {
        expect(Constants.getWebServiceURL(uniprot)).to.equal(uniprotWebService);
    });

    it('should get UniProt service handler', () => {
        expect(Constants.getWebServiceHandler(uniprot)).to.equal(handler);
    });

    it('should get default web service URL', () => {
         expect(Constants.getWebServiceURL('anything')).to.equal(uniprotWebService);
    });

    it('should get default provider', () => {
         expect(Constants.getDefaultProvider()).to.equal(uniprot);
    });

    it('should verify valid provider', () => {
         expect(Constants.isValidProvider(uniprot)).to.equal(true);
    });

    it('should verify invalid provider', () => {
         expect(Constants.isValidProvider('anything')).to.equal(false);
    });
});
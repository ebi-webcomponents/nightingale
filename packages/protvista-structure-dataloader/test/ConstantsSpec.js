let chai = require('chai');
chai.expect();

let Constants = require('../src/Constants');

const uniprot = 'uniprot';
const uniprotWebService = 'https://www.ebi.ac.uk/proteins/api/proteins/';

describe('Constants', () => {
    it('should get UniProt web service URL', () => {
        expect(Constants.getWebServiceURL(uniprot)).to.equal(uniprotWebService);
    });

    it('should get default web service URL', () => {
         expect(Constants.getWebServiceURL('anything')).to.equal(uniprotWebService);
    });
});
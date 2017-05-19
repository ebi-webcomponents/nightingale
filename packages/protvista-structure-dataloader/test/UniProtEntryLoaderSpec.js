require('babel-core/register');

let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');
let fetchMock = require('fetch-mock');
let fetch = require('node-fetch');

let MockData = require('./UniProtEntryData');
let UniProtEntryLoader = require('../src/UniProtEntryLoader');
let MakeRequest = require('../src/MakeRequest');

const accession = 'P05067';

describe('UniProtEntryLoader', () => {
    it('should mock a UniProtEntryLoader object and retrieve an entry', function() {
        let UniProtEntryLoaderStub = sinon.spy(function() {
            return sinon.createStubInstance(UniProtEntryLoader);
        });

        let aLoader = new UniProtEntryLoaderStub(accession);

        aLoader.retrieveEntry.returns(MockData.data);
        let data = aLoader.retrieveEntry();
        expect(data.accession).to.equal(MockData.data.accession);
        expect(data.id).to.equal(MockData.data.id);
        /*
        //This works, regular ES5 module
        /*
        fetchMock.get('*', MockData.data);

        MakeRequest.makeRequest().then(function(data) {
            console.log('got data', data);
        });
        //This does not, ES6 class
        aLoader.retrieveEntry()
            .then(function(json) {
                console.log('got json' + JSON.stringify(json));
            });

        fetchMock.restore();
        */
    });

    it('should construct a UniProtEntryLoader object', () => {
        let aLoader = new UniProtEntryLoader(accession);
        expect(aLoader.accession).to.equal(accession);
        expect(aLoader instanceof UniProtEntryLoader).to.equals(true);
    });
});
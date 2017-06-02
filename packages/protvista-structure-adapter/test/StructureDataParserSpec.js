import {StructureDataParser} from '../src/StructureDataParser';

import {getEntryTestData} from './UniProtEntryData'
import {getFeaturesTestData} from './UniProtFeaturesData'
import {assert} from 'chai';
import {expect} from 'chai';

describe('StructureDataParser', () => {
    it('should pass', () => {
        expect(true).to.equal(true);
    });

    it('should create a parser', () => {
        const aParser = new StructureDataParser();
        expect(aParser).to.be.an.instanceof(StructureDataParser);
    });

    it('should parse mocked data', () => {
        const aParser = new StructureDataParser();
        const entryData = getEntryTestData();
        const featuresData = getFeaturesTestData();

        aParser.parseData(entryData);
        expect(JSON.stringify(aParser.parsedData)).to.equal(JSON.stringify(featuresData));
    });
});
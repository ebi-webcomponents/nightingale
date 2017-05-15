import {Parser} from '../src/Parser';
import {assert} from 'chai';
import {expect} from 'chai';

describe('Parser', () => {
    it('should create a parser', () => {
        const url = 'a url';
        let aParser = new Parser(url);
        expect(aParser.loaderURL).to.equal(url);
    });
});
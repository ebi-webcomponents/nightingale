//let chai = require('chai');
//chai.expect();

import {assert} from 'chai';
import {expect} from 'chai';

//let Parser = require('../src/Parser');
import {Parser} from ('../src/Parser')

describe('Parser', () => {
    it('constructor', () => {
        const url = 'a url';
        let aParser = new Parser(url);
        expect(aParser.loaderURL).to.equal(url);
    });
});
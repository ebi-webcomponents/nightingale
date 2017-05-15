import {hello} from '../src/hello';
import {assert} from 'chai';
import {expect} from 'chai';

describe('hello', () => {
    it('should pass', function() {
        var test = true;
        assert.equal(test, true);
    });

	it('should return Hello Foo', function () {
		assert.equal(hello(), 'Hello Foo');
		expect(hello()).to.equal('Hello Foo');
	});
});
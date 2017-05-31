/*jslint node: true */
"use strict";

const _ = require('underscore');

class ParserHelper {
    static capitalizeFirstLetter(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    static getDescription(properties) {
        let description = '';
        _.each(properties, (property, key) => {
            description += ParserHelper.capitalizeFirstLetter(key) + ': ' + property + '. ';
        });
        return description;
    }

    static getBeginEnd(value) {
        const posEqual = value.indexOf('=');
        const posDash = value.indexOf('-');
        if ((posEqual === -1) || (posDash === -1)) {
            return {begin: 0, end: 0};
        } else {
            return {begin: +value.slice(posEqual+1, posDash), end: +value.slice(posDash+1)}
        }
    }
}

module.exports = ParserHelper;
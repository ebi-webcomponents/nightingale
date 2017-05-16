/*jslint node: true */
"use strict";

let Config = require('./config.json');
const webServices = Config.webServices;

class Constants {
    static getWebServiceURL(provider) {
        return webServices[provider] ? webServices[provider] : 'https://www.ebi.ac.uk/proteins/api/proteins/';
    }
}

module.exports = Constants;
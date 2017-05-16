/*jslint node: true */
"use strict";

let Config = require('./config.json');

const webServices = Config.webServices;
const defaultWebServiceURL = 'https://www.ebi.ac.uk/proteins/api/proteins/';

class Constants {
    static getWebServiceURL(provider) {
        return webServices[provider] ? webServices[provider] : defaultWebServiceURL;
    }

    static isWebServiceURLDefault(url) {
        return url === defaultWebServiceURL;
    }
}

module.exports = Constants;
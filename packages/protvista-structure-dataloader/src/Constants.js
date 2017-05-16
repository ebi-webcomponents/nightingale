/*jslint node: true */
"use strict";

let Config = require('./config.json');

const webServices = Config.webServices;
const defaultProvider = 'uniprot';
const defaultWebServiceURL = 'https://www.ebi.ac.uk/proteins/api/proteins/';
const defaultHandler = 'UniProtEntryLoader';

class Constants {
    static getWebServiceURL(provider) {
        return webServices[provider] ? webServices[provider].url : defaultWebServiceURL;
    }

    static getWebServiceHandler(provider) {
        return webServices[provider] ? webServices[provider].handler : defaultHandler;
    }

    static getDefaultProvider() {
        return defaultProvider;
    }

    static isValidProvider(provider) {
        return webServices[provider] ? true : false;
    }
}

module.exports = Constants;
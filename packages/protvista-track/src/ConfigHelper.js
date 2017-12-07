/*jslint node: true */
"use strict";

import _each from 'lodash-es/each';
import _some from 'lodash-es/some';

export default class ConfigHelper {
    constructor(config) {
        this._config = config;
    }

    getShapeByType(type) {
        return this._config[type.toLowerCase()] ? this._config[type.toLowerCase()].shape : 'rectangle';
    }

    getColorByType(type) {
        return this._config[type.toLowerCase()] ? this._config[type.toLowerCase()].color : 'black';
    }
}

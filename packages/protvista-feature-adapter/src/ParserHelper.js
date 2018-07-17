/*jslint node: true */
"use strict";

export default class ParserHelper {
    //We might need a something else to the generic formatTooltip... if not, just remove this clas
    static formatTooltip (feature, basicHelper) {

        return `
            ${basicHelper.formatTooltip(feature)}
        `;
    }
}
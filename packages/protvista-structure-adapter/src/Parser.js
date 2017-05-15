class Parser {
    constructor(loaderURL) {
        this._loaderURL = loaderURL;
    }

    get loaderURL() {
        return this._loaderURL;
    }

    set loaderURL(loaderURL) {
        this._loaderURL = loaderURL;
    };
}

module.exports = Parser;
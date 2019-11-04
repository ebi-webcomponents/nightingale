class RequestManager {
  static get storeSymbol() {
    return Symbol.for("protvista-request-manager-store");
  }

  static get storeRef() {
    return window[RequestManager.storeSymbol];
  }

  static initStore() {
    window[RequestManager.storeSymbol] = new Map();
  }

  static loadFromCache(key) {
    return RequestManager.storeRef.get(key);
  }

  static storeInCache(key, result) {
    const value = result.then(async response => {
      if (response.status !== 200) {
        throw Error(
          `Request Failed: Status = ${
            response.status
          }; URI = ${key}; Time = ${new Date()}`
        );
      }

      return {
        payload: await response.json(),
        headers: response.headers
      };
    });

    RequestManager.storeRef.set(key, value);

    return RequestManager.loadFromCache(key);
  }

  static async fetch(source) {
    if (typeof RequestManager.storeRef === "undefined") {
      RequestManager.initStore();
    }

    const cached = RequestManager.loadFromCache(source.src);

    if (typeof cached !== "undefined") {
      return cached;
    }
    // if `<source src="…" >`
    if (source.src) {
      // get data from remote endpoint
      const headers = new Headers({
        accept: "application/json"
      });

      const response = window.fetch(source.src, { headers });

      return RequestManager.storeInCache(source.src, response);
    }
    // if <script type="application/json">…</script>
    return {
      payload: JSON.parse(source.textContent)
    };
  }
}

export default RequestManager;

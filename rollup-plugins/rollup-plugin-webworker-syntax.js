/**
 * A rollup plugin that changes web workers webpack syntax
 * e.g. `new Worker(new URL(...))` into `import RollupWorker from "web-worker`
 * and then later `new RollupWorker`
 *
 * **NOTE:** This currently only works with 1 web worker.
 */

var workerRegex = /new\s+Worker\(([\s\S]*?)\)/g;

function rollupWorkerPlugin() {
  return {
    name: "rollup-worker-plugin",

    transform(code, id) {
      var match = code.match(/new\s+Worker\(([\s\S]*?)\)/g);
      if (!match) return;
      var matchURL = match[0].match(/new URL\("(.+)",.+\)/);
      if (!matchURL) return;
      console.log(matchURL);
      const transformedCode = `
      import RollupWorker from "web-worker:${matchURL[1]}";
      ${code.replace(workerRegex, "new RollupWorker(")};`;
      console.log(transformedCode);
      return {
        code: transformedCode,
        map: null, // You can generate source maps if needed
      };
    },
  };
}

module.exports = rollupWorkerPlugin;

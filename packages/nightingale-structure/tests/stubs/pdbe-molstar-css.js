// `pdbe-molstar/build/pdbe-molstar.css` is imported as a raw string by the
// bundler (see the package rollup config's `cssAsString`); jest has no such
// loader, so it resolves here instead. The repo compiles with
// `esModuleInterop: false`, so a default import reads `.default` directly.
module.exports = { default: ".msp-plugin {}" };

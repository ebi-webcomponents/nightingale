// CSS files are imported as strings (see the package-local rollup config's
// `cssAsString` transform) so they can be injected into document.head.
declare module "*.css" {
  const content: string;
  export default content;
}

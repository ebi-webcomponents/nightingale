/* globals DEV:false */
import InterproType from './components/interpro-type';
import InterproDataLoader from './components/interpro-data-loader';

if (DEV) {
  const livereloadScript = document.createElement('script');
  livereloadScript.type = 'text/javascript';
  livereloadScript.async = true;
  livereloadScript.src = `//${location.hostname}:35729/livereload.js?snipver=1`;
  document.head.appendChild(livereloadScript);
}

customElements.define('interpro-type', InterproType);
customElements.define('interpro-data-loader', InterproDataLoader);

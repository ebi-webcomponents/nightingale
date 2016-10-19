/* globals DEV:false */
import DataLoader from './components/data-loader';

if (DEV) {
  const livereloadScript = document.createElement('script');
  livereloadScript.type = 'text/javascript';
  livereloadScript.async = true;
  livereloadScript.src = `//${location.hostname}:35729/livereload.js?snipver=1`;
  document.head.appendChild(livereloadScript);
}

customElements.define('data-loader', DataLoader);
